import { runQuery, createHeaders } from '../../../test/helpers';
import * as constants from '../../constants';
import createIdentityHeader from '../../middleware/identity/utils';
import { testLimitOffset } from '../test.common';

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

    test('account isolation', async () => {
        const headers = {
            [constants.IDENTITY_HEADER]: createIdentityHeader(f => f, 'customer', '12345', '56789', false)
        };

        const { data, status } = await runQuery(TAG_FILTERS_QUERY, {}, headers);
        data.hostTags.data.should.have.length(0);
        data.hostTags.meta.should.have.property('total', 0);
        data.hostTags.meta.should.have.property('count', 0);
        expect(status).toEqual(200);
    });

    describe('pagination', function () {
        const headers = createHeaders('hostTagsTest', 'hostTagsTest', 'hostTagsTest');

        test('limit', async () => {
            const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
                limit: 2
            }, headers);

            expect(status).toEqual(200);
            data.hostTags.data.should.have.length(2);
            data.hostTags.meta.count.should.equal(2);
            data.hostTags.meta.total.should.equal(16);
            expect(data).toMatchSnapshot();
        });

        test('limit + offset', async () => {
            const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
                limit: 2,
                offset: 14
            }, headers);

            data.hostTags.data.should.have.length(2);
            data.hostTags.meta.should.have.property('count', 2);
            data.hostTags.meta.should.have.property('total', 16);

            expect(status).toEqual(200);
            expect(data).toMatchSnapshot();
        });

        test('limit + offset + search', async () => {
            const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
                limit: 2,
                offset: 2,
                filter: {
                    search: {
                        regex: '.*foo.*'
                    }
                }
            }, headers);

            expect(status).toEqual(200);

            data.hostTags.data.should.have.length(2);
            data.hostTags.meta.should.have.property('count', 2);
            data.hostTags.meta.should.have.property('total', 8);
        });

        test('limit + offset + search + ignorecase + typeahead', async () => {
            const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
                limit: 2,
                offset: 2,
                filter: {
                    search: {
                        regex: 'S*'
                    }
                }
            }, headers);

            expect(status).toEqual(200);

            data.hostTags.data.should.have.length(2);
            data.hostTags.meta.should.have.property('count', 2);
            data.hostTags.meta.should.have.property('total', 16);
            expect(data).toMatchSnapshot();
        });

        test('limit + offset + search + ignorecase + namespace + key', async () => {
            const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
                limit: 2,
                offset: 2,
                filter: {
                    search: {
                        regex: 'insights-client/b*'
                    }
                }
            }, headers);

            expect(status).toEqual(200);
            data.hostTags.data.should.have.length(2);
            data.hostTags.meta.should.have.property('count', 2);
            data.hostTags.meta.should.have.property('total', 16);
            expect(status).toEqual(200);

            expect(data).toMatchSnapshot();
        });

        testLimitOffset(TAG_FILTERS_QUERY);
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
                hostFilter: { id: { eq: '22cd8e39-13bb-4d02-8316-84b850dc5136' }}
            });

            expect(status).toEqual(200);
            expect(data).toMatchSnapshot();
        });

        test('by tag', async () => {
            const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
                hostFilter: {
                    tag: {
                        namespace: {eq: 'insights-client'},
                        key: {eq: 'database'}
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
                            namespace: {eq: 'insights-client'},
                            key: {eq: 'os'},
                            value: {eq: 'fedora'}
                        }
                    }, {
                        tag: {
                            namespace: {eq: 'insights-client'},
                            key: {eq: 'database'}
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
                    search: {
                        eq: 'aws/region=us-east-1'
                    }
                }
            });

            expect(status).toEqual(200);
            data.hostTags.data.should.have.length(1);
            data.hostTags.meta.should.have.property('count', 1);
            data.hostTags.meta.should.have.property('total', 1);
            data.hostTags.data.should.eql([{
                count: 1,
                tag: {
                    namespace: 'aws',
                    key: 'region',
                    value: 'us-east-1'
                }
            }]);
        });

        test('by tag name + regex', async () => {
            const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
                filter: {
                    search: {
                        regex: 'aws/region=us-east-1'
                    }
                }
            });

            expect(status).toEqual(200);
            data.hostTags.data.should.have.length(1);
            data.hostTags.meta.should.have.property('count', 1);
            data.hostTags.meta.should.have.property('total', 1);
            data.hostTags.data.should.eql([{
                count: 1,
                tag: {
                    namespace: 'aws',
                    key: 'region',
                    value: 'us-east-1'
                }
            }]);
        });

        test('by tag name + regex + different_case', async () => {
            const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
                filter: {
                    search: {
                        regex: 'aws/REGION=us-east-1'
                    }
                }
            });

            expect(status).toEqual(200);
            data.hostTags.data.should.have.length(1);
            data.hostTags.meta.should.have.property('count', 1);
            data.hostTags.meta.should.have.property('total', 1);
            data.hostTags.data.should.eql([{
                count: 1,
                tag: {
                    namespace: 'aws',
                    key: 'region',
                    value: 'us-east-1'
                }
            }]);
            expect(data).toMatchSnapshot();
        });

        test('by tag name + regex type-ahead', async () => {
            const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
                filter: {
                    search: {
                        regex: 'aws/region'
                    }
                }
            });

            expect(status).toEqual(200);
            data.hostTags.data.should.have.length(3);
            data.hostTags.meta.should.have.property('count', 3);
            data.hostTags.meta.should.have.property('total', 3);
            expect(data).toMatchSnapshot();
        });

        test('by tag name negative', async () => {
            const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
                filter: {
                    search: {
                        eq: '.*aws.*'
                    }
                }
            });

            expect(status).toEqual(200);
            data.hostTags.meta.should.have.property('count', 0);
            data.hostTags.meta.should.have.property('total', 0);
            data.hostTags.data.should.be.empty();
        });

        test('by tag name prefix', async () => {
            const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
                filter: {
                    search: {
                        regex: 'insights-client.*'
                    }
                }
            });

            expect(status).toEqual(200);
            expect(data).toMatchSnapshot();
        });

        test('by tag name substring', async () => {
            const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
                filter: {
                    search: {
                        regex: '.*region.*'
                    }
                }
            });

            expect(status).toEqual(200);
            expect(data).toMatchSnapshot();
        });

        test('by tag name suffix', async () => {
            const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
                filter: {
                    search: {
                        regex: '.*Δwithčhars!'
                    }
                }
            });

            expect(status).toEqual(200);
            expect(data).toMatchSnapshot();
        });

        describe('special characters', function () {
            const headers = {
                [constants.IDENTITY_HEADER]: createIdentityHeader(
                    f => f, 'hostTagsSpecialChars', 'hostTagsSpecialChars', 'hostTagsSpecialChars', false
                )
            };

            const specialTags = [{
                count: 1,
                tag: {
                    namespace: 'insights-client',
                    key: 'key',
                    value: 'keyΔwithčhars*+!.,-_ '
                }
            }, {
                count: 1,
                tag: {
                    namespace: 'insights-client',
                    key: 'keyΔwithčhars*+!.,-_ ',
                    value: 'value'
                }
            }, {
                count: 1,
                tag: {
                    namespace: 'keyΔwithčhars*+!.,-_ ',
                    key: 'key',
                    value: 'value'
                }
            }];

            Array.from('Δč*+!.,_ ').forEach(i =>
                test(`search by "${i}"`, async () => {
                    const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
                        filter: {
                            search: {
                                regex: `.*\\${i}.*`
                            }
                        }
                    }, headers);

                    expect(status).toEqual(200);
                    const d = data.hostTags.data;
                    d.should.have.length(3);
                    d.should.eql(specialTags);
                })
            );

            Array.from('=/').forEach(i =>
                test(`search by control characters ("${i}") returns all tags`, async () => {
                    const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
                        filter: {
                            search: {
                                regex: `.*\\${i}.*`
                            }
                        }
                    }, headers);

                    expect(status).toEqual(200);
                    const d = data.hostTags.data;
                    d.should.have.length(4);
                })
            );
        });
    });

    describe('tag filters ignore cases', function () {
        const headers = createHeaders('test', 'test', 'test');

        test('case-insensitve', async () => {
            const { data, status } = await runQuery(TAG_FILTERS_QUERY, {
                limit: 2,
                offset: 2,
                filter: {
                    search: {
                        regex: 'S*'
                    }
                }
            }, headers);

            expect(status).toEqual(200);

            data.hostTags.data.should.have.length(2);
            data.hostTags.meta.should.have.property('count', 2);
            data.hostTags.meta.should.have.property('total', 8);
            expect(data).toMatchSnapshot();
        });
        testLimitOffset(TAG_FILTERS_QUERY);
    });
});
