BIN = ./node_modules/.bin

lint:
	@$(BIN)/eslint .

lint-fix:
	@$(BIN)/eslint --fix .

test:
	@$(BIN)/mocha

.PHONY: lint lint-fix test
