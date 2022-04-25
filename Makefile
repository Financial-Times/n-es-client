IGNORE_A11Y = true

node_modules/@financial-times/n-gage/index.mk:
	npm install @financial-times/n-gage
	touch $@

-include node_modules/@financial-times/n-gage/index.mk

unit-test:
	export NODE_ENV=test; \
	export AWS_SIGNED_FETCH_DISABLE_DNS_RESOLUTION=true; \
	mocha 'test/spec/**/*-spec.js'

unit-test-coverage:
	nyc --reporter=$(if $(CIRCLECI),lcovonly,lcov) make unit-test

integration:
	export AWS_SIGNED_FETCH_DISABLE_DNS_RESOLUTION=false; \
	mocha 'integration-test/*.spec.js'

test:
	make verify

ifeq ($(CIRCLECI),true)
	make unit-test-coverage && cat ./coverage/lcov.info | ./node_modules/.bin/coveralls; \
	make integration;
else
	make unit-test
endif
