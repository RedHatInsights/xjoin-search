import { runQuery, runQueryCatchError } from '../../../test';
import * as constants from '../../constants';
import createIdentityHeader from '../../middleware/identity/utils';

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

const TAG_QUERY = `
    query hosts ($filter: HostFilter) {
        hosts (
            filter: $filter
        )
        {
            data {
                id,
                display_name,
                tags {
                    meta {
                        total
                    },
                    data {
                        namespace,
                        key,
                        value
                    }
                }
            }
        }
    }
`;

describe('hosts query', function () {
    test('fetch hosts', async () => {
        const { data, status } = await runQuery(BASIC_QUERY, {});
        expect(status).toEqual(200);
        expect(data).toMatchSnapshot();
    });

    test('account isolation', async () => {
        const headers = {
            [constants.IDENTITY_HEADER]: createIdentityHeader(f => f, 'customer', '12345', false)
        };

        const { data, status } = await runQuery(BASIC_QUERY, {}, headers);
        expect(status).toEqual(200);
        data.hosts.data.should.have.length(1);
        data.hosts.data[0].id.should.equal('a5ac67e1-ad65-4b62-bc27-845cc6d4bcea');
    });

    test('fetch host with canonical facts', async () => {
        const { data, status } = await runQuery(`
            {
                hosts (
                    filter: {
                        id: "f5ac67e1-ad65-4b62-bc27-845cc6d4bcee"
                    }
                ) {
                    data {
                        id, canonical_facts
                    }
                }
            }`,
        {});
        expect(status).toEqual(200);
        expect(data).toMatchSnapshot();
    });

    describe ('ordering', function () {

        test('display_name ASC', async () => {
            const { data, status } = await runQuery(BASIC_QUERY, {
                order_by: 'display_name',
                order_how: 'ASC'
            });

            expect(status).toEqual(200);
            expect(data).toMatchSnapshot();
        });

        test('display_name DESC', async () => {
            const { data, status } = await runQuery(BASIC_QUERY, {
                order_by: 'display_name',
                order_how: 'DESC'
            });

            expect(status).toEqual(200);
            expect(data).toMatchSnapshot();
        });

        test('modified_on DESC', async () => {
            const { data, status } = await runQuery(BASIC_QUERY, {
                order_by: 'modified_on',
                order_how: 'DESC'
            });

            expect(status).toEqual(200);
            expect(data).toMatchSnapshot();
        });
    });

    describe ('case insensitive ordering', function () {

        test('display_name ASC', async () => {
            const { data, status } = await runQuery(BASIC_QUERY, {
                order_by: 'display_name',
                order_how: 'ASC'}, {
                [constants.IDENTITY_HEADER]: createIdentityHeader(data => { return data; }, 'sorting_test', 'sorting_test')
            });

            expect(status).toEqual(200);
            const hostArray = data.hosts.data;

            expect(hostArray[0].display_name).toEqual('A');
            expect(hostArray[1].display_name).toEqual('a');
            expect(hostArray[2].display_name).toEqual('b');
            expect(hostArray[3].display_name).toEqual('B');
        });

        test('display_name DESC', async () => {
            const { data, status } = await runQuery(BASIC_QUERY, {
                order_by: 'display_name',
                order_how: 'ASC'}, {
                [constants.IDENTITY_HEADER]: createIdentityHeader(data => { return data; }, 'sorting_test', 'sorting_test')
            });

            expect(status).toEqual(200);
            const hostArray = data.hosts.data;

            expect(hostArray[3].display_name).toEqual('B');
            expect(hostArray[2].display_name).toEqual('b');
            expect(hostArray[1].display_name).toEqual('a');
            expect(hostArray[0].display_name).toEqual('A');
        });

    });

    describe('limit/offset', function () {
        test('limit too low', async () => {
            const err = await runQueryCatchError(undefined, BASIC_QUERY, { limit: -1 });
            expect(err.message.startsWith('value must be 0 or greater (was -1)')).toBeTruthy();
        });

        test('limit too high', async () => {
            const err = await runQueryCatchError(undefined, BASIC_QUERY, { limit: 101 });
            expect(err.message.startsWith('value must be 100 or less (was 101)')).toBeTruthy();
        });

        test('offset too low', async () => {
            const err = await runQueryCatchError(undefined, BASIC_QUERY, { offset: -5 });
            expect(err.message.startsWith('value must be 0 or greater (was -5)')).toBeTruthy();
        });
    });

    describe('queries', function () {
        describe('display_name', function () {
            test('substring', async () => {
                const { data } = await runQuery(BASIC_QUERY, { filter: { display_name: '*est03.*' }});
                data.hosts.data.should.have.length(1);
                data.hosts.data[0].id.should.equal('f5ac67e1-ad65-4b62-bc27-845cc6d4bcee');
            });
        });

        describe('fqdn', function () {
            test('substring', async () => {
                const { data } = await runQuery(BASIC_QUERY, { filter: { fqdn: '*dn.test02.*' }});
                data.hosts.data.should.have.length(1);
                data.hosts.data[0].id.should.equal('22cd8e39-13bb-4d02-8316-84b850dc5136');
            });
        });

        describe('insights_id', function () {
            test('exact match', async () => {
                const { data } = await runQuery(BASIC_QUERY, { filter: { insights_id: '17c52679-f0b9-4e9b-9bac-a3c7fae5070c' }});
                data.hosts.data.should.have.length(1);
                data.hosts.data[0].id.should.equal('22cd8e39-13bb-4d02-8316-84b850dc5136');
            });

            test('substring no wildcards', async () => {
                const { data } = await runQuery(BASIC_QUERY, { filter: { insights_id: 'a3c7fae507' }});
                data.hosts.data.should.have.length(0);
            });

            test('substring', async () => {
                const { data } = await runQuery(BASIC_QUERY, { filter: { insights_id: '*a3c7fae507*' }});
                data.hosts.data.should.have.length(1);
                data.hosts.data[0].id.should.equal('22cd8e39-13bb-4d02-8316-84b850dc5136');
            });
        });

        test('compound', async () => {
            const { data } = await runQuery(BASIC_QUERY, {
                filter: {
                    OR: [{
                        fqdn: '*dn.test02.rhel7.jharting.local',
                        display_name: '*est02*'
                    }, {
                        id: 'f5ac67e1-ad65-4b62-bc27-845cc6d4bcee',
                        insights_id: '*7d934aad983d'
                    }]
                }
            });
            expect(data).toMatchSnapshot();
        });

        describe('system_profile', function () {
            test('arch', async () => {
                const { data } = await runQuery(BASIC_QUERY, { filter: { spf_arch: 'x86_64' }});
                expect(data).toMatchSnapshot();
            });

            test('os_release', async () => {
                const { data } = await runQuery(BASIC_QUERY, {
                    filter: {
                        spf_os_release: '7.*',
                        NOT: {
                            spf_os_release: '7.4'
                        }
                    }
                });
                expect(data).toMatchSnapshot();
            });

            test('os_kernel_release', async () => {
                const { data } = await runQuery(BASIC_QUERY, { filter: { spf_os_kernel_version: '4.18.*' }});
                data.hosts.data.should.have.length(1);
                data.hosts.data[0].id.should.equal('22cd8e39-13bb-4d02-8316-84b850dc5136');
            });

            test('os_infrastructure_type', async () => {
                const { data } = await runQuery(BASIC_QUERY, { filter: { spf_infrastructure_type: 'virtual' }});
                expect(data).toMatchSnapshot();
            });

            test('os_infrastructure_vendor', async () => {
                const { data } = await runQuery(BASIC_QUERY, { filter: { spf_infrastructure_vendor: 'baremetal' }});
                data.hosts.data.should.have.length(1);
                data.hosts.data[0].id.should.equal('f5ac67e1-ad65-4b62-bc27-845cc6d4bcee');
            });
        });

        describe('identity header', function () {
            test('correct identity header', async () => {
                const headers = { [constants.IDENTITY_HEADER]: createIdentityHeader()};
                const err = await runQueryCatchError(headers);
                expect(err).toBeNull();
            });

            test('no identity header', async () => {
                const err = await runQueryCatchError({});
                expect(err.response.status).toEqual(401);
            });

            test('no account number', async () => {
                const headers = { [constants.IDENTITY_HEADER]: createIdentityHeader(
                    data => { delete data.identity.account_number; return data; })};
                const err = await runQueryCatchError(headers);
                expect(err.response.status).toEqual(400);
            });

            test('null account number', async () => {
                const headers = { [constants.IDENTITY_HEADER]: createIdentityHeader(
                    data => { data.identity.account_number = null; return data; })};
                const err = await runQueryCatchError(headers);
                expect(err.response.status).toEqual(400);
            });

            test('wrong identity type', async () => {
                const headers = { [constants.IDENTITY_HEADER]: createIdentityHeader(
                    data => { data.identity.type = 'foo'; return data; })};
                const err = await runQueryCatchError(headers);
                expect(err.response.status).toEqual(403);
            });

            test('missing user obj', async () => {
                const headers = { [constants.IDENTITY_HEADER]: createIdentityHeader(
                    data => { delete data.identity.user; return data; })};
                const err = await runQueryCatchError(headers);
                expect(err.response.status).toEqual(400);
            });

            test('System identity type', async () => {
                const headers = { [constants.IDENTITY_HEADER]: createIdentityHeader(
                    data => {
                        data.identity.type = 'System';
                        delete data.identity.user;
                        data.system = {cn: 'cert_name'};
                        return data; })};
                const err = await runQueryCatchError(headers);
                expect(err).toBeNull();
            });
        });

        describe('stale_timestamp', function () {
            test('basic', async () => {
                const { data } = await runQuery(BASIC_QUERY, {
                    filter: {
                        stale_timestamp: {
                            gte: '2020-01-10T08:07:03.354307Z',
                            lte: '2020-02-10T08:07:03.354307Z'
                        }
                    }
                });
                expect(data).toMatchSnapshot();
            });
            test('gte only', async () => {
                const { data } = await runQuery(BASIC_QUERY, {
                    filter: {
                        stale_timestamp: {
                            gte: '2020-02-10T08:07:03.354307Z'
                        }
                    }
                });
                expect(data).toMatchSnapshot();
            });
            test('lte only', async () => {
                const { data } = await runQuery(BASIC_QUERY, {
                    filter: {
                        stale_timestamp: {
                            lte: '2020-02-10T08:07:03.354307Z'
                        }
                    }
                });
                expect(data).toMatchSnapshot();
            });
            test('gt only', async () => {
                const { data } = await runQuery(BASIC_QUERY, {
                    filter: {
                        stale_timestamp: {
                            gt: '2020-02-10T08:07:03.354307Z'
                        }
                    }
                });
                expect(data).toMatchSnapshot();
            });
            test('lt only', async () => {
                const { data } = await runQuery(BASIC_QUERY, {
                    filter: {
                        stale_timestamp: {
                            lt: '2020-02-10T08:07:03.354307Z'
                        }
                    }
                });
                expect(data).toMatchSnapshot();
            });
            test('not valid gte', async () => {
                const headers = { [constants.IDENTITY_HEADER]: createIdentityHeader()};
                const err = await runQueryCatchError(headers, BASIC_QUERY, {
                    filter: {
                        stale_timestamp: {
                            gte: 'xxx'
                        }
                    }
                });
                expect(err.message.startsWith('invalid timestamp format')).toBeTruthy();
            });
        });

        describe('tags', function () {
            test('simple output', async () => {
                const { data } = await runQuery(TAG_QUERY, {});
                expect(data).toMatchSnapshot();
            });

            test('null tags', async () => {
                const headers = {
                    [constants.IDENTITY_HEADER]: createIdentityHeader(f => f, 'customer', '12345', false)
                };

                const { data, status } = await runQuery(TAG_QUERY, {}, headers);
                expect(status).toEqual(200);
                data.hosts.data.should.have.length(1);
                data.hosts.data[0].tags.meta.total.should.eql(0);
                data.hosts.data[0].tags.data.should.eql([]);
            });

            test('simple tag filter with value', async () => {
                const { data } = await runQuery(TAG_QUERY, {
                    filter: {
                        tag: {
                            namespace: 'aws',
                            key: 'region',
                            value: 'us-east-1'
                        }
                    }
                });
                expect(data).toMatchSnapshot();
            });

            test('simple tag filter with no value', async () => {
                const { data } = await runQuery(TAG_QUERY, {
                    filter: {
                        tag: {
                            namespace: 'insights-client',
                            key: 'web'
                        }
                    }
                });
                expect(data).toMatchSnapshot();
            });

            test('simple tag filter with explicit null value', async () => {
                const { data } = await runQuery(TAG_QUERY, {
                    filter: {
                        tag: {
                            namespace: 'insights-client',
                            key: 'web',
                            value: null
                        }
                    }
                });
                expect(data).toMatchSnapshot();
            });

            test('tag filter union', async () => {
                const { data } = await runQuery(TAG_QUERY, {
                    filter: {
                        OR: [{
                            tag: {
                                namespace: 'insights-client',
                                key: 'web'
                            }
                        }, {
                            tag: {
                                namespace: 'aws',
                                key: 'region',
                                value: 'us-east-1'
                            }
                        }]
                    }
                });
                expect(data).toMatchSnapshot();
            });

            test('tag filter intersection', async () => {
                const { data } = await runQuery(TAG_QUERY, {
                    filter: {
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
                expect(data).toMatchSnapshot();
            });
        });

        describe('facts', function () {
            const QUERY = `
                query hosts (
                    $filter: HostFilter,
                    $fact_filter: [String!],
                ) {
                    hosts (
                        filter: $filter,
                    )
                    {
                        data {
                            id,
                            account,
                            display_name,
                            facts(filter: $fact_filter)
                        }
                    }
                }
            `;

            test('all facts', async () => {
                const { data } = await runQuery(QUERY, { filter: {
                    id: '22cd8e39-13bb-4d02-8316-84b850dc5136'
                }});

                expect(data).toMatchSnapshot();
            });

            test('specific fact key', async () => {
                const { data } = await runQuery(QUERY, {
                    filter: { id: '22cd8e39-13bb-4d02-8316-84b850dc5136' },
                    fact_filter: ['bios']
                });

                expect(data).toMatchSnapshot();
            });

            test('facts not available', async () => {
                const { data } = await runQuery(QUERY, { filter: {
                    id: '6e7b6317-0a2d-4552-a2f2-b7da0aece49d'
                }});

                expect(data).toMatchSnapshot();
            });
        });
    });

    describe('JSONObjectFilter', function () {
        const QUERY = `
            query hosts (
                $filter: HostFilter,
                $system_profile_filter: [String!],
                $canonical_fact_filter: [String!]
            ) {
                hosts (
                    filter: $filter,
                )
                {
                    data {
                        id,
                        account,
                        display_name,
                        system_profile_facts(filter: $system_profile_filter),
                        canonical_facts(filter: $canonical_fact_filter)
                    }
                }
            }
        `;

        test('simple system profile query', async () => {
            const { data } = await runQuery(QUERY, {
                filter: { id: 'f5ac67e1-ad65-4b62-bc27-845cc6d4bcee' },
                system_profile_filter: ['arch', 'os_release']
            });

            expect(data).toMatchSnapshot();
        });

        test('simple canonical fact query', async () => {
            const { data } = await runQuery(QUERY, {
                filter: { id: 'f5ac67e1-ad65-4b62-bc27-845cc6d4bcee' },
                canonical_fact_filter: ['insights_id', 'satellite_id']
            });

            expect(data).toMatchSnapshot();
        });

        test('empty', async () => {
            const { data } = await runQuery(QUERY, {
                filter: { id: 'f5ac67e1-ad65-4b62-bc27-845cc6d4bcee' },
                system_profile_filter: []
            });

            expect(data).toMatchSnapshot();
        });
    });
});
