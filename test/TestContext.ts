import { createHeaders } from './helpers';

export const ACCOUNT_PREFIX = 'test-account-';
export const ORG_ID_PREFIX = 'test-orgId-';

export class TestContext {

    id: number;
    account: string;
    org_id: string;
    headers: Record<string, string>;

    constructor (id: number) {
        this.id = id;
        this.account = `${ACCOUNT_PREFIX}${id}`;
        this.org_id = `${ORG_ID_PREFIX}${id}`;
        this.headers = createHeaders(this.account, this.account, this.org_id, false);
    }
}
