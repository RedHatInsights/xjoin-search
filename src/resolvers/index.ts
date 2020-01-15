import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import hosts from './hosts';
import hostTags from './hostTags';
import { jsonObjectFilter } from './common';

const resolvers = {
    Query: {
        hosts,
        hostTags
    },

    Host: {
        system_profile_facts: jsonObjectFilter('system_profile_facts'),
        canonical_facts: jsonObjectFilter('canonical_facts')
    },

    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject
};

export default resolvers;
