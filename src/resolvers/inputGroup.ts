import {FilterBoolean, FilterGroup, FilterString} from '../generated/graphql';
import {ES_NULL_VALUE} from '../constants';
import {isEmpty} from "lodash";

function getFilterStringValue (value: FilterString | undefined | null): any {
    if (!value || !value.eq) {
        return null;
    }

    return value.eq;
}

function getFilterBooleanValue (value: FilterBoolean | undefined | null): any {
    return !(!value || !value.is);
}

export function filterGroup (value: FilterGroup): Record<string, any>[] {

    const bool: Record<string, any> = {}
    const query: Record<string, any> = {
        bool: bool
    }

    const filter: Record<string, any>[] = []

    if (!isEmpty(value.hasSome)) {
        const hasSomeValue = getFilterBooleanValue(value.hasSome);
        if (hasSomeValue) {
            filter.push({
                exists: {
                    field: 'groups'
                }
            })
        } else {
            bool['must_not'] = {
                exists: {
                    field: 'groups'
                }
            }
        }
    }

    if (!isEmpty(value.name)) {
        filter.push({
            term: {'groups.name': getFilterStringValue(value.name)}
        });
    }

    if (!isEmpty(value.id)) {
        filter.push({
            term: {'groups.id': getFilterStringValue(value.id)}
        });
    }

    bool['filter'] = filter;

    return [{
        nested: {
            path: 'groups',
            query: query
        }
    }];
}
