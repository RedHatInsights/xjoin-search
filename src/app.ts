import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createServer } from 'http';
import { createTerminus } from '@godaddy/terminus';
import { promisifyAll } from 'bluebird';

import config, { sanitized } from './config';
import version from './util/version';
import schema from './schema';
import resolvers from './resolvers';
import log from './util/log';
import logMiddleware from './middleware/log';
import client from './es';
import playground from './playground';
import metrics from './metrics';
import identity from './middleware/identity/impl';
import identityFallback from './middleware/identity/fallback';
import {observabilityPlugin} from './plugins';

process.on('unhandledRejection', (reason: any) => {
    log.fatal(reason);
    throw reason;
});

export default async function start (): Promise<Record<string, unknown>> {
    log.info({env: config.env}, `${version.full} starting`);
    log.debug(sanitized, 'configuration');

    await client.ping();
    log.debug('connected to Elasticsearch');

    const app = express();
    const metricsApp = config.metrics.port === config.port ? app : express();

    await metrics(app, metricsApp, config.metrics.path);

    if (config.env === 'development') {
        app.use(identityFallback);
        log.warn('Identity fallback enabled, unsafe for production!');
    }

    app.use(identity);
    app.use(logMiddleware);

    const apollo = new ApolloServer({
        typeDefs: schema,
        resolvers,
        context: ({ req }) => ({ account_number: req.account_number, org_id: req.org_id }),
        introspection: true,
        plugins: [
            observabilityPlugin,
            ApolloServerPluginLandingPageGraphQLPlayground(playground)
        ]
    });

    await apollo.start();
    apollo.applyMiddleware({ app });

    metricsApp.get('/version', (req: express.Request, res: express.Response) =>
        res.json({ version: version.version, commit: version.short }).end());

    const metricsServer: any = promisifyAll(createServer(metricsApp));
    const server: any = config.metrics.port === config.port ? null : promisifyAll(createServer(app));

    createTerminus(metricsServer, {
        signals: ['SIGINT', 'SIGTERM'],
        healthChecks: {
            '/health': async () => {
                await client.ping();
            }
        },

        async onSignal () {
            log.info('shutting down');
            await client.close();
        },

        async onShutdown () {
            log.info(`${version.full} shutdown complete`);
        },

        logger: (msg, error) => log.error(error, msg)
    });

    await metricsServer.listenAsync(config.metrics.port);

    if (server !== null) {
        const server: any = promisifyAll(createServer(app));
        await server.listenAsync(config.port);
    }

    log.info({ url: `http://localhost:${config.port}${apollo.graphqlPath}` }, 'accepting connections');

    return {
        apollo,
        async stop () {
            try {
                if (server !== null) {
                    await server.closeAsync();
                }

                await metricsServer.closeAsync();
            } finally {
                await client.close();
            }
        }
    };
}

if (require.main === module) {
    start();
}
