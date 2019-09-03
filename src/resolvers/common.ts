export function or <T> (resolver: (items: T[]) => object) {
    return (items: T[]) => ({
        bool: {
            should: resolver(items)
        }
    });
}

export function and <T> (resolver: (items: T[]) => object) {
    return (items: T[]) => ({
        bool: {
            must: resolver(items)
        }
    });
}

export function not <T> (resolver: (item: T) => object) {
    return (item: T) => ({
        bool: {
            must_not: resolver(item)
        }
    });
}
