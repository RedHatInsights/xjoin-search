import * as client from 'prom-client';
import config from './config';
import log from './util/log';
import { GraphQLError } from 'graphql';

const errors = new client.Counter({
    name: `${config.metrics.prefix}errors_total`,
    help: 'Total number of errors this instance encountered',
    labelNames: ['type', 'subtype']
});

// TODO: figure this out and remove/fix line before merge
// [('validation', 'system'].forEach(value => errors.labels(value).inc(0)); what is this line for???

function _countError (typeLabel: string, error: GraphQLError) {
    if (error.originalError) {
        errors.labels(typeLabel, error.originalError.constructor.name).inc();
    } else {
        errors.labels(typeLabel, 'unknown').inc();
    }

    log.warn({error}, `${typeLabel} error`);
}

export function systemError (error: GraphQLError) {
    _countError('system', error);
}

export function validationError (error: GraphQLError) {
    _countError('validation', error);
}
