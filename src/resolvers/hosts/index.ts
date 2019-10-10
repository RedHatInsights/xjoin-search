import * as _ from 'lodash';

import { QueryHostsArgs, HostFilter, KeyValueInput } from '../../generated/graphql';
import client from '../../es';
import * as common from '../common';
import log from '../../util/log';
import config from '../../config';

export function resolveFilter(filter: HostFilter): any[] {
    return _.transform(filter, (acc: any[], value: any, key: string) => {
        const resolver = getResolver(key); // eslint-disable-line @typescript-eslint/no-use-before-define
        acc.push(resolver(value));
    }, []);
}

export function resolveFilters(filters: HostFilter[]) {
    return _.flatMap(filters, resolveFilter);
}

const RESOLVERS: {
    [key: string]: (value: any) => any;
} = {
    system_profile_fact: ({ key, value }: KeyValueInput) => ({
        term: {
            [`system_profile_facts.${key}`]: value
        }
    }),

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

function buildESQuery(args: QueryHostsArgs) {
    const query: any = {
        from: args.offset,
        size: args.limit,

        sort: [{
            [String(args.order_by)]: String(args.order_how)
        }, {
            id: 'ASC' // for deterministic sort order
        }],

        _source: ['id', 'account', 'display_name', 'created_on', 'modified_on',
            'ansible_host', 'system_profile_facts'] // TODO: infer from info.selectionSet
    };

    if (args.filter) {
        query.query = {
            bool: {
                filter: resolveFilter(args.filter)
            }
        };
    }

    return query;
}

export default async function hosts (parent: any, args: QueryHostsArgs) {

    const body = buildESQuery(args);
    const query = {
        index: config.queries.hosts.index,
        body
    };

    log.trace(query, 'executing query');
    const result = await client.search(query);
    log.trace(result, 'query finished');

    return {
        data: _.map(result.body.hits.hits, '_source'),
        meta: {
            count: result.body.hits.hits.length,
            total: result.body.hits.total.value
        }
    };
}
