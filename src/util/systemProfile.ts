import * as _ from 'lodash';
import { JSONSchema, dereference } from '@apidevtools/json-schema-ref-parser';
import { filterTimestamp } from '../resolvers/inputTimestamp';
import { filterString, filterStringWithWildcard } from '../resolvers/inputString';
import { filterBoolean } from '../resolvers/inputBoolean';
import { filterObject } from '../resolvers/inputObject';
import { filterInt } from '../resolvers/inputInt';
import { HostFilterResolver } from '../resolvers/hosts';

export type PrimativeTypeString = 'string' | 'integer' | 'array' | 'wildcard' | 'object' | 'boolean' | 'date-time'

function removeBlockedFields(schema:JSONSchema) {
    if (!schema.properties) {
        throw 'schema doesn\'t exist';
    }

    for (const [key, value] of Object.entries(schema.properties)) {
        if ('x-indexed' in value && value['x-indexed'] === false && key in schema.properties) {
            delete schema.properties[key];
        } else if (value.type === 'object') {
            removeBlockedFields(value);
        } else if (value.type === 'array') {
            if (value.items.type === 'object') {
                removeBlockedFields(value.items);
            }
        }
    }

    return schema;
}

export function getItemsIfArray(field_value: {JSONSchema: JSONSchema}): JSONSchema {
    if (_.has(field_value, 'items')) {
        return _.get(field_value, "items");
    }

    return field_value;
}

export async function getSchema(schemaFilePath = 'inventory-schemas/system_profile_schema.yaml'): Promise<JSONSchema> {
    let schema: any;

    try {
        schema = await dereference(schemaFilePath);
    } catch (err) {
        throw (`System Profile Schema can not be read. error: ${err}`);
    }

    if (!_.get(schema, '$defs') || !_.get(schema.$defs, 'SystemProfile')) {
        throw 'invalid schema';
    }

    return removeBlockedFields(schema.$defs.SystemProfile);
}

export function getFieldFormat(field_name: string, field_value: JSONSchema): string {
    const format = _.get(field_value, 'format');

    if (!format) {
        throw `Field ${field_name} has no format`;
    }

    return format;
}

export function getFieldType(field_name: string, field_value: unknown): PrimativeTypeString {
    let type: PrimativeTypeString | undefined = _.get(field_value, 'type');

    //special string types
    if (type === 'string') {
        if (_.get(field_value, 'x-wildcard')) {
            type = 'wildcard';
        }
        else if (_.get(field_value, 'format') === 'date-time') {
            type = 'date-time';
        }
    }

    if (type === 'array') {
        type = getFieldType(field_name, _.get(field_value, "items"));
    }

    if (type === undefined) {
        throw `error: no type for entry ${field_name}`;
    }

    return type;
}

export function getSubFieldNames(field_value: JSONSchema):string[] {
    const sub_field_names: string[] = [];

    field_value = getItemsIfArray(field_value);

    _.forEach(field_value.properties, (value, key) => {
        sub_field_names.push(key);
    });

    return sub_field_names;
}

export function getSubFieldTypes(field_value: any):PrimativeTypeString[] {
    const sub_field_types: PrimativeTypeString[] = [];

    field_value = getItemsIfArray(field_value);

    _.forEach(field_value.properties, (value, key) => {
        sub_field_types.push(getFieldType(key, value));
    });

    return sub_field_types;
}

function createTypeResolverMap(): Map<string, any> {
    const typeResolverMap = new Map<string, any>();
    typeResolverMap.set('string', filterString);
    typeResolverMap.set('integer', filterInt);
    typeResolverMap.set('wildcard', filterStringWithWildcard);
    typeResolverMap.set('boolean', filterBoolean);
    typeResolverMap.set('object', filterObject);
    typeResolverMap.set('date-time', filterTimestamp);

    return typeResolverMap;
}

export function getResolver(name: string, type: string, value: any): HostFilterResolver | null {
    const typeResolverMap = createTypeResolverMap();

    let resolverFunction = typeResolverMap.get(type);

    if (resolverFunction === undefined) {
        throw 'resolver not found for schema entry ' + type;
    }

    if (resolverFunction === filterObject) {
        const sub_field_names: string[] = getSubFieldNames(value);
        const sub_field_types: PrimativeTypeString[] = getSubFieldTypes(value);
        resolverFunction = _.partialRight(resolverFunction, sub_field_names, sub_field_types);
    }

    return resolverFunction;
}

export function getOperationsForType(type: PrimativeTypeString):string[] {
    const operations_by_type_map = new Map<PrimativeTypeString, string[]>();
    operations_by_type_map.set('string', ['eq']);
    operations_by_type_map.set('wildcard', ['eq', 'matches']);
    operations_by_type_map.set('integer', ['gt', 'lt', 'gte', 'lte']);
    operations_by_type_map.set('date-time', ['gt', 'lt', 'gte', 'lte']);
    operations_by_type_map.set('boolean', ['is']);

    const operations = operations_by_type_map.get(type);

    if (operations === undefined) {
        throw (`Could not find operations for type ${type}`);
    }

    return operations;
}

export function getSchemaChunkProperties(schema_chunk: JSONSchema): JSONSchema {
    const properties = _.get(schema_chunk, 'properties');

    if (!properties) {
        throw 'No properties in schema chunk';
    }

    return properties;
}
