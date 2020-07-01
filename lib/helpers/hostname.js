const logger = require('@financial-times/n-logger').default;

const ELASTICSEARCH_PRODUCTION_HOSTNAME = 'next-elasticsearch.nlb.ft.com';
const ELASTICSEARCH_DEVELOPMENT_HOSTNAME = 'search-next-elasticsearch-dev-yh4wwly56xcwvmnlfqwgliizpe.eu-west-1.es.amazonaws.com';

let ELASTICSEARCH_HOSTNAME = ELASTICSEARCH_PRODUCTION_HOSTNAME;

module.exports = {
	get: () => ELASTICSEARCH_HOSTNAME,
	useDevelopmentCluster: () => {
		ELASTICSEARCH_HOSTNAME = ELASTICSEARCH_DEVELOPMENT_HOSTNAME;

		logger.debug({
			event: 'ES_CLIENT_USE_DEVELOPMENT_CLUSTER',
			ELASTICSEARCH_HOSTNAME
		});
	}
};
