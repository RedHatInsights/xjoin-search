import * as _ from 'lodash';
import {QueryHostsArgs, HostFilter} from '../../generated/graphql';

import {runQuery} from '../es';
import * as common from '../inputBooleanOperators';
import config from '../../config';

import { checkLimit, checkOffset } from '../validation';
import {
    filterStringWithWildcard,
    filterStringWithWildcardWithLowercase
} from '../inputString';
import { FilterResolver } from '../common';
import { filterTimestamp } from '../inputTimestamp';
import { filterTag } from '../inputTag';
import { formatTags } from './format';
import { filterString } from '../inputString';
import { getSchema, getFieldType, getResolver } from '../../util/systemProfile';
import { filterPerReporterStaleness } from '../inputPerReporterStaleness';

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

export function resolveFilters(filters: HostFilter[]): Record<any, any>[] {
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

function getPredefinedResolvers() {
    return [
        optional((filter: HostFilter) => filter.id, _.partial(filterStringWithWildcard, 'id')),
        optional((filter: HostFilter) =>
            filter.insights_id, _.partial(filterStringWithWildcard, 'canonical_facts.insights_id')),
        optional((filter: HostFilter) =>
            filter.display_name, _.partial(filterStringWithWildcardWithLowercase, 'display_name')),
        optional((filter: HostFilter) => filter.fqdn, _.partial(filterStringWithWildcardWithLowercase, 'canonical_facts.fqdn')),
        optional((filter: HostFilter) => filter.provider_type, _.partial(filterString, 'canonical_facts.provider_type')),
        optional((filter: HostFilter) => filter.provider_id, _.partial(filterString, 'canonical_facts.provider_id')),
        optional((filter: HostFilter) => filter.stale_timestamp, _.partial(filterTimestamp, 'stale_timestamp')),
        optional((filter: HostFilter) => filter.tag, filterTag),
        optional((filter: HostFilter) => filter.OR, common.or(resolveFilters)),
        optional((filter: HostFilter) => filter.AND, common.and(resolveFilters)),
        optional((filter: HostFilter) => filter.NOT, common.not(resolveFilter)),
        optional(
            (filter: HostFilter) => filter.per_reporter_staleness,
            _.partial(filterPerReporterStaleness)
        )
    ];
}

async function resolverMapFromSchema(): Promise<HostFilterResolver[]> {
    const schema = await getSchema();

    // Pre-defined resolvers for fields that are not part of the system profile
    const resolvers: HostFilterResolver[] = getPredefinedResolvers();

    _.forEach(_.get(schema, 'properties'), (field_value: any, field_name: any) => {
        if (typeof(field_name) === 'undefined' && typeof(field_value) === 'undefined') {
            throw 'error processing schema';
        }

        const type: string = getFieldType(field_name, field_value);

        const resolver: FilterResolver<any> | null = getResolver(type, field_value);

        if (resolver !== null) {
            resolvers.push(
                optional(
                    (filter: HostFilter) => _.get(filter, 'spf_' + field_name, null),
                    _.partial(resolver, 'system_profile_facts.' + field_name)
                )
            );
        }
    });
    return resolvers;
}

let RESOLVERS: HostFilterResolver[];
resolverMapFromSchema().then((resolvers: HostFilterResolver[])=>{
    RESOLVERS = resolvers;
});

export function buildFilterQuery(filter: HostFilter | null | undefined, org_id: string): any {
    return {
        bool: {
            filter: [
                {term: {org_id}}, // implicit filter based on x-rh-identity
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

function customOperatingSystemSort(order_how: any) {
    // Use a custom script sort
    return {
        _script: {
            type: 'string',
            script: {
                lang: 'painless',
                source: `
                String name = '';
                String major = '0';
                String minor = '0';
                if (doc['system_profile_facts.operating_system.name'].size() != 0) {
                    name = doc['system_profile_facts.operating_system.name'].value;
                }
                if (doc['system_profile_facts.operating_system.major'].size() != 0) {
                    major = String.format('%010d', new def[] {doc['system_profile_facts.operating_system.major'].value});
                }
                if (doc['system_profile_facts.operating_system.minor'].size() != 0) {
                    minor = String.format('%010d', new def[] {doc['system_profile_facts.operating_system.minor'].value});
                }
                return name + ' ' + major + '.' + minor;`
            },
            order: String(order_how)
        }
    };
}

function processOrderBy(order_by: any) {
    let string_order_by = String(order_by);

    if (string_order_by === 'display_name') {
        string_order_by = 'display_name.lowercase';
    }

    return string_order_by;
}

function processSort(order_by: any, order_how: any) {
    const string_order_by = String(order_by);
    let processedSort = {};

    if (string_order_by === 'operating_system') {
        processedSort = customOperatingSystemSort(order_how);
    } else {
        // Return the standard sort
        processedSort = [{
            [processOrderBy(string_order_by)]: String(order_how)
        }, {
            id: 'ASC' // for deterministic sort order
        }];
    }

    return processedSort;
}

/**
 * Build query for Elasticsearch based on GraphQL query.
 */
function buildESQuery(args: QueryHostsArgs, org_id: string, info: any) {

    const selectionSet = info.fieldNodes[0].selectionSet.selections;
    const sourceList: string[] = buildSourceList(selectionSet);

    const query: any = {
        from: args.offset,
        size: args.limit,
        track_total_hits: true,

        sort: processSort(args.order_by, args.order_how),
        _source: sourceList
    };

    query.query = buildFilterQuery(args.filter, org_id);

    return query;
}

export default async function hosts(
    parent: unknown,
    args: QueryHostsArgs,
    context: {org_id: string},
    info: unknown): Promise<unknown>
{
    checkLimit(args.limit);
    checkOffset(args.offset);

    const body = buildESQuery(args, context.org_id, info);
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

