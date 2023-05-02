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

function add_days_to_date(d: Date, s: number): Date {
    // Date.UTC returns millisecond representation of date
    // new Date(number) takes milliseconds date.  Time zone cannot be set?!
    return new Date(d.valueOf() + (s * 86400000));
}

function make_host(name: string, staleness: string) {
    const now = new Date();
    const soon: Date = add_days_to_date(now, 0.1);
    const tomorrow: Date = add_days_to_date(soon, 1);
    const yesterday: Date = add_days_to_date(soon, -1);
    const weeksago: Date = add_days_to_date(now, -22);
    let checkin: Date = now;
    let stale: Date = tomorrow;
    switch (staleness) {
        case 'stale': {
            checkin = yesterday;
            stale = now;
            break;
        }

        case 'warn': {
            checkin = weeksago;
            stale = weeksago;
            break;
        }

    }

    return {
        display_name: name,
        stale_timestamp: stale,
        per_reporter_staleness: {
            puptoo: {
                last_check_in: checkin,
                stale_timestamp: stale,
                check_in_succeeded: true
            },
            yupana: {
                last_check_in: checkin,
                stale_timestamp: stale,
                check_in_succeeded: true
            }
        },
        per_reporter_staleness_flat: [{
            reporter: 'puptoo',
            last_check_in: checkin,
            stale_timestamp: stale,
            check_in_succeeded: true
        }, {
            reporter: 'yupana',
            last_check_in: checkin,
            stale_timestamp: stale,
            check_in_succeeded: true
        }]
    };
}

const hosts = [
    make_host('foo01', 'fresh'),
    make_host('foo02', 'fresh'),
    make_host('foo03', 'fresh'),
    make_host('foo04', 'stale'),
    make_host('bar01', 'stale'),
    make_host('bar02', 'warn')
];

describe('host stats', function () {
    test('basic query', async () => {
        await createHosts(...hosts);

        const { data, status } = await runQuery(QUERY, {}, getContext().headers);
        expect(status).toEqual(200);
        data.hostStats.should.eql({
            total_hosts: 6,
            fresh_hosts: 3,
            stale_hosts: 2,
            warn_hosts: 1
        });
    });

    test('Basic filtering', async () => {
        await createHosts(...hosts);

        const { data, status } = await runQuery(QUERY, {
            hostFilter: {OR: [
                {display_name: {matches: 'bar01'}},
                {display_name: {matches: 'bar02'}}
            ]}
        }, getContext().headers);
        expect(status).toEqual(200);
        data.hostStats.should.eql({
            total_hosts: 2,
            fresh_hosts: 0,
            warn_hosts: 1,
            stale_hosts: 1
        });
    });
});
