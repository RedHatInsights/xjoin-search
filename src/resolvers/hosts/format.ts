import {NAMESPACE_NULL_VALUE} from '../inputTag';

export function formatTags (tags = []): Record<string, unknown>[] {
    return tags.map((tag: any) => {
        if (tag.namespace === NAMESPACE_NULL_VALUE) {
            return {
                ...tag,
                namespace: null
            };
        }

        return tag;
    });
}

export function formatGroups (groups: any): Record<string, unknown>[] {
    if (Array.isArray(groups)) {
        return groups;
    } else {
        return [];
    }
}