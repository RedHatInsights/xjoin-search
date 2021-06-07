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
      modified_on,
      system_profile_facts (filter: [
        "os_kernel_version",
        "os_release",
        "number_of_cpus"
      ])
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
        spf_infrastructure_vendor: { eq: "kvm" },
        spf_os_kernel_version: { eq: "3.11.0" }
      }, {
        spf_infrastructure_vendor: { eq: "virtualbox" },
        spf_os_release: { eq: "7.3" }
      }],
      display_name: { matches: "*jharting*" }
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
        gte: "2030-01-10T08:07:03.354307Z",
        lte: "2030-02-10T08:07:03.354307Z"
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
          namespace: { eq: "insights-client" },
          key: { eq: "os" },
          value: { eq: "fedora" }
        }
      }, {
        tag: {
          namespace: { eq: "insights-client" },
          key: { eq: "database" },
          value: { eq: null }
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
