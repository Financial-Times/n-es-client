const search = require('./search');

function handleData (data, uuid) {
	if (data.length) {
		return data[0].metadata.find((tag) => tag.idV1 === uuid);
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
