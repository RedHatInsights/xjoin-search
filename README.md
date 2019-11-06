# xjoin-search

Search server that exposes Elasticsearch indexes via GraphQL API.

## Getting started

### Prerequisities

* node.js 10
* docker-compose

### Running the application locally

1. ```npm ci```
1. ```npm run compile```
1. ```docker-compose up elasticsearch```
1. ```npm run seed```
1. ```npm start```
1. open http://localhost:4000/graphql

Metrics can be found at http://localhost:4000/metrics

### Sample queries

Use the following query to display names of systems whose name matches "jharting" substring:
```
{
  hosts (
    filter: {
      display_name: "*jharting*"
    }
  ) {
    data { id display_name }
  }
}
```

Multiple filters can be combined together using logical operations AND, OR and NOT
```
{
  hosts (
    filter: {
      OR: [{
        display_name: "*7*"
      }, {
        id: "*7*"
      }],
      NOT: {
        display_name: "test03*"
      }
    }
  ) {
    data { id display_name }
  }
}
```

See [the documentation](./docs/schema.md) for more information.

### Testing

To run the linter, unit and integration tests run:
```
npm run verify
```

### FAQ

1. Installing or upgrading nodeJs on Fedora >= 30
    ```
    sudo dnf install -y gcc-c++ make
    curl -sL https://rpm.nodesource.com/setup_12.x | sudo -E bash -
    sudo dnf remove -y nodejs npm
    sudo dnf install nodejs
    ```
    Then checking the version
    ```
    node -v
    v12.13.0
    ```
    
1. Error: ENOSPC: System limit for number of file watchers reached, watch 'xjoin-search/src/app.ts'
   
   You can check the current max_user_watches from your system:
   
   ```
    cat /proc/sys/fs/inotify/max_user_watches
   ```
   
   Then it should fix:
    
   ```
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
   ```
   reference: [Increasing the amount of inotify watchers](https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers) 


## Contact
For questions or comments join **#platform-xjoin** at ansible.slack.com or contact [Jozef Hartinger](https://github.com/jharting) directly.
