import {FilterBoolean, FilterGroup, FilterStringWithWildcardWithLowercase} from '../generated/graphql';
import {isEmpty} from 'lodash';
import {filterStringWithWildcardWithLowercase} from './inputString';

function getFilterStringValue (value: FilterStringWithWildcardWithLowercase | undefined | null): any {
    if (!value || !value.eq) {
        return null;
    }

    return value.eq;
}

function getFilterBooleanValue (value: FilterBoolean | undefined | null): any {
    return !(!value || !value.is);
}

export function filterGroup (value: FilterGroup): Record<string, any>[] {

    const bool: Record<string, any> = {};
    const query: Record<string, any> = {
        bool
    };

    const filter: Record<string, any>[] = [];

    if (!isEmpty(value.hasSome)) {
        const hasSomeValue = getFilterBooleanValue(value.hasSome);
        if (hasSomeValue) {
            filter.push({
                exists: {
                    field: 'groups'
                }
            });
        } else {
            bool.must_not = {
                exists: {
                    field: 'groups'
                }
            };
        }
    }

    if (!isEmpty(value.name) && value.name !== undefined) {
        filter.push(...filterStringWithWildcardWithLowercase('groups.name', value.name));
    }

    if (!isEmpty(value.id)) {
        filter.push({
            term: {'groups.id': getFilterStringValue(value.id)}
        });
    }

    bool.filter = filter;

    return [{
        nested: {
            path: 'groups',
            query
        }
    }];
}
