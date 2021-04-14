const client = require('../src/es').default;
const data = require('./hosts.json');
const P = require('bluebird');

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
                    field: "ingest_timestamp",
                    value: "{{_ingest.timestamp}}"
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

    await client.indices.putMapping({
        index,
        body: {
            dynamic: false,
            properties: {
                ingest_timestamp: {type: 'date'},
                id: { type: 'keyword' },
                account: { type: 'keyword' },
                display_name: {
                    type: 'keyword',
                    fields: {
                        lowercase: {
                            type: 'keyword',
                            normalizer: 'case_insensitive'
                        }
                    }
                },
                created_on: { type: 'date_nanos' },
                modified_on: { type: 'date_nanos' },
                stale_timestamp: { type: 'date_nanos' },
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
                        infrastructure_vendor: { type: 'keyword' },
                        sap_system: { type: 'boolean' },
                        sap_sids: { type: 'keyword' },
                        owner_id: { type: 'keyword'},
                        insights_client_version: { type: 'keyword' },
                        rhc_client_id: { type: 'keyword' },
                        is_marketplace: { type: 'boolean' },
                        operating_system: {
                            type: 'object',
                            properties: {
                                major: {type: 'byte'},
                                minor: {type: 'byte'},
                                name: {type: 'keyword'}
                            }
                        }
                    }
                },
                tags_structured: {
                    type: 'nested',
                    properties: {
                        namespace: {
                            type: 'keyword',
                            null_value: '$$_XJOIN_SEARCH_NULL_VALUE'
                        },
                        key: { type: 'keyword' },
                        value: {
                            type: 'keyword',
                            null_value: '$$_XJOIN_SEARCH_NULL_VALUE'
                        }
                    }
                },
                tags_string: {
                    type: 'keyword'
                },
                tags_search: {
                    type: 'keyword'
                }
            }
        }
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
