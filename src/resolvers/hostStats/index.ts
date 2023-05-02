import {QueryHostStatsArgs} from '../../generated/graphql';

// import log from '../../util/log';
import {runQuery} from '../es';
import {buildFilterQuery} from '../hosts';
import config from '../../config';

/**
 * Build query for Elasticsearch based on GraphQL query.
 */
function buildESQuery(args: QueryHostStatsArgs, org_id: string) {

    const terms = buildFilterQuery(args.hostFilter, org_id);
    const query: object = {
        size: 0,  // don't return search hits, just the aggregation data
        query: terms,
        aggs: {
            staleness: {
                filters: {
                    filters: {
                        fresh: { range: { stale_timestamp: {
                            gte: 'now'
                        } } },
                        stale: { range: { stale_timestamp: {
                            lt: 'now',
                            gte: 'now-21d'
                        } } },
                        warn: { range: { stale_timestamp: {
                            lt: 'now-21d'
                        } } }
                    }
                }
            }
        }
    };

    return query;
}

/**
 * Serve the hostStats endpoint.
 */
export default async function hostStats(
    parent: unknown,
    args: QueryHostStatsArgs,
    context: {org_id: string}
): Promise<unknown> {
    const body = buildESQuery(args, context.org_id);
    const query = {
        index: config.queries.hosts.index,
        body
    };

    const result = await runQuery(query, 'hostStats');
    // We need to pull the data out of the results and format it according
    // to our schema
    return {
        total_hosts: result.body.hits.total.value,
        fresh_hosts: result.body.aggregations.staleness.buckets.fresh.doc_count,
        stale_hosts: result.body.aggregations.staleness.buckets.stale.doc_count,
        warn_hosts: result.body.aggregations.staleness.buckets.warn.doc_count
    };
}
