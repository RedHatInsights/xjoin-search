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

function runBasicQuery (variables: Record<string, any>) {
    return getQuery()({ query: BASIC_QUERY, variables });
}

describe('hosts query', function () {
    test('fetch hosts', async () => {
        const data = await runBasicQuery({
            filter: {
                system_profile_fact: {
                    key: 'os_release',
                    value: '7.4'
                }
            }
        });

        expect(data).toMatchSnapshot();
    });

    describe ('ordering', function () {

        test('display_name ASC', async () => {
            const result = await runBasicQuery({
                order_by: 'display_name',
                order_how: 'ASC'
            });

            expect(result).toMatchSnapshot();
        });

        test('display_name DESC', async () => {
            const result = await runBasicQuery({
                order_by: 'display_name',
                order_how: 'DESC'
            });

            expect(result).toMatchSnapshot();
        });

        test('modified_on DESC', async () => {
            const result = await runBasicQuery({
                order_by: 'modified_on',
                order_how: 'DESC'
            });

            expect(result).toMatchSnapshot();
        });
    });

    describe('queries', function () {
        describe('display_name', function () {
            test('substring', async () => {
                const result = await runBasicQuery({ filter: { display_name: '*est03.*' }});
                result.data.hosts.data.should.have.length(1);
                result.data.hosts.data[0].id.should.equal('f5ac67e1-ad65-4b62-bc27-845cc6d4bcee');
            });
        });

        describe('fqdn', function () {
            test('substring', async () => {
                const result = await runBasicQuery({ filter: { fqdn: '*dn.test02.*' }});
                result.data.hosts.data.should.have.length(1);
                result.data.hosts.data[0].id.should.equal('22cd8e39-13bb-4d02-8316-84b850dc5136');
            });
        });

        describe('insights_id', function () {
            test('exact match', async () => {
                const result = await runBasicQuery({ filter: { insights_id: '17c52679-f0b9-4e9b-9bac-a3c7fae5070c' }});
                result.data.hosts.data.should.have.length(1);
                result.data.hosts.data[0].id.should.equal('22cd8e39-13bb-4d02-8316-84b850dc5136');
            });

            test('substring no wildcards', async () => {
                const result = await runBasicQuery({ filter: { insights_id: 'a3c7fae507' }});
                result.data.hosts.data.should.have.length(0);
            });

            test('substring', async () => {
                const result = await runBasicQuery({ filter: { insights_id: '*a3c7fae507*' }});
                result.data.hosts.data.should.have.length(1);
                result.data.hosts.data[0].id.should.equal('22cd8e39-13bb-4d02-8316-84b850dc5136');
            });
        });

        test('compound', async () => {
            const result = await runBasicQuery({
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
            expect(result).toMatchSnapshot();
        });
    });
});
