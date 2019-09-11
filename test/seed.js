const client = require('../src/es').default;
const data = require('./hosts.json');
const P = require('bluebird');

async function run () {
    await P.map(data, item => client.index({
        index: 'test.hosts',
        type: '_doc',
        id: item.id,
        body: item
    }));

    console.log(`indexed ${data.length} items`);
}

run();
