import { Client } from '@elastic/elasticsearch';
import config from '../config';

const client = new Client({ node: config.es.nodes, auth: {username: config.es.username,
    password: config.es.password}});
export default client;
