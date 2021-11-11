import * as _ from 'lodash';

import { QueryHostTagsArgs } from '../../generated/graphql';
import { buildFilterQuery } from '../hosts';
import {runQuery} from '../es';
import config from '../../config';
import { checkLimit, checkOffset } from '../validation';
import { defaultValue, extractPage } from '../common';

const TAG_ORDER_BY_MAPPING: { [key: string]: string } = {
    count: '_count',
    tag: '_key'
};

const TAG_CASE_DELIMITER = 'c6509b6d-9646-4122-a16c-f536660c22ee';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function hostTags(parent: any, args: QueryHostTagsArgs, context: any): Promise<Record<string, unknown>> {
    checkLimit(args.limit);
    checkOffset(args.offset);

    const limit = defaultValue(args.limit, 10);
    const offset = defaultValue(args.offset, 0);

    const body: any = {
        _source: [],
        query: buildFilterQuery(args.hostFilter, context.account_number),
        size: 0,
        aggs: {
            tags: {
                terms: {
                    field: 'tags_search',
                    size: config.queries.maxBuckets,
                    order: [{
                        [TAG_ORDER_BY_MAPPING[String(args.order_by)]]: String(args.order_how)
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
            body.aggs.tags.terms.field = 'tags_search';
            body.aggs.tags.terms.include = [search.eq];
        } else if (search.regex) {
            body.aggs.tags.terms.field = 'tags_search_combined';
            body.aggs.tags.terms.include = '.*(' + TAG_CASE_DELIMITER + ')' + search.regex.toLowerCase();
        }
    }

    const result = await runQuery({
        index: config.queries.hosts.index,
        body
    }, 'hostTags');

    const page = extractPage(
        result.body.aggregations.tags.buckets,
        limit,
        offset
    );

    const data = _.map(page, bucket => {

        function split (value: string, delimiter: string) {
            const index = value.indexOf(delimiter);

            if (index === -1) {
                throw new Error(`cannot split ${value} using ${delimiter}`);
            }

            return [value.substring(0, index), value.substring(index + delimiter.length)];
        }

        function normalizeTag (value: string, key: string) {
            if (value === '' && key !== 'key') {
                return null;
            }

            return value;
        }

        let cased_tag: string;

        // We need to prune of the case insensitive part if we used a Regex query
        if (bucket.key.includes(TAG_CASE_DELIMITER)) {
            cased_tag = split(bucket.key, TAG_CASE_DELIMITER)[0];
        } else {
            cased_tag = bucket.key;
        }

        // This assumes that a namespace never contains '/'
        // We control the namespaces so this should be a safe assumption;
        const [namespace, rest] = split(cased_tag, '/');

        // This assumes that the key ends with the first '='
        // That may not be accurate in a situation when someone defines a key that contains '='
        // This should rarely happen but if it does we can solve that by issuing another ES query to clear up the ambiguity
        const [key, value] = split(rest, '=');

        const tag = _.mapValues({
            namespace,
            key,
            value
        }, normalizeTag);

        return {
            tag,
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
