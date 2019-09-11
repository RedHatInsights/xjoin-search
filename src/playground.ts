const playground = {
    tabs: [{
        endpoint: '',
        name: 'hosts',
        query: `{
    hosts (
        filter: {
            system_profile_fact: {
            key: "os_release"
            value: "7.5"
        }
    }) {
        data { id account display_name system_profile_facts }
        meta { count, total }
    }
}`
    }]
};

export default playground;
