import * as _ from 'lodash';

import {QueryHostGroupsArgs} from '../../generated/graphql';
import { buildFilterQuery } from '../hosts';
import {runQuery} from '../es';
import config from '../../config';
import { checkLimit, checkOffset } from '../validation';
import { defaultValue, extractPage } from '../common';

const GROUP_ORDER_BY_MAPPING: { [key: string]: string } = {
    count: '_count',
    group: '_key'
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function hostGroups(parent: any, args: QueryHostGroupsArgs, context: any): Promise<Record<string, unknown>> {
    checkLimit(args.limit);
    checkOffset(args.offset);

    const limit = defaultValue(args.limit, 10);
    const offset = defaultValue(args.offset, 0);

    const body: any = {
        _source: [],
        query: buildFilterQuery(args.hostFilter, context.org_id),
        size: 0,
        aggs: {
            groups: {
                terms: {
                    field: 'groups_search',
                    size: config.queries.maxBuckets,
                    order: [{
                        [GROUP_ORDER_BY_MAPPING[String(args.order_by)]]: String(args.order_how)
                    }, {
                        _key: 'ASC' // for deterministic sort order
                    }],
                    show_term_doc_count_error: true
                }
            }
        }
    };

    if (args.filter && args.filter.search) {
        const search = args.filter.search;
        if (search.eq) {
            body.aggs.groups.terms.field = 'groups';
            body.aggs.groups.terms.include = [search.eq];
        } else if (search.regex) {
            body.aggs.groups.terms.field = 'groups';
            body.aggs.groups.terms.include = '.*' + search.regex.toLowerCase() + '.*'
        }
    }

    const result = await runQuery({
        index: config.queries.hosts.index,
        body
    }, 'hostGroups');

    const page = extractPage(
        result.body.aggregations.groups.buckets,
        limit,
        offset
    );

    const data = _.map(page, bucket => {
        return {
            group: bucket.key,
            count: bucket.doc_count
        };
    });

    return {
        data,
        meta: {
            count: data.length,
            total: result.body.aggregations.groups.buckets.length
        }
    };
}
