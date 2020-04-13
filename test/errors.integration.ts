import { runQuery, runQueryCatchError, createHeaders } from '.';
import * as constants from '../src/constants';
import createIdentityHeader from '../src/middleware/identity/utils';
import mockImplementationOnce from 'ts-jest';

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
    test('404 for host outside result window', async () => {
        const err = await runQueryCatchError(undefined, BASIC_QUERY, {
            offset: 99999
        });

        expect(err.message = "Not found")
    });

    test('Result window error', async () => {
        const clientSearchMock = jest.fn()
        .mockImplementationOnce(() => {
            return {
                meta: {
                    body: {
                        error: {
                            root_cause: [
                                {reason: 'Result window is too large'}
                            ]
                        }
                    }
                }
            }
        })
        .mockImplementationOnce(() => 'second call');

        require('../src/es').default.search = clientSearchMock;

        const err = await runQueryCatchError(undefined, BASIC_QUERY, {
            offset: 99999
        });

        console.log(err)
        
        expect(err.message = "Request could not be completed because the page is too deep")
    });
});
