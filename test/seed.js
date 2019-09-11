const client = require('../src/es').default;
const data = require('./hosts.json');
const P = require('bluebird');

async function run () {
    const index = 'test.hosts';

    await P.map(data, item => client.index({
        index,
        type: '_doc',
        id: item.id,
        body: item
    }));

    console.log(`indexed ${data.length} records in ${index}`);
}

run();
