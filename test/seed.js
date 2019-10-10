const client = require('../src/es').default;
const data = require('./hosts.json');
const P = require('bluebird');

async function run () {
    const index = 'test.hosts';

    await client.indices.delete({ index });
    await client.indices.create({ index });

    await client.indices.putMapping({
        index,
        body: {
            properties: {
                id: { type: 'keyword' },
                account: { type: 'keyword' },
                display_name: { type: 'keyword' },
                created_on: { type: 'keyword' },
                modified_on: { type: 'keyword' },
                ansible_host: { type: 'keyword' }
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
