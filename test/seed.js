const client = require('../src/es').default;
const data = require('./hosts.json');
const P = require('bluebird');

async function run () {
    const index = 'test.hosts.v1';

    try {
        await client.indices.delete({ index });
    } catch (ignored) { } // eslint-disable-line no-empty

    await client.indices.create({ index });

    await client.indices.putMapping({
        index,
        body: {
            dynamic: false,
            properties: {
                id: { type: 'keyword' },
                account: { type: 'keyword' },
                display_name: { type: 'keyword' },
                created_on: { type: 'date' },
                modified_on: { type: 'date' },
                stale_timestamp: { type: 'date' },
                ansible_host: { type: 'keyword' },
                canonical_facts: {
                    type: 'object',
                    properties: {
                        fqdn: { type: 'keyword'},
                        insights_id: { type: 'keyword'},
                        satellite_id: { type: 'keyword'}
                    }
                },
                system_profile_facts: {
                    properties: {
                        arch: { type: 'keyword' },
                        os_release: { type: 'keyword' },
                        os_kernel_version: { type: 'keyword'},
                        infrastructure_type: { type: 'keyword' },
                        infrastructure_vendor: { type: 'keyword' }
                    }
                }
            }
        }
    });

    await client.indices.putAlias({
        index: 'test.hosts.v1',
        name: 'test.hosts',
        body: {
            is_write_index: false
        }
    });

    await P.map(data, item => client.index({
        index,
        type: '_doc',
        id: item.id,
        body: item
    }));

    console.log(`indexed ${data.length} records in ${index}`);
}

run();
