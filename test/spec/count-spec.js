const chai = require('chai');
const sinon = require('sinon');

chai.should();

const count = require('../../lib/count');

describe('Count', () => {
	const signedFetchStub = sinon.stub()
		.resolves({
			ok: true,
			json: () => Promise.resolve({
				count: 2649
			})
		});

	afterEach(() => {
		signedFetchStub.resetHistory();
	})

	it('should exist', () => {
		count.should.be.defined;
	})

	it('should call the correct endpoint', () => {
		count(undefined, undefined, { signedFetch: signedFetchStub });
		const [url] = signedFetchStub.lastCall.args;
		url.should.equal('https://next-elastic.ft.com/v3_api_v2/item/_count');
	})

	it('should send a POST request', () => {
		count(undefined, undefined, { signedFetch: signedFetchStub });
		const [, { method }] = signedFetchStub.lastCall.args;
		method.should.equal('POST');
	})

	it('should set a default timeout of 3000', () => {
		count(undefined, undefined, { signedFetch: signedFetchStub });
		const [, { timeout }] = signedFetchStub.lastCall.args;
		timeout.should.equal(3000);
	})

	it('should be able to set the timeout', () => {
		count(undefined, 1000, { signedFetch: signedFetchStub });
		const [, { timeout }] = signedFetchStub.lastCall.args;
		timeout.should.equal(1000);
	})

	it('should set the Content-Type to `application/json`', () => {
		count(undefined, undefined, { signedFetch: signedFetchStub });
		const [, { headers }] = signedFetchStub.lastCall.args;
		headers.should.eql({
			'Content-Type': 'application/json'
		});
	})

	it('should send a default query which matches everything', () => {
		count(undefined, undefined, { signedFetch: signedFetchStub });
		const [, { body }] = signedFetchStub.lastCall.args;
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
		count({ query }, undefined, { signedFetch: signedFetchStub });
		const [, { body }] = signedFetchStub.lastCall.args;
		body.should.eql(JSON.stringify({ query }));
	})

	it('should handle the data correctly', () => {
		return count(undefined, undefined, { signedFetch: signedFetchStub })
			.then(actualCount => actualCount.should.equal(2649));
	})
});
