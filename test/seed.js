const client = require('../src/es').default;
const data = require('./hosts.json');
const P = require('bluebird');
const fs = require('fs');


async function run () {
    const index = 'test.hosts.v1';

    try {
        await client.indices.delete({ index });
    } catch (ignored) { } // eslint-disable-line no-empty

    await client.indices.create({ index });

    await client.indices.close({
        index
    });

    await client.ingest.putPipeline({
        id: 'test.hosts.v1',
        body: {
            description: 'Ingest pipeline for xjoin.inventory.hosts',
            processors: [{
                set: {
                    field: 'ingest_timestamp',
                    value: '{{_ingest.timestamp}}'
                },
                script: {
                    lang: 'painless',
                    if: 'ctx.tags_structured != null',
                    // eslint-disable-next-line max-len
                    source: `ctx.tags_search = ctx.tags_structured.stream().map(t -> { StringBuilder builder = new StringBuilder(); if (t.namespace != null && t.namespace != 'null') { builder.append(t.namespace); } builder.append('/'); builder.append(t.key); builder.append('='); if (t.value != null) { builder.append(t.value); } return builder.toString() }).collect(Collectors.toList())`
                }
            }]
        }
    });

    await client.indices.putSettings({
        index,
        body: {
            index: {
                max_result_window: 50000,
                default_pipeline: 'test.hosts.v1'
            },
            analysis: {
                normalizer: {
                    case_insensitive: {
                        filter: 'lowercase'
                    }
                }
            }
        }
    });

    let mappingFileContent = fs.readFileSync("./test/mapping.json");
    let mappingBody = JSON.parse(mappingFileContent);

    await client.indices.putMapping({
        index,
        body: mappingBody
    });

    await client.indices.open({
        index
    });

    await client.indices.putAlias({
        index: 'test.hosts.v1',
        name: 'test.hosts',
        body: {
            is_write_index: false
        }
    });

    await client.indices.putAlias({
        index: 'test.hosts.v1',
        name: 'test.hosts.sink',
        body: {
            is_write_index: true
        }
    });

    await P.map(data, item => client.index({
        index: 'test.hosts.sink',
        type: '_doc',
        id: item.id,
        body: item
    }));

    console.log(`indexed ${data.length} records in ${index}`);
}

run();
