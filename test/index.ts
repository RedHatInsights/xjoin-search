import 'should';
import start from '../src/app';

import { TestContext, ACCOUNT_PREFIX } from './TestContext';
import client from '../src/es';

let app: any = null;

jest.setTimeout(2000000)
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

let testId = 0;
let ctx: any = null;

beforeEach(() => {
    ctx = new TestContext(++testId);
});

export function getContext() {
    if (ctx instanceof TestContext) {
        return ctx;
    }

    throw new Error('test context not initialized');
}

beforeAll(async function () {
    client.deleteByQuery({
        index: 'test.hosts.sink',
        type: '_doc',
        body: {
            query: {
                wildcard: {
                    account: `${ACCOUNT_PREFIX}*`
                }
            }
        }
    });
});
