import express from 'express';
import log from '../../util/log';
import * as constants from '../../constants';
import {HttpErrorBadRequest, HttpErrorForbidden, HttpErrorUnauthorized} from '../../errors';

export default function identity(req: express.Request, res: express.Response, next: express.NextFunction): void {
    const raw = req.header(constants.IDENTITY_HEADER);

    if (raw === undefined) {
        log.info('rejecting request due to missing identity header');
        return next(new HttpErrorUnauthorized());
    }

    try {
        const value = Buffer.from(raw, 'base64').toString('utf8');
        const identity = JSON.parse(value).identity;

        req.org_id = identity.org_id;
        if (req.org_id === undefined || req.org_id === null) {
            log.info('rejecting request for undefined "org_id"');
            return next(new HttpErrorBadRequest());
        }

        if (identity.type !== 'User' && identity.type !== 'System') {
            log.info('rejecting request for identity.type: ' + identity.type);
            return next(new HttpErrorForbidden());
        }

        if (identity.type === 'User') {
            req.username = identity.user?.username;
            req.is_internal = identity.user?.is_internal;
        }

        next();
    } catch (e: any) {
        log.error(e);
        return next(new HttpErrorBadRequest());
    }
}
