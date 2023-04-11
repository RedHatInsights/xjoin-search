import { FilterGroup, FilterString } from '../generated/graphql';
import {ES_NULL_VALUE} from '../constants';

function getFilterStringValue (value: FilterString | undefined | null, dflt = ES_NULL_VALUE): string {
    if (!value || !value.eq) {
        return dflt;
    }

    return value.eq;
}

export function filterGroup (value: FilterGroup): Record<string, any>[] {
    return [{
        nested: {
            path: 'groups',
            query: {
                bool: {
                    filter: [{
                        term: { 'groups.name': getFilterStringValue(value.name) }
                    }]
                }
            }
        }
    }];
}
