import { FilterTag, FilterString } from '../generated/graphql';
import {ES_NULL_VALUE} from '../constants';

function getFilterStringValue (value: FilterString | undefined | null): string {
    if (!value || !value.eq) {
        return ES_NULL_VALUE;
    }

    return value.eq;
}

export function filterTag (value: FilterTag) {
    return [{
        nested: {
            path: 'tags_structured',
            query: {
                bool: {
                    filter: [{
                        term: { 'tags_structured.namespace': getFilterStringValue(value.namespace) }
                    }, {
                        term: { 'tags_structured.key': getFilterStringValue(value.key) }
                    }, {
                        term: { 'tags_structured.value': getFilterStringValue(value.value) }
                    }]
                }
            }
        }
    }];
}
