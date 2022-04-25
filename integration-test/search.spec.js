const search = require('../lib/search');
const { expect } = require('chai');

describe('search', () => {
	it('for 10 articles by default', async () => {
		const result = await search();
		expect(result.length).equal(10);
		expect(result.total).equal(10000);
		expect(result[0]).to.have.any.keys(
			'id',
			'webUrl',
			'title',
			'alternativeTitles',
			'provenance',
			'byline',
			'publishedDate',
			'firstPublishedDate',
			'publishReference',
			'bodyText',
			'curatedRelatedContent',
			'containedIn',
			'canBeSyndicated',
			'comments',
			'standout',
			'realtime',
			'originatingParty',
			'_lastUpdatedDateTime',
			'_lastUpdatedVersion',
			'type',
			'subtype',
			'accessLevel',
			'url',
			'attachments',
			'relativeUrl',
			'bodyHTML',
			'mainImage',
			'annotations',
			'brandConcept',
			'authorConcepts',
			'design',
			'displayConcept',
			'durationMinutes',
			'teaser'
		);
	});
});
