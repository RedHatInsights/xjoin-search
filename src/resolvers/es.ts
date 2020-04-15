import client from '../es';
import log from '../util/log';
import {esResponseHistogram} from '../metrics';
import { ElasticSearchError, ResultWindowError } from '../../src/errors';
import * as _ from 'lodash';

export async function runQuery (query: any, id: string): Promise<any> {
    log.trace(query, 'executing query');

    let result = null;
    try {
        result = await client.search(query);
        log.trace(result, 'query finished');
        esResponseHistogram.labels(id).observe(result.body.took / 1000); // ms -> seconds
        return result;
    } catch (err) {
        log.error(err);

        if (_.get(err, 'meta.body.error.root_cause[0].reason', '').startsWith('Result window is too large')) {
            // check if the request should have succeeded (eg. the requested page
            // contains hosts that should be able to be queried)
            const requested_host_number = query.body.from;

            query.body.from = 0;
            query.body.size = 0;

            const count_query_res = await client.search(query);

            const hits = count_query_res.body.hits.total.value;

            // only return the request window error if the requested page should
            // have contained at least one host
            if (hits >= requested_host_number) {
                throw new ResultWindowError(err);
            }

            // return an empty response (same behavior as when there is not host
            // at the specified offset within result window)
            return count_query_res;
        }

        throw new ElasticSearchError(err);
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
