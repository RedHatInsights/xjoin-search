import { FilterInt, FilterOperatingSystem, Host, HostFilter, HostResolvers } from '../generated/graphql';
import { FilterString} from '../generated/graphql';
import { filterString, filterStringWithWildcard } from './inputString';
import { filterInt } from './inputInt';
import _ from 'lodash';
import { filterBoolean } from './inputBoolean';
import { any } from 'bluebird';
import { HostFilterResolver, resolverFromType } from './hosts';
import { FilterResolver } from './common'

type Resolved = Record<string, any>[];

export type PrimativeTypeString = "string" | "integer" | "array" | "wildcard" | "object" | "boolean"

// TODO: check if HostResolvers is too broad
function term (field: string, filter: HostFilter | null | undefined, resolver: any): Resolved {
    if (filter !== null && filter !== undefined) {
        return resolver(field, filter);
    }

    return [];
}

export function filterObject(field: string, filter: any, sub_field_names: string[], sub_field_types: PrimativeTypeString[] ): Record<string, any>[] {
    // Data needed to work dynamically
    // the path: system_profile_facts.operating_system
    // the fields in the path: [major, minor, name]
    // the types of those fields: [int, int, string] or the resolver for each
    // those two could be in one dict style object maybe?
    console.log(`sub_fields_names: ${sub_field_names}.`);
    console.log(`sub_fields_types: ${sub_field_types}.`);

    let filter_array: any[] = [];
    let filter_terms: any[] = [];


    let sub_fields: [string| undefined, PrimativeTypeString | undefined][] = _.zip(sub_field_names, sub_field_types)


    _.forEach(sub_fields, (sub_field) => {
        let name = sub_field[0];
        let type = sub_field[1];
        
        if(name != undefined && type != undefined) {
            let resolver = resolverFromType(name, type, null);
            if (resolver != null) {
                filter_terms.push(term(`${field}.${name}`, filter[name], resolver));
            }
        }
    })

    filter_array = filter_array.concat(
        ...filter_terms
    );

    return [{
        bool: {
            must: filter_array
        }
    }];
}
