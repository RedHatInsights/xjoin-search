import * as _ from 'lodash';

export type FilterResolver<T> = (filter: T) => Record<string, any>[];

export function jsonObjectFilter (fieldName: string) {
    return function (parent: any, args: any) {
        const dict = _.get(parent, fieldName);

        if (dict && args.filter) {
            return _.pick(dict, args.filter);
        }

        return dict;
    };
}

export const VALUES_ORDER_BY_MAPPING: { [key: string]: string } = {
    count: '_count',
    value: '_key'
};

export function defaultValue (value: number | undefined | null, def: number) {
    if (value === undefined || value === null) {
        return def;
    }

    return value;
}

export function extractPage(list: any, limit: number, offset: number) {
    return list.slice(offset, offset + limit);
}
