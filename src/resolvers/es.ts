import client from '../es';
import log from '../util/log';
import {esResponseHistogram} from '../metrics';

export async function runQuery (query: any, id: string): Promise<any> {
    log.trace(query, 'executing query');
    const result = await client.search(query);
    log.trace(result, 'query finished');

    esResponseHistogram.labels(id).observe(result.body.took / 1000); // ms -> seconds

    return result;
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
