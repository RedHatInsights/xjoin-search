import { UserInputError } from 'apollo-server-express';

export function checkMin (min: number, value: number | null | undefined): void {
    if (value === null || value === undefined) {
        return;
    }

    if (value < min) {
        throw new UserInputError(`value must be ${min} or greater (was ${value})`);
    }
}

export function checkMax (max: number, value: number | null | undefined): void {
    if (value === null || value === undefined) {
        return;
    }

    if (value > max) {
        throw new UserInputError(`value must be ${max} or less (was ${value})`);
    }
}

export function checkLimit (limit: number | null | undefined): void {
    checkMin(0, limit);
    checkMax(100, limit);
}

export function checkOffset (offset: number | null | undefined): void {
    checkMin(0, offset);
}

export function checkTimestamp (timestamp: string | null | undefined): void {
    if (typeof timestamp === 'string') {
        const newTimestamp = new Date(timestamp).getTime();
        if (isNaN(newTimestamp)) {
            throw new UserInputError(`invalid timestamp format '${timestamp}'`);
        }
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function checkNotNull (value: any): void {
    if (value === null) {
        throw new UserInputError('value may not be null');
    }
}
