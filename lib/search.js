const signedFetch = require('signed-aws-es-fetch');
const handleResponse = require('./helpers/handle-response');
const extractSource = require('./helpers/extract-source');

const DEFAULTS = {
	query: { match_all: {} },
	from: 0,
	size: 10,
	sort: 'publishedDate:desc',
	_source: true
};

function handleData (data) {
	// extract the data we want
	const { total, hits } = data.hits;

	// pull out the content
	const results = hits.map(extractSource);

	// the total is handy so tack that on
	results.total = total;

	// return the array of content
	return results;
}

function search (options = {}, timeout = 3000) {
	const params = Object.assign({}, DEFAULTS, options);
	const body = JSON.stringify(params);

	return signedFetch('https://next-elastic.ft.com/v3_api_v2/item/_search', {
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

module.exports = search;
