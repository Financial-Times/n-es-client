[![Coverage Status](https://coveralls.io/repos/github/Financial-Times/n-es-client/badge.svg?branch=master)](https://coveralls.io/github/Financial-Times/n-es-client?branch=master)

# n-es-client

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

```js
const es = require('@financial-times/n-es-client');

// fetch a single content item
es.get(123).then(...)

// fetch multiple content items
es.mget([123, 456, 789]).then(...)

// search for content items
es.search({
    query: {
        term: { type: 'video' }
    }
})
    .then(...)
```

[1]: https://github.com/matthew-andrews/signed-aws-es-fetch
[2]: https://www.npmjs.com/package/http-errors
