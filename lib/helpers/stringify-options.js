// node's querystring module does does handle arrays how we'd like
function stringifyOptions (options) {
	const output = [];

	// no Object.entries in Node 6
	for (const key of Object.keys(options)) {
		let value = options[key];

		if (Array.isArray(value)) {
			value = value.join(',');
		}

		output.push(`${key}=${encodeURIComponent(value)}`);
	}

	return output.join('&');
}

module.exports = stringifyOptions;
