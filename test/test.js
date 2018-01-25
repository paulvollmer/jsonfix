'use strict';

const assert = require('assert');
let JSONFix = require('../jsonfix');

describe('JSONFix', function() {
  describe('empty data', function() {
    it('data:', function() {
      let result = JSONFix.process('');
      assert.deepEqual(result, {});
      assert.equal(JSONFix.isValid, false);
      assert.equal(JSONFix.wasFixed, true);
    });
  });

  describe('valid data', function() {
    const testData = '{"hello": "world"}';
    it(`data: ${testData}`, function() {
      let result = JSONFix.process(testData);
      assert.deepEqual(result, {'hello': 'world'});
      assert.equal(JSONFix.isValid, true);
      assert.equal(JSONFix.wasFixed, false);
      assert.equal(JSONFix.stats.totalTries, 0);
    });
  });

  describe('broken data', function() {
    describe('with error got "EOF"', function() {
      const testData1 = '{';
      it(`data: ${testData1}`, function() {
        let result = JSONFix.process(testData1);
        assert.deepEqual(result, {});
        assert.equal(JSONFix.isValid, false);
        assert.equal(JSONFix.wasFixed, true);
      });

      const testData2 = '{"hello": "world"';
      it(`data: ${testData2}`, function() {
        let result = JSONFix.process(testData2);
        assert.deepEqual(result, {hello: 'world'});
        assert.equal(JSONFix.isValid, false);
        assert.equal(JSONFix.wasFixed, true);
      });

      const testData3 = '[';
      it(`data: ${testData3}`, function() {
        let result = JSONFix.process(testData3);
        assert.deepEqual(result, []);
        assert.equal(JSONFix.isValid, false);
        assert.equal(JSONFix.wasFixed, true);
      });

      const testData4 = '[0, 1, 2';
      it(`data: ${testData4}`, function() {
        let result = JSONFix.process(testData4);
        assert.deepEqual(result, [0, 1, 2]);
        assert.equal(JSONFix.isValid, false);
        assert.equal(JSONFix.wasFixed, true);
      });
    });

    // describe('missing colon', function() {
    //   it('double colon', function() {
    //     let result = JSONFix.process('{"foo":: "bar"}');
    //     assert.deepEqual(result, {foo: 'bar'});
    //     assert.equal(JSONFix.wasFixed, true);
    //   });
    // });

    // describe('missing doublequote at the end', function() {
    //   const testData = '{"foo": "bar}'
    //   it(`data: ${testData}`, function() {
    //     let result = JSONFix.process(testData);
    //     assert.deepEqual(result, {foo: 'bar'});
    //     assert.equal(JSONFix.isValid, false);
    //     assert.equal(JSONFix.wasFixed, true);
    //   });
    // });

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

    describe('with error got "STRING"', function() {
      const testData1 ='{"hello" "world"}';
      it(`data: ${testData1}`, function() {
        let result = JSONFix.process(testData1);
        assert.deepEqual(result, {hello: 'world'});
        assert.equal(JSONFix.isValid, false);
        assert.equal(JSONFix.wasFixed, true);
      });

      const testData2 = '{\n"hello" "world",\n"foo" "bar"\n}';
      it(`data: ${testData2}`, function() {
        let result = JSONFix.process(testData2);
        assert.deepEqual(result, {hello: 'world', foo: 'bar'});
        assert.equal(JSONFix.isValid, false);
        assert.equal(JSONFix.wasFixed, true);
      });
    });

    // describe('NUMBER', function() {
    //   it('testing data with error got "NUMBER"', function() {
    //     var result = JSONFix.process('[0 1');
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
  //     var result = jsonlintErrorParser(errorMessage);
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
});
