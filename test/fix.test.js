'use strict';

const assert = require('assert');
const fix = require('../src/fix');

describe('missingColon', () => {
  const testData = [
    {
      input: '',
      expected: '',
    },
    {
      input: '"hello"',
      expected: '"hello":',
    },
    {
      input: '"hello" "world"',
      expected: '"hello": "world"',
    },
    {
      input: '"hello""world"',
      expected: '"hello":"world"',
    },
  ];
  for (let i = 0; i < testData.length; i++) {
    const data = testData[i];
    describe(`data: ${data.input}`, () => {
      it(`should equal to ${data.expected}`, () => {
        let result = fix.missingColon(data.input);
        assert.equal(result, data.expected);
      });
    });
  }
});

describe('missingComma', () => {
  const testData = [
    {
      input: '',
      expected: '',
    },
    {
      input: '123',
      expected: '123,',
    },
  ];
  for (let i = 0; i < testData.length; i++) {
    const data = testData[i];
    describe(`data: ${data.input}`, () => {
      it(`should equal to ${data.expected}`, () => {
        let result = fix.missingComma(data.input);
        assert.equal(result, data.expected);
      });
    });
  }
});
