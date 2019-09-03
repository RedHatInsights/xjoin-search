import pino from 'pino';
import config from '../config';

const logger: pino.Logger = pino({
    name: 'xjoin-search',
    level: config.logging.level,
    prettyPrint: config.logging.pretty ? {
        errorProps: '*'
    } : false
});

export default logger.child({ type: 'application' });

