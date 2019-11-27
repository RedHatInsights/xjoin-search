import {HttpErrorBadRequest} from '../errors';

export function checkMin (min: number, value: number | null | undefined) {
    if (value === null || value === undefined) {
        return;
    }

    if (value < min) {
        throw new HttpErrorBadRequest(`value must be ${min} or greater (was ${value})`);
    }
}

export function checkMax (max: number, value: number | null | undefined) {
    if (value === null || value === undefined) {
        return;
    }

    if (value > max) {
        throw new HttpErrorBadRequest(`value must be ${max} or less (was ${value})`);
    }
}

export function checkLimit (limit: number | null | undefined) {
    checkMin(0, limit);
    checkMax(100, limit);
}

export function checkOffset (offset: number | null | undefined) {
    checkMin(0, offset);
}

export function checkTimestamp (timestamp: string | null | undefined) {
    if (typeof timestamp === 'string') {
        const newTimestamp = new Date(timestamp).getTime();
        if (isNaN(newTimestamp)) {
            throw new HttpErrorBadRequest(`invalid timestamp format '${timestamp}'`);
        }
    }
}
