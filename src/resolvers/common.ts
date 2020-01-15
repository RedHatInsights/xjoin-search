import * as _ from 'lodash';

import client from '../es';
import log from '../util/log';
import {esResponseHistogram} from '../metrics';

export function or <T> (resolver: (items: T[]) => object) {
    return (items: T[]) => ({
        bool: {
            should: resolver(items)
        }
    });
}

export function and <T> (resolver: (items: T[]) => object) {
    return (items: T[]) => ({
        bool: {
            must: resolver(items)
        }
    });
}

export function not <T> (resolver: (item: T) => object) {
    return (item: T) => ({
        bool: {
            must_not: resolver(item)
        }
    });
}

export async function runQuery (query: any, id: string): Promise<any> {
    log.trace(query, 'executing query');
    const result = await client.search(query);
    log.trace(result, 'query finished');

    esResponseHistogram.labels(id).observe(result.body.took / 1000); // ms -> seconds

    return result;
}

export function jsonObjectFilter (fieldName: string) {
    return function (parent: any, args: any) {
        const dict = _.get(parent, fieldName);

        if (dict && args.filter) {
            return _.pick(dict, args.filter);
        }

        return dict;
    };
}
