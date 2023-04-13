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
            hosts: {
                nested: {
                    path: 'groups'
                },
                aggs: {
                    groups: {
                        terms: {
                            field: 'groups.id',
                            order: [{
                                [GROUP_ORDER_BY_MAPPING[String(args.order_by)]]: String(args.order_how)
                            }, {
                                _key: 'ASC' // for deterministic sort order
                            }],
                            show_term_doc_count_error: true,
                            missing: 'null'
                        },

                        aggs: {
                            'groups-doc': {
                                top_hits: {
                                    _source: {
                                        includes: [
                                            'groups.id',
                                            'groups.name',
                                            'groups.created_on',
                                            'groups.modified_on',
                                            'groups.account',
                                            'groups.org_id'
                                        ]
                                    },
                                    size: 1
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    const result = await runQuery({
        index: config.queries.hosts.index,
        body
    }, 'hostGroups');

    const page = extractPage(
        result.body.aggregations.hosts.groups.buckets,
        limit,
        offset
    );

    const data = _.map(page, bucket => {
        return {
            group: bucket['groups-doc'].hits.hits[0]._source,
            count: bucket.doc_count
        };
    });

    return {
        data,
        meta: {
            count: data.length,
            total: result.body.aggregations.hosts.groups.buckets.length
        }
    };
}
