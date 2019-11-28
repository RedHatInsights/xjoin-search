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
    }, {
        // this tab demostrates host filtering capabilities
        endpoint: '',
        name: 'stale_timestamp',
        query: `{
  hosts (
    filter: {
      stale_timestamp: {
        gte: "2020-01-10T08:07:03.354307Z",
        lte: "2020-02-10T08:07:03.354307Z"
      }
    },
    order_by: display_name,
    order_how: ASC,
    limit: 10,
    offset: 0
  ) {
    meta { count, total }
    data {
      id
      stale_timestamp
      created_on
    }
  }
}`
    }, {
        // this tab demostrates host filtering capabilities
        endpoint: '',
        name: 'tags',
        query: `{
  hosts (
    filter: {
      AND: [{
        tag: {
          namespace: "insights-client",
          key: "os",
          value: "fedora"
        }
      }, {
        tag: {
          namespace: "insights-client",
          key: "database",
          value: null
        }
      }]
    }
  ) {
    data {
      id
      display_name
      tags {
        meta {
          total
        }
        data {
          namespace
          key
          value
        }
      }
    }
  }
}`
    }, {
        endpoint: '',
        name: 'hostTags',
        query: `{
  hostTags {
    meta {
      count,
      total
    }
    data {
      tag {
        namespace,
        key,
        value
      },
      count
    }
  }
}`
    }]
};

export default playground;
