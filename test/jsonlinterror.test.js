'use strict';

const assert = require('assert');
const JsonLintError = require('../src/jsonlinterrorparser');

const testerror = `Error: Parse error on line 1:
{
-^
Expecting 'STRING', '}', got 'EOF'`;

describe('JsonLintError', () => {
  it('should return the error as object:', () => {
    let result = new JsonLintError().parse(testerror);
    // console.log(result);
    assert.equal(result.description, 'Error: Parse error');
    assert.equal(result.line, '1');
    assert.equal(result.code, '{');
    assert.equal(result.expecting, '\'STRING\', \'}\'');
    assert.equal(result.got, 'EOF\'');
  });
});
