function nEsClient({auth}) {
	if (auth) nEsClient.auth = auth;
	return nEsClient;
}

nEsClient.search = require('./lib/search');
nEsClient.count = require('./lib/count');
nEsClient.mget = require('./lib/mget');
nEsClient.get = require('./lib/get');
nEsClient.tag = require('./lib/tag');
nEsClient.concept = require('./lib/concept');
nEsClient.mapping = require('./lib/mapping');

module.exports = nEsClient;
