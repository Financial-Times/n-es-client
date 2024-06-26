const httpError = require('http-errors');
const logger = require('@dotcom-reliability-kit/logger');

function handleResponse(response) {
	if (response.ok) {
		return response.json();
	} else {
		logger.warn({
			event: 'ES_CLIENT_FAILED',
			statusCode: response.status,
			statusText: response.statusText
		});

		return response.textConverted().then((text) => {
			throw httpError(response.status, text || response.statusText);
		});
	}
}

module.exports = handleResponse;
