import { PerReporterStalenessFilter } from '../generated/graphql';
import { checkTimestamp } from './validation';
import { filterTimestamp } from './inputTimestamp'

export function filterPerReporterStaleness(field: string, filter: PerReporterStalenessFilter) {
    let prs_reporter = field

    let field_reporter = prs_reporter + ".reporter";
    let field_stale_timestamp = prs_reporter + "stale_timestamp";
    let field_last_check_in = prs_reporter + "last_check_in";


    let timestamp_query = null;
    if (filter.stale_timestamp != null) {
        timestamp_query = filterTimestamp(field_stale_timestamp, filter.stale_timestamp);
    }
 
    let range = {
        "per_reporter_staleness.stale_timestamp": {},
        "per_reporter_staleness.last_check_in": {}
    }

    if (filter.stale_timestamp != null) {
        checkTimestamp(filter.stale_timestamp.gte);
        checkTimestamp(filter.stale_timestamp.lte);
        checkTimestamp(filter.stale_timestamp.gt);
        checkTimestamp(filter.stale_timestamp.lt);
        
        range["per_reporter_staleness.stale_timestamp"] = {
            gte: filter.stale_timestamp.gte,
            lte: filter.stale_timestamp.lte,
            gt: filter.stale_timestamp.gt,
            lt: filter.stale_timestamp.lt
        }
    }


    if (filter.last_check_in != null) {
        checkTimestamp(filter.last_check_in.gte);
        checkTimestamp(filter.last_check_in.lte);
        checkTimestamp(filter.last_check_in.gt);
        checkTimestamp(filter.last_check_in.lt);
        
        range["per_reporter_staleness.last_check_in"] = {
            gte: filter.last_check_in.gte,
            lte: filter.last_check_in.lte,
            gt: filter.last_check_in.gt,
            lt: filter.last_check_in.lt
        }
    }
            
    let reporter_query = [{
        nested: {
            path: 'per_reporter_staleness',
            query: {
                bool: {
                    must: [
                        {term: { 'per_reporter_staleness.reporter': filter.reporter }},
                        {"range": {
                            "per_reporter_staleness.last_check_in": range["per_reporter_staleness.last_check_in"]
                        }},
                        {"range": {
                            "per_reporter_staleness.stale_timestamp": range["per_reporter_staleness.stale_timestamp"]
                        }}
                    ]
                }
            }
        },
        
    }]

    let final_query = reporter_query;
//    / final_query.concat(timestamp_query);

    console.log("the query:")
    console.log(reporter_query)
    //gonna have to change this bit to be dynamic
    return reporter_query;
}
