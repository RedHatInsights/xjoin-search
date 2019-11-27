# xjoin-search

Search server that exposes Elasticsearch indexes via GraphQL API.

## Getting started

### Prerequisities

* node.js 10
* docker-compose

### Running the application

1. ```npm ci```
1. ```npm run compile```
1. ```docker-compose up elasticsearch```
1. ```npm run seed```
1. ```npm start```
1. open http://localhost:4000/graphql

Metrics can be found at http://localhost:4000/metrics

#### Development

when running locally for development or testing purposes the application automatically sets the header
**x-rh-identity** object to **test** value, be aware it may affect your test. 

Passing NODE_ENV here is optional, by default it is set to development 

```
NODE_ENV=development npm start
```

#### Production or non-dev environment

On this mode identity header is not set and you must specify NODE_ENV:

```
NODE_ENV=production npm start
```

### Sample queries

You can run queries from GraphQL UI or through API.

#### GraphQL UI 

Assuming you have application running locally you can access [http://localhost:4000/graphql](http://localhost:4000/graphql)

**Examples:**

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

#### API

Examples using curl:

```
# no passing x-rh-identity object
curl \
-H 'Content-Type: application/json' \
--data-binary '{"query":"{hosts(limit:10,offset:0){meta{count,total}data{id account display_name}}}"}' \
http://localhost:4000/graphql

# passing x-rh-identity object ( must be base64 encoded )
curl \
-H 'Content-Type: application/json' \
-H 'x-rh-identity: eyJpZGVudGl0eSI6eyJhY2NvdW50X251bWJlciI6InRlc3QiLCJ0eXBlIjoiVXNlciIsInVzZXIiOnsidXNlcm5hbWUiOiJ0dXNlckByZWRoYXQuY29tIiwiZW1haWwiOiJ0dXNlckByZWRoYXQuY29tIiwiZmlyc3RfbmFtZSI6InRlc3QiLCJsYXN0X25hbWUiOiJ1c2VyIiwiaXNfYWN0aXZlIjp0cnVlLCJpc19vcmdfYWRtaW4iOmZhbHNlLCJpc19pbnRlcm5hbCI6dHJ1ZSwibG9jYWxlIjoiZW5fVVMifX19' \
--data-binary '{"query":"{hosts(limit:10,offset:0){meta{count,total}data{id account display_name}}}"}' \
http://localhost:4000/graphql
```

by passing xjoin-search only for test purposes you can run queries against elastic:

```
# get record map
curl -X GET "localhost:9200/test.hosts.v1/"

# get all records
curl -X GET "localhost:9200/test.hosts.v1/_search?pretty"

# filtering
curl -X GET "localhost:9200/test.hosts.v1/_search?q=test" | json_pp
curl -X GET "localhost:9200/test.hosts.v1/_search?q=display_name:test03*" | json_pp

# deleting index
curl -X DELETE "localhost:9200/test.hosts.v1?pretty"
```

### Identity header

**x-rh-identity** header object is expected for request authorization, it must be base64 encoded and 
following the schema from: src/middleware/identity/utils.ts

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

1. Why when I run queries on [http://localhost:4000/graphql](http://localhost:4000/graphql) I can't see all hosts? 
    It is because **x-rh-identity** header object and by default on xjoin-search runs on development mode so only hosts from 
    test account will be listed.  
          

## Contact
For questions or comments join **#platform-xjoin** at ansible.slack.com or contact [Jozef Hartinger](https://github.com/jharting) directly.
