const signedFetch = require('signed-aws-es-fetch');
const agent = require('./helpers/https-agent');
const handleResponse = require('./helpers/handle-response');
const extractSource = require('./helpers/extract-source');

const DEFAULT_QUERY = {
	from: 0,
	size: 10,
	sort: { publishedDate: 'desc' },
	_source: true
};

const DEFAULTS = {
	queries: []
};

function handleData ({ responses }) {
	return responses.map((data) => {
		return {
			total: data.hits.total,
			hits: data.hits.hits.map(extractSource)
		};
	});
}

function search (options = {}, timeout = 3000, dataHandler = handleData) {
	const params = Object.assign({}, DEFAULTS, options);

	const body = params.queries.reduce((accumulator, query) => {
		accumulator.push({});
		accumulator.push(Object.assign({}, DEFAULT_QUERY, query));
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
