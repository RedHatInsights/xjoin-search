import express from 'express';
import createIdentityHeader from './utils';

const IDENTITY_HEADER = 'x-rh-identity';

export default function identityFallback(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.header(IDENTITY_HEADER) === undefined) {
        req.headers[IDENTITY_HEADER] = createIdentityHeader(); // eslint-disable-line security/detect-object-injection
    }

    next();
}
