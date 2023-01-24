const logger = require('@financial-times/n-logger').default;

const endpoints = {
	development: 'https://next-elasticsearch-v7-dev.gslb.ft.com',
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
