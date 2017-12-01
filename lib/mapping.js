const signedFetch = require('signed-aws-es-fetch');
const agent = require('./helpers/https-agent');
const handleResponse = require('./helpers/handle-response');

function mapping (timeout = 3000) {
	return signedFetch('https://next-elastic.ft.com/content/_mapping', {
		agent,
		timeout,
		method: 'GET'
	})
		.then(handleResponse);
};

module.exports = mapping;
