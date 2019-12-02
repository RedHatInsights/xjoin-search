import { runQuery } from '../../../test';

const TAG_FILTERS_QUERY = `
    query hostTags (
        $hostFilter: HostFilter,
        $filter: TagAggregationFilter,
        $order_by: HOST_TAGS_ORDER_BY,
        $order_how: ORDER_DIR,
        $limit: Int,
        $offset: Int) {
        hostTags (
            hostFilter: $hostFilter,
            filter: $filter,
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
                tag {
                    namespace, key, value
                },
                count
            }
        }
    }
`;

describe('host tags', function () {
    test('basic query', async () => {
        const { data, status } = await runQuery(TAG_FILTERS_QUERY, {});
        expect(status).toEqual(200);
        expect(data).toMatchSnapshot();
    });

    test('limit', async () => {
        const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
            limit: 2
        });

        expect(status).toEqual(200);
        expect(data).toMatchSnapshot();
    });

    test('limit + offset', async () => {
        const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
            limit: 2,
            offset: 1
        });

        expect(status).toEqual(200);
        expect(data).toMatchSnapshot();
    });

    test('ordering', async () => {
        const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
            order_by: 'tag',
            order_how: 'ASC'
        });

        expect(status).toEqual(200);
        expect(data).toMatchSnapshot();
    });

    describe('host filters', function () {
        test('by id', async () => {
            const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
                hostFilter: {
                    id: '22cd8e39-13bb-4d02-8316-84b850dc5136'
                }
            });

            expect(status).toEqual(200);
            expect(data).toMatchSnapshot();
        });

        test('by tag', async () => {
            const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
                hostFilter: {
                    tag: {
                        namespace: 'insights-client',
                        key: 'database'
                    }
                }
            });

            expect(status).toEqual(200);
            expect(data).toMatchSnapshot();
        });

        test('by tag intersection', async () => {
            const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
                hostFilter: {
                    AND: [{
                        tag: {
                            namespace: 'insights-client',
                            key: 'os',
                            value: 'fedora'
                        }
                    }, {
                        tag: {
                            namespace: 'insights-client',
                            key: 'database'
                        }
                    }]
                }
            });

            expect(status).toEqual(200);
            expect(data).toMatchSnapshot();
        });
    });

    describe('tag filters', function () {
        test('by tag name', async () => {
            const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
                filter: {
                    name: 'aws/region/us-east-1'
                }
            });

            expect(status).toEqual(200);
            expect(data).toMatchSnapshot();
        });

        test('by tag name prefix', async () => {
            const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
                filter: {
                    name: 'insights-client.*'
                }
            });

            expect(status).toEqual(200);
            expect(data).toMatchSnapshot();
        });

        test('by tag name substring', async () => {
            const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
                filter: {
                    name: '.*region.*'
                }
            });

            expect(status).toEqual(200);
            expect(data).toMatchSnapshot();
        });

        test('by tag name suffix', async () => {
            const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
                filter: {
                    name: '.*%CE%94with%C4%8Dhars%21'
                }
            });

            expect(status).toEqual(200);
            expect(data).toMatchSnapshot();
        });
    });
});
