const chai = require('chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(sinonChai);

const fetchStub = sinon.stub();
let handleResponseFake;

const proxy = {
	'./helpers/handle-response': () => handleResponseFake,
	'signed-aws-es-fetch': fetchStub,
	'@noCallThru': true
};

const nEsClient = proxyquire('../../', {
	'./lib/search': proxyquire('../../lib/search', proxy),
	'./lib/count': proxyquire('../../lib/count', proxy),
	'./lib/mget': proxyquire('../../lib/mget', proxy),
	'./lib/get': proxyquire('../../lib/get', proxy),
	'./lib/mapping': proxyquire('../../lib/mapping', proxy),
	'./lib/concept': proxyquire('../../lib/concept', {
		'./search': proxyquire('../../lib/search', proxy)
	}),
});

const subject = new nEsClient({
	auth: 'test-credentials'
});

const subjectNoArg = new nEsClient();

describe('constructor with auth', () => {
	afterEach(() => {
		fetchStub.reset();
		handleResponseFake = null;
	});

	context('with arg', () => {
		it('#count', async () => {
			handleResponseFake = Promise.resolve(true);
			fetchStub.returns(Promise.resolve(true));

			await subject.count('test');

			fetchStub.should.have.been.calledWith(
				sinon.match.defined,
				sinon.match.defined,
				'test-credentials'
			);
		});

		it('#get', async () => {
			fetchStub.returns(Promise.resolve(true));
			handleResponseFake = Promise.resolve(true);

			await subject.get('test');

			fetchStub.should.have.been.calledWith(
				sinon.match.defined,
				sinon.match.defined,
				'test-credentials'
			);
		});

		it('#mget', async () => {
			fetchStub.returns(Promise.resolve(true));
			handleResponseFake = {
				docs: []
			};

			await subject.mget('test');

			fetchStub.should.have.been.calledWith(
				sinon.match.defined,
				sinon.match.defined,
				'test-credentials'
			);
		});

		it('#search', async () => {
			fetchStub.returns(Promise.resolve(true));
			handleResponseFake = {
				hits: {
					hits: [],
					total: 0,
				}
			};

			await subject.search('test');

			fetchStub.should.have.been.calledWith(
				sinon.match.defined,
				sinon.match.defined,
				'test-credentials'
			);
		});

		it('#mapping', async () => {
			fetchStub.returns(Promise.resolve(true));

			await subject.mapping('test');

			fetchStub.should.have.been.calledWith(
				sinon.match.defined,
				sinon.match.defined,
				'test-credentials'
			);
		});

		it('#concept', async () => {
			fetchStub.returns(Promise.resolve(true));
			handleResponseFake = {
				hits: {
					hits: [],
					total: 0,
				}
			};

			await subject.concept('test');

			fetchStub.should.have.been.calledWith(
				sinon.match.defined,
				sinon.match.defined,
				'test-credentials'
			);
		});

		it('#tag', async () => {
			chai.expect(subject.tag('test')).to.be.a('promise');
		});
	});

	context('no arg', () => {
		it('#count', async () => {
			handleResponseFake = Promise.resolve(true);
			fetchStub.returns(Promise.resolve(true));

			await subjectNoArg.count('test');

			fetchStub.should.have.been.calledWith(
				sinon.match.defined,
				sinon.match.defined,
				sinon.match.undefined
			);
		});

		it('#get', async () => {
			fetchStub.returns(Promise.resolve(true));
			handleResponseFake = Promise.resolve(true);

			await subjectNoArg.get('test');

			fetchStub.should.have.been.calledWith(
				sinon.match.defined,
				sinon.match.defined,
				sinon.match.undefined
			);
		});

		it('#mget', async () => {
			fetchStub.returns(Promise.resolve(true));
			handleResponseFake = {
				docs: []
			};

			await subjectNoArg.mget('test');

			fetchStub.should.have.been.calledWith(
				sinon.match.defined,
				sinon.match.defined,
				sinon.match.undefined
			);
		});

		it('#search', async () => {
			fetchStub.returns(Promise.resolve(true));
			handleResponseFake = {
				hits: {
					hits: [],
					total: 0,
				}
			};

			await subjectNoArg.search('test');

			fetchStub.should.have.been.calledWith(
				sinon.match.defined,
				sinon.match.defined,
				sinon.match.undefined
			);
		});

		it('#mapping', async () => {
			fetchStub.returns(Promise.resolve(true));

			await subjectNoArg.mapping('test');

			fetchStub.should.have.been.calledWith(
				sinon.match.defined,
				sinon.match.defined,
				sinon.match.undefined
			);
		});

		it('#concept', async () => {
			fetchStub.returns(Promise.resolve(true));
			handleResponseFake = {
				hits: {
					hits: [],
					total: 0,
				}
			};

			await subjectNoArg.concept('test');

			fetchStub.should.have.been.calledWith(
				sinon.match.defined,
				sinon.match.defined,
				sinon.match.undefined
			);
		});

		it('#tag', async () => {
			chai.expect(subject.tag('test')).to.be.a('promise');
		});
	});

	context('all — without using constructor', () => {
		it('works with concept()', async () => {
			fetchStub.returns(Promise.resolve(true));
			handleResponseFake = {
				hits: {
					hits: [],
					total: 0,
				}
			};

			await nEsClient.concept('test');

			fetchStub.should.have.been.calledWith(
				sinon.match.defined,
				sinon.match.defined,
				sinon.match.undefined
			);
		});

		it('works with count()', async () => {
			handleResponseFake = Promise.resolve(true);
			fetchStub.returns(Promise.resolve(true));

			await nEsClient.count('test');

			fetchStub.should.have.been.calledWith(
				sinon.match.defined,
				sinon.match.defined,
				sinon.match.undefined
			);
		});

		it('works with get()', async () => {
			handleResponseFake = Promise.resolve(true);
			fetchStub.returns(Promise.resolve(true));

			await nEsClient.get('test');

			fetchStub.should.have.been.calledWith(
				sinon.match.defined,
				sinon.match.defined,
				sinon.match.undefined
			);
		});

		it('works with mapping()', async () => {
			handleResponseFake = Promise.resolve(true);
			fetchStub.returns(Promise.resolve(true));

			await nEsClient.mapping('test');

			fetchStub.should.have.been.calledWith(
				sinon.match.defined,
				sinon.match.defined,
				sinon.match.undefined
			);
		});

		it('works with mget()', async () => {
			fetchStub.returns(Promise.resolve(true));
			handleResponseFake = {
				docs: []
			};

			await nEsClient.mget('test');

			fetchStub.should.have.been.calledWith(
				sinon.match.defined,
				sinon.match.defined,
				sinon.match.undefined
			);
		});

		it('works with search()', async () => {
			fetchStub.returns(Promise.resolve(true));
			handleResponseFake = {
				hits: {
					hits: [],
					total: 0,
				}
			};

			await nEsClient.search('test');

			fetchStub.should.have.been.calledWith(
				sinon.match.defined,
				sinon.match.defined,
				sinon.match.undefined
			);
		});

		it('works with tag()', async () => {
			handleResponseFake = Promise.resolve(true);
			fetchStub.returns(Promise.resolve(true));

			chai.expect(nEsClient.tag('test')).to.be.a('promise');
		});
	});
});
