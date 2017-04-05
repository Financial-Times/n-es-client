const search = require('./search');

const KEYS = [ 'idV1', 'prefLabel', 'taxonomy', 'attributes', 'url' ];

function pluck (rawTag) {
	return KEYS.reduce((newTag, key) => {
		newTag[key] = rawTag[key];
		return newTag;
	}, {});
}

function handleData (data, uuid) {
	if (data.length) {
		const tag = data[0].metadata.find((tag) => tag.idV1 === uuid);
		return pluck(tag);
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
