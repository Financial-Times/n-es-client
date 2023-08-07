const logger = require('@dotcom-reliability-kit/logger');

const endpoints = {
	development: 'https://search-next-elasticsearch-v7-dev-znli3en2mvhur6j35qsr4673fq.eu-west-1.es.amazonaws.com',
	production: 'https://next-elasticsearch-v7.gslb.ft.com'
};

const getEndpoint = () => {
	const env = process.env.N_ES_CLIENT_ENV || 'production';
	const isDev = env === 'development';
	const isProd = env === 'production';

	if (isDev) {
		return endpoints.development;
	}

	if (isProd) {
		return endpoints.production;
	}

	logger.error(`n-es-client: Unknown environment: ${env}`);
	throw new Error(`n-es-client: Unknown environment: ${env}`);
};

module.exports = getEndpoint;
