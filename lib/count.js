const signedFetch = require('signed-aws-es-fetch');
const agent = require('./helpers/https-agent');
const handleResponse = require('./helpers/handle-response');

const DEFAULTS = {
	query: { match_all: {} }
};

function handleData ({ count }) {
	return count;
}

function count (options = {}, timeout = 3000) {
	const params = Object.assign({}, DEFAULTS, options);
	const body = JSON.stringify(params);

	return signedFetch(`https://${global.ELASTICSEARCH_HOSTNAME}/content/item/_count`, {
		body,
		agent,
		timeout,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(handleResponse)
		.then(handleData);
};

module.exports = count;
