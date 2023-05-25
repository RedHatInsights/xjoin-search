import * as _ from 'lodash';
import { JSONSchema} from '@apidevtools/json-schema-ref-parser';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import { filterTimestamp } from '../resolvers/inputTimestamp';
import { filterString, filterStringWithWildcard } from '../resolvers/inputString';
import { filterBoolean } from '../resolvers/inputBoolean';
import { filterObject } from '../resolvers/inputObject';
import { filterInt } from '../resolvers/inputInt';
import { HostFilterResolver } from '../resolvers/hosts';

export type PrimativeTypeString = string
export type PossiblyNestedJSONschema = JSONSchema | {JSONSchema: JSONSchema}

function removeBlockedFields(schema:JSONSchema) {
    if (!schema.properties) {
        throw 'schema doesn\'t exist';
    }

    for (const [key, value] of Object.entries(schema.properties)) {
        if ('x-indexed' in value && value['x-indexed'] === false) {
            // eslint incorrectly identifies the delete call as an object
            // injection sink because of the use of a variable as the key.
            // because we know the key exist on the object since we are iterating
            // over the keys IN the object it is not a security risk.
            // eslint-disable-next-line security/detect-object-injection
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

// verify that an object is JSONSchema type by checking for the "type"
// property. Not foolproof theoretically, but all the fields we need
// to check must hace a type anyways so it should work for all our applications
function isJSONschema(obj: unknown): obj is JSONSchema {
    return _.get(obj, 'type') !== undefined;
}

export function getItemsIfArray(field_value: JSONSchema): JSONSchema {
    if (_.has(field_value, 'items')) {
        if (isJSONschema(field_value.items)) {
            return field_value.items;
        }

        throw 'Field_value is not JSONSchema';
    }

    return field_value;
}

export async function getSchema(schemaFilePath = 'inventory-schemas/system_profile_schema.yaml'): Promise<JSONSchema> {
    let schema: any;

    try {
        schema = await $RefParser.dereference(schemaFilePath);
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
        type = getFieldType(field_name, _.get(field_value, 'items'));
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

export function getSubFieldTypes(field_value: JSONSchema):PrimativeTypeString[] {
    const sub_field_types: PrimativeTypeString[] = [];

    field_value = getItemsIfArray(field_value);

    _.forEach(field_value.properties, (value, key) => {
        sub_field_types.push(getFieldType(key, value));
    });

    return sub_field_types;
}

function getTypeResolverMap(): Map<string, any> {
    const type_resolver_map = new Map<string, any>();
    type_resolver_map.set('string', filterString);
    type_resolver_map.set('integer', filterInt);
    type_resolver_map.set('wildcard', filterStringWithWildcard);
    type_resolver_map.set('boolean', filterBoolean);
    type_resolver_map.set('object', filterObject);
    type_resolver_map.set('date-time', filterTimestamp);

    return type_resolver_map;
}

export function getTypeResolverFunction(type: string): HostFilterResolver {
    const type_resolver_map = getTypeResolverMap();
    const resolver_function = type_resolver_map.get(type);

    if (resolver_function === undefined) {
        throw 'resolver not found for schema entry ' + type;
    }

    return resolver_function;
}

export function getResolver(type: string, field_value: JSONSchema): HostFilterResolver {
    let resolver_function = getTypeResolverFunction(type);

    if (resolver_function === filterObject) {
        const sub_field_names: string[] = getSubFieldNames(field_value);
        const sub_field_types: PrimativeTypeString[] = getSubFieldTypes(field_value);
        resolver_function = _.partialRight(resolver_function, sub_field_names, sub_field_types);
    }

    return resolver_function;
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
