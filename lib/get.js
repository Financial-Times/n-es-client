const querystring = require('querystring');
const signedFetch = require('signed-aws-es-fetch');
const handleResponse = require('./helpers/handle-response');

const DEFAULTS = {
	_source: true,
	_source_excludes: 'openingXML,bodyXML'
};

function get (uuid, options = {}, timeout = 3000) {
	const params = Object.assign({}, DEFAULTS, options);
	const qs = querystring.stringify(params);

	return signedFetch(`https://next-elastic.ft.com/content/item/${uuid}/_source?${qs}`, {
		timeout,
		method: 'GET'
	})
		.then(handleResponse);
};

module.exports = get;
