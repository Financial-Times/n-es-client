const search = require('./search');
const pluckProperties = require('./helpers/pluck-properties');

// property => alias (optional)
const PROPS = new Map([
	['idV1', 'id'],
	['prefLabel', 'name'],
	['taxonomy'],
	['attributes'],
	['url']
]);

function handleData (data, uuid) {
	if (data.length) {
		const tag = data[0].metadata.find((tag) => tag.idV1 === uuid);
		return pluckProperties(PROPS, tag);
	}
}

function tag (uuid, timeout = 3000) {
	const params = {
		query: {
			// avoid scoring to increase caching
			constant_score: {
				filter: {
					term: {
						'metadata.idV1': uuid
					}
				}
			}
		},
		size: 1,
		_source: [ 'metadata' ]
	};

	return search(params, timeout)
		.then((data) => handleData(data, uuid));
}

module.exports = tag;
