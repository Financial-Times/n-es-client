module.exports = {
	files: {
		allow: [
			'.husky/pre-commit',
			'.husky/pre-push'
		],
		allowOverrides: []
	},
	strings: {
		deny: [],
		denyOverrides: [
			'cce58e8e\\x2d158c\\x2d11e7\\x2d80f4\\x2d13e067d5072c', // README.md:10|43|54|59|103
			'0615fc8c\\x2d1558\\x2d11e7\\x2d80f4\\x2d13e067d5072c', // README.md:60|104
			'dbb0bdae\\x2d1f0c\\x2d11e4\\x2db0cb\\x2db2227cce2b54', // README.md:75|90
			'26b07d2a\\x2d3715\\x2d11e3\\x2d9603\\x2d00144feab7de', // test/fixtures/concept-found.json:20
			'80871faa\\x2dd16f\\x2d4c9f\\x2db310\\x2ddf42104dcecc', // test/fixtures/concept-found.json:33|38|40|41, test/spec/concept-spec.js:16
			'f90747af\\x2d9632\\x2d4bd3\\x2d9082\\x2d1454e58dd86f', // test/fixtures/concept-found.json:50|54|56|57
			'5216ff2e\\x2da6ed\\x2d42b2\\x2da613\\x2d109fc6491ba2', // test/fixtures/concept-found.json:66|70
			'c47f4dfc\\x2d6879\\x2d4e95\\x2daccf\\x2dca8cbe6a1f69', // test/fixtures/concept-found.json:82|86
			'5f93fe95\\x2df487\\x2d4aba\\x2dabce\\x2d39e7d783047d', // test/fixtures/concept-found.json:98|102
			'97133bf5\\x2dc958\\x2d4c69\\x2d9e0e\\x2d44874679cedc', // test/fixtures/concept-found.json:114|118
			'f95dd6f8\\x2d9ab9\\x2d407f\\x2db8b3\\x2d9239815216b5', // test/fixtures/concept-found.json:130|134
			'9d13b836\\x2ddf76\\x2d4445\\x2db599\\x2d10ae378680f0', // test/fixtures/concept-found.json:146|150
			'6bade25b\\x2d56b3\\x2d4409\\x2d8d32\\x2dc131666d9acb', // test/fixtures/concept-found.json:162|166
			'a579350c\\x2d61ce\\x2d4c00\\x2d97ca\\x2dddaa2e0cacf6', // test/fixtures/concept-found.json:179|183|185|186
			'01dcc40b\\x2d8099\\x2d35f2\\x2dadbf\\x2d637c9b7b160b', // test/fixtures/concept-found.json:195|199|201|202
			'0236bde5\\x2d98d7\\x2d3dd6\\x2d8819\\x2de0bc25124595', // test/fixtures/concept-found.json:211|215|217|218
			'67fb70ae\\x2db970\\x2d4bd1\\x2d92ea\\x2d761618ae8cb7', // test/fixtures/concept-found.json:227|231
			'af1f01be\\x2d1564\\x2d11e7\\x2db0c1\\x2d37e417ee6c76', // test/fixtures/get-found.json:2|5, test/fixtures/search-with-results.json:20|23|26
			'ff1f01be\\x2d1564\\x2d11e7\\x2db0c1\\x2d37e417ee6c76', // test/fixtures/mget-no-results.json:6|12|18|24
			'9ef3a1c5\\x2d328c\\x2d460d\\x2d9261\\x2d33ea991cae62', // test/fixtures/mget-with-results.json:6|12|15
			'02ecd3cc\\x2d40ee\\x2d4712\\x2dae9a\\x2dd9b41427d6e9', // test/fixtures/mget-with-results.json:21|27|30
			'f5c8f565\\x2d3463\\x2d4a18\\x2db64b\\x2d24075d83ad57', // test/fixtures/mget-with-results.json:36|42|45
			'e1a526ba\\x2df1c8\\x2d45df\\x2d88f1\\x2d9aa32fa4af3e', // test/fixtures/mget-with-results.json:51|57|60
			'30364c64\\x2df150\\x2d11dc\\x2da91a\\x2d0000779fd2ac', // test/fixtures/msearch-with-results.json:23
			'f3ab96be\\x2db72e\\x2d11e7\\x2d8c12\\x2d5661783e5589', // test/fixtures/msearch-with-results.json:32
			'ab0cf1fa\\x2d4fbe\\x2d11e7\\x2da1f2\\x2ddb19572361bb', // test/fixtures/msearch-with-results.json:61
			'3ace6a68\\x2defa9\\x2d11d9\\x2dbd3b\\x2d00000e2511c8', // test/fixtures/msearch-with-results.json:70
			'803d0c6e\\x2d153d\\x2d11e7\\x2db0c1\\x2d37e417ee6c76', // test/fixtures/search-with-results.json:35|38|41
			'2690a2d8\\x2d148f\\x2d11e7\\x2d80f4\\x2d13e067d5072c', // test/fixtures/search-with-results.json:50|53|56
			'6b032668\\x2d155f\\x2d11e7\\x2d80f4\\x2d13e067d5072c', // test/fixtures/search-with-results.json:65|68|71
			'64e70fac\\x2d155e\\x2d11e7\\x2db0c1\\x2d37e417ee6c76', // test/fixtures/search-with-results.json:80|83|86
			'2331a33d\\x2dc5db\\x2d3a50\\x2da549\\x2d8746f3067f0f', // test/fixtures/search-with-results.json:95|98|101
			'c3f81a26\\x2d155f\\x2d11e7\\x2d80f4\\x2d13e067d5072c', // test/fixtures/search-with-results.json:110|113|116
			'88f5d2a6\\x2d155a\\x2d11e7\\x2db0c1\\x2d37e417ee6c76', // test/fixtures/search-with-results.json:125|128|131
			'aa8fbace\\x2d14c6\\x2d11e7\\x2d80f4\\x2d13e067d5072c', // test/fixtures/search-with-results.json:140|143|146
			'201cf2f0\\x2d153c\\x2d11e7\\x2db0c1\\x2d37e417ee6c76', // test/fixtures/search-with-results.json:155|158|161
			'73cc33b5\\x2dd0cb\\x2d3815\\x2d8347\\x2dbg24c232324c' // test/spec/concept-spec.js:51
		]
	}
};
