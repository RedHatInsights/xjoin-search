import { FilterPerReporterStaleness, FilterTimestamp } from '../generated/graphql';
import { filterBoolean } from './inputBoolean';
import { FilterBoolean } from '../generated/graphql';
import { filterString } from './inputString';
import { FilterString} from '../generated/graphql';
import { filterTimestamp } from './inputTimestamp';

type Resolved = Record<string, any>[];

function booleanTerm (filter: FilterBoolean | null | undefined): Resolved {
    if (filter !== null && filter !== undefined) {
        return filterBoolean('per_reporter_staleness.check_in_succeeded', filter);
    }

    return [];
}

function timestampTerm (field: string, filter: FilterTimestamp | null | undefined): Resolved {
    if (filter !== null && filter !== undefined) {
        return filterTimestamp(field, filter);
    }

    return [];
}

function stringTerm (filter: FilterString | null | undefined): Resolved {
    if (filter !== null && filter !== undefined) {
        return filterString('per_reporter_staleness.reporter', filter);
    }

    return [];
}

export function filterPerReporterStaleness(filter: FilterPerReporterStaleness) {
    return [{
        nested: {
            path: 'per_reporter_staleness',
            query: {
                bool: {
                    must: [
                        stringTerm(filter.reporter),
                        booleanTerm(filter.check_in_succeeded),
                        timestampTerm('per_reporter_staleness.last_check_in', filter.last_check_in),
                        timestampTerm('per_reporter_staleness.stale_timestamp', filter.stale_timestamp)
                    ]

                }
            }
        }
    }];
}
