const signedFetch = require('signed-aws-es-fetch');
const agent = require('./helpers/https-agent');
const handleResponse = require('./helpers/handle-response');
const extractSource = require('./helpers/extract-source');
const getEndpoint = require('./helpers/get-endpoint');

const DEFAULTS = {
	query: { match_all: {} },
	from: 0,
	size: 10,
	sort: { publishedDate: 'desc' },
	_source: true
};

function handleData(data) {
	// extract the data we want
	const { total, hits } = data.hits;

	// pull out the content
	const results = hits.map(extractSource);

	// the total is handy so tack that on
	results.total = total.value;

	// return the array of content
	return results;
}

function search(options = {}, timeout = 3000, dataHandler = handleData) {
	const params = Object.assign({}, DEFAULTS, options);
	const body = JSON.stringify(params);
	const endpoint = getEndpoint();

	return signedFetch(`${endpoint}/content/_search`, {
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
}

module.exports = search;
