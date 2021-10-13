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

HOW TO RUN:
When running this script add the path to the schema file you want to use as argv
e.g. node update_mapping.js path/to/schema_file.yml
The most recent version of the schema is stored at:
    /inventory-schemas/system_profile_schema
*/

const _ = require('lodash');
const fs = require('fs');
const yaml = require('js-yaml');
const { buildMappingsFor } = require("json-schema-to-es-mapping");
const $RefParser = require("@apidevtools/json-schema-ref-parser");

const FILTER_TYPES = {
    string: "FilterString",
    boolean: "FilterBoolean",
    integer: "FilterInt",
    wildcard: "FilterStringWithWildcard",
    timestamp: "FilterTimestamp",
};

const HOSTS_FILE_PATH = 'test/hosts.json';
const GRAPHQL_FILE_PATH = 'src/schema/schema.graphql';
const NUM_TEST_HOSTS = 3;

/*
Remove any fields that are marked to NOT be indexed in elasticSearch
These fields will have the property:
    x-indexed: false
in their schema definition
*/
function removeBlockedFields(schema) {
    console.log("\n### removing fields marked to not be indexed ###");

    for (const [key, value] of Object.entries(schema["properties"])) {
        if ("x-indexed" in value && value["x-indexed"] == false) {
            console.log(`Removing field: ${key}`)
            delete schema["properties"][key];
        } else if (value["type"] == "object") {
            console.log(`object: ${key}`)
            removeBlockedFields(value)
        } else if (value["type"] == "array") {
            console.log(`array: ${key}`)
            if (value["items"]["type"] == "object") {
                removeBlockedFields(value["items"])
            }
        }
    }

    return schema;
}


function snakeToTitle(str) {
    return str.split('_').map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join('')
}


function graphQLTypeName(str) {
    return "Filter" + snakeToTitle(str);
}


/*
From the properties of the field in the system profile schema determine the type
of filter to use in the GraphQL schema
*/
function determineFilterType(field_name, value) {
    let type = getTypeOfField(value);

    if (type == undefined) {
        throw `ERROR: type of ${key} is undefined in the system_profile JSONschema`
    }

    if (type == "object") {
        return graphQLTypeName(field_name);
    } else if (type == "boolean") {
        return FILTER_TYPES.boolean;
    } else if (type == "integer") {
        return FILTER_TYPES.integer;
    } else if (_.get(value, "format") == "date-time") {
        return FILTER_TYPES.timestamp;
    } else if (_.get(value, "x-wildcard")) {
        return FILTER_TYPES.wildcard;
    } else if (type == "string") {
        return FILTER_TYPES.string;
    }
}


async function getSchema(schema_path) {
    if (schema_path == undefined) {
        schema_path = './inventory-schemas/schemas/system_profile/v1.yaml'
    }

    let schema;

    try {
        schema = await $RefParser.dereference(schema_path);
    }
    catch (err) {
        console.error(err);
    }

    return removeBlockedFields(schema["$defs"]["SystemProfile"])
}


function updateMapping(schema) {
    console.log("\n### updating elasticsearch mapping ###");

    let mappingFilePath = 'test/mapping.json'
    let mappingFileContent = fs.readFileSync(mappingFilePath, 'utf8');
    let template = JSON.parse(mappingFileContent);

    new_mapping = buildMappingsFor("system_profile_facts", schema);

    template["properties"]["system_profile_facts"]["properties"] = new_mapping["mappings"]["system_profile_facts"]["properties"];

    fs.writeFileSync(mappingFilePath, JSON.stringify(template, null, 2));
}


function createGraphqlFields(schema, parent_name = "system profile", prefix = "spf_") {
    let graphqlFieldsArray = [];

    schema = getItemsIfArray(schema);

    for (const [key, value] of Object.entries(schema["properties"])) {
        let filterType = determineFilterType(key, value);
        graphqlFieldsArray.push(`    "Filter by '${key}' field of ${parent_name}"\n    ${prefix}${key}: ${filterType}\n`);
    }

    return graphqlFieldsArray;
}


function createTypeForObject(field_name, field_value) {
    type_array = []
    type_array += `"""\nFilter by '${field_name}' field of system profile\n"""\ninput ${graphQLTypeName(field_name)} {\n`;
    type_array += createGraphqlFields(field_value, field_name, "");
    type_array += "\n}\n";

    return type_array;
}

function createGraphqlTypes(schema) {
    let graphql_type_array = [];

    for (const [key, value] of Object.entries(schema["properties"])) {
        if (getTypeOfField(value) == "object") {
            graphql_type_array.push(createTypeForObject(key, value));
        }
    }

    return graphql_type_array;
}


function updateGraphQLSchema(schema) {
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

    // TODO: relying on comments for this to function already sucks, maybe use a more explicit one for the end
    // at least make sure to add do not removes
    let typeInsertIndex = graphqlStringArray.indexOf("# Generated system_profile input types") + 2;
    let typeEndIndex = graphqlStringArray.indexOf("# Output types");

    //remove existing types, but leave padding
    graphqlStringArray.splice(typeInsertIndex, typeEndIndex - typeInsertIndex - 3);

    _.forEach(createGraphqlTypes(schema), (field) => {
        graphqlStringArray.splice(typeInsertIndex, 0, field);
    })

    let newGraphqlFileContent = graphqlStringArray.join("\n");
    fs.writeFileSync(GRAPHQL_FILE_PATH, newGraphqlFileContent);
}


function getHosts() {
    let hosts_file_content = fs.readFileSync(HOSTS_FILE_PATH, 'utf8');
    return JSON.parse(hosts_file_content);
}


function getTypeOfField(field_value) {
    let type = field_value["type"];

    if (type == "array") {
        type = getTypeOfField(field_value["items"]);
    }

    return type;
}


function getExampleValues(key, field_value, host_number) {
    example = _.get(field_value, "example");

    if (example == undefined) {
        throw `ERROR: string field ${key} missing example values`;
    }

    values = example.split(",");
    values = values.map(s => s.trim());

    value = values[host_number]
    if (value == "null") {
        value = null
    }

    return value;
}


function getItemsIfArray(field_value) {
    if (_.has(field_value, "items")) {
        field_value = field_value["items"];
    }

    return field_value;
}

/*
Generates example values for each field in the system profile for use on test hosts.

for strings:
    Fetches one of the example strings provided in the system profile
    three values are provided for each field, the host number determines which is
    fetched.

for booleans:
    host_number 0 gets True
    host_number > 0 gets False

for ints:
    gets the host_number

*/
function generateSystemProfileValues(field, host_number) {
    if(host_number < 0 || host_number > NUM_TEST_HOSTS) {
        throw `Cannot generate system profile values for test host number ${host_number}. Out of range.`
    }

    let value = {}

    if (_.has(field, "items")) {
        field = field["items"];
    }

    for (let [key, field_value] of Object.entries(field["properties"])) {
        let type = getTypeOfField(field_value);

        field_value = getItemsIfArray(field_value);

        switch (type) {
            case "object":
                value[key] = generateSystemProfileValues(field_value, host_number);
                break;
            case "string":
                value[key] = getExampleValues(key, field_value, host_number);
                break;
            case "boolean":
                value[key] = Boolean(host_number);
                break;
            case "integer":
                value[key] = host_number;
                break;
            default:
                throw `ERROR! ${key} type: ${type} not supported!`;
        }
    }

    return value
}


function generateNewSystemProfileFacts(schema, number_of_hosts) {
    let new_host_system_profile_facts = [];

    for (let i = 0; i < number_of_hosts; i++) {
        new_host_system_profile_facts.push(generateSystemProfileValues(schema, i));
    }

    return new_host_system_profile_facts;
}


function updateHostsJson(new_host_system_profile_facts) {
    console.log("\n### updating example data for tests in hosts.json ###");

    let hosts = getHosts();

    let i = 0;
    _.forEach(hosts, (host) => {
        if (host["account"] == "test") {
            _.forEach(new_host_system_profile_facts[i], (_, field) => {
                host["system_profile_facts"][field] = new_host_system_profile_facts[i][field];
            })
        }
        i++;
    })

    fs.writeFileSync(HOSTS_FILE_PATH, JSON.stringify(hosts, null, 4));
}


async function main() {
    var myArgs = process.argv.slice(2);
    schema_path = myArgs[0];

    let schema = await getSchema(schema_path);

    updateMapping(schema);
    updateGraphQLSchema(schema);
    updateHostsJson(generateNewSystemProfileFacts(schema, NUM_TEST_HOSTS));
}

try {
    main();
} catch (e) {
    console.log(e);
}
