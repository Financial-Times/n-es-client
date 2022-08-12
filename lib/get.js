const signedFetch = require('signed-aws-es-fetch');
const agent = require('./helpers/https-agent');
const handleResponse = require('./helpers/handle-response');
const stringifyOptions = require('./helpers/stringify-options');

const DEFAULTS = {
	_source: true
};

function get(uuid, options = {}, timeout = 3000) {
	const params = Object.assign({}, DEFAULTS, options);
	const qs = stringifyOptions(params);

	return signedFetch(
		`https://next-elasticsearch-v7.gslb.ft.com/content/_doc/${uuid}/_source?${qs}`,
		{
			agent,
			timeout,
			method: 'GET'
		}
	).then(handleResponse);
}

module.exports = get;
