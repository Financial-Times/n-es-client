const { expect } = require('chai');
const nock = require('nock');

const subject = require('../../lib/get');

const fixture = require('../fixtures/get-found.json');

describe('Get', () => {
	afterEach(() => {
		nock.isDone();
		nock.cleanAll();
	});

	context('With options', () => {
		it('accepts a source parameter', () => {
			const source = 'id,title';

			const req = nock('https://next-elastic.ft.com')
				.get(`/content/item/${fixture.id}/_source`)
				.query((params) => {
					return params._source === source;
				})
				.reply(200, fixture);

			return subject(fixture.id, { _source: source });
		});
	});

	context('Response - found', () => {
		beforeEach(() => {
			nock('https://next-elastic.ft.com')
				.get(`/content/item/${fixture.id}/_source`)
				.query(true)
				.reply(200, fixture);
		});

		it('returns an object', () => (
			subject(fixture.id).then((result) => {
				expect(result).to.be.an('object');
			})
		));
	});

	context('Response - not found', () => {
		beforeEach(() => {
			nock('https://next-elastic.ft.com')
				.get(`/content/item/${fixture.id}/_source`)
				.query(true)
				.reply(404);
		});

		it('throws an HTTP error', () => (
			subject(fixture.id)
				.then((result) => {
					expect(result).to.equal('This should never run');
				})
				.catch((error) => {
					expect(error).to.be.an('error');
					expect(error.name).to.equal('NotFoundError');
				})
		));
	});
});
