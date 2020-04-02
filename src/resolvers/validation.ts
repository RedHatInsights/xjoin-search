import { UserInputError } from 'apollo-server-express';

export function checkMin (min: number, value: number | null | undefined) {
    if (value === null || value === undefined) {
        return;
    }

    if (value < min) {
        throw new UserInputError(`value must be ${min} or greater (was ${value})`);
    }
}

export function checkMax (max: number, value: number | null | undefined) {
    if (value === null || value === undefined) {
        return;
    }

    if (value > max) {
        throw new UserInputError(`value must be ${max} or less (was ${value})`);
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
            throw new UserInputError(`invalid timestamp format '${timestamp}'`);
        }
    }
}

export function checkNotNull (value: any) {
    if (value === null) {
        throw new UserInputError('value may not be null');
    }
}
