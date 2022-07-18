import * as _ from 'lodash';

import { QueryHostSystemProfileArgs } from '../../generated/graphql';
import { runQuery } from '../es';
import config from '../../config';
import { checkLimit, checkOffset } from '../validation';
import { buildFilterQuery } from '../hosts';
import { defaultValue, VALUES_ORDER_BY_MAPPING, extractPage } from '../common';

export default async function hostSystemProfile(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    parent: any,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    args: QueryHostSystemProfileArgs, context: any): Promise<Record<string, unknown>> {

    context.hostQuery = buildFilterQuery(args.hostFilter, context.org_id);
    return {};
}

export function enumerationResolver <T> (field: string, convert: (value: any) => T) {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    return async (parent: any, args: any, context: any): Promise<Record<string, unknown>> => {
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
                        size: config.queries.maxBuckets,
                        order: [{
                            [VALUES_ORDER_BY_MAPPING[String(args.order_by)]]: String(args.order_how)
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
                body.aggs.terms.terms.include = [search.eq];
            } else if (search.regex) {
                body.aggs.terms.terms.include = search.regex;
            }
        }

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
                total: result.body.aggregations.terms.buckets.length
            }
        };
    };
}

export function OSResolver() {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    return async (parent: any, args: any, context: any): Promise<Record<string, unknown>> => {
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
                        // eslint-disable-next-line max-len, quotes
                        script: "if(doc['system_profile_facts.operating_system.name'].size()==0 || doc['system_profile_facts.operating_system.major'].size()==0 || doc['system_profile_facts.operating_system.minor'].size()==0){return '';} def someString = doc['system_profile_facts.operating_system.name'].value + '|' + doc['system_profile_facts.operating_system.major'].value + '|' + doc['system_profile_facts.operating_system.minor'].value ; return someString;",
                        exclude: '',
                        size: config.queries.maxBuckets,
                        order: [{
                            [VALUES_ORDER_BY_MAPPING[String(args.order_by)]]: String(args.order_how)
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
                body.aggs.terms.terms.include = [search.eq];
            } else if (search.regex) {
                body.aggs.terms.terms.include = search.regex;
            }
        }

        const result = await runQuery({
            index: config.queries.hosts.index,
            body
        }, '');

        const page = extractPage(
            result.body.aggregations.terms.buckets,
            limit,
            offset
        );

        const data = _.map(page, bucket => {
            const versionSplit = bucket.key.split('|');
            return {
                value: {
                    name: versionSplit[0],
                    major: versionSplit[1],
                    minor: versionSplit[2]
                },
                count: bucket.doc_count
            };
        });

        return {
            data,
            meta: {
                count: data.length,
                total: result.body.aggregations.terms.buckets.length
            }
        };
    };
}
