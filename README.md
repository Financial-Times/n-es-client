# n-es-client

[![CircleCI](https://img.shields.io/circleci/project/github/Financial-Times/n-es-client/main.svg)](https://circleci.com/gh/Financial-Times/n-es-client) ![Coveralls Coverage](https://img.shields.io/coveralls/github/Financial-Times/n-es-client/main.svg) [![NPM version](https://img.shields.io/npm/v/@financial-times/n-es-client.svg)](https://www.npmjs.com/package/@financial-times/n-es-client)

A very thin wrapper around [signed fetch][1] and [http-errors][2] to search and retrieve content from our Elasticsearch clusters in a simple, DRY manner.

```js
const client = require('@financial-times/n-es-client');

client.get('cce58e8e-158c-11e7-80f4-13e067d5072c').then((data) => { … });
```

## Installation

```sh
# install from NPM
$ npm i -S @financial-times/n-es-client

# add Elasticsearch read AWS access key
export ES_AWS_ACCESS_KEY=123

# add Elasticsearch read AWS secret access key
export ES_AWS_SECRET_ACCESS_KEY=456
```

### Doppler compatibility

Set your secret name as `ES_AWS_ACCESS_KEY_ID` for the AWS ACCESS KEY, and this library will write its value to `ES_AWS_ACCESS_KEY` so that `signed-aws-es-fetch` accepts it

## Usage

All methods return a promise. If a request errors then it will be rejected with an appropriate HTTP error. Each method accepts an options object that will be preserved verbatim and sent with the request, either stringified as part of the URL or as the `POST` body.

All methods have an optional `timeout` argument that defaults to 3 seconds.

Some methods allow a custom `dataHandler` argument that will receive and may manipulate the raw response from Elasticsearch instead of the default handler.

It is _highly recommended_ to always use [source filtering][3] to fetch only the fields you require.

### `.get(uuid[, options][, timeout])`

Get a content item by UUID. Returns the content source.

#### Example

```js
client.get('cce58e8e-158c-11e7-80f4-13e067d5072c', { _source: ['id', 'title'] })
```

### `.mget(options[, timeout][, dataHandler])`

Get multiple content items by UUID. By default returns an array of content sources for the items that were found but allows an optional custom data handler function.

#### Example

```js
client.mget({
	ids: ['cce58e8e-158c-11e7-80f4-13e067d5072c', '0615fc8c-1558-11e7-80f4-13e067d5072c']
})

client.mget({
	docs: [
		{ _id: 'cce58e8e-158c-11e7-80f4-13e067d5072c', _source: ['title'] },
		{ _id: '0615fc8c-1558-11e7-80f4-13e067d5072c', _source: ['title'] }
	]
})
```

### `.search(options[, timeout][, dataHandler])`

Get content items by search query (the full [query DSL][4] is available). The default sort order is by `publishedDate` descending and with a query `size` of 10. By default returns an array of content sources for the items that matched but allows an optional custom data handler function.

#### Example

```js
client.search({
	_source: ['id', 'title'],
	query: {
		term: { 'annotations.id': 'dbb0bdae-1f0c-11e4-b0cb-b2227cce2b54' }
	},
	size: 100
});
```

### `.count(query[, timeout])`

Get the number of items by search query (the full [query DSL][4] is available). Returns a number.

#### Example

```js
client.count({
	query: {
		term: { 'annotations.id': 'dbb0bdae-1f0c-11e4-b0cb-b2227cce2b54' }
	}
});
```

### `.msearch(queries[, timeout][, dataHandler])`

Perform multiple search queries with one request. By default returns an array of query responses including total matches and content sources for the items that were found but allows an optional custom data handler function. Returns an array of result sets in the format `[ { total: number, hits: [] } ]`.

#### Example

```js
client.msearch([
	{ query: { term: { 'annotations.id': 'cce58e8e-158c-11e7-80f4-13e067d5072c' } } },
	{ query: { term: { 'annotations.id': '0615fc8c-1558-11e7-80f4-13e067d5072c' } } }
])
```

### `.concept(uuid[, timeout])`

Get a single concept by UUID. Returns an object or `undefined` if no matches were found.

[1]: https://github.com/matthew-andrews/signed-aws-es-fetch
[2]: https://www.npmjs.com/package/http-errors
[3]: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-source-filtering.html
[4]: https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html

## Environments

You can configure the Elasticsearch environment to use by setting the `N_ES_CLIENT_ENV` environment variable to either `development` or `production`. If this environment variable is not set it defaults to `production`. 