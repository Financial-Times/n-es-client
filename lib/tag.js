const logger = require('@dotcom-reliability-kit/logger');

module.exports = () => {
	logger.error('DEPRECATED: The `tag` method of n-es-client is obsolete.');
	return Promise.resolve();
};
