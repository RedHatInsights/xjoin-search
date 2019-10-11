const client = require('../src/es').default;
const data = require('./hosts.json');
const P = require('bluebird');

async function run () {
    const index = 'test.hosts';

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
                created_on: { type: 'keyword' },
                modified_on: { type: 'keyword' },
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
                        os_release: { type: 'keyword' },
                        arch: { type: 'keyword' },
                        infrastructure_vendor: { type: 'keyword' }
                    }
                }
            }
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
