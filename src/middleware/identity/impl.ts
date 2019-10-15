import express from 'express';
import log from '../../util/log';
import {HttpErrorBadRequest, HttpErrorForbidden, HttpErrorUnauthorized} from '../../errors';

const IDENTITY_HEADER = 'x-rh-identity';

export default function identity(req: express.Request, res: express.Response, next: express.NextFunction) {
    const raw = req.header(IDENTITY_HEADER);

    if (raw === undefined) {
        log.info('rejecting request due to missing identity header');
        return next(new HttpErrorUnauthorized());
    }

    try {
        const value = Buffer.from(raw, 'base64').toString('utf8');
        const identity = JSON.parse(value).identity;

        if (identity.type !== 'User') {
            log.info('rejecting request for identity.type: ' + identity.type);
            return next(new HttpErrorForbidden());
        }

        req.account_number = identity.account_number;
        req.username = identity.user.username;
        req.is_internal = identity.user.is_internal;

        next();
    } catch (e) {
        log.error(e);
        return next(new HttpErrorBadRequest());
    }
}
