import {
    FilterString,
    FilterStringWithWildcard,
    FilterStringWithWildcardWithLowercase
} from '../generated/graphql';
import { negate, exists, wildcard, term } from './es';
import { checkNotNull } from './validation';

type Resolved = Record<string, any>[];

function lowercaseField (field: string) {
    return `${field}.lowercase`;
}

/*
 * Resolver for FilterString
 */
export function filterString (field: string, filter: FilterString): Resolved {
    if (filter.eq === null) {
        // TODO: remove
        console.log(field);
        return [negate(exists(field))];
    } else if (filter.eq !== undefined) {
        return [term(field, filter.eq)];
    }

    return [];
}

/*
 * Resolver for FilterStringWithWildcard
 */
export function filterStringWithWildcard (field: string, filter: FilterStringWithWildcard): Resolved {
    const result = filterString(field, filter);

    checkNotNull(filter.matches);
    if (filter.matches !== undefined) {
        result.push(wildcard(field, filter.matches));
    }

    return result;
}

export function filterStringWithWildcardWithLowercase (field: string, filter: FilterStringWithWildcardWithLowercase): Resolved {
    const result = filterStringWithWildcard(field, filter);

    checkNotNull(filter.eq_lc);
    if (filter.eq_lc !== undefined) {
        result.push(term(lowercaseField(field), filter.eq_lc));
    }

    checkNotNull(filter.matches_lc);
    if (filter.matches_lc !== undefined) {
        result.push(wildcard(lowercaseField(field), filter.matches_lc));
    }

    return result;
}

