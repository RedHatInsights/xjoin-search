import { FilterAnsible } from '../generated/graphql';
import { filterStringWithWildcard } from './inputString';
import { FilterStringWithWildcard } from '../generated/graphql';

type Resolved = Record<string, any>[];

function stringTerm (field: string, filter: FilterStringWithWildcard | null | undefined): Resolved {
    if (filter !== null && filter !== undefined) {
        return filterStringWithWildcard(field, filter);
    }

    return [];
}

export function filterAnsible(filter: FilterAnsible): Record<string, any>[] {
    let filter_array: any[] = [];

    filter_array = filter_array.concat(
        stringTerm('system_profile_facts.ansible.controller_version', filter.controller_version),
        stringTerm('system_profile_facts.ansible.hub_version', filter.hub_version),
        stringTerm('system_profile_facts.ansible.catalog_worker_version', filter.catalog_worker_version),
        stringTerm('system_profile_facts.ansible.sso_version', filter.sso_version)
    );

    return [{
        bool: {
            must: filter_array
        }
    }];
}
