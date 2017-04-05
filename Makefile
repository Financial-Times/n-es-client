include n.Makefile

unit-test:
	export NODE_ENV=test; \
	export AWS_SIGNED_FETCH_DISABLE_DNS_RESOLUTION=true; \
	mocha 'test/spec/**/*-spec.js'

unit-test-coverage:
	nyc --reporter=$(if $(CIRCLECI),lcovonly,lcov) make unit-test

test:
	make verify

ifeq ($(CIRCLECI),true)
	make unit-test-coverage && cat ./coverage/lcov.info | ./node_modules/.bin/coveralls
else
	make unit-test
endif

install-hooks:
	cp -rf git-hooks/ .git/hooks/
