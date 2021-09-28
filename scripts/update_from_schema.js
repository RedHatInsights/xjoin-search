// When running this script add the path to the schema file to use as argv
// e.g. node update_mapping.js path/to/schema_file.yml
const _ = require('lodash');
const fs = require('fs');
const yaml = require('js-yaml');
const { buildMappingsFor } = require("json-schema-to-es-mapping");
const { type } = require('os');
const $RefParser = require("@apidevtools/json-schema-ref-parser");

const FILTER_TYPES = {
    string: "FilterString", //when type is anything else (default)
    boolean: "FilterBoolean", //when type is boolean
    integer: "FilterInt",
    wildcard: "FilterStringWithWildcard", //when `x-wildcard` is true (and present)
    timestamp: "FilterTimestamp", //when type is string and format is `date-time`
};

const HOSTS_FILE_PATH = 'test/hosts.json'

function removeBlockedFields(schema) {
    console.log("\n### removing fields marked to not be indexed ###");

    for (const [key, value] of Object.entries(schema["properties"])) {
        if ("x-indexed" in value && value["x-indexed"] == false) {
            delete schema["properties"][key]; 
        }
    }

    return schema;
}

// TODO: remove this if it doesn't come back up
// function removeIncludeInParent(mapping) {
//     for (const property in mapping["mappings"]["system_profile_facts"]["properties"]) {        
//         if ("include_in_parent" in mapping["mappings"]["system_profile_facts"]["properties"][property]) {
//             delete mapping["mappings"]["system_profile_facts"]["properties"][property]["include_in_parent"]; 
//         }
//     }

//     return mapping;
// }

function snakeToTitle(str) {
    return str.split('_').map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join('')
}

function graphQLTypeName(str) {
    return "Filter" + snakeToTitle(str);
}

function determineFilterType(field_name, value) {
    //take the details of the field from the JSONshema and return the type
    //of filter used in the graphQL schema
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
    }else if (_.get(value, "format") == "date-time") {
        return FILTER_TYPES.timestamp;
    } else if (_.get(value, "x-wildcard")) {
        return FILTER_TYPES.wildcard;
    } 

    // FilterString is pretty much a catch all, but watch for edge cases
    return FILTER_TYPES.string;
}


async function getSchema(schema_path) {
    if (schema_path == undefined) {
        schema_path = './inventory-schemas/schemas/system_profile/v1.yaml'
    }

    let schema;

    try {
        schema = await $RefParser.dereference(schema_path);
        // console.log(schema);
    }
        catch(err) {
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

function createGraphqlFields(schema, parent_name="system profile", prefix="spf_") {
    //console.log(schema);
    let grapqhlFieldsArray = [];

    schema = getItemsIfArray(schema);

    for (const [key, value] of Object.entries(schema["properties"])) {
        let filterType = determineFilterType(key, value);
        grapqhlFieldsArray.push(`    "Filter by '${key}' field of ${parent_name}"\n    ${prefix}${key}: ${filterType}\n`);
    }

    return grapqhlFieldsArray;
}

function createTypeForObject(field_name, field_value) {
    type_array = []
    type_array += `"""\nFilter by '${field_name}' field of system profile\n"""\ninput ${graphQLTypeName(field_name)} {\n`;
    type_array += createGraphqlFields(field_value, field_name, "");
    type_array += "\n}\n";

    //console.log("!!! NEW TYPE !!!")
    //console.log(type_array);

    return type_array;
}

function createGraphqlTypes(schema) {
    let graphql_type_array = [];

    for (const [key, value] of Object.entries(schema["properties"])) {
        if(getTypeOfField(value) == "object") {
            graphql_type_array.push(createTypeForObject(key, value));
        }
    }

    //console.log(graphql_type_array);
    return graphql_type_array;
}


function updateGraphQLSchema(schema) {
    console.log("\n### updating GraphQL schema ###");

    let grapqhlFilePath = 'src/schema/schema.graphql';
    let grapqhlFileContent = fs.readFileSync(grapqhlFilePath, 'utf8');
    let graphqlStringArray = grapqhlFileContent.toString().split('\n');

    //find the index of the marker line where we will insert the new additions
    let insertIndex = graphqlStringArray.indexOf("    # START: system_profile schema filters") + 1;
    let endIndex = graphqlStringArray.indexOf("    # END: system_profile schema filters");
    
    //remove existing system_profile filters, but leave padding
    graphqlStringArray.splice(insertIndex, endIndex-insertIndex-2);

    //insert the generated ones
    _.forEach(createGraphqlFields(schema), (field) => {
        graphqlStringArray.splice(insertIndex, 0, field);
    })

    
    // TODO: relying on comments for this to function already sucks, maybe use a more explicite on for the end
    // at least make sure to add do not removes
    let typeInsertIndex = graphqlStringArray.indexOf("# Generated system_profile input types") + 2;
    let typeEndIndex = graphqlStringArray.indexOf("# Output types");
    
    //console.log(`!!! TYPE start: ${typeInsertIndex}`);
    //console.log(`!!! TYPE end: ${typeEndIndex}`);
    
    //remove existing types, but leave padding
    graphqlStringArray.splice(typeInsertIndex, typeEndIndex-typeInsertIndex-3);
    
    _.forEach(createGraphqlTypes(schema), (field) => {
        graphqlStringArray.splice(typeInsertIndex, 0, field);
    })
    
    let newGraphqlFileContent = graphqlStringArray.join("\n");
    fs.writeFileSync(grapqhlFilePath, newGraphqlFileContent);
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

    if(example == undefined) {
        throw `ERROR: string field ${key} missing example values`;
    }

    values = example.split(",");
    values = values.map(s => s.trim());

    return values[host_number];
}

function getItemsIfArray(field_value) {
    if (_.has(field_value,"items")) {
        field_value = field_value["items"];
    }

    return field_value;
}

function generateSystemProfileValues(field, host_number) {
    let value = {}
    
    // TODO: remove the following
    //console.log(field);
    if (_.has(field,"items")) {
        //console.log(`!!!! has items !!!!!!!!!`);
        //console.log(field["items"]);
        field = field["items"];
    }
    
    for (let [key, field_value] of Object.entries(field["properties"])) {
        let type = getTypeOfField(field_value);

        field_value = getItemsIfArray(field_value);

        //for strings take example values from example property
        if(type == "object") {
            //console.log(`Found object: ${key} | value: ${field_value}`)
            value[key] = generateSystemProfileValues(field_value, host_number);
        } else if(type == "string") {
            ///console.log(field_value);
            value[key] = getExampleValues(key, field_value, host_number);
        } else if (type == "boolean") {
            value[key] = Boolean(host_number);
        } else if (type == "integer") {
            value[key] = host_number;
        } else {
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
        if(host["account"] == "test") {
            _.forEach(new_host_system_profile_facts[i], (value, field) => {
                host["system_profile_facts"][field] = new_host_system_profile_facts[i][field];
            })
        }
        i++;
    })

    fs.writeFileSync(HOSTS_FILE_PATH, JSON.stringify(hosts, null, 4));
}

function getTestHostIds(hosts) {
    let test_host_ids = [];

    _.forEach(hosts, (host) => {
        if(host["account"] == "test") {
            test_host_ids.push(host["id"]);
        }
    })

    return test_host_ids;
}

function updateHostTests(schema, new_host_system_profile_facts) {
    // iterate through non-custom type fields
    // for each create a new test case like the following
    // test('spf_host_color', async () => {
    //     const { data } = await runQuery(BASIC_QUERY,
    //     { filter: { spf_host_color: { eq: 'blue'}}});
    //     data.hosts.data.should.have.length(1);
    //     data.hosts.data[0].id.should.equal('f5ac67e1-ad65-4b62-bc27-845cc6d4bcee');
    // });

    // Data needed:
    // - field_name: new_host_system_profile_facts
    // - field_type (for operation): schema
    // - the first example value for the field: new_host_system_profile_facts
    // - the id of the host: ???

    let hosts = getHosts();
    let test_host_ids = getTestHostIds(hosts);

    // open the test file
    let test_file_path = 'src/resolvers/hosts/hosts.integration.ts';
    let test_file_content = fs.readFileSync(zv, 'utf8');
    let test_string_array = test_file_content.toString().split('\n');

    //find the index of the marker line where we will insert the new additions
    let insert_index = test_string_array.indexOf("            describe('generated_spf_tests', function () {") + 1;
    let end_index = test_string_array.indexOf("            });", insert_index);

    //remove existing system_profile filters, but leave padding
    graphqlStringArray.splice(insert_index, end_index - insert_index);

    let new_tests_array = [];


    for (const [key, value] of Object.entries(schema["properties"])) {
        let type = value["type"];



        new_tests_array.push();

        // if string look at the example values provided in schema
        // query for the first value and expect the id of the first
        // host in hosts.json

    }
}

function updateTests(schema) {
    let new_host_system_profile_facts = generateNewSystemProfileFacts(schema, 3);

    //first update the test data in hosts.json
    updateHostsJson(new_host_system_profile_facts);
    //updateHostTests(schema, new_host_system_profile_facts);

}


async function main() {
    var myArgs = process.argv.slice(2);
    schema_path = myArgs[0];

    let schema = await getSchema(schema_path);

    updateMapping(schema);
    updateGraphQLSchema(schema);
    updateTests(schema);
}

try {
    main();
} catch (e) {
    console.log(e);
}
