
const DEFAULTS = Object.freeze({
    account_number: 'test',
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
    account_number = DEFAULTS.account_number,
    is_internal = true) {

    const data = {
        identity: {
            account_number,
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
