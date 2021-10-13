import * as _ from 'lodash';
import $RefParser from "@apidevtools/json-schema-ref-parser";
import { filterTimestamp } from '../resolvers/inputTimestamp';
import { filterString, filterStringWithWildcard } from '../resolvers/inputString';
import { filterBoolean } from '../resolvers/inputBoolean';
import { filterObject } from '../resolvers/inputObject';
import { filterInt } from '../resolvers/inputInt';
import { HostFilterResolver } from '../resolvers/hosts';
import * as fs from 'fs';
//TODO: make an env variable?
export type PrimativeTypeString = "string" | "integer" | "array" | "wildcard" | "object" | "boolean" | "date-time"
const schemaFilePath = "inventory-schemas/system_profile_schema.yaml";

function removeBlockedFields(schema: Object) {
    console.log("\n### removing fields marked to not be indexed ###");

    let blocked_fields: string[] = []
    let redacted_schema: Record<string,any> = {};
    _.forEach(_.get(schema, "properties"), (value:string, key: string) => {
        const type = _.get(value, "type");

        if (_.get(value, "x-indexed") == false) {
            console.log(`Removing field: ${key}`);
            blocked_fields.push(value);
        } else if (type == "object") {
            console.log(`object: ${key}`);
            redacted_schema[key] = removeBlockedFields(value);
        } else if (type == "array") {
            console.log(`array: ${key}`)
            const items = _.get(value, "items");
            if (_.get(items, "type") == "object") {
                redacted_schema[key] = removeBlockedFields(items);
            }
        } else {
            redacted_schema[key] = value;
        }
    });

    return _.omit(redacted_schema, blocked_fields);
}

function getItemsIfArray(field_value: any) {
    if (_.has(field_value,"items")) {
        field_value = field_value["items"];
    }

    return field_value;
}


export async function getSchema() {
    let schema
    try {
        schema = await $RefParser.dereference(schemaFilePath);
    } catch(err) {
        console.error(err);
        throw("error: System Profile Schema can not be read")
    }

    if (typeof(schema) !== "object") {
        throw "system profile schema not proccessed into an object. Actual type: " + typeof(schema);
    }

    return schema
}


export function getTypeOfField(key: string, field_value: any): PrimativeTypeString {
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
        type = getTypeOfField(key, field_value["items"]);
    }

    if (type == undefined) {
        throw `error: no type for entry ${key}`;
    }

    return type;
}


export function getSubFieldNames(field_value: any) {
    let sub_field_names: string[] = [];

    field_value = getItemsIfArray(field_value);

    _.forEach(field_value["properties"], (value, key) => {
        sub_field_names.push(key);
    })
    
    return sub_field_names;
}


export function getSubFieldTypes(field_value: any): PrimativeTypeString[] {
    let sub_field_types: PrimativeTypeString[] = [];

    field_value = getItemsIfArray(field_value);

    _.forEach(field_value["properties"], (value, key) => {
        sub_field_types.push(getTypeOfField(key, value)); 
    })
    
    return sub_field_types;
}

function createTypeResolverMap(): Map<string, any> {
    let typeResolverMap = new Map<string, any>();
    typeResolverMap.set('string', filterString);
    typeResolverMap.set('integer', filterInt);
    typeResolverMap.set('wildcard', filterStringWithWildcard);
    typeResolverMap.set('boolean', filterBoolean);
    typeResolverMap.set('object', filterObject);
    typeResolverMap.set('date-time', filterTimestamp);

    return typeResolverMap;
}


export function getResolver(name: string, type: string, value: any): HostFilterResolver | null {
    let typeResolverMap = createTypeResolverMap()

    let resolverFunction = typeResolverMap.get(type);

    if (resolverFunction === undefined) {
        throw "resolver not found for schema entry " + type;
    }

    if (resolverFunction === filterObject) {
        let sub_field_names: string[] = getSubFieldNames(value);
        let sub_field_types: PrimativeTypeString[] = getSubFieldTypes(value);
        console.log(`Creating object partial for ${name}`);
        console.log(`sub_fields_names: ${sub_field_names}.`);
        console.log(`sub_fields_types: ${sub_field_types}.`);
        resolverFunction = _.partialRight(resolverFunction, sub_field_names, sub_field_types);
    }

    return resolverFunction;
}

function getTestHosts() {
    let hosts_file_data = fs.readFileSync('test/hosts.json', 'utf8');
    let parsed = JSON.parse(hosts_file_data);
    return parsed;
}


//Maybe move? not *really* related to the schema technically, but it is spiritually
//just hand this the hosts object instread of reading a whole file every dang time
export function getTestHost(host_id: String): Object {
    let hosts = getTestHosts();

    let found_host = null;
    
    _.forEach(hosts, (host) => {
        console.log(host);
        if (_.get(host, "id") == host_id) {
            found_host = host;
        }
    })

    if (found_host == null) {
        throw "Test host not found for ID";
    }
    
    return found_host;
}


export function getOperationsForType(type: PrimativeTypeString):string[] {
    const operations_by_type_map = new Map<PrimativeTypeString, string[]>();
    operations_by_type_map.set("string", ["eq"]);
    operations_by_type_map.set("wildcard", ["eq", "matches"]);
    operations_by_type_map.set("integer", ["gt", "lt", "gte", "lte"]);
    operations_by_type_map.set("date-time", ["gt", "lt", "gte", "lte"]);
    operations_by_type_map.set("boolean", ["is"]);

    const operations = operations_by_type_map.get(type);

    if (operations == undefined) {
        throw(`Could not find operations for type ${type}`)
    }

    return operations;
}
