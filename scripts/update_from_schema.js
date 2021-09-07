// When running this script add the path to the schema file to use as argv
// e.g. node update_mapping.js path/to/schema_file.yml
const _ = require('lodash');
const fs = require('fs');
const yaml = require('js-yaml');
const { buildMappingsFor } = require("json-schema-to-es-mapping");

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
    for (const [key, value] of Object.entries(schema["properties"])) {
        if ("x-indexed" in value && value["x-indexed"] == false) {
            console.log("found x-indexed: " + value["x-indexed"]);
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
        console.log("custom!")
        console.log(field_name)
        console.log(customTypeFromName(field_name))
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

    schema = removeBlockedFields(schema);
    new_mapping = removeIncludeInParent(buildMappingsFor("system_profile_facts", schema));

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
    _.forEach(createGraphqlFields(schema), (field) => {
        graphqlStringArray.splice(insertIndex, 0, field);
    })

    let newGraphqlFileContent = graphqlStringArray.join("\n");

    fs.writeFileSync(grapqhlFilePath, newGraphqlFileContent);
} catch (e) {
    console.log(e);
}
