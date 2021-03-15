import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import hosts from './hosts';
import hostTags from './hostTags';
import hostSystemProfile from './hostSystemProfile';
import { enumerationResolver }  from './hostSystemProfile';
import { jsonObjectFilter } from './common';

const resolvers = {
    Query: {
        hosts,
        hostTags,
        hostSystemProfile
    },

    Host: {
        system_profile_facts: jsonObjectFilter('system_profile_facts'),
        canonical_facts: jsonObjectFilter('canonical_facts'),
        facts: jsonObjectFilter('facts')
    },

    HostSystemProfile: {
        sap_system: enumerationResolver('system_profile_facts.sap_system', Boolean),
        sap_sids: enumerationResolver('system_profile_facts.sap_sids', String)
    },

    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject
};

export default resolvers;
