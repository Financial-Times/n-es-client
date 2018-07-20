function nEsClient({auth} = {}) {
	if (auth) this.auth = auth;

	this.search = require('./lib/search');
	this.count = require('./lib/count');
	this.mget = require('./lib/mget');
	this.get = require('./lib/get');
	this.tag = require('./lib/tag');
	this.concept = require('./lib/concept');
	this.mapping = require('./lib/mapping');

	return this;
}

nEsClient.search = require('./lib/search');
nEsClient.count = require('./lib/count');
nEsClient.mget = require('./lib/mget');
nEsClient.get = require('./lib/get');
nEsClient.tag = require('./lib/tag');
nEsClient.concept = require('./lib/concept');
nEsClient.mapping = require('./lib/mapping');

module.exports = nEsClient;
