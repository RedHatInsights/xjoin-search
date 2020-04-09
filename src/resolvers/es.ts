import client from '../es';
import log from '../util/log';
import {esResponseHistogram} from '../metrics';
import { ElasticSearchError, ResultWindowError } from '../../src/errors';
import * as _ from 'lodash';
import config from '../config';

export async function runQuery (query: any, id: string): Promise<any> {
    log.trace(query, 'executing query');

    let result = null
    try {
        result = await client.search(query);
        log.trace(result, 'query finished');
        esResponseHistogram.labels(id).observe(result.body.took / 1000); // ms -> seconds
        return result;
    } catch(err) {
        log.error(err);
        if (_.get(err, 'meta.body.error.root_cause[0].reason', '').startsWith('Result window is too large')) {
            // check if the request should have succeeded (eg. the requested page
            // contains hosts that should be able to be queried)
            
            // TODO: remove this info log
            log.info(query, "query object");
            log.info(query.body.from, "query body from");
            
            const count_query = {
                index: config.queries.hosts.index,
                body: {
                    "from": 0,
                    "size": 0,
                    "track_total_hits": true,
                    "query": {
                        "bool": {
                            "filter": [
                                {"term": {
                                    "account": String(query.body.query.bool.filter[0].term.account)
                                }
                            }]
                        }
                    }
                }
            };
            
            log.info(count_query, "count query");
            
            const requested_host_number = query.body.from + query.body.size;
            const count_query_res = await client.search(count_query);
            log.info(count_query_res.body, 'results of total hosts check query')
            log.info(requested_host_number, "requested host ammount")
            
            const hits = count_query_res.body.hits.total.value
            // check if the number of hits exceded the original queries limit * offset
            if (hits < requested_host_number) {
                throw new ResultWindowError();
            }
            throw new ElasticSearchError();
        } else {
            throw new ElasticSearchError();
        }
    }
}

export function negate<T> (value: T) {
    return {
        bool: {
            must_not: value
        }
    };
}

export function exists (field: string) {
    return {
        exists: {
            field
        }
    };
}

export function term<T> (field: string, value: T) {
    return {
        term: {
            [field]: value
        }
    };
}

export function wildcard<T> (field: string, value: T) {
    return {
        wildcard: {
            [field]: value
        }
    };
}
