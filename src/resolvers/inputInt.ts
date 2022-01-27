import { FilterInt } from '../generated/graphql';
import { term, negate, exists } from './es';

export function filterInt(field: string, filter: FilterInt): Record<string, any>[] {
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
