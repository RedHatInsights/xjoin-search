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
