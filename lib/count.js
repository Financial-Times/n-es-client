const signedAwsEsFetch = require('signed-aws-es-fetch');

const handleResponse = require('./helpers/handle-response');

const handleData = ({ count }) => count;

module.exports = (query = { match_all: {}}, timeout = 3000, dependencies = {}) => {
	const deps = Object.assign({}, { signedAwsEsFetch }, dependencies);

	return deps.signedAwsEsFetch('https://next-elastic.ft.com/content/item/_count', {
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
