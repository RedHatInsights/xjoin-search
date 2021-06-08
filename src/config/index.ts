import convict from 'convict';
import * as os from 'os';
import * as _ from 'lodash';

const config = convict({
    env: {
        format: ['production', 'development', 'test'],
        default: 'development',
        env: 'NODE_ENV'
    },
    commit: {
        format: String,
        default: undefined,
        env: 'BUILD_COMMIT'
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
        },
        port: {
            format: 'nat',
            default: 4000,
            env: 'METRICS_PORT'
        },
        path: {
            format: String,
            default: '/metrics',
            env: 'METRICS_PATH'
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
        maxBuckets: {
            format: Number,
            default: 10000,
            env: 'MAX_BUCKETS'
        }
    }
});

// load Clowder config
const acgConfig = process.env.ACG_CONFIG; // eslint-disable-line no-process-env
if (acgConfig) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const clowdAppConfig = require(acgConfig); // eslint-disable-line security/detect-non-literal-require

    const data: any = {
        port: clowdAppConfig.webPort,
        metrics: {
            port: clowdAppConfig.metricsPort,
            path: clowdAppConfig.metricsPath
        }
    };

    if (_.get(clowdAppConfig, 'logging.cloudwatch.accessKeyId') !== undefined) {
        data.logging = {
            cloudwatch: {
                enabled: true,
                group: clowdAppConfig.logging.cloudwatch.logGroup,
                stream: os.hostname(),
                key: clowdAppConfig.logging.cloudwatch.accessKeyId,
                secret: clowdAppConfig.logging.cloudwatch.secretAccessKey,
                region: clowdAppConfig.logging.cloudwatch.region
            }
        };
    }

    config.load(data);
}

config.validate({ strict: true });

export default config.get();
export const sanitized = config.toString();
