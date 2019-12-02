import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import hosts from './hosts';
import hostTags from './hostTags';

const resolvers = {
    Query: {
        hosts,
        hostTags
    },

    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject
};

export default resolvers;
