const signedFetch = require('signed-aws-es-fetch');

const handleResponse = require('./helpers/handle-response');

const handleData = ({ count }) => count;

module.exports = (query = { match_all: {}}, timeout = 3000, deps = { signedFetch = signedFetch } = {}) => {
	return deps.signedFetch('https://next-elastic.ft.com/v3_api_v2/item/_count', {
		body: JSON.stringify({ query }),
		timeout,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(handleResponse)
		.then(handleData);
};
