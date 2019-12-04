import * as _ from 'lodash';

import { QueryHostTagsArgs } from '../../generated/graphql';
import { buildFilterQuery } from '../hosts';
import {runQuery} from '../common';
import config from '../../config';
import { checkLimit } from '../validation';

const ORDER_BY_MAPPING: { [key: string]: string } = {
    count: '_count',
    tag: '_key'
};

function defaultValue (value: number | undefined | null, def: number) {
    if (value === undefined || value === null) {
        return def;
    }

    return value;
}

function extractPage(list: any, limit: number, offset: number) {
    return list.slice(offset, offset + limit);
}

export default async function hostTags(parent: any, args: QueryHostTagsArgs, context: any) {
    checkLimit(args.limit);

    const body: any = {
        _source: [],
        query: buildFilterQuery(args.hostFilter, context.account_number),
        aggs: {
            tags: {
                terms: {
                    field: 'tags_string',
                    order: [{
                        [ORDER_BY_MAPPING[String(args.order_by)]]: String(args.order_how)
                    }, {
                        _key: 'ASC' // for deterministic sort order
                    }],
                    show_term_doc_count_error: true
                }
            }
        }
    };

    if (args.filter && args.filter.name) {
        body.aggs.tags.terms.include = args.filter.name;
    }

    const result = await runQuery({
        index: config.queries.hosts.index,
        body
    }, 'hostTags');

    const page = extractPage(
        result.body.aggregations.tags.buckets,
        defaultValue(args.limit, 10),
        defaultValue(args.offset, 0)
    );

    const data = _.map(page, bucket => {
        let segments = bucket.key.split('/').map(decodeURIComponent);

        if (segments.length !== 3) {
            throw new Error(`invalid tag format ${bucket.key}`);
        }

        /*
         * Translate to canonical forms
         * - "" means null
         * - "null" namespace means null
         */
        segments = segments.map((segment: string) => segment === '' ? null : segment);
        if (segments[0] === 'null') {
            segments[0] = null;
        }

        return {
            tag: {
                namespace: segments[0],
                key: segments[1],
                value: segments[2]
            },
            count: bucket.doc_count
        };
    });

    return {
        data,
        meta: {
            count: data.length,
            total: result.body.aggregations.tags.buckets.length
        }
    };
}
