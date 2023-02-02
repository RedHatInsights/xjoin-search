import { runQuery, createHosts } from '../../../test/helpers';
import { getContext } from '../../../test';

const QUERY = `
    query hostStats (
        $hostFilter: HostFilter,
    ) {
        hostStats (
            hostFilter: $hostFilter
        )
        {
            total_hosts, fresh_hosts, warn_hosts, stale_hosts
        }
    }
`;
const hosts = [
    {display_name: 'foo01', system_profile_facts: {sap_system: true}},
    {display_name: 'foo02', system_profile_facts: {sap_system: true}},
    {display_name: 'foo03', system_profile_facts: {sap_system: true}},
    {display_name: 'foo04', system_profile_facts: {sap_system: true}},
    {display_name: 'bar01', system_profile_facts: {sap_system: false}},
    {display_name: 'bar02', system_profile_facts: {sap_system: false}},
    {display_name: 'bar03', system_profile_facts: {}}
];

describe('host stats', function () {
    test('basic query', async () => {
        await createHosts(...hosts);

        const { data, status } = await runQuery(QUERY, {}, getContext().headers);
        expect(status).toEqual(200);
        data.hostStats.should.eql({
            total_hosts: 7,
            fresh_hosts: 7,
            warn_hosts: 0,
            stale_hosts: 0
        });
    });

    test('Basic filtering', async () => {
        await createHosts(...hosts);

        const { data, status } = await runQuery(QUERY, {
            hostFilter: {display_name: {matches: 'bar01'}}
        }, getContext().headers);
        expect(status).toEqual(200);
        data.hostStats.should.eql({
            total_hosts: 1,
            fresh_hosts: 1,
            warn_hosts: 0,
            stale_hosts: 0
        });
    });
});
