import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import { SafeIntResolver } from 'graphql-scalars';
import hosts from './hosts';
import hostStats from './hostStats';
import hostTags from './hostTags';
import hostSystemProfile from './hostSystemProfile';
import hostGroups from './hostGroups';
import { enumerationResolver, OSResolver }  from './hostSystemProfile';
import { jsonObjectFilter } from './common';

const resolvers = {
    Query: {
        hosts,
        hostGroups,
        hostStats,
        hostSystemProfile,
        hostTags
    },

    Host: {
        system_profile_facts: jsonObjectFilter('system_profile_facts'),
        canonical_facts: jsonObjectFilter('canonical_facts'),
        facts: jsonObjectFilter('facts')
    },

    HostStats: {
    },

    HostSystemProfile: {
        sap_system: enumerationResolver('system_profile_facts.sap_system', Boolean),
        sap_sids: enumerationResolver('system_profile_facts.sap_sids', String),
        operating_system: OSResolver()
    },

    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject,
    BigInt: SafeIntResolver
};

export default resolvers;
