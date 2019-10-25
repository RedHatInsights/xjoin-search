const playground = {
    tabs: [{
        // this tab is here for convenient querying of the unfiltered host list
        endpoint: '',
        name: 'hosts',
        query: `{
  hosts (
    limit: 10,
    offset: 0
  ) {
    meta { count, total }
    data {
      id
      account
      display_name
      modified_on
    }
  }
}`
    }, {
        // this tab demostrates host filtering capabilities
        endpoint: '',
        name: 'filter',
        query: `{
  hosts (
    filter: {
      OR: [{
        spf_infrastructure_vendor: "kvm",
        spf_os_kernel_version: "3.11.0"
      }, {
        spf_infrastructure_vendor: "virtualbox",
        spf_os_release: "7.3"
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
    }
  }
}`
    }]
};

export default playground;
