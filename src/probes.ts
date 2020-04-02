import * as client from 'prom-client';
import config from './config';
import log from './util/log';
import { GraphQLError } from 'graphql';

const errors = new client.Counter({
    name: `${config.metrics.prefix}errors_total`,
    help: 'Total number of errors this instance encountered',
    labelNames: ['type']
});

['validation', 'system'].forEach(value => errors.labels(value).inc(0));

export function validationError (error: GraphQLError) {
    errors.labels('validation').inc();
    log.warn({error}, 'validation error');
}

export function systemError (error: GraphQLError) {
    errors.labels('system').inc();
    log.error({error}, 'system error');
}
