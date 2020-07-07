'use strict';

/**
 * JsonLint error parser and data structure
 */
class JsonLintError {
  /**
   * the error data structure we want to return.
   */
  constructor() {
    this.description = '';
    this.line = '';
    this.code = '';
    this.expecting = '';
    this.got = '';
  }

  /**
   * parse a jsonlint message and return an error object with
   * description, line, code, expecting and got elements
   *
   * @param {String} msg - the output from jsonlint
   * @return {Object}
   */
  parse(msg) {
    const errorLines = msg.split('\n');
    this.description = errorLines[0].split(' on line ')[0];
    this.line = errorLines[0].split('on line ')[1].split(':')[0];
    this.code = errorLines[1];
    this.expecting = errorLines[3].split('Expecting ')[1].split(', got ')[0];
    this.got = errorLines[3].split(', got \'')[1];
    // console.log('------------------------');
    // console.log(this);
    // console.log('------------------------');
    return this;
  }
}

module.exports = JsonLintError;
