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
			total: data.hits.total,
			hits: data.hits.hits.map(extractSource)
		};
	});
}

function search (queries = [], timeout = 3000, dataHandler = handleData) {
	const body = queries.reduce((accumulator, query) => {
		// The header can be empty as the URL already specifies index and type
		accumulator.push({});
		accumulator.push(Object.assign({}, DEFAULTS, query));
		return accumulator;
	}, []);

	return signedFetch('https://next-elastic.ft.com/content/item/_msearch', {
		body: body.map(JSON.stringify).join('\n'),
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
