const nodeFetch = require('node-fetch');
const { HttpRequest } = require('@aws-sdk/protocol-http');
const { SignatureV4 } = require('@aws-sdk/signature-v4');
const { Sha256 } = require('@aws-crypto/sha256-browser');
const logger = require('@financial-times/n-logger').default;
const resolveCname = require('util').promisify(require('dns').resolveCname);
const memoize = require('lodash/memoize');

const memoizedResolveCname = memoize(resolveCname);

const defaultAwsKeys = {
	awsKeys: ['ES_AWS_ACCESS_KEY', 'AWS_ACCESS_KEY', 'AWS_ACCESS_KEY_ID'],
	awsSecretKeys: ['ES_AWS_SECRET_ACCESS_KEY', 'AWS_SECRET_ACCESS_KEY'],
	tokenKeys: ['ES_AWS_SESSION_TOKEN', 'AWS_SESSION_TOKEN']
};

// We capture the group before the extension es.amazonaws.com
const RE_AWS_ES_REGION = /\.(\w{2}-\w*?-\d)\.es\.amazonaws\.com/;
const defaultRegion = 'eu-west-1';

module.exports = async function (url, opts = {}, creds = {}) {
	creds = setAwsCredentials(creds);
	return signedFetch(url, opts, creds);
};

function getURLObject(url) {
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

async function resolveValidHost(urlObject) {
	try {
		const hosts = await memoizedResolveCname(urlObject.host);
		if (hosts && hosts[0]) {
			return hosts[0];
		}
	} catch (error) {}
	logger.error({
		event: 'Invalid Host',
		data: {
			url: urlObject
		}
	});
	throw new Error('Invalid Host');
}

function isActiveDnsResolution() {
	return process.env.AWS_SIGNED_FETCH_DISABLE_DNS_RESOLUTION !== 'true';
}

async function resolveUrlAndHost(urlObject) {
	return !/\.es\.amazonaws\.com$/.test(urlObject.host) &&
		isActiveDnsResolution()
		? resolveValidHost(urlObject)
		: urlObject.host;
}

function defaultAwsCredentials(keys) {
	const keyName = defaultAwsKeys[keys].find((keyName) => process.env[keyName]);
	return process.env[keyName];
}

function thereIsToken() {
	return (
		process.env.ES_AWS_SESSION_TOKEN !== false &&
		// a boolean value is interpreted as string if set from vault
		process.env.ES_AWS_SESSION_TOKEN !== 'false'
	);
}

function setAwsCredentials(creds) {
	creds.accessKeyId = creds.accessKeyId || defaultAwsCredentials('awsKeys');
	creds.secretAccessKey =
		creds.secretAccessKey || defaultAwsCredentials('awsSecretKeys');

	let sessionToken = creds.sessionToken;
	if (thereIsToken()) {
		sessionToken = sessionToken || defaultAwsCredentials('tokenKeys');
	}
	if (sessionToken) {
		creds.sessionToken = sessionToken;
	}
	return creds;
}

async function getSignableData(url) {
	const urlObject = getURLObject(url);
	const domain = await resolveUrlAndHost(urlObject);
	const matchRegion = domain.match(RE_AWS_ES_REGION);
	const region = matchRegion[1] || defaultRegion;
	const path = `${urlObject.pathname}${urlObject.search}`;
	const protocol = urlObject.protocol;
	return { domain, region, path, protocol };
}

async function signedFetch(url, opts, creds = {}) {
	// I need to get domain, region and path
	const { domain, region, path, protocol } = await getSignableData(url);
	opts.hostname = domain;
	opts.headers.host = domain;
	opts.headers['Content-Type'] = 'application/json';
	opts.path = path;

	// Create the HTTP request
	const request = new HttpRequest(opts);

	// Sign the request
	const signer = new SignatureV4({
		credentials: async () => creds,
		region: region,
		service: 'es',
		sha256: Sha256
	});

	const signedRequest = await signer.sign(request);
	opts.headers = signedRequest.headers;
	// Try to use a global fetch here if possible otherwise risk getting a handle
	// on the wrong fetch reference (ie. not a mocked one if in a unit test)
	return (global.fetch || nodeFetch)(`${protocol}//${domain}${path}`, opts);
}
