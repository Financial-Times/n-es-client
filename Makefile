include n.Makefile

unit-test:
	export NODE_ENV=test; \
	export AWS_SIGNED_FETCH_DISABLE_DNS_RESOLUTION=true; \
	mocha 'test/spec/**/*-spec.js'

test:
	make verify
