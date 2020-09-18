import * as _ from 'lodash';

import { QueryHostSystemProfileArgs } from '../../generated/graphql';
import { runQuery } from '../es';
import config from '../../config';
import { checkLimit, checkOffset } from '../validation';
import { buildFilterQuery } from '../hosts';
import { defaultValue, VALUES_ORDER_BY_MAPPING, extractPage } from '../common';

export default async function hostSystemProfile(parent: any, args: QueryHostSystemProfileArgs, context: any) {
    context.hostQuery = buildFilterQuery(args.hostFilter, context.account_number);

    return {};
}

export function enumerationResolver <T> (field: string, convert: (value: any) => T) {
    return async (parent: any, args: any, context: any) => {
        checkLimit(args.limit);
        checkOffset(args.offset);

        const limit = defaultValue(args.limit, 10);
        const offset = defaultValue(args.offset, 0);

        const body: any = {
            _source: [],
            query: context.hostQuery,
            size: 0,
            aggs: {
                terms: {
                    terms: {
                        field,
                        size: limit + offset,
                        order: [{
                            [VALUES_ORDER_BY_MAPPING[String(args.order_by)]]: String(args.order_how)
                        }, {
                            _key: 'ASC' // for deterministic sort order
                        }],
                        show_term_doc_count_error: true
                    }
                },
                total: {
                    cardinality: {
                        field,
                        precision_threshold: 1000
                    }
                }
            }
        };

        const result = await runQuery({
            index: config.queries.hosts.index,
            body
        }, field);

        const page = extractPage(
            result.body.aggregations.terms.buckets,
            limit,
            offset
        );

        const data = _.map(page, bucket => ({
            value: convert(bucket.key),
            count: bucket.doc_count
        }));

        return {
            data,
            meta: {
                count: data.length,
                total: result.body.aggregations.total.value
            }
        };
    };
}
