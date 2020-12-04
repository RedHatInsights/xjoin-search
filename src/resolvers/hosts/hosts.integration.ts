import { runQuery, runQueryCatchError, createHeaders, createHosts } from '../../../test/helpers';
import * as constants from '../../constants';
import createIdentityHeader from '../../middleware/identity/utils';
import sinon from 'sinon';
import client from '../../es';
import * as probes from '../../probes';
import { getContext } from '../../../test';
import { testLimitOffset } from '../test.common';

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

const SP_QUERY = `
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
                system_profile_facts
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
        const headers = createHeaders('customer', '12345', false);

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
                        id: {
                            eq: "f5ac67e1-ad65-4b62-bc27-845cc6d4bcee"
                        }
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
        const headers = createHeaders('sorting_test', 'sorting_test');

        test('display_name ASC', async () => {
            const { data, status } = await runQuery(BASIC_QUERY,
                {
                    order_by: 'display_name',
                    order_how: 'ASC'
                },
                headers);

            expect(status).toEqual(200);
            const hostArray = data.hosts.data;

            expect(hostArray[0].display_name).toEqual('aa');
            expect(hostArray[1].display_name).toEqual('Ab');
            expect(hostArray[2].display_name).toEqual('aC');
            expect(hostArray[3].display_name).toEqual('Ba');
            expect(hostArray[4].display_name).toEqual('bb');
        });

        test('display_name DESC', async () => {
            const { data, status } = await runQuery(BASIC_QUERY,
                {
                    order_by: 'display_name',
                    order_how: 'DESC'
                },
                headers);

            expect(status).toEqual(200);
            const hostArray = data.hosts.data;

            expect(hostArray[0].display_name).toEqual('bb');
            expect(hostArray[1].display_name).toEqual('Ba');
            expect(hostArray[2].display_name).toEqual('aC');
            expect(hostArray[3].display_name).toEqual('Ab');
            expect(hostArray[4].display_name).toEqual('aa');
        });

    });

    describe('case sensitive search', function () {
        describe('display_name', function () {
            test('substring', async () => {
                const { data } = await runQuery(BASIC_QUERY,
                    { filter: { display_name: { eq: 'Ba' } }},
                    createHeaders('sorting_test', 'sorting_test'));
                data.hosts.data.should.have.length(1);
                data.hosts.data[0].display_name.should.equal('Ba');
            });
        });
    });

    describe('timestamp_ordering', function () {
        const headers = createHeaders('timestamp_sorting_test', 'timestamp_sorting_test');

        test('timestamps DESC', async () => {
            const { data, status } = await runQuery(BASIC_QUERY,
                {
                    order_by: 'modified_on',
                    order_how: 'DESC'
                },
                headers);

            expect(status).toEqual(200);
            const hostArray = data.hosts.data;

            expect(hostArray[0].display_name).toEqual('WhenDESC_Before');
            expect(hostArray[1].display_name).toEqual('WhenDESC_After');
        });

        test('timestamps ASC', async () => {
            const { data, status } = await runQuery(BASIC_QUERY,
                {
                    order_by: 'modified_on',
                    order_how: 'ASC'
                },
                headers);

            expect(status).toEqual(200);
            const hostArray = data.hosts.data;

            expect(hostArray[0].display_name).toEqual('WhenDESC_After');
            expect(hostArray[1].display_name).toEqual('WhenDESC_Before');
        });
    });

    testLimitOffset(BASIC_QUERY);

    describe('queries', function () {
        describe('display_name', function () {
            test('substring', async () => {
                const { data } = await runQuery(BASIC_QUERY, { filter: { display_name: { matches: '*est03.*' }}});
                data.hosts.data.should.have.length(1);
                data.hosts.data[0].id.should.equal('f5ac67e1-ad65-4b62-bc27-845cc6d4bcee');
            });
        });

        describe('fqdn', function () {
            test('substring', async () => {
                const { data } = await runQuery(BASIC_QUERY, { filter: { fqdn: { matches: '*dn.test02.*' }}});
                data.hosts.data.should.have.length(1);
                data.hosts.data[0].id.should.equal('22cd8e39-13bb-4d02-8316-84b850dc5136');
            });
        });

        describe('insights_id', function () {
            test('exact match', async () => {
                const { data } = await runQuery(BASIC_QUERY, { filter: { insights_id: {
                    eq: '17c52679-f0b9-4e9b-9bac-a3c7fae5070c'
                }}});
                data.hosts.data.should.have.length(1);
                data.hosts.data[0].id.should.equal('22cd8e39-13bb-4d02-8316-84b850dc5136');
            });

            test('substring no wildcards', async () => {
                const { data } = await runQuery(BASIC_QUERY, { filter: { insights_id: { eq: 'a3c7fae507' }}});
                data.hosts.data.should.have.length(0);
            });

            test('substring', async () => {
                const { data } = await runQuery(BASIC_QUERY, { filter: { insights_id: { matches: '*a3c7fae507*' }}});
                data.hosts.data.should.have.length(1);
                data.hosts.data[0].id.should.equal('22cd8e39-13bb-4d02-8316-84b850dc5136');
            });
        });

        test('compound', async () => {
            const { data } = await runQuery(BASIC_QUERY, {
                filter: {
                    OR: [{
                        fqdn: { matches: '*dn.test02.rhel7.jharting.local'},
                        display_name: { matches: '*est02*'}
                    }, {
                        id: { eq: 'f5ac67e1-ad65-4b62-bc27-845cc6d4bcee' },
                        insights_id: { matches: '*7d934aad983d' }
                    }]
                }
            });
            expect(data).toMatchSnapshot();
        });

        describe('system_profile', function () {
            test('arch', async () => {
                const { data } = await runQuery(BASIC_QUERY, { filter: { spf_arch: { eq: 'x86_64' }}});
                expect(data).toMatchSnapshot();
            });

            test('os_release', async () => {
                const { data } = await runQuery(BASIC_QUERY, {
                    filter: {
                        spf_os_release: { matches: '7.*'},
                        NOT: {
                            spf_os_release: { eq: '7.4'}
                        }
                    }
                });
                expect(data).toMatchSnapshot();
            });

            test('os_kernel_release', async () => {
                const { data } = await runQuery(BASIC_QUERY, { filter: { spf_os_kernel_version: { matches: '4.18.*' }}});
                data.hosts.data.should.have.length(1);
                data.hosts.data[0].id.should.equal('22cd8e39-13bb-4d02-8316-84b850dc5136');
            });

            test('os_infrastructure_type', async () => {
                const { data } = await runQuery(BASIC_QUERY, { filter: { spf_infrastructure_type: { eq: 'virtual' }}});
                expect(data).toMatchSnapshot();
            });

            test('os_infrastructure_vendor', async () => {
                const { data } = await runQuery(BASIC_QUERY, { filter: { spf_infrastructure_vendor: { eq: 'baremetal' }}});
                data.hosts.data.should.have.length(1);
                data.hosts.data[0].id.should.equal('f5ac67e1-ad65-4b62-bc27-845cc6d4bcee');
            });

            test('spf_owner_id', async () => {
                const { data } = await runQuery(BASIC_QUERY,
                    { filter: { spf_owner_id: { eq: 'it8i99u1-48ut-1rdf-bc10-84opf904lbop' }}});
                data.hosts.data.should.have.length(1);
                data.hosts.data[0].id.should.equal('f5ac67e1-ad65-4b62-bc27-845cc6d4bcee');
            });

            describe('sap_system', function () {
                const hosts = [
                    {system_profile_facts: {sap_system: true}},
                    {system_profile_facts: {sap_system: false}},
                    {system_profile_facts: {}}
                ];

                [true, false].forEach(expected =>
                    test(`${expected}`, async () => {
                        await createHosts(...hosts);

                        const { data } = await runQuery(
                            SP_QUERY,
                            { filter: { spf_sap_system: { is: expected }}},
                            getContext().headers
                        );
                        data.hosts.data.should.have.length(1);
                        data.hosts.data[0].system_profile_facts.should.have.property('sap_system', expected);
                    })
                );

                test('null', async () => {
                    await createHosts(...hosts);

                    const { data } = await runQuery(SP_QUERY, { filter: { spf_sap_system: { is: null }}}, getContext().headers);
                    data.hosts.data.should.have.length(1);
                    data.hosts.data[0].system_profile_facts.should.be.empty();
                });

                test('not null', async () => {
                    await createHosts(...hosts);

                    const { data } = await runQuery(
                        SP_QUERY,
                        { filter: { NOT: { spf_sap_system: { is: null }}}},
                        getContext().headers
                    );
                    data.hosts.data.should.have.length(2);
                    data.hosts.data.forEach((host: any) => host.system_profile_facts.should.have.property('sap_system'));
                });
            });

            describe('sap_sids', function () {
                const hosts = [
                    {system_profile_facts: {sap_sids: ['H20', 'ABC']}},
                    {system_profile_facts: {sap_sids: []}},
                    {system_profile_facts: {sap_sids: ['ABC']}},
                    {system_profile_facts: {sap_sids: ['BCD']}}
                ];

                test('simple', async () => {
                    await createHosts(...hosts);

                    const { data } = await runQuery(
                        SP_QUERY,
                        { filter: { spf_sap_sids: { eq: 'H20' }}},
                        getContext().headers
                    );
                    data.hosts.data.should.have.length(1);
                    data.hosts.data[0].system_profile_facts.sap_sids.includes('H20');
                });

                test('multiple', async () => {
                    await createHosts(...hosts);

                    const { data } = await runQuery(
                        SP_QUERY,
                        { filter: { spf_sap_sids: { eq: 'ABC' }}},
                        getContext().headers
                    );
                    data.hosts.data.should.have.length(2);
                    data.hosts.data.forEach((host: any) => host.system_profile_facts.sap_sids.includes('ABC'));
                });

                test('AND', async () => {
                    await createHosts(...hosts);

                    const { data } = await runQuery(
                        SP_QUERY,
                        { filter: { AND: [{spf_sap_sids: { eq: 'ABC' }}, {spf_sap_sids: { eq: 'H20' }}]}},
                        getContext().headers
                    );
                    data.hosts.data.should.have.length(1);
                    data.hosts.data[0].system_profile_facts.sap_sids.should.eql(['H20', 'ABC']);
                });

                test('OR', async () => {
                    await createHosts(...hosts);

                    const { data } = await runQuery(
                        SP_QUERY,
                        { filter: { OR: [{spf_sap_sids: { eq: 'BCD' }}, {spf_sap_sids: { eq: 'H20' }}]}},
                        getContext().headers
                    );
                    data.hosts.data.should.have.length(2);
                });

                test('NOT', async () => {
                    await createHosts(...hosts);

                    const { data } = await runQuery(
                        SP_QUERY,
                        { filter: { NOT: {spf_sap_sids: { eq: 'ABC' }}}},
                        getContext().headers
                    );
                    data.hosts.data.should.have.length(2);
                });
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
                const headers = createHeaders('customer', '12345', false);
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
                            namespace: {eq: 'aws'},
                            key: {eq: 'region'},
                            value: {eq: 'us-east-1'}
                        }
                    }
                });
                expect(data).toMatchSnapshot();
            });

            test('simple tag filter with no value', async () => {
                const { data } = await runQuery(TAG_QUERY, {
                    filter: {
                        tag: {
                            namespace: {eq: 'insights-client'},
                            key: {eq: 'web'}
                        }
                    }
                });
                expect(data).toMatchSnapshot();
            });

            test('simple tag filter with explicit null value', async () => {
                const { data } = await runQuery(TAG_QUERY, {
                    filter: {
                        tag: {
                            namespace: {eq: 'insights-client'},
                            key: {eq: 'web'},
                            value: {eq: null}
                        }
                    }
                });
                expect(data).toMatchSnapshot();
            });

            test('simple tag filter with explicit null namespace', async () => {
                const headers = createHeaders('noNamespace', 'noNamespace');
                const { data } = await runQuery(TAG_QUERY, {
                    filter: {
                        tag: {
                            namespace: {eq: null},
                            key: {eq: 'foo'},
                            value: {eq: null}
                        }
                    }
                }, headers);

                data.hosts.data.should.have.length(1);
                data.hosts.data[0].tags.data.should.have.length(1);
                data.hosts.data[0].tags.data[0].should.eql({
                    namespace: null,
                    key: 'foo',
                    value: null
                });
            });

            test('tag filter union', async () => {
                const { data } = await runQuery(TAG_QUERY, {
                    filter: {
                        OR: [{
                            tag: {
                                namespace: {eq: 'insights-client'},
                                key: {eq: 'web'}
                            }
                        }, {
                            tag: {
                                namespace: {eq: 'aws'},
                                key: {eq: 'region'},
                                value: {eq: 'us-east-1'}
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
                    id: { eq: '22cd8e39-13bb-4d02-8316-84b850dc5136' }
                }});

                expect(data).toMatchSnapshot();
            });

            test('specific fact key', async () => {
                const { data } = await runQuery(QUERY, {
                    filter: { id: { eq: '22cd8e39-13bb-4d02-8316-84b850dc5136' }},
                    fact_filter: ['bios']
                });

                expect(data).toMatchSnapshot();
            });

            test('facts not available', async () => {
                const { data } = await runQuery(QUERY, { filter: {
                    id: { eq: '6e7b6317-0a2d-4552-a2f2-b7da0aece49d' }
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
                filter: { id: { eq: 'f5ac67e1-ad65-4b62-bc27-845cc6d4bcee' }},
                system_profile_filter: ['arch', 'os_release']
            });

            expect(data).toMatchSnapshot();
        });

        test('simple canonical fact query', async () => {
            const { data } = await runQuery(QUERY, {
                filter: { id: { eq: 'f5ac67e1-ad65-4b62-bc27-845cc6d4bcee' }},
                canonical_fact_filter: ['insights_id', 'satellite_id']
            });

            expect(data).toMatchSnapshot();
        });

        test('empty', async () => {
            const { data } = await runQuery(QUERY, {
                filter: { id: { eq: 'f5ac67e1-ad65-4b62-bc27-845cc6d4bcee' }},
                system_profile_filter: []
            });

            expect(data).toMatchSnapshot();
        });
    });

    describe('string filters', function () {
        const QUERY = `
            query hosts (
                $filter: HostFilter
            ) {
                hosts (
                    filter: $filter,
                )
                {
                    data {
                        id
                    }
                }
            }
        `;

        const headers = createHeaders('user', 'filter_test');

        function expectId (data: any, id: string) {
            data.hosts.data.should.eql([{id}]);
        }

        test('eq with value', async () => {
            const { data } = await runQuery(QUERY, {
                filter: { id: { eq: 'd1119a66-ffb7-4529-a8ca-15439aed29ad' }}
            }, headers);

            expectId(data, 'd1119a66-ffb7-4529-a8ca-15439aed29ad');
        });

        test('eq with null', async () => {
            const { data } = await runQuery(QUERY, {
                filter: { spf_arch: { eq: null }}
            }, headers);

            expectId(data, '5212d66b-62bf-49ee-8f96-dbb5d866fa2a');
        });

        test('eq with not null', async () => {
            const { data } = await runQuery(QUERY, {
                filter: { NOT: {spf_arch: { eq: null }}}
            }, headers);

            expectId(data, 'd1119a66-ffb7-4529-a8ca-15439aed29ad');
        });

        test('matches possitive', async () => {
            const { data } = await runQuery(QUERY, {
                filter: {display_name: { matches: '*DD02' }}
            }, headers);

            expectId(data, '5212d66b-62bf-49ee-8f96-dbb5d866fa2a');
        });

        test('matches negative', async () => {
            const { data } = await runQuery(QUERY, {
                filter: {display_name: { matches: '*dd02' }}
            }, headers);

            data.hosts.data.should.be.empty();
        });

        test('matches null', async () => {
            const error = await runQueryCatchError(headers, QUERY, {
                filter: {display_name: { matches: null }}
            });

            expect(error.response.errors[0].extensions.code).toEqual('BAD_USER_INPUT');
        });

        describe('lowercase', function () {
            test('eq lowercase input', async () => {
                const { data } = await runQuery(QUERY, {
                    filter: {display_name: { eq_lc: 'aabbccdd01' }}
                }, headers);

                expectId(data, 'd1119a66-ffb7-4529-a8ca-15439aed29ad');
            });

            test('eq uppercase input', async () => {
                const { data } = await runQuery(QUERY, {
                    filter: {display_name: { eq_lc: 'AABBCCDD01' }}
                }, headers);

                expectId(data, 'd1119a66-ffb7-4529-a8ca-15439aed29ad');
            });

            test('eq null', async () => {
                const error = await runQueryCatchError(headers, QUERY, {
                    filter: {display_name: { eq_lc: null }}
                });

                expect(error.response.errors[0].extensions.code).toEqual('BAD_USER_INPUT');
            });

            test('eq negative', async () => {
                const { data } = await runQuery(QUERY, {
                    filter: {display_name: { eq_lc: 'aabbccdd*' }}
                }, headers);

                data.hosts.data.should.be.empty();
            });

            test('matches lowercase input', async () => {
                const { data } = await runQuery(QUERY, {
                    filter: {display_name: { matches_lc: '*cdd01' }}
                }, headers);

                expectId(data, 'd1119a66-ffb7-4529-a8ca-15439aed29ad');
            });

            test('matches uppercase input', async () => {
                const { data } = await runQuery(QUERY, {
                    filter: {display_name: { matches_lc: '*D01' }}
                }, headers);

                expectId(data, 'd1119a66-ffb7-4529-a8ca-15439aed29ad');
            });

            test('matches negative', async () => {
                const { data } = await runQuery(QUERY, {
                    filter: {display_name: { matches_lc: '*03' }}
                }, headers);

                data.hosts.data.should.be.empty();
            });

            test('matches null', async () => {
                const error = await runQueryCatchError(headers, QUERY, {
                    filter: {display_name: { matches_lc: null }}
                });

                expect(error.response.errors[0].extensions.code).toEqual('BAD_USER_INPUT');
            });
        });
    });

    describe('errors tests', function () {
        const error = (
            {
                meta: {
                    body: {
                        error: {
                            root_cause: [
                                {
                                    type: 'illegal_argument_exception',
                                    reason: 'Result window is too large'
                                }
                            ]
                        }
                    }
                }
            }
        );

        afterEach(() => {
            return sinon.restore();
        });

        function createClientSearchStub(error: any, return_object: any) {
            const clientSearchStub = sinon.stub(client, 'search');
            clientSearchStub.onCall(0).throws(error);
            clientSearchStub.onCall(1).returns(return_object);
        }

        test('Result window error', async () => {
            createClientSearchStub(error, (
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

            expect(err.message.startsWith('Request could not be completed because the page is too deep')).toBeTruthy();
        });

        test('Result window exceeded no error', async () => {
            createClientSearchStub(error, (
                {
                    body: {
                        hits: {
                            total: {
                                value: 100
                            },
                            hits: []
                        }
                    }
                }
            ));

            const { data } = await runQuery(BASIC_QUERY, {
                offset: 50001
            });

            expect(data.hosts.data).toEqual([]);
        });

        test('Generic elastic search error', async () => {
            createClientSearchStub(({}), ({}));

            const err = await runQueryCatchError(undefined, BASIC_QUERY);

            expect(err.message.startsWith('Elastic search error')).toBeTruthy();
        });

        test('log validation error', async () => {
            jest.spyOn(probes, 'validationError');
            await runQueryCatchError(undefined, BASIC_QUERY, {
                offset: -1
            });

            expect(probes.validationError).toHaveBeenCalled();
        });

        test('log system error', async () => {
            jest.spyOn(probes, 'systemError');

            createClientSearchStub(error, (
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

            await runQueryCatchError(undefined, BASIC_QUERY, {
                offset: 100000
            });

            expect(probes.systemError).toHaveBeenCalled();
        });
    });
});
