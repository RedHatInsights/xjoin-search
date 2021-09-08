// When running this script add the path to the schema file to use as argv
// e.g. node update_mapping.js path/to/schema_file.yml
const _ = require('lodash');
const fs = require('fs');
const yaml = require('js-yaml');
const { buildMappingsFor } = require("json-schema-to-es-mapping");
const { type } = require('os');

const FILTER_TYPES = {
    string: "FilterString", //when type is anything else (default)
    boolean: "FilterBoolean", //when type is boolean
    wildcard: "FilterStringWithWildcard", //when `x-wildcard` is true (and present)
    timestamp: "FilterTimestamp", //when type is string and format is `date-time`
};
const CUSTOM_FILTER_TYPES = {
    operating_system: "FilterOperatingSystem"
};
const CUSTOM_FIELDS = ["operating_system"];

function removeBlockedFields(schema) {
    console.log("\n### removing fields marked to not be indexed ###");

    for (const [key, value] of Object.entries(schema["properties"])) {
        if ("x-indexed" in value && value["x-indexed"] == false) {
            console.log(`Removed field: ${key}`);
            delete schema["properties"][key]; 
        }
    }

    return schema;
}

function removeIncludeInParent(mapping) {
    for (const property in mapping["mappings"]["system_profile_facts"]["properties"]) {        
        if ("include_in_parent" in mapping["mappings"]["system_profile_facts"]["properties"][property]) {
            delete mapping["mappings"]["system_profile_facts"]["properties"][property]["include_in_parent"]; 
        }
    }

    return mapping;
}

function customTypeFromName(field_name) {
    console.log(`using custom field type for: ${field_name}`);

    return CUSTOM_FILTER_TYPES[field_name];
}

function determineFilterType(field_name, value) {
    //take the details of the field from the JSONshema and return the type
    //of filter used in the graphQL schema
    let type = _.get(value, "type");

    if (type == undefined) {
        throw `ERROR: type of ${key} is undefined in the system_profile JSONschema`
    }

    if(_.includes(CUSTOM_FIELDS, field_name)) {
        return customTypeFromName(field_name);
    } else if (type == "boolean") {
        return FILTER_TYPES.boolean;
    } else if (_.get(value, "format") == "date-time") {
        return FILTER_TYPES.timestamp;
    } else if (_.get(value, "x-wildcard")) {
        return FILTER_TYPES.wildcard;
    } 

    // FilterString is pretty much a catch all, but watch for edge cases
    return FILTER_TYPES.string;
}

function createGraphqlFields(schema) {
    let grapqhlFieldsArray = [];

    for (const [key, value] of Object.entries(schema["properties"])) {
        let filterType = determineFilterType(key, value);
        grapqhlFieldsArray.push(`    "Filter by '${key}' field of system profile"\n    spf_${key}: ${filterType}`);
    }

    return grapqhlFieldsArray;
}

function getSchema(schema_path) {
    if (schema_path == undefined) {
        schema_path = './inventory-schemas/schemas/system_profile/v1.yaml'
    }

    let schemaFileContent = fs.readFileSync(myArgs[0], 'utf8');
    let schemaData = yaml.load(schemaFileContent);

    return removeBlockedFields(schemaData["$defs"]["SystemProfile"])
}

function updateMapping(schema) {
    console.log("\n### updating elasticsearch mapping ###");

    let mappingFilePath = '../test/mapping.json'
    let mappingFileContent = fs.readFileSync(mappingFilePath, 'utf8');
    let template = JSON.parse(mappingFileContent);

    new_mapping = removeIncludeInParent(buildMappingsFor("system_profile_facts", schema));

    template["properties"]["system_profile_facts"]["properties"] = new_mapping["mappings"]["system_profile_facts"]["properties"];
    
    fs.writeFileSync(mappingFilePath, JSON.stringify(template, null, 2));
}

function updateGraphQLSchema(schema) {
    console.log("\n### updating GraphQL schema ###");

    let grapqhlFilePath = '../src/schema/schema.graphql';
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

    let newGraphqlFileContent = graphqlStringArray.join("\n");

    fs.writeFileSync(grapqhlFilePath, newGraphqlFileContent);
}

function updateHostsJson(schema) {
    console.log("\n### updating example data for tests in hosts.json ###");

    let hosts_file_path = '../test/hosts.json'
    let hosts_file_content = fs.readFileSync(hosts_file_path, 'utf8');
    let hosts = JSON.parse(hosts_file_content);

    let new_host_system_profile_facts = [{},{},{}];

    //iterate over JSONschema creating three hosts worh of example SPF data
    for (const [key, value] of Object.entries(schema["properties"])) {
        let type = value["type"];

        //for strings take example values from example property
        if(type == "string") {
            example = _.get(value, "example");

            if(example == undefined) {
                throw `ERROR: string field ${key} missing example values`;
            }

            example_values = example.split(",");

            for(let i = 0; i < 3; i++) {
                new_host_system_profile_facts[i][key] = example_values[i].trim();
            }
        } else if (type == "boolean") {
            let bool_values = [true, false, false];

            for(let i = 0; i < 3; i++) {
                new_host_system_profile_facts[i][key] = bool_values[i];
            }
        } else if (type == "integer") {
            for(let i = 0; i < 3; i++) {
                new_host_system_profile_facts[i][key] = i;
            }
        }
    }

    let i = 0;
    _.forEach(hosts, (host) => {
        if(host["account"] == "test") {
            _.forEach(new_host_system_profile_facts[i], (value, field) => {
                host["system_profile_facts"][field] = new_host_system_profile_facts[i][field];
            })
        }
        i++;
    })

    fs.writeFileSync(hosts_file_path, JSON.stringify(hosts, null, 4));
}

try {
    var myArgs = process.argv.slice(2);
    schema_path = myArgs[0];

    let schema = getSchema(schema_path);

    updateMapping(schema);
    updateGraphQLSchema(schema);
    updateHostsJson(schema);

    
} catch (e) {
    console.log(e);
}
