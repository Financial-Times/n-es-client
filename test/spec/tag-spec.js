const { expect } = require('chai');
const nock = require('nock');

const subject = require('../../lib/tag');

const fixtureFound = require('../fixtures/tag-found.json');
const fixtureNotFound = require('../fixtures/tag-not-found.json');

describe('Tag', () => {
	afterEach(() => {
		nock.isDone();
		nock.cleanAll();
	});

	context('Response - found', () => {
		const id = 'NTM=-U2VjdGlvbnM=';

		beforeEach(() => {
			nock('https://next-elastic.ft.com')
				.post('/v3_api_v2/item/_search')
				.reply(200, fixtureFound);
		});

		it('returns an object', () => (
			subject(id).then((result) => {
				expect(result).to.be.an('object');
			})
		));

		it('finds the requested tag', () => {
			subject(id).then((result) => {
				expect(result.idV1).to.equal(id);
			})
		});

		it('plucks out the necessary keys', () => (
			subject(id).then((result) => {
				expect(result).to.include.keys('idV1', 'prefLabel', 'taxonomy', 'attributes', 'url');
				expect(result).to.not.include.keys('primaryTag', 'teaserTag', 'primary');
			})
		));
	});

	context('Response - not found', () => {
		const id = 'No=-Exist=';

		beforeEach(() => {
			nock('https://next-elastic.ft.com')
				.post('/v3_api_v2/item/_search')
				.reply(200, fixtureNotFound);
		});

		it('returns nothing', () => (
			subject(id).then((result) => {
				expect(result).to.be.undefined;
			})
		));
	});

	context('Response - error', () => {
		beforeEach(() => {
			nock('https://next-elastic.ft.com')
				.post('/v3_api_v2/item/_search')
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
