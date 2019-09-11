import start from '../src/app';
import { createTestClient } from 'apollo-server-testing';

let ctx: any = null;

beforeAll(async () => {
    const app = await start();
    const { query } = createTestClient(app.apollo);
    ctx = { app, query };
});

afterAll(async () => {
    const local = ctx;
    ctx = null;
    await local.app.stop();
});

export function getQuery () {
    return ctx.query;
}
