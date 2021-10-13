import { HostFilter } from '../generated/graphql';
import { getResolver } from '../util/systemProfile';
import { PrimativeTypeString } from '../util/systemProfile';
import _ from 'lodash';

type Resolved = Record<string, any>[];


function term (field: string, filter: HostFilter | null | undefined, resolver: any): Resolved {
    if (filter !== null && filter !== undefined) {
        return resolver(field, filter);
    }

    return [];
}

export function filterObject(field: string, filter: any, sub_field_names: string[], sub_field_types: PrimativeTypeString[] ): Record<string, any>[] {
    let filter_array: any[] = [];
    let filter_terms: any[] = [];


    let sub_fields: [string| undefined, PrimativeTypeString | undefined][] = _.zip(sub_field_names, sub_field_types)


    _.forEach(sub_fields, (sub_field) => {
        let name = sub_field[0];
        let type = sub_field[1];
        
        if(name != undefined && type != undefined) {
            let resolver = getResolver(name, type, null);
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
