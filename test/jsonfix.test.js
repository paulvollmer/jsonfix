'use strict';

const assert = require('assert');
let JSONFix = require('../src/jsonfix');
let jsonlint = require('jsonlint');

describe('JSONFix', () => {
  describe('empty data', () => {
    it('data:', () => {
      let jsonfix = new JSONFix(jsonlint);
      let fixed = jsonfix.process('');
      assert.deepEqual(fixed.result, {});
      assert.equal(fixed.isValid, false);
      assert.equal(fixed.wasFixed, true);
    });
  });

  describe('valid data', () => {
    const testData = '{"hello": "world"}';
    it(`data: ${testData}`, () => {
      let jsonfix = new JSONFix(jsonlint);
      let fixed = jsonfix.process(testData);
      assert.deepEqual(fixed.result, {'hello': 'world'});
      assert.equal(fixed.isValid, true);
      assert.equal(fixed.wasFixed, false);
      assert.equal(fixed.totalTries, 0);
    });
  });

  describe('broken data', () => {
    describe('with error got "EOF"', () => {
      const testData1 = '{';
      it(`data: ${testData1}`, () => {
        let jsonfix = new JSONFix(jsonlint);
        let fixed = jsonfix.process(testData1);
        assert.deepEqual(fixed.result, {});
        assert.equal(fixed.isValid, false);
        assert.equal(fixed.wasFixed, true);
      });

      const testData2 = '{"hello": "world"';
      it(`data: ${testData2}`, () => {
        let jsonfix = new JSONFix(jsonlint);
        let fixed = jsonfix.process(testData2);
        assert.deepEqual(fixed.result, {hello: 'world'});
        assert.equal(fixed.isValid, false);
        assert.equal(fixed.wasFixed, true);
      });

      const testData3 = '[';
      it(`data: ${testData3}`, () => {
        let jsonfix = new JSONFix(jsonlint);
        let fixed = jsonfix.process(testData3);
        assert.deepEqual(fixed.result, []);
        assert.equal(fixed.isValid, false);
        assert.equal(fixed.wasFixed, true);
      });

      const testData4 = '[0, 1, 2';
      it(`data: ${testData4}`, () => {
        let jsonfix = new JSONFix(jsonlint);
        let fixed = jsonfix.process(testData4);
        assert.deepEqual(fixed.result, [0, 1, 2]);
        assert.equal(fixed.isValid, false);
        assert.equal(fixed.wasFixed, true);
      });
    });

    describe.skip('missing doublequote at the end', () => {
      const testData = '{"foo": "bar}';
      it(`data: ${testData}`, () => {
        let jsonfix = new JSONFix(jsonlint);
        let fixed = jsonfix.process(testData);
        assert.deepEqual(fixed.result, {foo: 'bar'});
        assert.equal(fixed.isValid, false);
        assert.equal(fixed.wasFixed, true);
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
        let jsonfix = new JSONFix(jsonlint);
        let fixed = jsonfix.process(testData1);
        assert.deepEqual(fixed.result, {hello: 'world'});
        assert.equal(fixed.isValid, false);
        assert.equal(fixed.wasFixed, true);
      });

      const testData2 = '{\n"hello" "world",\n"foo" "bar"\n}';
      it(`data: ${testData2}`, () => {
        let jsonfix = new JSONFix(jsonlint);
        let fixed = jsonfix.process(testData2);
        assert.deepEqual(fixed.result, {hello: 'world', foo: 'bar'});
        assert.equal(fixed.isValid, false);
        assert.equal(fixed.wasFixed, true);
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
