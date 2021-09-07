// When running this script add the path to the schema file to use as argv
// e.g. node update_mapping.js path/to/schema_file.yml
const _ = require('lodash');
const fs = require('fs');
const yaml = require('js-yaml');
const { buildMappingsFor } = require("json-schema-to-es-mapping");

function remove_blocked_fields(schema) {
    for (const [key, value] of Object.entries(schema["properties"])) {
        if ("x-indexed" in value && value["x-indexed"] == false) {
            console.log("found x-indexed: " + value["x-indexed"]);
            delete schema["properties"][key]; 
        }
    }

    return schema;
}

function remove_include_in_parent(mapping) {
    for (const property in mapping["mappings"]["system_profile_facts"]["properties"]) {        
        if ("include_in_parent" in mapping["mappings"]["system_profile_facts"]["properties"][property]) {
            delete mapping["mappings"]["system_profile_facts"]["properties"][property]["include_in_parent"]; 
        }
    }

    return mapping;
}

function determine_filter_type(value) {
    //take the details of the field from the JSONshema and return the type
    //of filter used in the graphQL schema

    const filterTypes = {
        string: "FilterString", //when type is anything else (default)
        boolean: "FilterBoolean", //when type is boolean
        wildcard: "FilterStringWithWildcard", //when `x-wildcard` is true (and present)
        timestamp: "FilterTimestamp" //when type is string and format is `date-time`
        // ^ not currently used, but maybe?
    };

    //boolean (wildcard imposible)
    //timestamp (wildcard irrelevant)
    //wildcard string
    //else filterstring

    let type = _.get(value, "type");

    if (type == undefined) {
        throw `ERROR: type of ${key} is undefined in the system_profile JSONschema`
    }

    if (type == "boolean") {
        return filterTypes.boolean;
    } else if (_.get(value, "format") == "date-time") {
        return filterTypes.timestamp;
    } else if (_.get(value, "x-wildcard")) {
        return filterTypes.wildcard;
    } 

    // FilterString is pretty much a catch all, but watch for edge cases
    return filterTypes.string;
}

function create_graphql_fields(schema) {
    let grapqhlFieldsArray = [];

    for (const [key, value] of Object.entries(schema["properties"])) {
        let filterType = determine_filter_type(value);
        grapqhlFieldsArray.push(`    "Filter by '${key}' field of system profile"\n    spf_${key}: ${filterType}`);
    }

    return grapqhlFieldsArray;
}

try {
    var myArgs = process.argv.slice(2);
    schemaPath = myArgs[0];

    console.log(schemaPath)

    if (schemaPath == undefined) {
        schemaPath = './inventory-schemas/schemas/system_profile/v1.yaml'
    }

    let schemaFileContent = fs.readFileSync(myArgs[0], 'utf8');
    let schemaData = yaml.load(schemaFileContent);
    let schema = schemaData["$defs"]["SystemProfile"]

    let mappingFilePath = '../test/mapping.json'
    let mappingFileContent = fs.readFileSync(mappingFilePath, 'utf8');
    let template = JSON.parse(mappingFileContent);

    schema = remove_blocked_fields(schema);
    new_mapping = remove_include_in_parent(buildMappingsFor("system_profile_facts", schema));

    template["properties"]["system_profile_facts"]["properties"] = new_mapping["mappings"]["system_profile_facts"]["properties"];
    
    fs.writeFileSync(mappingFilePath, JSON.stringify(template, null, 2));


    //update the graphql schema
    let grapqhlFilePath = '../src/schema/schema.graphql';
    let grapqhlFileContent = fs.readFileSync(grapqhlFilePath, 'utf8');
    let graphqlStringArray = grapqhlFileContent.toString().split('\n');

    //find the index of the marker line where we will insert the new additions
    let insertIndex = graphqlStringArray.indexOf("    # START: system_profile schema filters") + 2;
    let endIndex = graphqlStringArray.indexOf("    # END: system_profile schema filters") - 1;
    
    console.log(`insert: ${insertIndex} | end: ${endIndex}`);

    //remove existing system_profile filters, but leave padding
    graphqlStringArray.splice(insertIndex, endIndex-insertIndex-2);

    //insert the generated ones
    _.forEach(create_graphql_fields(schema), (field) => {
        graphqlStringArray.splice(insertIndex, 0, field);
    })

    let newGraphqlFileContent = graphqlStringArray.join("\n");

    fs.writeFileSync(grapqhlFilePath, newGraphqlFileContent);
} catch (e) {
    console.log(e);
}