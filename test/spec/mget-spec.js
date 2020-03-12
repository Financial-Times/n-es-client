const { expect } = require('chai');
const nock = require('nock');

const subject = require('../../lib/mget');

const fixtureWithResults = require('../fixtures/mget-with-results.json');
const fixtureNoResults = require('../fixtures/mget-no-results.json');

describe('Multi get', () => {
	afterEach(() => {
		nock.isDone();
		nock.cleanAll();
	});

	context('With options', () => {
		it('accepts an IDs parameter', () => {
			const ids = [123, 456, 789];

			nock('https://next-elasticsearch.nlb.ft.com')
				.post('/content/item/_mget', (body) => {
					return body.ids.every((id, i) => id === ids[i]);
				})
				.reply(200, fixtureWithResults);

			return subject({ ids });
		});

		it('accepts a source parameter', () => {
			const source = 'id,title';

			nock('https://next-elasticsearch.nlb.ft.com')
				.post('/content/item/_mget', (body) => {
					return body._source === source;
				})
				.reply(200, fixtureWithResults);

			return subject({ _source: source });
		});
	});

	context('Response - with results', () => {
		beforeEach(() => {
			nock('https://next-elasticsearch.nlb.ft.com')
				.post('/content/item/_mget')
				.reply(200, fixtureWithResults);
		});

		it('returns an array', () => (
			subject().then((result) => {
				expect(result).to.be.an('array');
				expect(result.length).to.equal(fixtureWithResults.docs.length);
			})
		));

		it('returns the document source', () => (
			subject().then((result) => {
				result.forEach((doc) => {
					expect(doc).to.include.keys('id', 'title');
				});
			})
		));
	});

	context('Response - no results', () => {
		beforeEach(() => {
			nock('https://next-elasticsearch.nlb.ft.com')
				.post('/content/item/_mget')
				.reply(200, fixtureNoResults);
		});

		it('returns an array', () => (
			subject().then((result) => {
				expect(result).to.be.an('array');
			})
		));

		it('filters out not found documents', () => {
			subject().then((result) => {
				expect(result.length).to.equal(0);
			});
		});
	});

	context('Response - error', () => {
		beforeEach(() => {
			nock('https://next-elasticsearch.nlb.ft.com')
				.post('/content/item/_mget')
				.reply(500);
		});

		it('throws an HTTP error', () => (
			subject()
				.then((result) => {
					expect(result).to.equal('This should never run');
				})
				.catch((error) => {
					expect(error).to.be.an('error');
					expect(error.name).to.equal('InternalServerError');
				})
		));
	});
});
