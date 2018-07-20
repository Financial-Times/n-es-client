const chai = require("chai");
const proxyquire = require("proxyquire");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");

chai.should();
chai.use(sinonChai);

const fetchStub = sinon.stub();
let handleResponseFake;

const proxy = {
	"./helpers/handle-response": () => handleResponseFake,
	"signed-aws-es-fetch": fetchStub,
	"@noCallThru": true
};

const subject = proxyquire("../../", {
	"./lib/search": proxyquire("../../lib/search", proxy),
	"./lib/count": proxyquire("../../lib/count", proxy),
	"./lib/mget": proxyquire("../../lib/mget", proxy),
	"./lib/get": proxyquire("../../lib/get", proxy),
	"./lib/mapping": proxyquire("../../lib/mapping", proxy)
	// './lib/tag': proxyquire('../../lib/tag', proxy),
	// './lib/concept': proxyquire('../../lib/concept', proxy),
});

describe("constructor with auth", () => {
	afterEach(() => {
		fetchStub.reset();
		handleResponseFake = null;
	});

	context("count — with constructor", () => {
		it("passes credentials to n-es-fetch", async () => {
			handleResponseFake = Promise.resolve(true);
			fetchStub.returns(Promise.resolve(true));

			await subject({
				auth: "test-credentials"
			}).count("test");

			fetchStub.should.have.been.calledWith(
				sinon.match.defined,
				sinon.match.defined,
				"test-credentials"
			);
		});
	});

	context("get — with constructor", () => {
		it("passes credentials to n-es-fetch", async () => {
			fetchStub.returns(Promise.resolve(true));
			handleResponseFake = Promise.resolve(true);

			await subject({
				auth: "test-credentials"
			}).get("test");

			fetchStub.should.have.been.calledWith(
				sinon.match.defined,
				sinon.match.defined,
				"test-credentials"
			);
		});
	});

	context("mget — with constructor", () => {
		it("passes credentials to n-es-fetch", async () => {
			fetchStub.returns(Promise.resolve(true));
			handleResponseFake = {
				docs: []
			};

			await subject({
				auth: "test-credentials"
			}).mget("test");

			fetchStub.should.have.been.calledWith(
				sinon.match.defined,
				sinon.match.defined,
				"test-credentials"
			);
		});
	});

	context("search — with constructor", () => {
		it("passes credentials to n-es-fetch", async () => {
			fetchStub.returns(Promise.resolve(true));
			handleResponseFake = {
				hits: {
					hits: [],
					total: 0,
				}
			};

			await subject({
				auth: "test-credentials"
			}).search("test");

			fetchStub.should.have.been.calledWith(
				sinon.match.defined,
				sinon.match.defined,
				"test-credentials"
			);
		});
	});

	context("mapping — with constructor", () => {
		it("passes credentials to n-es-fetch", async () => {
			fetchStub.returns(Promise.resolve(true));

			await subject({
				auth: "test-credentials"
			}).mapping("test");

			fetchStub.should.have.been.calledWith(
				sinon.match.defined,
				sinon.match.defined,
				"test-credentials"
			);
		});
	});

	// context('concept — with constructor', () => {
	// 	it('passes credentials to n-es-fetch', async () => {
	// 		await subject({
	// 			auth: 'test-credentials',
	// 		}).concept('test');
	//
	// 		fetchStub.should.have.been.calledWith('test-credentials');
	// 	});
	// });
	//
	// context('tag — with constructor', () => {
	// 	it('passes credentials to n-es-fetch', async () => {
	// 		await subject({
	// 			auth: 'test-credentials',
	// 		}).tag('test');
	//
	// 		fetchStub.should.have.been.calledWith('test-credentials');
	// 	});
	// });
});
