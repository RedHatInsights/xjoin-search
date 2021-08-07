import { FilterTag, FilterString } from '../generated/graphql';
import {ES_NULL_VALUE} from '../constants';

/*
 * The way https://github.com/RedHatInsights/flattenlistsmt handles null dictionary keys is that
 * it returns 'null' (i.e. String not null). That does not happen for values. Therefore, this special
 * handling is needed for queries to work properly. It may be better to move this logic out of xjoin-search
 * (e.g. the SMT itself or a digest pipeline).
 */
export const NAMESPACE_NULL_VALUE = 'null';

function getFilterStringValue (value: FilterString | undefined | null, dflt = ES_NULL_VALUE): string {
    if (!value || !value.eq) {
        return dflt;
    }

    return value.eq.toLowerCase();
}

export function filterTag (value: FilterTag): Record<string, any>[] {
    return [{
        nested: {
            path: 'tags_structured',
            query: {
                bool: {
                    filter: [{
                        term: { 'tags_structured.namespace': getFilterStringValue(value.namespace, NAMESPACE_NULL_VALUE) }
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
