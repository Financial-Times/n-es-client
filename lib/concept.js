const search = require('./search');

// property => alias (optional)
const PROPS = new Map([
	['id'],
	['prefLabel'],
	['apiUrl'],
	['attributes'],
	['types'],
	['type'],
	['directType'],
	['url']
]);

function pluck (rawTag) {
	const newTag = {};

	for (let [prop, alias] of PROPS) {
		if (rawTag[prop]) {
			newTag[alias || prop] = rawTag[prop];
		}
	}

	return newTag;
}

function handleData (data, uuid) {
	if (data.length) {
		const concept = data[0].annotations.find((concept) => concept.id === uuid);
		return pluck(concept);
	}
}

function concept (uuid, timeout = 3000) {
	const params = {
		query: {
			// avoid scoring to increase caching
			constant_score: {
				filter: {
					term: {
						'annotations.id': uuid
					}
				}
			}
		},
		size: 1,
		_source: [ 'annotations' ]
	};

	return search(params, timeout)
		.then((data) => handleData(data, uuid));
}

module.exports = concept;
