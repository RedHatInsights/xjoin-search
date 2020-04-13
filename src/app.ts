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

export default async function start () {
    log.info({env: config.env}, `${version.full} starting`);
    log.debug(sanitized, 'configuration');

    await client.ping();
    log.debug('connected to Elasticsearch');

    const app = express();

    metrics(app);

    if (config.env === 'development') {
        app.use(identityFallback);
        log.warn('Identity fallback enabled, unsafe for production!');
    }

    app.use(identity);
    app.use(logMiddleware);

    const apollo = new ApolloServer({
        typeDefs: schema,
        resolvers,
        context: ({ req }) => ({ account_number: req.account_number }),
        playground,
        introspection: true,
        plugins: [
            observabilityPlugin
        ]
    });

    apollo.applyMiddleware({ app });

    app.get('/version', (req: express.Request, res: express.Response) =>
        res.json({ version: version.version, commit: version.short }).end());

    const server: any = promisifyAll(createServer(app));

    createTerminus(server, {
        signals: ['SIGINT', 'SIGTERM'],
        healthChecks: {
            '/health': () => client.ping()
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

    await server.listenAsync(config.port);
    log.info({ url: `http://localhost:${config.port}${apollo.graphqlPath}` }, 'accepting connections');

    return {
        apollo,
        async stop () {
            try {
                await server.closeAsync();
            } finally {
                await client.close();
            }
        }
    };
}

if (require.main === module) {
    start();
}
