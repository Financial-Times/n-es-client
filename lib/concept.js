const search = require('./search');

function handleData (data, uuid) {
	if (data.length) {
		return data[0].annotations.find((tag) => tag.id === uuid);
	}
}

function tag (uuid, timeout = 3000) {
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

module.exports = tag;
