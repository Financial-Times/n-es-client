# n-es-client [![CircleCI](https://circleci.com/gh/Financial-Times/n-es-client.svg?style=svg)](https://circleci.com/gh/Financial-Times/n-es-client) [![Coverage Status](https://coveralls.io/repos/github/Financial-Times/n-es-client/badge.svg?branch=master)](https://coveralls.io/github/Financial-Times/n-es-client?branch=master)

A very thin wrapper around [signed fetch][1] and [http-errors][2] to search and retrieve content from our Elasticsearch clusters in a simple manner.

## Installation

```sh
# install from NPM
$ npm i -S @financial-times/n-es-client

# add AWS access key
export ES_AWS_ACCESS_KEY=123

# add AWS secret access key
export ES_AWS_SECRET_ACCESS_KEY=456
```

## Usage

All methods return a promise. If the request errors then it will be rejected with an HTTP error. Each method will accept an options object that will be preserved verbatim and sent with the request. The default `timeout` is 3000 milliseconds.

It is _highly recommended_ to use [source filtering][3] to fetch only the fields you require.

### `.get(uuid[, options][, timeout])`

Get a content item by UUID. All options will be [stringified][4] and appended to the request URL. Returns the content source.

#### Example

```js
es.get('cce58e8e-158c-11e7-80f4-13e067d5072c', { _source: 'id,title' })
```

### `.mget(options[, timeout])`

Get multiple content items by UUID. All options will be appended to the `POST` body. Returns an array of content sources for the items that were found.

#### Example

```js
es.mget({
    _source: ['id', 'title'],
    ids: ['cce58e8e-158c-11e7-80f4-13e067d5072c', '0615fc8c-1558-11e7-80f4-13e067d5072c']
})
```

### `.search(options[, timeout])`

Get content items by search query. All options will be appended to the `POST` body so the full [query DSL][5] is available. The default sort order is by `publishedDate` descending and with a query `size` of 10. Returns an array of content sources for the items that matched.

#### Example

```js
es.search({
    _source: ['id', 'title'],
    query: {
        term: { 'annotations.id': 'dbb0bdae-1f0c-11e4-b0cb-b2227cce2b54' }
    },
    size: 100
});
```

[1]: https://github.com/matthew-andrews/signed-aws-es-fetch
[2]: https://www.npmjs.com/package/http-errors
[3]: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-source-filtering.html
[4]: https://www.npmjs.com/package/querystring
[5]: https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html
