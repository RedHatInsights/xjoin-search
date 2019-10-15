import express from 'express';
import createIdentityHeader from './utils';
import * as constants from '../../constants';

export default function identityFallback(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.header(constants.IDENTITY_HEADER) === undefined) {
        req.headers[constants.IDENTITY_HEADER] = createIdentityHeader(); // eslint-disable-line security/detect-object-injection
    }

    next();
}
