import { runQuery } from '../../../test';

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
        const { data, status } = await runQuery(BASIC_QUERY, {});
        expect(status).toEqual(200);
        expect(data).toMatchSnapshot();
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
    });
});
