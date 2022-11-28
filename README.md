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
      display_name: {
        matches: "*jharting*"
      }
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
        display_name: {
          matches: "*7*"
        }
      }, {
        id: {
          matches: "*7*"
        }
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
--data-binary '{"query":"{hosts(limit:10,offset:0){meta{count,total}data{id org_id display_name}}}"}' \
http://localhost:4000/graphql

# passing x-rh-identity object ( must be base64 encoded )
curl \
-H 'Content-Type: application/json' \
-H 'x-rh-identity: eyJpZGVudGl0eSI6eyJvcmdfaWQiOiJ0ZXN0IiwidHlwZSI6IlVzZXIiLCJhdXRoX3R5cGUiOiJiYXNpYy1hdXRoIiwidXNlciI6eyJ1c2VybmFtZSI6InR1c2VyQHJlZGhhdC5jb20iLCJlbWFpbCI6InR1c2VyQHJlZGhhdC5jb20iLCJmaXJzdF9uYW1lIjoidGVzdCIsImxhc3RfbmFtZSI6InVzZXIiLCJpc19hY3RpdmUiOnRydWUsImlzX29yZ19hZG1pbiI6ZmFsc2UsImlzX2ludGVybmFsIjp0cnVlLCJsb2NhbGUiOiJlbl9VUyJ9fX0=' \
--data-binary '{"query":"{hosts(limit:10,offset:0){meta{count,total}data{id org_id display_name}}}"}' \
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
## Maintenance
### Update SystemProfile Filters using schema

`xjoin-search` automatically creates filters for most* fields in the system profile based on the schema defined in
the [inventory-schemas](https://github.com/RedHatInsights/inventory-schemas) repo. Specifically [this file](https://github.com/RedHatInsights/inventory-schemas/blob/master/schemas/system_profile/v1.yaml).
When a new field is added to the schema a GitHub action should be triggered running the command `npm run updateFromSchema`.
That script will automatically update the following files to accommodate the new field:

* `/test/mapping.json`
  * This file contains the ElasticSearch mapping that is applied by `seed.js` when `npm run seed` is called.
  The update script uses the schema data to define new document fields and data types as needed.
* `/src/schema.graphql`
  * This file defines the inputs and types of inputs that can be used in the GraphQL API.
  The update script uses the schema data to define new inputs and types as needed.
* `/test/hosts.json`
  * This file contains test data for hosts used in automated and manual testing.
  The script uses the example fields in the schema to populate the file with example values for testing.
* `/test/spf_test_data.json`
  * This file contains the queries used to test that the automatically added field filters work as expected.
* `/deploy/ephemeral.yaml`
  * This file contains configuration specific to ephemeral environments.
  The script updates the index mapping template used by elasticsearch.

If you want to update things manually you can update the schema file `inventory-schemas/system_profile_schema.yaml` and run `npm run updateFromSchema`. If you intend to commit the change remember to update `inventory-schemas/system_profile_schema_sha.txt` as well with the SHA of the associated `inventory-schemas` commit. This should not be done unless the automated action is not working. Any change out of sync with the `inventory-schemas` repo will be removed the next time the action is run, but they should ideally never be out of sync.

Changes to the mapping, graphql schema or hosts file that are unrelated to system profile fields should be unaffected.

After running `updateFromSchema`, you will likely need to update the unit test baselines to account for the field changes.
You should still review the baseline changes to make sure they're expected before committing.
You can update the baselines by running:

```bash
npm run coverage -- -u
```

\* Some fields are intentionally ignored for performance reasons, or because the data is not useful to filter on.
Fields in the schema with `x-indexed: false` will not be indexed by ElasticSearch and are ignored during the update.

## Contact
For questions or comments join **#platform-xjoin** at ansible.slack.com or contact [Jozef Hartinger](https://github.com/jharting) directly. 
