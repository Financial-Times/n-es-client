const { expect } = require('chai');
const nock = require('nock');

const subject = require('../../lib/count');
const fixture = require('../fixtures/count.json');

describe('Count', () => {
	afterEach(() => {
		nock.isDone();
		nock.cleanAll();
	});

	context('With options', () => {
		it('accepts a query', () => {
			const query = {
				term: {
					'metadata.idV1': 'Ng==-U2VjdGlvbnM='
				}
			};

			nock('https://next-elastic.glb.ft.com')
				.post('/content/item/_count', (body) => {
					return body.query.term['metadata.idV1'] === 'Ng==-U2VjdGlvbnM=';
				})
				.reply(200, fixture);

			return subject({ query });
		});
	});

	context('Response - success', () => {
		beforeEach(() => {
			nock('https://next-elastic.glb.ft.com')
				.post('/content/item/_count')
				.reply(200, fixture);
		});

		it('returns a number', () => (
			subject().then((result) => {
				expect(result).to.be.a('number');
				expect(result).to.equal(fixture.count);
			})
		));
	});

	context('Response - error', () => {
		beforeEach(() => {
			nock('https://next-elastic.glb.ft.com')
				.post('/content/item/_count')
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
