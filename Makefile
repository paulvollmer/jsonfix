BIN = ./node_modules/.bin
LINT_SRC = webpack.config.js cmd/jsonfix src test

all: lint test

lint:
	@$(BIN)/eslint ${LINT_SRC}

lint-fix:
	@$(BIN)/eslint --fix ${LINT_SRC}

test:
	@$(BIN)/mocha test/*.test.js

build:
	@$(BIN)/webpack --progress -p

clean:
	rm -rf build

.PHONY: lint lint-fix test build clean
