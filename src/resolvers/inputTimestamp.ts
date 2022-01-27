import { FilterTimestamp } from '../generated/graphql';
import { checkTimestamp } from './validation';
import { term } from './es';

export function filterTimestamp(field: string, filter: FilterTimestamp): Record<string, any>[] {
    checkTimestamp(filter.gte);
    checkTimestamp(filter.lte);
    checkTimestamp(filter.gt);
    checkTimestamp(filter.lt);
    checkTimestamp(filter.eq);

    if (!filter.eq) {
        return [{
            range: {
                [field]: {
                    gte: filter.gte,
                    lte: filter.lte,
                    gt: filter.gt,
                    lt: filter.lt
                }
            }
        }];
    } else if (filter.eq !== undefined) {
        return [term(field, filter.eq)];
    }

    return [];
}
