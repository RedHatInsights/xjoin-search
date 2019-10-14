import express from 'express';
import log from '../../util/log';

const IDENTITY_HEADER = 'x-rh-identity';

export default function identity(req: express.Request, res: express.Response, next: express.NextFunction) {
    const raw = req.header(IDENTITY_HEADER);

    if (raw === undefined) {
        log.info('rejecting request due to missing identity header');
        return next(new Error('Unauthorized'));
    }

    try {
        const value = Buffer.from(raw, 'base64').toString('utf8');
        const identity = JSON.parse(value).identity;
        if (!identity.account_number) {
            return next(new Error('Unauthorized')); // TODO
        }

        if (identity.type !== 'User') {
            return next(new Error('Unauthorized')); // TODO
        }

        req.account_number = identity.account_number;
        req.username = identity.user.username;
        req.is_internal = identity.user.is_internal;

        next();
    } catch (e) {
        log.error(e);
        next(new Error('IDENTITY_HEADER - Invalid identity header'));
    }
}
