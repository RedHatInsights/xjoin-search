import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import hosts from './hosts/hosts';
import hostTags from './hosts/hostTags';

const resolvers = {
    Query: {
        hosts,
        hostTags
    },

    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject
};

export default resolvers;
