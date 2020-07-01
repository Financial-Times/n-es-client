const logger = require('@financial-times/n-logger').default;

const ELASTICSEARCH_PRODUCTION_HOSTNAME = 'next-elasticsearch.nlb.ft.com';
const ELASTICSEARCH_DEVELOPMENT_HOSTNAME = 'search-next-elasticsearch-dev-yh4wwly56xcwvmnlfqwgliizpe.eu-west-1.es.amazonaws.com';

global.ELASTICSEARCH_HOSTNAME = ELASTICSEARCH_PRODUCTION_HOSTNAME;

module.exports = {
	search: require('./lib/search'),
	count: require('./lib/count'),
	mget: require('./lib/mget'),
	get: require('./lib/get'),
	tag: require('./lib/tag'),
	concept: require('./lib/concept'),
	mapping: require('./lib/mapping'),
	msearch: require('./lib/msearch'),
	useDevelopmentCluster: () => {
		global.ELASTICSEARCH_HOSTNAME = ELASTICSEARCH_DEVELOPMENT_HOSTNAME;

		logger.debug({
			event: 'ES_CLIENT_USING_DEVELOPMENT_CLUSTER',
			ELASTICSEARCH_HOSTNAME: global.ELASTICSEARCH_HOSTNAME
		});
	}
};
