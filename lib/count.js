const signedFetch = require('signed-aws-es-fetch');
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

	return signedFetch('https://next-elastic.ft.com/content/item/_count', {
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

module.exports = count;
