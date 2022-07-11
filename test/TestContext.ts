import { createHeaders } from './helpers';

export const ORG_ID_PREFIX = 'test-orgId-';

export class TestContext {

    id: number;
    org_id: string;
    headers: Record<string, string>;

    constructor (id: number) {
        this.id = id;
        this.org_id = `${ORG_ID_PREFIX}${id}`;
        this.headers = createHeaders(this.org_id, this.org_id, false);
    }
}
