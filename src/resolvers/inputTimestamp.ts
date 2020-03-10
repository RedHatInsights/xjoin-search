import { FilterTimestamp } from '../generated/graphql';
import { checkTimestamp } from './validation';

export function filterTimestamp(field: string, filter: FilterTimestamp) {
    checkTimestamp(filter.gte);
    checkTimestamp(filter.lte);
    checkTimestamp(filter.gt);
    checkTimestamp(filter.lt);

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
