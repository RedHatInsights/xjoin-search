import { createHeaders } from './helpers';

export const ACCOUNT_PREFIX = 'test-account-';

export class TestContext {

    id: number;
    account: string;
    headers: Record<string, string>;

    constructor (id: number) {
        this.id = id;
        this.account = `${ACCOUNT_PREFIX}${id}`;
        this.headers = createHeaders(this.account, this.account, false);
    }
}
