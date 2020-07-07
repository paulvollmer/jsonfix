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
      assert.equal(fixed.totalTries, 1);
      assert.equal(fixed.message, 'empty source detected...');
      assert.deepEqual(fixed.errorList, []);
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
      assert.equal(fixed.message, 'JSON is valid!');
      assert.deepEqual(fixed.errorList, []);
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
        assert.equal(fixed.totalTries, 2);
        assert.equal(fixed.message, 'input was successfully fixed!');
        // assert.deepEqual(fixed.errorList, []);
        // console.log(fixed);
      });

      const testData2 = '{"hello": "world"';
      it(`data: ${testData2}`, () => {
        let jsonfix = new JSONFix(jsonlint);
        let fixed = jsonfix.process(testData2);
        assert.deepEqual(fixed.result, {hello: 'world'});
        assert.equal(fixed.isValid, false);
        assert.equal(fixed.wasFixed, true);
        assert.equal(fixed.totalTries, 2);
        assert.equal(fixed.message, 'input was successfully fixed!');
      });

      const testData3 = '[';
      it(`data: ${testData3}`, () => {
        let jsonfix = new JSONFix(jsonlint);
        let fixed = jsonfix.process(testData3);
        assert.deepEqual(fixed.result, []);
        assert.equal(fixed.isValid, false);
        assert.equal(fixed.wasFixed, true);
        assert.equal(fixed.totalTries, 2);
        assert.equal(fixed.message, 'input was successfully fixed!');
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
      const testData = [
        // error STRING
        {
          input: '{"hello" "world"}',
          expected: {hello: 'world'},
        },
        {
          input: '{"hello" "world", "foo" "bar"}',
          expected: {hello: 'world', foo: 'bar'},
        },
        {
          input: '{\n"hello" "world",\n"foo" "bar"\n}',
          expected: {hello: 'world', foo: 'bar'},
        },

        // error }
        {
          input: '{"a": [123 }',
          expected: {a: [123]},
        },
        {
          input: '{"a": [123, 456 }',
          expected: {a: [123, 456]},
        },
        // {
        //   input: '{"a": [123, 456 "b": [7, 8 }',
        //   expected: {a: [123, 456], b: [7, 8]},
        // },

        // error NUMBER
        // {
        //   input: '[0 1]',
        //   expected: [0, 1],
        // },
        // {
        //   input: '[0 1',
        //   expected: [0, 1],
        // },
        // {
        //   input: '[0, 1, 2 3, 4]',
        //   expected: [0, 1, 2, 3, 4],
        // }
      ];
      for (let i = 0; i < testData.length; i++) {
        const data = testData[i];
        it(`data: ${data.input}`, () => {
          let jsonfix = new JSONFix(jsonlint);
          let fixed = jsonfix.process(data.input);
          assert.deepEqual(fixed.result, data.expected);
          assert.equal(fixed.isValid, false);
          assert.equal(fixed.wasFixed, true);
          // console.log(fixed);
        });
      }
    });
  });
});
