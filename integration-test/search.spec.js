const search = require('../lib/search');
const { expect } = require('chai');

describe('search', () => {
	it('for 10 articles by default', async () => {
		const result = await search();
		expect(result.length).equal(10);
		expect(result.total).equal(10000);
		expect(result[0].type).equal('article');
	});
});
