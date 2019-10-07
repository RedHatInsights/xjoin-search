import start from '../src/app';
import { createTestClient } from 'apollo-server-testing';

let ctx: any = null;

beforeAll(async () => {
    try {
        const app = await start();
        const { query } = createTestClient(app.apollo);
        ctx = { app, query };
    } catch (e) {
        // workaround for https://github.com/facebook/jest/issues/8688
        console.log(e);
        throw e;
    }
});

afterAll(async () => {
    const local = ctx;
    ctx = null;
    await local.app.stop();
});

export function getQuery () {
    return ctx.query;
}
