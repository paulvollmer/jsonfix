'use strict';

const jsonlintErrorParser = require('./jsonlinterrorparser');
const fix = require('./fix');

/**
 *
 */
class JSONFix {
  /**
   * @param {Object} jsonlint - the jsonlint dependency
   */
  constructor(jsonlint) {
    this.input = null; // store the input data as string
    this.isValid = null; // if input is valid, set to true
    this.wasFixed = null; // set to true if source was successful fixed
    this.message = null; // a message about the fix process
    this.result = null; // store the fixed json data here
    this.totalTries = 0; // count the number of "JSONFixer" calls
    this.errorList = []; // all found and fixed bugs will be reported here.
    this.jsonlint = jsonlint; // the jsonlint instance
  }

  /**
   * functions
   * @param {String} src - json data
   * @return {String} fixed json data
   */
  process(src) {
    // set the input
    this.input = src;

    // reset some variables
    this.isValid = null;
    this.wasFixed = null;
    this.message = null;
    this.result = null;
    this.totalTries = 0;
    this.errorList = [];

    // first check if source is valid...
    try {
      let jsonParsed = JSON.parse(src);
      this.isValid = true;
      this.wasFixed = false;
      this.message = 'JSON is valid!';
      this.result = jsonParsed;
    } catch (e) {
      this.isValid = false;

      // check if source is empty
      if (src === '') {
        this.wasFixed = true;
        this.message = 'empty source detected...';
        this.result = {};
        this.totalTries = 1;
        // TODO: JSONFix.errorList.push({});
      } else {
        // optimize input source for bug detection...
        let optimizedSrc1 = src.replace('{', '{\n');
        let optimizedSrc2 = optimizedSrc1.replace('}', '\n}');

        // TODO: remove whitespace
        // TODO: remove java style comments
        // console.log('inputOptimized',  this.inputOptimized);

        this.tryFix(optimizedSrc2); // fix it :)
      }
    }

    // DEBUG(this.message);
    return this;
  }

  /**
   * this function we call multiple times. (at the callbacks of the different fix functions)
   * @param {String} src - json data
   */
  tryFix(src) {
    this.totalTries++;
    // console.log('JSONTryFix totalTries =', this.totalTries, 'source:', src);

    // try to lint the source. we use this to get the jsonlint error and detect the bug.
    try {
      let linted = this.jsonlint.parse(src);
      this.wasFixed = true;
      this.message = 'input was successfully fixed!';
      this.result = linted;
    } catch (e) {
      // save error to history
      let err = jsonlintErrorParser(e.message);
      this.errorList.push(err);

      // try to fix... check if fix method exists.
      switch (err.description) {
        case 'Parse error':
          err.message = null;
          err.fix = null;
          this.tryFixParseError(src, err);
          break;
        default:
          this.result = null;
          this.message = 'cannot fix the error type "'+err.description+'"... sorry';
          break;
      }
    }
  }

  /**
   * we only fix parse errors...
   * @param {String} input - json data
   * @param {Object} err - jsonlint error
   */
  tryFixParseError(input, err) {
    // check the error.got string and choose a fixer
    switch (err.got) {
      case 'EOF\'': {
        let fixedEOF = this.tryFixParseErrorEOF(input, err);
        this.tryFix(fixedEOF);
        break;
      }
      case 'undefined\'': {
        let tmp = this.tryFixParseErrorUndefined(input, err);
        this.tryFix(tmp);
        break;
      }
      case '}\'': {
        let tmp = this.tryFixParseErrorCurlyBracket(input, err);
        this.tryFix(tmp);
        break;
      }
      case ':\'': {
        let tmp = this.tryFixParseErrorColon(input, err);
        this.tryFix(tmp);
        break;
      }
      case 'STRING\'': {
      // case "TRUE'":
      // case "FALSE'":
        let tmp = this.tryFixParseErrorSTRING(input, err);
        this.tryFix(tmp);
        break;
      }
      case 'NUMBER\'': {
        let tmp = this.tryFixParseErrorNUMBER(input, err);
        this.tryFix(tmp);
        break;
      }
      default:
        JSONFix.wasFixed = false;
        JSONFix.message = 'cannot fix got="'+err.got+'" '+'expecting="'+err.expecting+'"';
        throw new Error(JSONFix.message);
    }
  }

  /**
   * @param {String} input - json data
   * @param {Object} err - jsonlint error
   * @return {String} fixed json data
   */
  tryFixParseErrorEOF(input, err) {
    // console.log('call tryFixParseErrorEOF')
    // console.log('input:', input)
    // console.log('err:', err)
    // console.log('cb:', cb);

    // check if last char is } or ]
    let lastChar = input[input.length-1];
    // console.warn('last char', lastChar);
    if (lastChar !== '}' || lastChar !== ' ]') {
      // check if input is object or array...
      if (input[0] === '{') {
        // console.warn('input is object');
        input += '}';
        err.message = 'missing } at end of source';
        err.fix = input;
      }
      if (input[0] === '[') {
        // console.warn('input is array');
        input += ']';
        err.message = 'missing ] at end of source';
        err.fix = input;
      }
    }
    return input;
  }

  /**
   * @param {String} input - json data
   * @param {Object} err - jsonlint error
   * @return {String} fixed json data
   */
  tryFixParseErrorUndefined(input, err) {
    // console.log('call fixParseError_undefined');
    // console.log('input:', input)
    // console.log('err:', err)
    // console.log('cb:', cb);

    let inputLines = input.split('\n');
    // console.log('error at this line:', inputLines[err.line-1]);
    let tmp = inputLines[err.line-1].split(',');
    // console.log(tmp);
    inputLines[err.line-1] = tmp[0]+'",';

    let fixed = inputLines.join('\n');
    // console.log('fixed: "'+fixed+'"');

    // cb(fixed);
    return fixed;
  }

  /**
   * @param {String} input - json data
   * @param {Object} err - jsonlint error
   * @return {String} fixed json data
   */
  tryFixParseErrorCurlyBracket(input, err) {
    // JSONFix.message = 'TODO: fix {';

    // if(err.expecting === "':'") {
    //   console.log('} & :');
    // } else if(err.expecting === "'STRING'") {
    //     console.log('} & STRING');
    // } else {
    //   fixParseError_CurlyBracket(input, err, cb);
    // };

    // console.log('call fixParseError_CurlyBracket');
    // console.log('input:', input)
    // console.log('err:', err)
    // console.log('cb:', cb);

    let inputLines = input.split('\n');
    // console.info('error at this line:', inputLines[err.line-1]);

    if (err.expecting === '\'STRING\'') {
      // console.log('too much "," ?');
      // check if comma is last char
      let totalchars = inputLines[err.line-1].length;
      let lastChar = inputLines[err.line-1][totalchars-1];
      // console.log('totalchars:', totalchars);
      // console.log('lastChar:', lastChar);

      if (lastChar === ',') {
        // console.info('remove last char (,)');
        // fix it...
        inputLines[err.line-1] = inputLines[err.line-1].replace(',', '');
      }

      let fixed = inputLines.join('\n');
      err.fix = fixed;
      // console.log('fixed: "'+fixed+'"');

      // cb(fixed);
      return fixed;
    } else if (err.expecting === '\'EOF\', \'}\', \':\', \',\', \']\'') {
      return input;
    }
  }

  /**
   * @param {String} input - json data
   * @param {Object} err - jsonlint error
   * @return {String} fixed json data
   */
  tryFixParseErrorColon(input, err) {
    if (err.expecting === '\'EOF\', \'}\', \',\', \']\'') {
      let firstChar = input[0];
      let lastChar = input[input.length-1];
      // console.log('firstChar', firstChar);
      // console.log('lastChar', lastChar);

      // check if { is missing...
      if (firstChar !== '{' && lastChar === '}') {
        err.message = 'missing { at the beginning of the json';
        let fixed = '{'+input;
        err.fix = fixed;
        return fixed;
      }

      // check if [ is missing...
      if (firstChar !== '[' && lastChar === ']') {
        err.message = 'missing [ at the beginning of the json';
        let fixed2 = '['+input;
        err.fix = fixed2;
        return fixed2;
      }
    }

    if (err.expecting === '\'STRING\', \'NUMBER\', \'NULL\', \'TRUE\', \'FALSE\', \'{\', \'[\'') {
      // multiple colon
    }
  }

  /**
   * @param {String} input - json data
   * @param {Object} err - jsonlint error
   * @return {String} fixed json data
   */
  tryFixParseErrorSTRING(input, err) {
    let inputLines = input.split('\n');
    // console.log('inputLines:', inputLines);
    // console.log('buggyCode:', inputLines[err.line-1]);

    if (err.expecting === '\'EOF\', \'}\', \',\', \']\'') {
      err.message = 'missing comma';
      // console.log(err.messsage);
      let fixed = fix.missingComma(inputLines[err.line-1]);
      err.fix = fixed;
      inputLines[err.line-1] = fixed;
    } else if (err.expecting === '\'EOF\', \'}\', \':\', \',\', \']\'') {
      // is colon missing?
      if (inputLines[err.line-1].indexOf(':') === -1) {
        // console.log('cannot find colon');

        err.message = 'missing :';
        // console.log(err.message);
        let tmpFixed = fix.missingColon(inputLines[err.line-1]);
        err.fix = tmpFixed;
        inputLines[err.line-1] = tmpFixed;
      }

      // is comma missing?
      if (inputLines[err.line-1].indexOf(',') === -1) {
        // console.log('cannot find ,');
        let fixed3 = fix.missingComma(inputLines[err.line-1]);
        err.fix = fixed3;
        inputLines[err.line-1] = fixed3;
      }
    } else {
      JSONFix.message = 'cannot fix this ugly bug... sorry!';
      JSONFix.wasFixed = false;
    }

    let fixedResult = inputLines.join('\n');
    // console.info('fixedResult: "'+fixedResult+'"');
    // cb(fixedResult);
    return fixedResult;
  }

  /**
   * @param {String} input - json data
   * @param {Object} err - jsonlint error
   */
  tryFixParseErrorNUMBER(input, err) {
    // DEBUG('call tryFixParseErrorNUMBER');
    // if (err.expecting === '\'EOF\', \'}\', \',\', \']\'') {
    // }
  }
}

if (typeof module !== 'undefined') {
  module.exports = JSONFix;
}
