const signedFetch = require('./helpers/signed-aws-es-fetch');
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

	return signedFetch('https://next-elasticsearch-v7.gslb.ft.com/content/_count', {
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
