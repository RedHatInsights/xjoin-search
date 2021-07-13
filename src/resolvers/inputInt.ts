import { FilterInt } from '../generated/graphql';

export function filterInt(field: string, filter: FilterInt): Record<string, any>[] {
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
}
