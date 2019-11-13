import * as _ from 'lodash';

import {QueryHostsArgs, HostFilter, TimestampFilter, TagFilter} from '../../generated/graphql';
import client from '../../es';
import * as common from '../common';
import log from '../../util/log';
import config from '../../config';
import {HttpErrorBadRequest} from '../../errors';
import {ES_NULL_VALUE} from '../../constants';
import {esResponseHistogram} from '../../metrics';

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

function validateTimestamp(timestamp: string | null | undefined) {
    if (typeof timestamp === 'string') {
        const newTimestamp = new Date(timestamp).getTime();
        if (isNaN(newTimestamp)) {
            throw new HttpErrorBadRequest(`invalid timestamp format '${timestamp}'`);
        }
    }
}

function timestampFilterResolver(field: string) {
    return (value: TimestampFilter) => {
        validateTimestamp(value.gte);
        validateTimestamp(value.lte);

        return {
            range: {
                [field]: {
                    gte: value.gte,
                    lte: value.lte
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

/**
 * Build query for Elasticsearch based on GraphQL query.
 */
function buildESQuery(args: QueryHostsArgs, account_number: string) {
    const query: any = {
        from: args.offset,
        size: args.limit,

        sort: [{
            [String(args.order_by)]: String(args.order_how)
        }, {
            id: 'ASC' // for deterministic sort order
        }],

        _source: ['id', 'account', 'display_name', 'created_on', 'modified_on', 'stale_timestamp',
            'ansible_host', 'system_profile_facts', 'canonical_facts', 'tags_structured'] // TODO: infer from info.selectionSet
    };

    query.query = {
        bool: {
            filter: [
                {term: {account: account_number}}, // implicit filter based on x-rh-identity
                ...(args.filter ? resolveFilter(args.filter) : [])
            ]
        }
    };

    return query;
}

export default async function hosts(parent: any, args: QueryHostsArgs, context: any) {

    const body = buildESQuery(args, context.account_number);
    const query = {
        index: config.queries.hosts.index,
        body
    };

    log.trace(query, 'executing query');
    const result = await client.search(query);
    log.trace(result, 'query finished');

    esResponseHistogram.labels('hosts').observe(result.body.took / 1000); // ms -> seconds

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
