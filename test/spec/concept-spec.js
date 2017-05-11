const { expect } = require('chai');
const nock = require('nock');

const subject = require('../../lib/concept');

const fixtureFound = require('../fixtures/concept-found.json');
const fixtureNotFound = require('../fixtures/concept-not-found.json');

describe('Concept', () => {
	afterEach(() => {
		nock.isDone();
		nock.cleanAll();
	});

	context('Response - found', () => {
		const id = '73cc33b5-d0cb-3815-8347-bc49e1ddbd5c';

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

		it('finds the requested concept', () => (
			subject(id).then((result) => {
				expect(result.id).to.equal(id);
			})
		));

		it('plucks out the necessary keys', () => (
			subject(id).then((result) => {
				expect(result).to.include.keys('id', 'prefLabel', 'apiUrl', 'attributes', 'url', 'types', 'type', 'directType');
				expect(result).to.not.include.keys('predicate');
			})
		));
	});

	context('Response - not found', () => {
		const id = '73cc33b5-d0cb-3815-8347-bg24c232324c';

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
