import {
    FilterString,
    FilterStringWithWildcard,
    FilterStringWithWildcardWithLowercase, InputMaybe
} from '../generated/graphql';
import { negate, exists, wildcard, term } from './es';
import { checkNotNull } from './validation';
import {UserInputError} from 'apollo-server-express';

type Resolved = Record<string, any>[];

function lowercaseField (field: string) {
    return `${field}.lowercase`;
}

/*
 * Resolver for FilterString
 */
export function filterString (field: string, filter: InputMaybe<FilterString>): Resolved {
    if (!filter) {
        throw new UserInputError('filter may not be null');
    }

    if (filter.eq === null) {
        return [negate(exists(field))];
    } else if (filter.eq !== undefined) {
        return [term(field, filter.eq)];
    }

    return [];
}

/*
 * Resolver for FilterStringWithWildcard
 */
export function filterStringWithWildcard (field: string, filter: InputMaybe<FilterStringWithWildcard>): Resolved {
    if (!filter) {
        throw new UserInputError('filter may not be null');
    }

    const result = filterString(field, filter);

    checkNotNull(filter.matches);
    if (filter.matches !== undefined) {
        result.push(wildcard(field, filter.matches));
    }

    return result;
}

export function filterStringWithWildcardWithLowercase (
    field: string,
    filter: InputMaybe<FilterStringWithWildcardWithLowercase>): Resolved {

    if (!filter) {
        throw new UserInputError('filter may not be null');
    }

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

