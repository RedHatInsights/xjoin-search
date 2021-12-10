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
import * as YAML from 'js-yaml';
import { buildMappingsFor } from 'json-schema-to-es-mapping';
import { JSONSchema, dereference } from '@apidevtools/json-schema-ref-parser';

export type PrimativeTypeString = "string" | "integer" | "array" | "wildcard" | "object" | "boolean" | "date-time"

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

function getFullMapping(schema: JSONSchema) {
    let mappingFilePath = '../test/mapping.json'
    let mappingFileContent = fs.readFileSync(mappingFilePath, 'utf8');
    let template = JSON.parse(mappingFileContent);

    let new_mapping:any = buildMappingsFor("system_profile_facts", schema);

    template["properties"]["system_profile_facts"]["properties"] = new_mapping["mappings"]["system_profile_facts"]["properties"];

    return template;
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
        xjoinConfigMapIndexTemplate["mappings"] = mapping;
        xjoinConfigMap["data"]["elasticsearch.index.template"] = JSON.stringify(xjoinConfigMapIndexTemplate, null, 2);
    }

    console.log(xjoinConfigMap);

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

async function main() {
    const schema = await getSchema("../inventory-schemas/system_profile_schema.yaml");

    updateEphemeralMapping(schema)
}

try {
    main();
} catch (e) {
    console.log(e);
}