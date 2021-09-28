import { FilterInt, FilterOperatingSystem } from '../generated/graphql';
import { filterString } from './inputString';
import { filterInt } from './inputInt';
import { FilterString} from '../generated/graphql';
type Resolved = Record<string, any>[];

function stringTerm (field: string, filter: FilterString | null | undefined): Resolved {
    if (filter !== null && filter !== undefined) {
        return filterString(field, filter);
    }

    return [];
}

function intTerm (field: string, filter: FilterInt | null | undefined): Resolved {
    if (filter !== null && filter !== undefined) {
        return filterInt(field, filter);
    }

    return [];
}

export function filterOperatingSystem(field: string, filter: FilterOperatingSystem): Record<string, any>[] {
    console.log("OperatingSystem filter")
    console.log(filter);
    console.log(filter.major)
    console.log(filter.minor)
    console.log(filter.name)

    let filter_array: any[] = [];

    filter_array = filter_array.concat(
        intTerm('system_profile_facts.operating_system.major', filter.major),
        intTerm('system_profile_facts.operating_system.minor', filter.minor),
        stringTerm('system_profile_facts.operating_system.name', filter.name)
    );

    return [{
        bool: {
            must: filter_array
        }
    }];
}
