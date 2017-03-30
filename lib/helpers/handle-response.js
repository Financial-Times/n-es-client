const httpError = require('http-errors');
const logger = require('@financial-times/n-logger').default;

function handleResponse (response) {
	if (response.ok) {
		return response.json();
	} else {
		logger.warn({
			event: 'ES_CLIENT_FAILED',
			statusCode: response.status,
			statusText: response.statusText,
		});

		return response.text()
			.then((text) => {
				throw httpError(response.status, text);
			});
	}
}

module.exports = handleResponse;
