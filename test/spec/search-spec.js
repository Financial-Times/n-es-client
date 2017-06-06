const { expect } = require('chai');
const nock = require('nock');

const subject = require('../../lib/search');

const fixtureWithResults = require('../fixtures/search-with-results.json');
const fixtureNoResults = require('../fixtures/search-no-results.json');
const fixtureError = require('../fixtures/search-error.json');

describe('Search', () => {
	afterEach(() => {
		nock.isDone();
		nock.cleanAll();
	});

	context('With options', () => {
		it('accepts pagination parameters', () => {
			const from = 10;
			const size = 20;

			nock('https://next-elastic.ft.com')
				.post('/content/item/_search', (body) => {
					return body.from === from && body.size === size;
				})
				.reply(200, fixtureWithResults);

			return subject({ from, size });
		});

		it('accepts a source parameter', () => {
			const source = 'id,title';

			nock('https://next-elastic.ft.com')
				.post('/content/item/_search', (body) => {
					return body._source === source;
				})
				.reply(200, fixtureWithResults);

			return subject({ _source: source });
		});
	});

	context('Response - with results', () => {
		beforeEach(() => {
			nock('https://next-elastic.ft.com')
				.post('/content/item/_search')
				.reply(200, fixtureWithResults);
		});

		it('returns an array', () => (
			subject().then((result) => {
				expect(result).to.be.an('array');
				expect(result.length).to.equal(fixtureWithResults.hits.hits.length);
			})
		));

		it('returns the total', () => (
			subject().then((result) => {
				expect(result.total).to.equal(fixtureWithResults.hits.total);
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
			nock('https://next-elastic.ft.com')
				.post('/content/item/_search')
				.reply(200, fixtureNoResults);
		});

		it('returns an array', () => (
			subject().then((result) => {
				expect(result).to.be.an('array');
			})
		));

		it('appends the total', () => (
			subject().then((result) => {
				expect(result.total).to.equal(0);
			})
		));
	});

	context('Response - error', () => {
		beforeEach(() => {
			nock('https://next-elastic.ft.com')
				.post('/content/item/_search')
				.reply(400, fixtureError);
		});

		it('throws an HTTP error', () => (
			subject()
				.then((result) => {
					expect(result).to.equal('This should never run');
				})
				.catch((error) => {
					expect(error).to.be.an('error');
					expect(error.name).to.equal('BadRequestError');
				})
		));
	});
});
