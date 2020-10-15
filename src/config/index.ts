import convict from 'convict';

const config = convict({
    env: {
        format: ['production', 'development', 'test'],
        default: 'development',
        env: 'NODE_ENV'
    },
    commit: {
        format: String,
        default: undefined,
        env: 'OPENSHIFT_BUILD_COMMIT'
    },
    port: {
        format: 'nat',
        default: 4000,
        env: 'HTTP_PORT'
    },
    logging: {
        level: {
            format: String,
            default: 'trace',
            env: 'LOG_LEVEL'
        },
        pretty: {
            format: Boolean,
            default: false,
            env: 'LOG_PRETTY'
        },
        cloudwatch: {
            enabled: {
                format: Boolean,
                default: false,
                env: 'LOG_CW_ENABLED'
            },
            group: {
                format: String,
                default: 'xjoin-ci',
                env: 'LOG_CW_GROUP'
            },
            stream: {
                format: String,
                default: 'xjoin-ci',
                env: 'LOG_CW_STREAM'
            },
            intervalMs: {
                format: Number,
                default: 1000,
                env: 'LOG_CW_INTERVAL_MS'
            },
            key: {
                format: String,
                default: undefined,
                env: 'LOG_CW_KEY'
            },
            secret: {
                format: String,
                default: undefined,
                env: 'LOG_CW_SECRET',
                sensitive: true
            },
            region: {
                format: String,
                default: 'us-east-1',
                env: 'LOG_CW_REGION'
            }
        }
    },
    es: {
        nodes: {
            format: String,
            default: 'http://localhost:9200',
            env: 'ES_NODES'
        },
        username: {
            format: String,
            default: '',
            env: 'ES_USERNAME'
        },
        password: {
            format: String,
            default: '',
            env: 'ES_PASSWORD',
            sensitive: true
        }
    },
    metrics: {
        prefix: {
            format: String,
            default: 'xjoin_search_',
            env: 'METRICS_PREFIX'
        }
    },
    queries: {
        hosts: {
            index: {
                format: String,
                default: 'test.hosts',
                env: 'HOSTS_INDEX'
            }
        },
        tags: {
            aggregations: {
                size: {
                    format: Number,
                    default: 10000,
                    env: 'MAX_TAGS_RETURNED'
                }
            }
        }
    }
});

config.validate({ strict: true });

export default config.get();
export const sanitized = config.toString();
