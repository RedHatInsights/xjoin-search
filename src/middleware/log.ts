import pinoLogger from 'express-pino-logger';
import log, { serializers } from '../util/log';

const pinoMiddleware = pinoLogger({
    logger: log,
    serializers
});

export default pinoMiddleware;
