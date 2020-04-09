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

export async function runQuery(query: string, variables: Record<string, any>,
    headers: any = { [constants.IDENTITY_HEADER]: createIdentityHeader()}) {

    const client = new GraphQLClient('http://localhost:4000/graphql', { headers });
    return client.rawRequest(query, variables);
}

export async function runQueryCatchError(headers: any, query = '{ hosts { data { id }}}', variables = {}) {
    let err = null;
    try {
        await runQuery(query, variables, headers);
    } catch (e) {
        err = e;
    }

    return err;
}

export function createHeaders (username: string, account: string, is_internal = true) {
    return {
        [constants.IDENTITY_HEADER]: createIdentityHeader(f => f, username, account, is_internal)
    };
}
