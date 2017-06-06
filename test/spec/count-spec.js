const chai = require('chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

chai.should();

const count = require('../../lib/count');

describe('Count', () => {
	const signedAwsEsFetchStub = sinon.stub()
		.resolves({
			ok: true,
			json: () => Promise.resolve({
				count: 2649
			})
		});

	afterEach(() => {
		signedAwsEsFetchStub.resetHistory();
	})

	it('should exist', () => {
		count.should.be.defined;
	})

	it('should call the correct endpoint', () => {
		count(undefined, undefined, { signedAwsEsFetch: signedAwsEsFetchStub });
		const [url] = signedAwsEsFetchStub.lastCall.args;
		url.should.equal('https://next-elastic.ft.com/content/item/_count');
	})

	it('should send a POST request', () => {
		count(undefined, undefined, { signedAwsEsFetch: signedAwsEsFetchStub });
		const [, { method }] = signedAwsEsFetchStub.lastCall.args;
		method.should.equal('POST');
	})

	it('should set a default timeout of 3000', () => {
		count(undefined, undefined, { signedAwsEsFetch: signedAwsEsFetchStub });
		const [, { timeout }] = signedAwsEsFetchStub.lastCall.args;
		timeout.should.equal(3000);
	})

	it('should be able to set the timeout', () => {
		count(undefined, 1000, { signedAwsEsFetch: signedAwsEsFetchStub });
		const [, { timeout }] = signedAwsEsFetchStub.lastCall.args;
		timeout.should.equal(1000);
	})

	it('should set the Content-Type to `application/json`', () => {
		count(undefined, undefined, { signedAwsEsFetch: signedAwsEsFetchStub });
		const [, { headers }] = signedAwsEsFetchStub.lastCall.args;
		headers.should.eql({
			'Content-Type': 'application/json'
		});
	})

	it('should send a default query which matches everything', () => {
		count(undefined, undefined, { signedAwsEsFetch: signedAwsEsFetchStub });
		const [, { body }] = signedAwsEsFetchStub.lastCall.args;
		body.should.eql(JSON.stringify({
			query: { match_all: {} }
		}));
	})

	it('should be able to set the query', () => {
		const query = {
			term: {
				'metadata.idV1': 'Ng==-U2VjdGlvbnM='
			}
		};
		count(query, undefined, { signedAwsEsFetch: signedAwsEsFetchStub });
		const [, { body }] = signedAwsEsFetchStub.lastCall.args;
		body.should.eql(JSON.stringify({ query }));
	})

	it('should be able to set the query and the timeout', () => {
		const query = {
			term: {
				'metadata.idV1': 'Ng==-U2VjdGlvbnM='
			}
		};
		count(query, 1000, { signedAwsEsFetch: signedAwsEsFetchStub });
		const [, { body, timeout }] = signedAwsEsFetchStub.lastCall.args;
		body.should.eql(JSON.stringify({ query }));
		timeout.should.equal(1000);
	})

	it('should handle the data correctly', () => {
		return count(undefined, undefined, { signedAwsEsFetch: signedAwsEsFetchStub })
			.then(actualCount => actualCount.should.equal(2649));
	})

	it('should use required signedAwsEsFetch, if no dependecy given', () => {
		const count = proxyquire('../../lib/count', {
			'signed-aws-es-fetch': signedAwsEsFetchStub
		});

		return count()
			.then(() => {
				signedAwsEsFetchStub.should.have.been.called;
			});
	})
});
