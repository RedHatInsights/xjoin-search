import * as _ from 'lodash';

import {QueryHostsArgs, HostFilter, TimestampFilter, TagFilter} from '../../generated/graphql';

import {runQuery} from '../common';
import * as common from '../common';
import config from '../../config';
import {ES_NULL_VALUE} from '../../constants';
import { checkTimestamp, checkLimit, checkOffset } from '../validation';

export function resolveFilter(filter: HostFilter): any[] {
    return _.transform(filter, (acc: any[], value: any, key: string) => {
        const resolver = getResolver(key); // eslint-disable-line @typescript-eslint/no-use-before-define
        acc.push(resolver(value));
    }, []);
}

export function resolveFilters(filters: HostFilter[]) {
    return _.flatMap(filters, resolveFilter);
}

function wildcardResolver (field: string) {
    return (value: string) => ({
        wildcard: {
            [field]: value
        }
    });
}

function timestampFilterResolver(field: string) {
    return (value: TimestampFilter) => {
        checkTimestamp(value.gte);
        checkTimestamp(value.lte);
        checkTimestamp(value.gt);
        checkTimestamp(value.lt);

        return {
            range: {
                [field]: {
                    gte: value.gte,
                    lte: value.lte,
                    gt: value.gt,
                    lt: value.lt
                }
            }
        };
    };
}

function tagResolver (value: TagFilter) {
    return {
        nested: {
            path: 'tags_structured',
            query: {
                bool: {
                    filter: [{
                        term: { 'tags_structured.namespace': value.namespace || ES_NULL_VALUE }
                    }, {
                        term: { 'tags_structured.key': value.key }
                    }, {
                        term: { 'tags_structured.value': value.value || ES_NULL_VALUE }
                    }]
                }
            }
        }
    };
}

const RESOLVERS: {
    [key: string]: (value: any) => any;
} = {
    id: wildcardResolver('id'),
    insights_id: wildcardResolver('canonical_facts.insights_id'),
    display_name: wildcardResolver('display_name'),
    fqdn: wildcardResolver('canonical_facts.fqdn'),

    spf_arch: wildcardResolver('system_profile_facts.arch'),
    spf_os_release: wildcardResolver('system_profile_facts.os_release'),
    spf_os_kernel_version: wildcardResolver('system_profile_facts.os_kernel_version'),
    spf_infrastructure_type: wildcardResolver('system_profile_facts.infrastructure_type'),
    spf_infrastructure_vendor: wildcardResolver('system_profile_facts.infrastructure_vendor'),

    stale_timestamp: timestampFilterResolver('stale_timestamp'),
    tag: tagResolver,

    OR: common.or(resolveFilters),
    AND: common.and(resolveFilters),
    NOT: common.not(resolveFilter)
};

function getResolver (key: string) {
    if (_.has(RESOLVERS, key)) {
        return RESOLVERS[key]; // eslint-disable-line security/detect-object-injection
    }

    throw new Error(`unknown key ${key}`);
}

export function buildFilterQuery(filter: HostFilter | null | undefined, account_number: string) {
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
        const structuredTags = item.tags_structured || [];
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

