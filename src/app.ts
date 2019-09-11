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
import client from './es';
import playground from './playground';
import metrics from './metrics';

process.on('unhandledRejection', (reason: any) => {
    log.fatal(reason);
    throw reason;
});

async function run () {
    log.info({env: config.env}, `${version.full} starting`);
    log.debug(sanitized, 'configuration');

    await client.ping();
    log.debug('connected to Elasticsearch');

    const app = express();
    const apollo = new ApolloServer({
        typeDefs: schema,
        resolvers,
        playground
    });

    metrics(app);
    apollo.applyMiddleware({ app });
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
}

run();
