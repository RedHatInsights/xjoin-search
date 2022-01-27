import { FilterTimestamp } from '../generated/graphql';
import { checkTimestamp } from './validation';
import { term, negate, exists } from './es';

export function filterTimestamp(field: string, filter: FilterTimestamp): Record<string, any>[] {
    checkTimestamp(filter.gte);
    checkTimestamp(filter.lte);
    checkTimestamp(filter.gt);
    checkTimestamp(filter.lt);
    checkTimestamp(filter.eq);

    if (filter.gt || filter.gte || filter.lt || filter.lte) {
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
    } else if (filter.eq === null) {
        return [negate(exists(field))];
    } else if (filter.eq !== undefined) {
        return [term(field, filter.eq)];
    }

    return [];
}
