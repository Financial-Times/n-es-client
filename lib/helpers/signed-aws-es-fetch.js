const aws4 = require('aws4');
const nodeFetch = require('node-fetch');
const logger = require('@financial-times/n-logger').default;
const resolveCname = require('util').promisify(require('dns').resolveCname);
const memoize = require('lodash/memoize');

const memoizedResolveCname = memoize(resolveCname);

const envKeys = {
	awsKeys: ['ES_AWS_ACCESS_KEY', 'AWS_ACCESS_KEY', 'AWS_ACCESS_KEY_ID'],
	awsSecretKeys: ['ES_AWS_SECRET_ACCESS_KEY', 'AWS_SECRET_ACCESS_KEY'],
	tokenKeys: ['ES_AWS_SESSION_TOKEN', 'AWS_SESSION_TOKEN']
};

module.exports = async function (url, opts, creds) {
	opts = opts || {};
	url = await resolveUrlAndHost(url);
	return signedFetch(url, opts, creds);
};

function getURL (url) {
	try {
		const urlObject = new URL(url);
		return urlObject;
	} catch (error) {
		logger.error({
			event: 'Invalid URL',
			data: {
				url
			}
		});
		throw error;
	}
}

async function resolveValidHost (urlObject) {
	const hosts = await memoizedResolveCname(urlObject.host);
	if (hosts === undefined) {
		logger.error({
			event: 'Invalid Host',
			data: {
				url: urlObject
			}
		});
		throw new Error('Invalid Host');
	}
	return hosts[0];
}

async function resolveUrlAndHost (url) {
	const urlObject = getURL(url);
	if (
		!/\.es\.amazonaws\.com$/.test(urlObject.host) &&
		!process.env.AWS_SIGNED_FETCH_DISABLE_DNS_RESOLUTION
	) {
		const host = await resolveValidHost(urlObject);
		url = url.replace(urlObject.host, host);
	}
	return url;
}

function getEnv (keys) {
	const keyName = envKeys[keys].find((keyName) => process.env[keyName]);
	return process.env[keyName];
}

function setAwsCredentials (creds) {
	creds = creds || {};
	creds.accessKeyId = creds.accessKeyId || getEnv('awsKeys');
	creds.secretAccessKey = creds.secretAccessKey || getEnv('awsSecretKeys');

	let sessionToken = creds.sessionToken;
	if (
		process.env.ES_AWS_SESSION_TOKEN !== false &&
		// a boolean value is interpreted as string if set from vault
		process.env.ES_AWS_SESSION_TOKEN !== 'false'
	) {
		sessionToken = sessionToken || getEnv('tokenKeys');
	}
	if (sessionToken) {
		creds.sessionToken = sessionToken;
	}
	return creds;
}

function getSignableData (url, opts, creds) {
	creds = setAwsCredentials(creds);
	const { host, pathname: path, search, protocol } = new URL(url);
	const signable = {
		method: opts.method,
		host,
		path,
		body: opts.body,
		headers: opts.headers
	};
	aws4.sign(signable, creds);
	return [signable.headers, signable.path, search, protocol];
}

function signedFetch (url, opts, creds) {
	const [headers, path, search, protocol] = getSignableData(url, opts, creds);
	opts.headers = headers;
	// Try to use a global fetch here if possible otherwise risk getting a handle
	// on the wrong fetch reference (ie. not a mocked one if in a unit test)
	return (global.fetch || nodeFetch)(
		`${protocol}//${opts.headers.Host}${path}${search}`,
		opts
	);
}
