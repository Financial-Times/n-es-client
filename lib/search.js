const signedFetch = require('signed-aws-es-fetch');
const agent = require('./helpers/https-agent');
const handleResponse = require('./helpers/handle-response');
const extractSource = require('./helpers/extract-source');


const EXCLUDE_BLOG_POSTS = {
	bool: {
		must_not: {
			term: {
				type: 'live-blog-post'
			}
		}
	}
};

const DEFAULTS = {
	query: { match_all: {} },
	from: 0,
	size: 10,
	sort: { publishedDate: 'desc' },
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

function search (options = {}, timeout = 3000, dataHandler = handleData) {
	
	if (Boolean(options.includeBlogPosts) === false) {
		const boolQuery = options.query.bool ? Object.assign({}, options.query.bool, EXCLUDE_BLOG_POSTS.bool) : EXCLUDE_BLOG_POSTS;
		options.query.bool = boolQuery;
 	}
	
	const params = Object.assign({}, DEFAULTS, options);
	const body = JSON.stringify(params);

	return signedFetch('https://next-elasticsearch.nlb.ft.com/content/item/_search', {
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
