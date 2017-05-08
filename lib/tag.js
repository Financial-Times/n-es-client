'strict mode';
const search = require('./search');

// property => alias (optional)
const PROPS = new Map([
	['idV1', 'id'],
	['prefLabel', 'name'],
	['taxonomy'],
	['attributes'],
	['url']
]);

function pluck (rawTag) {
	const newTag = {};

	for (var attribute of PROPS) { // eslint-disable-line no-var
		var alias = attribute[1]; // eslint-disable-line no-var
		var prop = attribute[0]; // eslint-disable-line no-var
		newTag[alias || prop] = rawTag[prop];
	}

	return newTag;
}

function handleData (data, uuid) {
	if (data.length) {
		const tag = data[0].metadata.find((tag) => tag.idV1 === uuid);
		return pluck(tag);
	}
}

function tag (uuid, timeout) {
	timeout = timeout || 3000;
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
