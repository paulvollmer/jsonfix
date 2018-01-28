
const assert = require('assert');
const jsonlintErrorParser = require('../src/jsonlinterrorparser');

const testerror = `Error: Parse error on line 1:
{
-^
Expecting 'STRING', '}', got 'EOF'
    at Object.parseError (/Users/paul/code/src/github.com/paulvollmer/jsonfix/node_modules/jsonlint/lib/jsonlint.js:55:11)
    at Object.parse (/Users/paul/code/src/github.com/paulvollmer/jsonfix/node_modules/jsonlint/lib/jsonlint.js:132:22)
    at parse (/Users/paul/code/src/github.com/paulvollmer/jsonfix/node_modules/jsonlint/lib/cli.js:82:14)
    at main (/Users/paul/code/src/github.com/paulvollmer/jsonfix/node_modules/jsonlint/lib/cli.js:135:14)
    at Object.<anonymous> (/Users/paul/code/src/github.com/paulvollmer/jsonfix/node_modules/jsonlint/lib/cli.js:179:1)
    at Module._compile (module.js:660:30)
    at Object.Module._extensions..js (module.js:671:10)
    at Module.load (module.js:573:32)
    at tryModuleLoad (module.js:513:12)
    at Function.Module._load (module.js:505:3)`

describe('jsonlintErrorParser', () => {
  it('should return the error as object:', () => {
    let result = jsonlintErrorParser(testerror);
    // console.log(result);
    assert.equal(result.description, 'Error: Parse error');
    assert.equal(result.line, '1');
    assert.equal(result.code, '{');
    assert.equal(result.expecting, '\'STRING\', \'}\'');
    assert.equal(result.got, 'EOF\'');
  });
});
