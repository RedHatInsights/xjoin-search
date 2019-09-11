import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import hosts from './hosts';

const resolvers = {
    Query: {
        hosts
    },

    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject
};

export default resolvers;
