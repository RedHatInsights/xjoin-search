import pino, { Level } from 'pino';
import config from '../config';
import pinoms from 'pino-multi-stream';
import pinoCW from 'pino-cloudwatch';

function buildDestination () {
    if (!config.logging.cloudwatch.enabled) {
        return pino.destination(1); // stdout
    }

    const cwOptions = {
        group: config.logging.cloudwatch.group,
        stream: config.logging.cloudwatch.stream,
        interval: config.logging.cloudwatch.intervalMs,
        aws_access_key_id: config.logging.cloudwatch.key,
        aws_secret_access_key: config.logging.cloudwatch.secret,
        aws_region: config.logging.cloudwatch.region
    };

    return pinoms.multistream([{
        stream: pino.destination(1),
        level: config.logging.level as Level
    }, {
        stream: pinoCW(cwOptions, (e: any) => {
            // eslint-disable-next-line
            console.log("Unable to connect to cloudwatch");
            // eslint-disable-next-line
            console.log(e);
        }),
        level: config.logging.level as Level
    }]);
}

const logger: pino.Logger = pino({
    name: 'xjoin-search',
    level: config.logging.level,
    prettyPrint: config.logging.pretty && !config.logging.cloudwatch.enabled ? {
        errorProps: '*'
    } : false
}, buildDestination());

export const serializers = {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    req: (value: any): void => {
        // the default serializer does not print the identity values attached by identity mw
        // therefore we copy org_id and username so that they are logged
        const result: any = pino.stdSerializers.req(value);
        result.org_id = value.raw.org_id;
        result.username = value.raw.username;

        return result;
    }
};

export default logger.child({ type: 'application' });

