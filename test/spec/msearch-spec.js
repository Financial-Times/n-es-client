const { expect } = require('chai');
const nock = require('nock');

const subject = require('../../lib/msearch');

const fixtureWithResults = require('../fixtures/msearch-with-results.json');
const fixtureNoResults = require('../fixtures/msearch-no-results.json');
const fixtureError = require('../fixtures/search-error.json');

describe('msearch', () => {
	afterEach(() => {
		nock.isDone();
		nock.cleanAll();
	});

	context('With options', () => {
		it('formats each header and query onto a line', () => {
			nock('https://next-elasticsearch-v7.gslb.ft.com')
				.post('/content/_msearch', (body) => {
					const lines = body.split(/\n/).filter(Boolean).map(JSON.parse);

					expect(lines.length).to.equal(4);

					return true;
				})
				.reply(200, fixtureWithResults);

			return subject([
				{ query: 'foo' },
				{ query: 'bar' }
			]);
		});

		it('sets defaults for each query', () => {
			nock('https://next-elasticsearch-v7.gslb.ft.com')
				.post('/content/_msearch', (body) => {
					const lines = body.split(/\n/).filter(Boolean).map(JSON.parse);

					expect(lines[1]).to.include.keys('query', 'from', 'size', 'sort');
					expect(lines[3]).to.include.keys('query', 'from', 'size', 'sort');

					return true;
				})
				.reply(200, fixtureWithResults);

			return subject([
				{ query: 'foo' },
				{ query: 'bar' }
			]);
		});
	});

	context('Response - with results', () => {
		beforeEach(() => {
			nock('https://next-elasticsearch-v7.gslb.ft.com')
				.post('/content/_msearch')
				.reply(200, fixtureWithResults);
		});

		it('returns an array', () => (
			subject().then((result) => {
				expect(result).to.be.an('array');
				expect(result.length).to.equal(2);
			})
		));

		it('formats each set of results', () => (
			subject().then((result) => {
				result.forEach((item) => {
					expect(item).to.include.keys(['total', 'hits']);
				});
			})
		));

		it('returns the total for each result set', () => (
			subject().then((result) => {
				result.forEach((item, i) => {
					const fixtureResponse = fixtureWithResults.responses[i];
					expect(item.total).to.equal(fixtureResponse.hits.total.value);
				});
			})
		));

		it('returns each document source', () => (
			subject().then((result) => {
				result.forEach((item) => {
					item.hits.forEach((doc) => {
						expect(doc).to.include.keys('title');
					});
				});
			})
		));
	});

	context('Response - no results', () => {
		beforeEach(() => {
			nock('https://next-elasticsearch-v7.gslb.ft.com')
				.post('/content/_msearch')
				.reply(200, fixtureNoResults);
		});

		it('returns an array', () => (
			subject().then((result) => {
				expect(result).to.be.an('array');
			})
		));

		it('formats each set of results', () => (
			subject().then((result) => {
				result.forEach((item) => {
					expect(item).to.deep.equal({ total: 0, hits: [] });
				});
			})
		));
	});

	context('Response - error', () => {
		beforeEach(() => {
			nock('https://next-elasticsearch-v7.gslb.ft.com')
				.post('/content/_msearch')
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
