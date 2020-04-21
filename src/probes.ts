import * as client from 'prom-client';
import config from './config';
import log from './util/log';
import { GraphQLError } from 'graphql';
import { ElasticSearchError, ResultWindowError } from './errors';

const errors = new client.Counter({
    name: `${config.metrics.prefix}errors_total`,
    help: 'Total number of errors this instance encountered',
    labelNames: ['type', 'subtype']
});

['validation', 'system'].forEach(value => errors.labels(value).inc(0));

export function validationError (error: GraphQLError, subtypeLabel: string) {
    errors.labels('validation', subtypeLabel).inc();
    log.warn({error}, 'validation error');
}

export function systemError (error: GraphQLError, subtypeLabel: string) {
    errors.labels('system', subtypeLabel).inc();
    log.error({error}, 'system error');
}