const overrideEnvVars = () => {
	const vars = {
		NODE_ENV: 'test',
		AWS_SIGNED_FETCH_DISABLE_DNS_RESOLUTION: true
	};

	process.env = { ...process.env, ...vars };
};

overrideEnvVars();

exports.mochaHooks = {
	beforeAll: () => {}
};
