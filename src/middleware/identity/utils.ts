
const DEFAULTS = Object.freeze({
    org_id: 'test',
    type: 'User',
    user: {
        username: 'tuser@redhat.com',
        email: 'tuser@redhat.com',
        first_name: 'test',
        last_name: 'user',
        is_active: true,
        is_org_admin: false,
        is_internal: true,
        locale: 'en_US'
    },
    internal: {
        org_id: '5318290' // not used by remediations but some apps (compliance) rely on this (demo mode)
    }
});

function encode(data: any) {
    return Buffer.from(JSON.stringify(data)).toString('base64');
}

export default function createIdentityHeader(
    modify_data = (d: any) => d,
    username = DEFAULTS.user.username,
    org_id = DEFAULTS.org_id,
    is_internal = true): string {

    const data = {
        identity: {
            org_id,
            type: DEFAULTS.type,
            user: {
                ...DEFAULTS.user,
                username,
                is_internal
            }
        }
    };
    const modified_data = modify_data(data);
    return encode(modified_data);
}
