import { runQuery, createHeaders } from '../../../test/helpers';
import * as constants from '../../constants';
import createIdentityHeader from '../../middleware/identity/utils';

const GROUP_FILTERS_QUERY = `
    query hostGroups (
        $hostFilter: HostFilter,
        $order_by: HOST_GROUPS_ORDER_BY,
        $order_how: ORDER_DIR,
        $limit: Int,
        $offset: Int) {
        hostGroups (
            hostFilter: $hostFilter,
            order_by: $order_by,
            order_how: $order_how,
            limit: $limit,
            offset: $offset
        )
        {
            meta {
                count,
                total
            }
            data {
                group {
                    id, name, account, org_id, created_on, modified_on
                },
                count
            }
        }
    }
`;

describe('host groups', function () {
    test('basic query', async () => {
        const {data, status} = await runQuery(GROUP_FILTERS_QUERY, {});
        expect(status).toEqual(200);
        expect(data).toMatchSnapshot();
    });

    test('org_id isolation', async () => {
        const headers = {
            [constants.IDENTITY_HEADER]: createIdentityHeader(
                f => f, 'customer', '12345', false)
        };

        const { data, status } = await runQuery(GROUP_FILTERS_QUERY, {}, headers);
        data.hostGroups.data.should.have.length(0);
        data.hostGroups.meta.should.have.property('total', 0);
        data.hostGroups.meta.should.have.property('count', 0);
        expect(status).toEqual(200);
    });

    describe('pagination', function () {
        const headers = createHeaders('hostGroupsTest', 'hostGroupsTest');

        test('limit', async () => {
            const {data, status} = await runQuery(GROUP_FILTERS_QUERY, {
                limit: 2
            }, headers);

            expect(status).toEqual(200);
            data.hostGroups.data.should.have.length(2);
            data.hostGroups.meta.count.should.equal(2);
            data.hostGroups.meta.total.should.equal(5);
            expect(data).toMatchSnapshot();
        });

        test('limit + offset', async () => {
            const {data, status} = await runQuery(GROUP_FILTERS_QUERY, {
                limit: 1,
                offset: 1
            }, headers);

            data.hostGroups.data.should.have.length(1);
            data.hostGroups.meta.should.have.property('count', 1);
            data.hostGroups.meta.should.have.property('total', 5);

            expect(status).toEqual(200);
            expect(data).toMatchSnapshot();
        });

        test('ordering', async () => {
            const {data, status} = await runQuery(GROUP_FILTERS_QUERY, {
                order_by: 'group',
                order_how: 'ASC'
            });

            expect(status).toEqual(200);
            expect(data).toMatchSnapshot();
        });
    });

    describe('host filters', function () {
        test('by id', async () => {
            const { data, status } = await runQuery(GROUP_FILTERS_QUERY, {
                hostFilter: { id: { eq: 'd36bd5c3-fb39-4826-8d82-152bedfd1ecd' }}
            });

            expect(status).toEqual(200);
            expect(data).toMatchSnapshot();
        });
    });
});

