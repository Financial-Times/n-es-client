const signedFetch = require('signed-aws-es-fetch');
const agent = require('./helpers/https-agent');
const handleResponse = require('./helpers/handle-response');
const extractSource = require('./helpers/extract-source');

const DEFAULTS = {
	from: 0,
	size: 10,
	sort: { publishedDate: 'desc' },
	_source: true
};

function handleData ({ responses }) {
	return responses.map((data) => {
		return {
			total: data.hits.total.value,
			hits: data.hits.hits.map(extractSource)
		};
	});
}

function search (queries = [], timeout = 3000, dataHandler = handleData) {
	// The request format of the multi search API is a little odd. It accepts a
	// newline delimited JSON format with each query preceded by a "header".
	const lines = queries.reduce((accumulator, query) => {
		// The header line is empty b/c the URL already specifies index and type
		accumulator.push({});
		accumulator.push(Object.assign({}, DEFAULTS, query));
		return accumulator;
	}, []);

	const body = lines.map(JSON.stringify).join('\n') + '\n';

	return signedFetch('https://next-elasticsearch-v7.gslb.ft.com/content/_msearch', {
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

module.exports = search;
