import pino from 'pino';
import config from '../config';
import {buildMultistream} from './msbuilder';

function buildDestination () {
    if (!config.logging.cloudwatch.enabled) {
        return pino.destination(1); // stdout
    }

    const cwOptions = {
        group: 'xjoin-search',
        prefix: config.logging.cloudwatch.prefix,
        interval: config.logging.cloudwatch.intervalMs,
        aws_access_key_id: config.logging.cloudwatch.key,
        aws_secret_access_key: config.logging.cloudwatch.secret,
        aws_region: config.logging.cloudwatch.region
    };

    const ms = buildMultistream(config.logging.level, cwOptions);
    return ms;
}

const logger: pino.Logger = pino({
    name: 'xjoin-search',
    level: config.logging.level,
    prettyPrint: config.logging.pretty ? {
        errorProps: '*'
    } : false
}, buildDestination());

export const serializers = {
    req: (value: any) => {
        // the default serializer does not print the identity values attached by identity mw
        // therefore we copy account_number and username so that they are logged
        const result: any = pino.stdSerializers.req(value);
        result.account_number = value.raw.account_number;
        result.username = value.raw.username;

        return result;
    }
};

export default logger.child({ type: 'application' });

