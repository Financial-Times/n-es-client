const signedFetch = require('signed-aws-es-fetch');

const handleResponse = require('./helpers/handle-response');

const DEFAULTS = {
	query: {
		match_all: {}
	}
};

const handleData = ({ count }) => count;

module.exports = (options = {}, timeout = 3000, deps = { signedFetch = signedFetch } = {}) => {
	const params = Object.assign({}, DEFAULTS, options);
	const body = JSON.stringify(params);

	return deps.signedFetch('https://next-elastic.ft.com/v3_api_v2/item/_count', {
		body,
		timeout,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(handleResponse)
		.then(handleData);
};
