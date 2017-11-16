const signedFetch = require('signed-aws-es-fetch');
const agent = require('./helpers/https-agent');
const handleResponse = require('./helpers/handle-response');
const extractSource = require('./helpers/extract-source');

const DEFAULTS = {
	ids: [],
	_source: true
};

function handleData (data) {
	// filter out the documents not found
	const results = data.docs.filter((doc) => doc.found);

	// pull out the content
	return results.map(extractSource);
}

function mget (options = {}, timeout = 3000, dataHandler = handleData) {
	const params = Object.assign({}, DEFAULTS, options);
	const body = JSON.stringify(params);

	return signedFetch('https://next-elastic.ft.com/content/item/_mget', {
		body,
		agent,
		timeout,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(handleResponse)
		.then(dataHandler);
};

module.exports = mget;
