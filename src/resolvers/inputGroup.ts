import {FilterBoolean, FilterGroup, FilterStringWithWildcardWithLowercase} from '../generated/graphql';
import {isEmpty} from 'lodash';
import {filterStringWithWildcardWithLowercase} from './inputString';

function getFilterStringValue(value: FilterStringWithWildcardWithLowercase | undefined | null): any {
    if (!value || !value.eq) {
        return null;
    }

    return value.eq;
}

function getFilterBooleanValue(value: FilterBoolean | undefined | null): any {
    return !(!value || !value.is);
}

function buildHasSomeFilter(hasSome: FilterBoolean): Record<string, any> {
    let response: Record<string, any>;

    const hasSomeValue = getFilterBooleanValue(hasSome);
    const nested = [{
        nested: {
            path: 'groups',
            query: {
                bool: {
                    filter: [{
                        exists: {
                            field: 'groups'
                        }
                    }]
                }
            }
        }
    }];
    if (hasSomeValue) {
        response = {
            bool: {
                must: nested
            }
        };
    } else {
        response = {
            bool: {
                must_not: nested
            }
        };
    }

    return response;
}

function buildTermFilter(value: FilterGroup): Record<any, any> {

    const bool: Record<string, any> = {};
    const query: Record<string, any> = {
        bool
    };

    const filter: Record<string, any>[] = [];

    if (!isEmpty(value.name) && value.name !== undefined) {
        filter.push(...filterStringWithWildcardWithLowercase('groups.name', value.name));
    }

    if (!isEmpty(value.id)) {
        filter.push({
            term: {'groups.id': getFilterStringValue(value.id)}
        });
    }

    bool.filter = filter;

    return {
        bool: {
            must: {
                nested: {
                    path: 'groups',
                    query
                }
            }
        }
    };
}

export function filterGroup(value: FilterGroup): Record<string, any>[] {
    const response: any = [];

    if ((!isEmpty(value.name) && value.name !== undefined) || !isEmpty(value.id)) {
        response.push(buildTermFilter(value));
    }

    if (!isEmpty(value.hasSome)) {
        response.push(buildHasSomeFilter(value.hasSome));
    }

    return response;
}
