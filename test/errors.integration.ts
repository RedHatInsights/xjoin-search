import { runQuery, runQueryCatchError, createHeaders } from '.';
import * as constants from '../src/constants';
import createIdentityHeader from '../src/middleware/identity/utils';
import mockImplementationOnce from 'ts-jest';

const sinon = require('sinon');

const BASIC_QUERY = `
    query hosts (
        $filter: HostFilter,
        $order_by: HOSTS_ORDER_BY,
        $order_how: ORDER_DIR,
        $limit: Int,
        $offset: Int) {
        hosts (
            filter: $filter,
            order_by: $order_by,
            order_how: $order_how,
            limit: $limit,
            offset: $offset
        )
        {
            data {
                id,
                account,
                display_name,
                modified_on,
                stale_timestamp,
                reporter,
                ansible_host
            }
        }
    }
`;

describe('errors tests', function () {
    test('Result window error', async () => {
        const client = require('../src/es').default;
        let clientSearchStub = sinon.stub(client, "search")
        clientSearchStub.onCall(0).throws((
            {
                meta: {
                    body: {
                        "error": {
                            "root_cause": [
                                {
                                    "type": "illegal_argument_exception",
                                    "reason": "Result window is too large"
                                }
                            ]
                        }
                    }
                }
            }
        ));

        clientSearchStub.onCall(1).returns((
            {
                body: {
                    hits: {
                        total: {
                            value: 100000
                        }
                    }
                }
            }
        ));

        const err = await runQueryCatchError(undefined, BASIC_QUERY, {
            offset: 50001
        });

        expect(err.message.startsWith("Request could not be completed because the page is too deep")).toBeTruthy();
    });
});
