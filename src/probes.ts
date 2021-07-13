import * as client from 'prom-client';
import config from './config';
import log from './util/log';
import { GraphQLError } from 'graphql';
import * as _ from 'lodash';

const errors = new client.Counter({
    name: `${config.metrics.prefix}errors_total`,
    help: 'Total number of errors this instance encountered',
    labelNames: ['type', 'subtype']
});

const sublabels = ['Unknown', 'ResultWindowError', 'ElasticSearchError'];
['validation', 'system'].forEach(typeLabel => {
    sublabels.forEach(subLabel => errors.labels(typeLabel, subLabel).inc(0));
});

function determineSubtype (error: GraphQLError) {
    if (error.originalError) {
        return error.originalError.constructor.name;
    }

    return _.get(error, 'constructor.name', 'unknown');
}

export function validationError (error: GraphQLError): void {
    errors.labels('validation', determineSubtype(error)).inc();
    log.warn({error}, 'validation error');
}

export function systemError (error: GraphQLError): void {
    errors.labels('system', determineSubtype(error)).inc();
    log.error({error}, 'system error');
}
