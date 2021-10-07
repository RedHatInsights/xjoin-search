import * as _ from 'lodash';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import $RefParser from "@apidevtools/json-schema-ref-parser";
import {QueryHostsArgs, HostFilter} from '../../generated/graphql';

import {runQuery} from '../es';
import * as common from '../inputBooleanOperators';
import config from '../../config';

import { checkLimit, checkOffset } from '../validation';
import {
    filterStringWithWildcard,
    filterStringWithWildcardWithLowercase
} from '../inputString';
import { filterBoolean } from '../inputBoolean';
import { FilterResolver } from '../common';
import { filterTimestamp } from '../inputTimestamp';
import { filterTag } from '../inputTag';
import { formatTags } from './format';
import { filterString } from '../inputString';
import { filterOperatingSystem } from '../inputOperatingSystem';
import { filterObject } from '../inputObject';
import { filterInt } from '../inputInt';
import { PrimativeTypeString } from '../inputObject';

export type HostFilterResolver = FilterResolver<HostFilter>;

export function resolveFilter(filter: HostFilter): Record<string, any>[] {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define, no-use-before-define
    return _.reduce(RESOLVERS, function (acc: any[], resolver: HostFilterResolver): any {
        const value: Record<string, any>[] = resolver(filter);

        if (value.length) {
            return [...acc, ...value];
        }

        return acc;
    }, []);
}

export function resolveFilters(filters: HostFilter[]) {
    return _.flatMap(filters, resolveFilter);
}

function optional<FILTER, TYPE, TYPE_NULLABLE extends TYPE | null | undefined> (
    accessor: (filter: FILTER) => TYPE_NULLABLE, resolver: FilterResolver<TYPE>) {
    return function (filter: FILTER) {
        const value = accessor(filter);
        if (value === null || value === undefined) {
            return []; // TODO
        }

        return resolver(value as TYPE);
    };
}

function getItemsIfArray(field_value: any) {
    if (_.has(field_value,"items")) {
        field_value = field_value["items"];
    }

    return field_value;
}

function getSubFieldNames(field_value: any) {
    let sub_field_names: string[] = [];

    field_value = getItemsIfArray(field_value);

    _.forEach(field_value["properties"], (value, key) => {
        sub_field_names.push(key);
    })
    
    return sub_field_names;
}

function getSubFieldTypes(field_value: any): PrimativeTypeString[] {
    let sub_field_types: PrimativeTypeString[] = [];

    field_value = getItemsIfArray(field_value);

    _.forEach(field_value["properties"], (value, key) => {
        sub_field_types.push(getTypeOfField(key, value)); 
    })
    
    return sub_field_types;
}

export function resolverFromType(name: string, type: string, value: any): HostFilterResolver | null {
    // TODO: make this global and constant
    // kind of reevaluate it on the whole really, not sure it needs to be a map
    let resolverFunctionTypeMap = new Map<string, any>();
    resolverFunctionTypeMap.set('string', filterString);
    resolverFunctionTypeMap.set('integer', filterInt);
    resolverFunctionTypeMap.set('wildcard', filterStringWithWildcard);
    resolverFunctionTypeMap.set('boolean', filterBoolean);
    resolverFunctionTypeMap.set('object', filterObject);

    let resolverFunction = resolverFunctionTypeMap.get(type);

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

// TODO: this can be removed if filterObject work works
function resolverFromName(name: string): HostFilterResolver | null {
    let resolverFunctionTypeMap = new Map<string, any>();
    resolverFunctionTypeMap.set('operating_system', filterObject);

    let resolverFunction = resolverFunctionTypeMap.get(name);

    if (resolverFunction === undefined) {
        console.log("ERROR: custom resolver not found for schema entry " + name)
        return null;
    } else {
        console.log(`custom resolver found for schema entry ${name}: ${resolverFunction}`)
    }

    return resolverFunction;
}

function getResolver(name: string, type: string, value: object): HostFilterResolver | null {
    return resolverFromType(name, type, value);
}

function getTypeOfField(key: string, field_value: any): PrimativeTypeString {
    let type: PrimativeTypeString | undefined = _.get(field_value, "type");

    if (type == "string" && _.get(field_value, "x-wildcard")) {
        type = "wildcard"
    }

    if (type == "array") {
        type = getTypeOfField(key, field_value["items"]);
    }

    if (type == undefined) {
        throw `error: no type for entry ${key}`;
    }

    return type;
}

async function resolverMapFromSchema(schemaFilePath: string): Promise<HostFilterResolver[]> {
    let schema;

    try {
        schema = await $RefParser.dereference(schemaFilePath);
        // console.log(schema);
    }
        catch(err) {
        console.error(err);
    }  

    if (typeof(schema) !== "object") {
        // console.log("loaded data:");
        // console.log(schema);
        throw "system profile schema not proccessed into an object. Actual type: " + typeof(schema);
    }

    let resolvers: HostFilterResolver[] = [
        optional((filter: HostFilter) => filter.id, _.partial(filterStringWithWildcard, 'id')),
        optional((filter: HostFilter) =>
            filter.insights_id, _.partial(filterStringWithWildcard, 'canonical_facts.insights_id')),
        optional((filter: HostFilter) =>
            filter.display_name, _.partial(filterStringWithWildcardWithLowercase, 'display_name')),
        optional((filter: HostFilter) => filter.fqdn, _.partial(filterStringWithWildcard, 'canonical_facts.fqdn')),
        optional((filter: HostFilter) => filter.provider_type, _.partial(filterString, 'canonical_facts.provider_type')),
        optional((filter: HostFilter) => filter.provider_id, _.partial(filterString, 'canonical_facts.provider_id')),
        optional((filter: HostFilter) => filter.stale_timestamp, _.partial(filterTimestamp, 'stale_timestamp')),
        optional((filter: HostFilter) => filter.tag, filterTag),
        optional((filter: HostFilter) => filter.OR, common.or(resolveFilters)),
        optional((filter: HostFilter) => filter.AND, common.and(resolveFilters)),
        optional((filter: HostFilter) => filter.NOT, common.not(resolveFilter))
    ];

    //loop through the schema object and create a new entry in the array for each entry in the schema
    _.forEach(_.get(schema, "$defs.SystemProfile.properties"), (value: any, key: any) => {

        console.log("entry: ")
        console.log(key);
        console.log(value);

        if (typeof(key) === "undefined" && typeof(value) === "undefined") {
            throw "error processing schema";
        }

        let type: string = getTypeOfField(key, value); //_.get(value, "type");

        console.log("type is: " + type)
            
        let resolver: FilterResolver<any> | null = getResolver(key, type, value);

        if (resolver != null) {       
            resolvers.push(
                optional(
                    (filter: HostFilter) => _.get(filter, "spf_"+key, null), _.partial(resolver, "system_profile_facts."+key)
                )
            );
        }
    })

    // console.log("RESOLVERS");
    // console.log(resolvers);

    return resolvers;
}


//TODO: make this path configurable
let RESOLVERS: HostFilterResolver[];
resolverMapFromSchema("inventory-schemas/system_profile_schema.yaml").then((resolvers: HostFilterResolver[])=>{
    RESOLVERS = resolvers;
});


export function buildFilterQuery(filter: HostFilter | null | undefined, account_number: string): any {
    return {
        bool: {
            filter: [
                {term: {account: account_number}}, // implicit filter based on x-rh-identity
                ...(filter ? resolveFilter(filter) : [])
            ]
        }
    };
}

/**
 * change graphql names to elastic search names where they differ
 */
function translateFilterName(name: string) {
    switch (name) {
        case 'tags':
            return 'tags_structured';
        default:
            return name;
    }
}

function buildSourceList(selectionSet: any) {
    const dataSelectionSet = _.find(selectionSet, s => s.name.value === 'data');

    return dataSelectionSet.selectionSet.selections.map((o: any) => o.name.value).map(translateFilterName);
}

function processOrderBy(order_by: any) {
    let string_order_by = String(order_by);

    if (string_order_by === 'display_name') {
        string_order_by = 'display_name.lowercase';
    }

    return string_order_by;
}

/**
 * Build query for Elasticsearch based on GraphQL query.
 */
function buildESQuery(args: QueryHostsArgs, account_number: string, info: any) {

    const selectionSet = info.fieldNodes[0].selectionSet.selections;
    const sourceList: string[] = buildSourceList(selectionSet);

    const query: any = {
        from: args.offset,
        size: args.limit,
        track_total_hits: true,

        sort: [{
            [processOrderBy(args.order_by)]: String(args.order_how)
        }, {
            id: 'ASC' // for deterministic sort order
        }],
        _source: sourceList
    };

    query.query = buildFilterQuery(args.filter, account_number);

    return query;
}

export default async function hosts(parent: any, args: QueryHostsArgs, context: any, info: any) {
    checkLimit(args.limit);
    checkOffset(args.offset);

    const body = buildESQuery(args, context.account_number, info);
    const query = {
        index: config.queries.hosts.index,
        body
    };

    const result = await runQuery(query, 'hosts');

    const data = _.map(result.body.hits.hits, result => {
        const item = result._source;
        const structuredTags = formatTags(item.tags_structured);
        item.tags = {
            meta: {
                count: structuredTags.length,
                total: structuredTags.length
            },
            data: structuredTags
        };

        return item;
    });

    return {
        data,
        meta: {
            count: result.body.hits.hits.length,
            total: result.body.hits.total.value
        }
    };
}

