import { gql } from 'apollo-server-express';
import { readFileSync } from 'fs';

const schema = gql(readFileSync('./src/schema/schema.graphql', 'utf8'));
export default schema;
