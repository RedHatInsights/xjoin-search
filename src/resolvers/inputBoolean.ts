import { FilterBoolean } from '../generated/graphql';
import { negate, exists, term } from './es';

type Resolved = Record<string, any>[];

/*
 * Resolver for FilterBoolean
 */
export function filterBoolean (field: string, filter: FilterBoolean): Resolved {
    if (filter.is === null) {
        return [negate(exists(field))];
    } else if (filter.is !== undefined) {
        return [term(field, filter.is)];
    }

    return [];
}
