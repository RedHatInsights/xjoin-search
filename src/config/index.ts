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
        }
    },
    es: {
        nodes: {
            format: String,
            default: 'http://localhost:9200',
            env: 'ES_NODES'
        }
    }
});

config.validate({ strict: true });

export default config.get();
export const sanitized = config.toString();
