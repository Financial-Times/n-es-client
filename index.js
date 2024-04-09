// doppler auto secret rotation requires a suffix of _ACCESS_KEY_ID, but signed-es-aws-fetch module does not have that in its list of accepted key names
if (process.env.ES_AWS_ACCESS_KEY_ID) {
	process.env.ES_AWS_ACCESS_KEY = process.env.ES_AWS_ACCESS_KEY_ID;
}

module.exports = {
	search: require('./lib/search'),
	count: require('./lib/count'),
	mget: require('./lib/mget'),
	get: require('./lib/get'),
	tag: require('./lib/tag'),
	concept: require('./lib/concept'),
	mapping: require('./lib/mapping'),
	msearch: require('./lib/msearch')
};
