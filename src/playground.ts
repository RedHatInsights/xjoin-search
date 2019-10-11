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
      }],
      display_name: "*jharting*"
    },
    order_by: display_name,
    order_how: ASC,
    limit: 10,
    offset: 0
  ) {
    meta { count, total }
    data {
      id
      account
      display_name
      modified_on
      canonical_facts {
        fqdn, insights_id
      }
    }
  }
}`
    }]
};

export default playground;
