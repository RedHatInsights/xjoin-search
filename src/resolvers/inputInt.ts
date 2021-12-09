import { FilterInt } from '../generated/graphql';
import { term } from './es';

export function filterInt(field: string, filter: FilterInt): Record<string, any>[] {
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
