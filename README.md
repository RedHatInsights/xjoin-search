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

### Testing

To run the linter, unit and integration tests run:
```
npm run verify
```

## Contact
For questions or comments join **#platform-xjoin** at ansible.slack.com or contact [Jozef Hartinger](https://github.com/jharting) directly.
