import 'should';
import start from '../src/app';
import createIdentityHeader from '../src/middleware/identity/utils';
import * as constants from '../src/constants';
import { GraphQLClient } from 'graphql-request';

let app: any = null;

beforeAll(async () => {
    try {
        app = await start();
    } catch (e) {
        // workaround for https://github.com/facebook/jest/issues/8688
        console.log(e);
        throw e;
    }
});

afterAll(async () => {
    await app.stop();
});

export async function runQuery(query: string, variables: Record<string, any>, modify_identity_hdr_data = (d: any) => d) {
    const headers = { headers: { [constants.IDENTITY_HEADER]: createIdentityHeader(modify_identity_hdr_data)}};
    const client = new GraphQLClient('http://localhost:4000/graphql', headers);
    return client.rawRequest(query, variables);
}
