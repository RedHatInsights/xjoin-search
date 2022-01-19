/*
SUMMARY:
This script updates various files in xjoin-search to support filtering on and
retrieving data from the fields defined in the system profile schema. 
It is meant to be run when fields are added to or removed from the schema.

For more information about how this script is used please check the README
in the root of this repository. Relevant information is located under the
Maintenance header in a subsection titled "Update SystemProfile Filters using schema"

WHEN TO RUN:
Ideally this script should never need to be manually run for maintenance
reasons. However there may be utility in running this script as part of the
development process. For example: if you are working with some change to the 
system profile schema that has yet to be committed you can point this script 
to your custom version of the schema to test things out.

If the automation that runs this script to keep xjoin-search up to date has
failed please see the README for more information about performing the maintenance
manually
*/

/// <reference path="decs.d.ts"/>
import * as _ from 'lodash';
import fs from 'fs';
import { buildMappingsFor } from 'json-schema-to-es-mapping';
import { JSONSchema, dereference } from '@apidevtools/json-schema-ref-parser';
import { integer } from '@elastic/elasticsearch/api/types';
import * as YAML from 'js-yaml';

export type PrimativeTypeString = "string" | "integer" | "array" | "wildcard" | "object" | "boolean" | "date-time"

const FILTER_TYPES = {
    string: "FilterString",
    boolean: "FilterBoolean",
    integer: "FilterInt",
    wildcard: "FilterStringWithWildcard",
    timestamp: "FilterTimestamp",
};

const HOSTS_FILE_PATH = '../test/hosts.json';
const GRAPHQL_FILE_PATH = '../src/schema/schema.graphql';
const SPF_TEST_DATA_FILE_PATH = '../test/spf_test_data.json';
const NUM_TEST_HOSTS = 3;

function removeBlockedFields(schema:JSONSchema) {
    if (!schema["properties"]) {
        throw "schema doesn't exist"
    }

    for (const [key, value] of Object.entries(schema["properties"])) {
        if ("x-indexed" in value && value["x-indexed"] == false && key in schema["properties"]) {
            delete schema["properties"][key];
        } else if (value["type"] == "object") {
            removeBlockedFields(value)
        } else if (value["type"] == "array") {
            if (value["items"]["type"] == "object") {
                removeBlockedFields(value["items"])
            }
        }
    }

    return schema;
}

export function getItemsIfArray(field_value:any) {
    if (_.has(field_value,"items")) {
        field_value = field_value["items"];
    }

    return field_value;
}

export async function getSchema(schemaFilePath:string="inventory-schemas/system_profile_schema.yaml"): Promise<JSONSchema> {
    let schema: any;

    try {
        schema = await dereference(schemaFilePath);
    } catch(err) {
        console.error(err);
        throw("error: System Profile Schema can not be read");
    }

    if (!_.get(schema, "$defs") || !_.get(schema["$defs"],"SystemProfile")) {
        throw "invalid schema"
    }

    return removeBlockedFields(schema["$defs"]["SystemProfile"]);
}

export function getFieldFormat(field_value: JSONSchema): string|undefined {
    const format = _.get(field_value, "format");

    return format;
}

export function getFieldType(field_name: string, field_value: any): PrimativeTypeString {
    let type: PrimativeTypeString | undefined = _.get(field_value, "type");

    //special string types
    if (type == "string") {
        if(_.get(field_value, "x-wildcard")) {
            type = "wildcard"
        }
        else if(_.get(field_value, "format") == "date-time") {
            type = "date-time"
        }
    }

    if (type == "array") {
        type = getFieldType(field_name, field_value["items"]);
    }

    if (type == undefined) {
        throw `error: no type for entry ${field_name}`;
    }

    return type;
}

export function getSchemaChunkProperties(schema_chunk: JSONSchema): JSONSchema {
    const properties = _.get(schema_chunk, "properties");

    if (!properties) {
        throw "No properties in schema chunk";
    }

    return properties;
}

//end copy-paste import

function snakeToTitle(str: string):string {
    return str.split('_').map((w:string) => w[0].toUpperCase() + w.substr(1).toLowerCase()).join('')
}


function graphQLTypeName(str: string):string {
    return "Filter" + snakeToTitle(str);
}

/*
From the properties of the field in the system profile schema determine the type
of filter to use in the GraphQL schema
*/
function determineFilterType(field_name: string, field_value:JSONSchema) {
    let type = getFieldType(field_name, field_value);

    if (type == undefined) {
        throw `ERROR: type of ${field_name} is undefined in the system_profile JSONschema`
    }

    if (type == "object") {
        return graphQLTypeName(field_name);
    } else if (type == "boolean") {
        return FILTER_TYPES.boolean;
    } else if (type == "integer") {
        return FILTER_TYPES.integer;
    } else if (_.get(field_value, "format") == "date-time") {
        return FILTER_TYPES.timestamp;
    } else if (_.get(field_value, "x-wildcard")) {
        return FILTER_TYPES.wildcard;
    } else if (type == "string") {
        return FILTER_TYPES.string;
    }
}

function updateMapping(schema: JSONSchema) {
    console.log("\n### updating elasticsearch mapping ###");
    
    let mappingFilePath = '../test/mapping.json'
    let mappingFileContent = fs.readFileSync(mappingFilePath, 'utf8');
    let template = JSON.parse(mappingFileContent);

    let new_mapping:any = buildMappingsFor("system_profile_facts", schema);

    template["properties"]["system_profile_facts"]["properties"] = new_mapping["mappings"]["system_profile_facts"]["properties"];

    fs.writeFileSync(mappingFilePath, JSON.stringify(template, null, 2));
}

function getFullMapping(schema: JSONSchema) {
    let mappingFilePath = '../test/mapping.json'
    let mappingFileContent = fs.readFileSync(mappingFilePath, 'utf8');
    let template = JSON.parse(mappingFileContent);

    let new_mapping:any = buildMappingsFor("system_profile_facts", schema);

    template["properties"]["system_profile_facts"]["properties"] = new_mapping["mappings"]["system_profile_facts"]["properties"];

    return template;
}

function createGraphqlFields(schema:JSONSchema, parent_name:string = "system profile", prefix:string = "spf_"):string[] {
    let graphqlFieldsArray:string[] = [];

    schema = getItemsIfArray(schema);
    const schema_properties = getSchemaChunkProperties(schema);

    _.forEach(schema_properties, (field_value:JSONSchema, field_name:string):void => {
        let filterType = determineFilterType(field_name, field_value);
        graphqlFieldsArray.push(`    "Filter by '${field_name}' field of ${parent_name}"\n    ${prefix}${field_name}: ${filterType}\n`);
    })

    return graphqlFieldsArray;
}

function createTypeForObject(field_name:string, field_value:JSONSchema):string[] {
    let type_array: string[] = []
    type_array.push(`"""\nFilter by '${field_name}' field of system profile\n"""\ninput ${graphQLTypeName(field_name)} {\n`);
    type_array.push(...createGraphqlFields(field_value, field_name, ""));
    type_array.push("}\n");

    return type_array;
}

function createGraphqlTypes(schema:JSONSchema):string[][] {
    let graphql_type_array:string[][] = [];

    const schema_properties: JSONSchema = getSchemaChunkProperties(schema);

    _.forEach(schema_properties, (field_value:JSONSchema, field_name:string):void => {
        if (getFieldType(field_name, field_value) == "object") {
                graphql_type_array.push(createTypeForObject(field_name, field_value));
            }
    });

    return graphql_type_array;
}

function updateGraphQLSchema(schema:JSONSchema):void {
    console.log("\n### updating GraphQL schema ###");

    let graphqlFileContent = fs.readFileSync(GRAPHQL_FILE_PATH, 'utf8');
    let graphqlStringArray = graphqlFileContent.toString().split('\n');

    //find the index of the marker line where we will insert the new additions
    let insertIndex = graphqlStringArray.indexOf("    # START: system_profile schema filters") + 1;
    let endIndex = graphqlStringArray.indexOf("    # END: system_profile schema filters");

    //remove existing system_profile filters, but leave padding
    graphqlStringArray.splice(insertIndex, endIndex - insertIndex - 2);

    //insert the generated ones
    _.forEach(createGraphqlFields(schema), (field) => {
        graphqlStringArray.splice(insertIndex, 0, field);
    })

    let typeInsertIndex = graphqlStringArray.indexOf("# Generated system_profile input types") + 2;
    let typeEndIndex = graphqlStringArray.indexOf("# Output types");

    //remove existing types, but leave padding
    graphqlStringArray.splice(typeInsertIndex, typeEndIndex - typeInsertIndex - 3);

    _.forEach(createGraphqlTypes(schema), (new_type) => {
        graphqlStringArray.splice(typeInsertIndex, 0, ...new_type);
    })

    let newGraphqlFileContent = graphqlStringArray.join("\n");
    fs.writeFileSync(GRAPHQL_FILE_PATH, newGraphqlFileContent);
}

function getHosts() {
    let hosts_file_content = fs.readFileSync(HOSTS_FILE_PATH, 'utf8');
    return JSON.parse(hosts_file_content);
}

function getExampleValues(field_name: string, field_value: JSONSchema, host_number: number) {
    let example = _.get(field_value, "example");

    if (example == undefined) {
        throw `ERROR: string field ${field_name} missing example values`;
    }

    let values = example.split(",");
    values = values.map((s:string) => s.trim());

    let value = values[host_number]
    if (value == "null") {
        value = null
    }

    return value;
}

export function hostNumberToDatetime(host_number: integer):Date {
    if (host_number < 0 || host_number >= 10) {
        //The 10 host limit is keep from making invalid dates with this simple approach
        //a more general aproach could support as many as you want
        throw "Too many hosts to generate test date-time values. Must be fewer than 10.";
    }

    return new Date(`2021-01-1${host_number}T10:10:10`);
}

/*
Generates example values for each field in the system profile for use on test hosts.

for strings:
    Fetches one of the example strings provided in the system profile
    three values are provided for each field, the host number determines which is
    fetched.

    for data-time format strings:
        creates a static date time where the day is 10 + host_number

for booleans:
    host_number 1 gets True
    others get False

for ints:
    gets the host_number

*/

function generateSystemProfileValues(schema_chunk: Object, host_number: number): Object {
    if(host_number < 0 || host_number > NUM_TEST_HOSTS) {
        throw `Cannot generate system profile values for test host number ${host_number}. Out of range.`
    }

    const schema_chunk_properties:JSONSchema = getSchemaChunkProperties(getItemsIfArray(schema_chunk));
    
    let values:any = {};
    _.forEach(schema_chunk_properties, (field_value:JSONSchema, field_name:string):void => {
        field_value = getItemsIfArray(field_value);
        let type = getFieldType(field_name, field_value)

        switch (type) {
            case "object":
                values[field_name] = generateSystemProfileValues(field_value, host_number);
                break;
            case "wildcard":
            case "string":
                values[field_name] = getExampleValues(field_name, field_value, host_number);
                break;
            case "date-time":
                values[field_name] = hostNumberToDatetime(host_number).toISOString();
                break;
            case "boolean":
                values[field_name] = Boolean(host_number - 1);
                break;
            case "integer":
                values[field_name] = host_number;
                break;
            default:
                throw `ERROR! ${field_name} type: ${type} not supported!`;
        }

    })

    return values;
}

function generateNewSystemProfileFacts(schema: JSONSchema, number_of_hosts: number): Object[] {
    let new_host_system_profile_facts = [];

    for (let i = 0; i < number_of_hosts; i++) {
        new_host_system_profile_facts.push(generateSystemProfileValues(schema, i));
    }

    return new_host_system_profile_facts;
}

function updateHostsJson(new_host_system_profile_facts: any): void {
    console.log("\n### updating example data for tests in hosts.json ###");

    let hosts = getHosts();

    let i = 0;
    _.forEach(hosts, (host:any) => {
        if (host["account"] == "test") {
            _.forEach(new_host_system_profile_facts[i], (_, field_name:string):void => {
                host["system_profile_facts"][field_name] = new_host_system_profile_facts[i][field_name];
            })
        i++;
        }
    })

    fs.writeFileSync(HOSTS_FILE_PATH, JSON.stringify(hosts, null, 4));
}


function updateEphemeralMapping(schema: JSONSchema) {
    console.log("\n### updating elasticsearch mapping for ephemeral environments ###");

    let mapping = getFullMapping(schema);
    let filePath = '../deploy/ephemeral.yaml'
    let fileContent = fs.readFileSync(filePath, 'utf8');
    let loaded: any = YAML.load(fileContent);
    let objects: any[] = [{}];

    if(typeof(loaded) == "object") {
        objects = _.get(loaded, "objects");
    }

    let xjoinConfigMap: any;

    _.forEach(objects, (o: any) => {
        if(_.get(o, "metadata") && _.get(o, "metadata.name") == "xjoin") {
            xjoinConfigMap = o;
        }
    })

    if(_.has(xjoinConfigMap, "data")) {
        let xjoinConfigMapIndexTemplate = JSON.parse(xjoinConfigMap["data"]["elasticsearch.index.template"]);
        xjoinConfigMapIndexTemplate["mappings"]["properties"]["system_profile_facts"] = mapping["properties"]["system_profile_facts"];
        xjoinConfigMap["data"]["elasticsearch.index.template"] = JSON.stringify(xjoinConfigMapIndexTemplate, null, 2);
    }

    let i = 0
    _.forEach(objects, (o: any) => {
        if(_.get(o, "metadata") && _.get(o, "metadata.name") == "xjoin") {
            objects[i] = xjoinConfigMap;
        }
        i++;
    })

    if(typeof(loaded) == "object" && _.has(loaded, "objects")) {
        loaded["objects"] = objects
    }

    fs.writeFileSync(filePath, YAML.dump(loaded));
}

function getOperationsForType(type: string): string[] {
    const operations_by_type_map = new Map();
    operations_by_type_map.set("string", ["eq"]);
    operations_by_type_map.set("wildcard", ["eq", "matches"]);
    operations_by_type_map.set("boolean", ["is"]);
    operations_by_type_map.set("integer", ["gt", "lt", "gte", "lte"]);
    operations_by_type_map.set("date-time", ["gt", "lt", "gte", "lte"]);

    const operations = operations_by_type_map.get(type);

    if (operations == undefined) {
        throw(`Could not find operations for type ${type}`)
    }

    return operations;
}

function createFilterQueryForEquality(field_name:string, operation:string, test_value:string):Object {
    const filter_name = 'spf_' + field_name;
    return {[filter_name]:{[operation]: test_value}};
}

function createFilterQueriesForEquality(field_name: string, field_type: string, test_value: string) {
    const operations = getOperationsForType(field_type);
    let test_data: Object[] = [];

    _.forEach(operations, (operation) => {
        test_data.push({"field_name": field_name, "field_query": createFilterQueryForEquality(field_name, operation, test_value)});
    })

    return test_data;
}

function createFilterQueryForRange(field_name: string, lower_value: string|number, test_value: string) {
    const filter_name = 'spf_' + field_name;
    return {[filter_name]:{"gt": lower_value, "lte": test_value}};
}

// assuming int if not a date-time string
function createFilterQueriesForRange(field_name: string, field_format: string|undefined, test_value: string) {
    let lower_value: number|Date|string = 0;

    if (field_format == "date-time") {
        lower_value = new Date(test_value);
        lower_value.setDate(lower_value.getDate()-1)
        lower_value = lower_value.toISOString();
    }

    return [{"field_name": field_name, "field_query": createFilterQueryForRange(field_name, lower_value, test_value)}];

}

function createFilterQueriesForField(field_name: string, field_type: string, field_format: string|undefined, test_value: string): Object[] {
    const equality_types = ["string", "wildcard", "boolean"];

    if (equality_types.includes(field_type) && field_format != "date-time") {
        return createFilterQueriesForEquality(field_name, field_type, test_value);
    } else {
        return createFilterQueriesForRange(field_name, field_format, test_value);
    }
}

function _checkSchemaAndHostChunkValid(field_name: string, schema_chunk: JSONSchema, host_chunk: Object): void {
    if (schema_chunk == null) {
        throw `${field_name} object has no contents in schema`
    }

    if (host_chunk == null) {
        throw `${field_name} object has no contents in host`
    }
}

function createFilterQuerys(schema_chunk:JSONSchema, test_host_chunk:Object): Object[] {
    let test_data: Object[] = [];

    const schema_chunk_properties:JSONSchema = getSchemaChunkProperties(schema_chunk);

    _.forEach(schema_chunk_properties, (field_value: JSONSchema, field_name: string) => {
        if (typeof(field_name) === "undefined" && typeof(field_value) === "undefined") {
            throw "error processing schema";
        }


        let field_type: string = getFieldType(field_name, field_value);
        let field_format: string|undefined = getFieldFormat(field_value);

        if (field_type == "object") {
            const next_schema_chunk = getItemsIfArray(field_value);
            const next_host_chunk = _.get(test_host_chunk, field_name);

            _checkSchemaAndHostChunkValid(field_name, next_schema_chunk, next_host_chunk);

            const filter_queries = createFilterQuerys(next_schema_chunk, next_host_chunk);
            test_data.push(..._.map(filter_queries, (field_dict: {"field_name": string, "field_query": any}) => {
                if (!_.get(field_dict,"field_name")) {
                    throw "Error while creating field query"
                }

                field_dict["field_name"] = field_name + " " + field_dict["field_name"]
                // remove spf_ from field query
                let old_field_name = Object.keys(field_dict["field_query"])[0];
                let new_field_name_no_spf = old_field_name.substr(4);
                let new_field_dict = {[new_field_name_no_spf]: field_dict["field_query"][old_field_name]}
                field_dict["field_query"] = {["spf_"+field_name]: new_field_dict}
                return field_dict;
            }));
        } else {
            let field_test_value = _.get(test_host_chunk, field_name);

            _.forEach(createFilterQueriesForField(field_name, field_type, field_format, field_test_value), (field_data) => {
                test_data.push(field_data);
            });
            
            
        }
    })

    return test_data;
}

function updateTestData(schema: JSONSchema, host_facts: Object) {
    console.log("\n### updating test queries in spf_test_data.json ###");
    const test_data = createFilterQuerys(schema, host_facts)

    fs.writeFileSync(SPF_TEST_DATA_FILE_PATH, JSON.stringify(test_data, null, 2));
}

async function main() {
    const schema = await getSchema("../inventory-schemas/system_profile_schema.yaml");
    const new_spf_facts = generateNewSystemProfileFacts(schema, NUM_TEST_HOSTS);

    updateMapping(schema);
    updateGraphQLSchema(schema);
    updateHostsJson(new_spf_facts);
    updateTestData(schema, new_spf_facts[1]);
    updateEphemeralMapping(schema);
}

try {
    main();
} catch (e) {
    console.log(e);
}
