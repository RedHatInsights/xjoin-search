import { getQuery } from '../../../test';

const BASIC_QUERY = `
    query hosts ($filter: HostFilter, $order_by: HOSTS_ORDER_BY, $order_how: ORDER_DIR) {
        hosts (
            filter: $filter,
            order_by: $order_by,
            order_how: $order_how
        )
        {
            data {
                id, account, display_name, modified_on
            }
        }
    }
`;

describe('hosts query', function () {
    test('fetch hosts', async () => {
        const data = await getQuery()({
            query: BASIC_QUERY,
            variables: {
                filter: {
                    system_profile_fact: {
                        key: 'os_release',
                        value: '7.4'
                    }
                }
            }
        });

        expect(data).toMatchSnapshot();
    });

    describe ('ordering', function () {

        test('display_name ASC', async () => {
            const result = await getQuery()({
                query: BASIC_QUERY,
                variables: {
                    order_by: 'display_name',
                    order_how: 'ASC'
                }
            });

            expect(result).toMatchSnapshot();
        });

        test('display_name DESC', async () => {
            const result = await getQuery()({
                query: BASIC_QUERY,
                variables: {
                    order_by: 'display_name',
                    order_how: 'DESC'
                }
            });

            expect(result).toMatchSnapshot();
        });

        test('modified_on DESC', async () => {
            const result = await getQuery()({
                query: BASIC_QUERY,
                variables: {
                    order_by: 'modified_on',
                    order_how: 'DESC'
                }
            });

            expect(result).toMatchSnapshot();
        });
    });
});
