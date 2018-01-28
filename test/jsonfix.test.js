'use strict';

const assert = require('assert');
let JSONFix = require('../src/jsonfix');

describe('JSONFix', () => {
  describe('empty data', () => {
    it('data:', () => {
      let result = JSONFix.process('');
      assert.deepEqual(result, {});
      assert.equal(JSONFix.isValid, false);
      assert.equal(JSONFix.wasFixed, true);
    });
  });

  describe('valid data', () => {
    const testData = '{"hello": "world"}';
    it(`data: ${testData}`, () => {
      let result = JSONFix.process(testData);
      assert.deepEqual(result, {'hello': 'world'});
      assert.equal(JSONFix.isValid, true);
      assert.equal(JSONFix.wasFixed, false);
      assert.equal(JSONFix.stats.totalTries, 0);
    });
  });

  describe('broken data', () => {
    describe('with error got "EOF"', () => {
      const testData1 = '{';
      it(`data: ${testData1}`, () => {
        let result = JSONFix.process(testData1);
        assert.deepEqual(result, {});
        assert.equal(JSONFix.isValid, false);
        assert.equal(JSONFix.wasFixed, true);
      });

      const testData2 = '{"hello": "world"';
      it(`data: ${testData2}`, () => {
        let result = JSONFix.process(testData2);
        assert.deepEqual(result, {hello: 'world'});
        assert.equal(JSONFix.isValid, false);
        assert.equal(JSONFix.wasFixed, true);
      });

      const testData3 = '[';
      it(`data: ${testData3}`, () => {
        let result = JSONFix.process(testData3);
        assert.deepEqual(result, []);
        assert.equal(JSONFix.isValid, false);
        assert.equal(JSONFix.wasFixed, true);
      });

      const testData4 = '[0, 1, 2';
      it(`data: ${testData4}`, () => {
        let result = JSONFix.process(testData4);
        assert.deepEqual(result, [0, 1, 2]);
        assert.equal(JSONFix.isValid, false);
        assert.equal(JSONFix.wasFixed, true);
      });
    });

    describe('missing doublequote at the end', () => {
      const testData = '{"foo": "bar}'
      it(`data: ${testData}`, () => {
        let result = JSONFix.process(testData);
        assert.deepEqual(result, {foo: 'bar'});
        assert.equal(JSONFix.isValid, false);
        assert.equal(JSONFix.wasFixed, true);
      });
    });

    // describe('testing data with error got "undefined"', () => {
    //   it('data:');
    // });
    //
    // describe('testing data with error got "}"', () => {
    //   it('data:');
    // });
    //
    // describe('testing data with error got ":"', () => {
    //   it('data:');
    // });

    describe('with error got "STRING"', () => {
      const testData1 ='{"hello" "world"}';
      it(`data: ${testData1}`, () => {
        let result = JSONFix.process(testData1);
        assert.deepEqual(result, {hello: 'world'});
        assert.equal(JSONFix.isValid, false);
        assert.equal(JSONFix.wasFixed, true);
      });

      const testData2 = '{\n"hello" "world",\n"foo" "bar"\n}';
      it(`data: ${testData2}`, () => {
        let result = JSONFix.process(testData2);
        assert.deepEqual(result, {hello: 'world', foo: 'bar'});
        assert.equal(JSONFix.isValid, false);
        assert.equal(JSONFix.wasFixed, true);
      });
    });

    // describe('NUMBER', () => {
    //   it('testing data with error got "NUMBER"', () => {
    //     var result = JSONFix.process('[0 1');
    //     assert.deepEqual(result, [0, 1]);
    //   });
    // });
  });

});
