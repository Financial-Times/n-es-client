function pluckProperties(props, original) {
	const remapped = {};

	for (let [prop, alias] of props) {
		if (original[prop]) {
			remapped[alias || prop] = original[prop];
		}
	}

	return remapped;
}

module.exports = pluckProperties;
