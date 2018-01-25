'use strict';

const assert = require('assert');
let JSONFix = require('../jsonfix');

describe('JSONFix', function() {
  describe('empty data', function() {
    it('testing empty data', function() {
      let result = JSONFix.process('');
      assert.deepEqual(result, {});
      assert.equal(JSONFix.isValid, false);
      assert.equal(JSONFix.wasFixed, true);
    });
  });

  describe('valid data', function() {
    it('testing valid data', function() {
      let result = JSONFix.process('{"hello": "world"}');
      assert.deepEqual(result, {'hello': 'world'});
      assert.equal(JSONFix.isValid, true);
      assert.equal(JSONFix.wasFixed, false);
      assert.equal(JSONFix.stats.totalTries, 0);
    });
  });

  describe('testing data with error got "EOF"', function() {
    it('data: {', function() {
      let result = JSONFix.process('{');
      assert.deepEqual(result, {});
    });

    it('data: {"hello": "world"', function() {
      let result = JSONFix.process('{"hello": "world"');
      assert.deepEqual(result, {hello: 'world'});
    });

    it('data: [', function() {
      let result = JSONFix.process('[');
      assert.deepEqual(result, []);
    });

    it('data: [0, 1, 2', function() {
      let result = JSONFix.process('[0, 1, 2');
      assert.deepEqual(result, [0, 1, 2]);
    });
  });

  // describe('testing data with error got "undefined"', function() {
  //   it('data:');
  // });
  //
  // describe('testing data with error got "}"', function() {
  //   it('data:');
  // });
  //
  // describe('testing data with error got ":"', function() {
  //   it('data:');
  // });

  describe('testing data with error got "STRING"', function() {
    it('data: {"hello" "world"}', function() {
      let result = JSONFix.process('{"hello" "world"}');
      assert.deepEqual(result, {hello: 'world'});
    });

    it('data: {\n"hello" "world",\n"foo" "bar"\n}', function() {
      let result = JSONFix.process('{\n"hello" "world",\n"foo" "bar"\n}');
      assert.deepEqual(result, {hello: 'world', foo: 'bar'});
    });
  });

  // describe('NUMBER', function() {
  //   it('testing data with error got "NUMBER"', function() {
  //     let result = JSONFix.process('[0 1');
  //     assert.deepEqual(result, [0, 1]);
  //   });
  // });
});


// describe('jsonlintErrorParser', function() {
//   it('parse an jsonlint error', function() {
//     var errorMessage = "Parse error on line 1: \n\
//   \n\
//   ^\n\
//   Expecting 'STRING', 'NUMBER', 'NULL', 'TRUE', 'FALSE', '{', '[', got 'EOF'";
//     let result = jsonlintErrorParser(errorMessage);
//     var expected = {
//       description: "Parse error",
//       line: "1",
//       code: "",
//       expecting: "'STRING', 'NUMBER', 'NULL', 'TRUE', 'FALSE', '{', '['",
//       got: "EOF'"
//     };
//     assert.deepEqual(result, expected, "Passed!");
//   });
// });
