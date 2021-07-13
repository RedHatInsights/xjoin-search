import { negate } from './es';

// eslint-disable-next-line @typescript-eslint/ban-types
export function or <T> (resolver: (items: T[]) => object) {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    return (items: T[]) => ([{
        bool: {
            should: resolver(items)
        }
    }]);
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function and <T> (resolver: (items: T[]) => object) {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    return (items: T[]) => ([{
        bool: {
            must: resolver(items)
        }
    }]);
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function not <T> (resolver: (item: T) => object) {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    return (item: T) => [negate(resolver(item))];
}
