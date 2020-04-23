import * as client from 'prom-client';
import config from './config';
import log from './util/log';
import { GraphQLError } from 'graphql';

const errors = new client.Counter({
    name: `${config.metrics.prefix}errors_total`,
    help: 'Total number of errors this instance encountered',
    labelNames: ['type', 'subtype']
});

const sublabels = ['Unknown', 'ResultWindowError', 'ElasticSearchError'];
['Validation', 'System'].forEach(typeLabel => {
    sublabels.forEach(subLabel => errors.labels(typeLabel, subLabel).inc(0));
});

function _countError (typeLabel: string, error: GraphQLError) {
    let subLabel = 'unknown';

    if (error.originalError) {
        subLabel = error.originalError.constructor.name;
    }

    errors.labels(typeLabel, subLabel).inc();
    log.warn({error}, `${typeLabel} error: ${subLabel}`);
}

export function systemError (error: GraphQLError) {
    _countError('System', error);
}

export function validationError (error: GraphQLError) {
    _countError('Validation', error);
}
