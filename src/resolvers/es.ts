import client from '../es';
import log from '../util/log';
import {esResponseHistogram} from '../metrics';
import { ElasticSearchError, ResultWindowError } from '../errors';
import * as _ from 'lodash';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function runQuery (query: any, id: string): Promise<any> {
    log.trace(query, 'executing query');

    try {
        const result = await client.search(query);
        log.trace(result, 'query finished');
        esResponseHistogram.labels(id).observe(result.body.took / 1000); // ms -> seconds
        return result;
    } catch (err: any) {
        log.error(err);

        if (_.get(err, 'meta.body.error.root_cause[0].reason', '').startsWith('Result window is too large')) {
            // check if the request should have succeeded (eg. the requested page
            // contains hosts that should be able to be queried)
            const requestedHostNumber = query.body.from;

            query.body.from = 0;
            query.body.size = 0;

            const countQueryRes = await client.search(query);

            const hits = countQueryRes.body.hits.total.value;

            // only return the request window error if the requested page should
            // have contained at least one host
            if (hits >= requestedHostNumber) {
                throw new ResultWindowError(err);
            }

            // return an empty response (same behavior as when there is not host
            // at the specified offset within result window)
            return countQueryRes;
        }

        throw new ElasticSearchError(err);
    }
}

export function negate<T> (value: T): Record<string, any> {
    return {
        bool: {
            must_not: value
        }
    };
}

export function exists (field: string): Record<string, any> {
    return {
        exists: {
            field
        }
    };
}

export function term<T> (field: string, value: T): Record<string, any> {
    return {
        term: {
            [field]: value
        }
    };
}

export function wildcard<T> (field: string, value: T): Record<string, any> {
    return {
        wildcard: {
            [field]: value
        }
    };
}
