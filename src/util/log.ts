import pino from 'pino';
import config from '../config';

const logger: pino.Logger = pino({
    name: 'xjoin-search',
    level: config.logging.level,
    prettyPrint: config.logging.pretty ? {
        errorProps: '*'
    } : false
});

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

