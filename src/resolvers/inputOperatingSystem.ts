import { FilterOperatingSystem } from '../generated/graphql';
import { filterString } from './inputString';
import { FilterString} from '../generated/graphql';

type Resolved = Record<string, any>[];

function stringTerm (field: string, filter: FilterString | null | undefined): Resolved {
    if (filter !== null && filter !== undefined) {
        return filterString(field, filter);
    }

    return [];
}

export function filterOperatingSystem(filter: FilterOperatingSystem) {
    let filter_array: any[] = [];

    filter_array = filter_array.concat(
        stringTerm('system_profile_facts.operating_system.major', filter.major),
        stringTerm('system_profile_facts.operating_system.minor', filter.minor),
        stringTerm('system_profile_facts.operating_system.name', filter.name)
    );

    return [{
        bool: {
            must: filter_array
        }
    }];
}
