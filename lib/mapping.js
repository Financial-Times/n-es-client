const signedFetch = require('signed-aws-es-fetch');
const agent = require('./helpers/https-agent');
const handleResponse = require('./helpers/handle-response');
const getEndpoint = require('./helpers/get-endpoint');

function mapping(timeout = 3000) {
	const endpoint = getEndpoint();

	return signedFetch(`${endpoint}/content/_mapping`, {
		agent,
		timeout,
		method: 'GET'
	}).then(handleResponse);
}

module.exports = mapping;
