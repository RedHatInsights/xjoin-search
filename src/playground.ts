const playground = {
    tabs: [{
        endpoint: '',
        name: 'hosts',
        query: `{
  hosts (
    filter: {
      OR: [{
        system_profile_fact: {
          key: "os_release"
          value: "7.4"
        }
      }, {
        system_profile_fact: {
          key: "os_release"
          value: "7.5"
        }
      }]
    },
    order_by: display_name,
    order_how: ASC
  ) {
    meta { count, total }
    data { id account display_name modified_on system_profile_facts }
  }
}`
    }]
};

export default playground;
