include n.Makefile

unit-test:
	export NODE_ENV=test; \
	export AWS_SIGNED_FETCH_DISABLE_DNS_RESOLUTION=true; \
	mocha 'test/spec/**/*-spec.js'

test:
	make verify

coverage:
	istanbul cover node_modules/.bin/_mocha --report lcovonly 'test/**/*.test.js'

ifeq ($(CIRCLE_BRANCH),master)
	make coverage && cat ./coverage/lcov.info | ./node_modules/.bin/coveralls
else
	make unit-test
endif
