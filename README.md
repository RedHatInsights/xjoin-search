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

### Testing

To run the linter, unit and integration tests run:
```
npm run verify
```

## Contact
For questions or comments join **#platform-xjoin** at ansible.slack.com or contact [Jozef Hartinger](https://github.com/jharting) directly.
