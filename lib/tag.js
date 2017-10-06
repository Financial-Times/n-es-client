const logger = require('@financial-times/n-logger').default;

module.exports = () => {
	logger.error('DEPRECATED: The `tag` method of n-es-client is obsolete.')
	return Promise.resolve();
};
