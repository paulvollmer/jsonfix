/*!
 * jsonfix/src/jsonfix.js
 */


// this is only for debugging this crazy stuff
var DEBUG_ACTIVE = false;
function DEBUG() {
  if(DEBUG_ACTIVE) {
    var msg = [];
    for (var i = 0; i < arguments.length; i++) {
      msg.push(arguments[i]);
    }
    console.log('DEBUG> '+msg.join(' '));
  }
}


// load jsonlint if not defined (server side stuff)
if(typeof jsonlint === 'undefined') {
  var jsonlint = require('jsonlint');
}


/**
 * main logic and data store
 */
var JSONFix = {

  /*
   * variables
   */
  input: null,            // store the input data as string
  inputOptimized: null,   // the optimized input data
  isValid: null,          // if input is valid, set to true
  wasFixed: null,         // set to true if source was successful fixed
  message: null,          // a message about the fix process
  result: null,           // store the fixed json data here
  stats: {                // stats about the fix process...
    totalTries: 0,        // count the number of "JSONFixer" calls
    errorList: [],        // all found and fixed bugs will be reported here.
  },

  /*
   * functions
   */
  process: function(src) {
    DEBUG('JSONFix start processing...');

    // set the input
    this.input = src;

    // reset some variables
    this.inputOptimized = null;
    this.isValid = null;
    this.wasFixed = null;
    this.message = null;
    this.result = null;
    this.stats.totalTries = 0;
    this.stats.errorList = [];

    // first check if source is valid...
    try {
      var jsonParsed = JSON.parse(src);
      this.isValid = true;
      this.wasFixed = false;
      this.message = 'JSON is valid!';
      this.result = jsonParsed;
    } catch(e) {
      this.isValid = false;

      // check if source is empty
      if(src === '') {
        this.wasFixed = true;
        this.message = 'empty source detected...';
        this.result = {};
        this.stats.totalTries = 1;
        // TODO: JSONFix.stats.errorList.push({});
      } else {
        // optimize input source for bug detection...
        var optimizedSrc1 = src.replace('{', '{\n');
        var optimizedSrc2 = optimizedSrc1.replace('}', '\n}');
        this.inputOptimized = optimizedSrc2;
        // TODO: remove whitespace
        // TODO: remove java style comments
        // var removedComments = removeComments(src);
        // console.log('inputOptimized',  this.inputOptimized);
        JSONTryFix(optimizedSrc2); // fix it :)
      }
    }

    DEBUG(this.message);
    return this.result;
  }
};

if(typeof module !== 'undefined') {
  module.exports = JSONFix;
}


/**
 * jsonlintErrorParser
 *
 * die funktion parsed den error message string und
 * returned ein Error object
 */
function jsonlintErrorParser(msg) {
  errorLines = msg.split('\n');
  // console.log('ERROR LINES:', errorLines);

  // the error data structure we want to return.
  var err = {
    description: '',
    line: '',
    code: '',
    expecting: '',
    got: ''
  };

  err.description = errorLines[0].split(' on line ')[0];
  err.line = errorLines[0].split('on line ')[1].split(':')[0];
  err.code = errorLines[1];
  err.expecting = errorLines[3].split('Expecting ')[1].split(', got ')[0];
  err.got = errorLines[3].split(", got '")[1]; //.split("'")[0]
  return err;
}


function removeComments(src) {
  // TODO: ...
  return result;
}


/**
 * this function we call multiple times. (at the callbacks of the different fix functions)
 */
function JSONTryFix(src) {
  JSONFix.stats.totalTries++;
  DEBUG('JSONTryFix totalTries =', JSONFix.stats.totalTries, ' <---', src);

  // try to lint the source. we use this to get the jsonlint error and detect the bug.
  try {
    var linted = jsonlint.parse(src);
    // console.log('jsonlint', linted);
    JSONFix.wasFixed = true;
    JSONFix.message = 'input was successfully fixed!';
    JSONFix.result = linted;
  } catch(e) {
    // save error to history
    var err = jsonlintErrorParser(e.message);
    // console.log("error object:", err);
    JSONFix.stats.errorList.push(err);

    // try to fix... check if fix method exists.
    switch(err.description) {
      case 'Parse error':
        err.message = null;
        err.fix = null;
        JSONTryFixParseError(src, err, JSONTryFix);
        break;
      default:
        // console.log('DEFAULT...');
        JSONFix.result = null;
        JSONFix.message = 'cannot fix the error type "'+err.description+'"... sorry';
        break;
    }
  }
}


/**
 * we only fix parse errors...
 */
function JSONTryFixParseError(input, err, cb) {
  // console.log('call JSONTryFixParseError', input, err);
  // console.info('try to fix "'+err.got+'"');

  // error got...
  switch(err.got) {
    case "EOF'":
      JSONTryFixParseError_EOF(input, err, cb);
      break;

    case "undefined'":
      JSONTryFixParseError_undefined(input, err, cb);
      break;

    case "}'":
      JSONTryFixParseError_CurlyBracket(input, err, cb);
      break;

    case ":'":
      JSONTryFixParseError_Colon(input, err, cb);
      break;

    case "STRING'":
    // case "NUMBER'":
    // case "TRUE'":
    // case "FALSE'":
      JSONTryFixParseError_STRING(input, err, cb);
      break;


    default:
      JSONFix.wasFixed = false;
      JSONFix.message = 'cannot fix got="'+err.got+'" '+'expecting="'+err.expecting+'"';
      console.error(JSONFix.message);
      break;
  }
}



function JSONTryFixParseError_EOF(input, err, cb) {
  JSONFix.message = 'TODO: fix EOF';

  // check if last char is } or ]
  var lastChar = input[input.length-1];
  // console.warn('last char', lastChar);
  if(lastChar !== '}' || lastChar !== ' ]') {

    // check if input is object or array...
    if(input[0] === '{') {
      // console.warn('input is object');
      input += '}';
      err.message = 'missing } at end of source';
      err.fix = input;
    }
    if(input[0] === '[') {
      // console.warn('input is array');
      input += ']';
      err.message = 'missing ] at end of source';
      err.fix = input;
    }

  }

  cb(input);
}

function JSONTryFixParseError_undefined(input, err, cb) {
  console.info('call fixParseError_undefined');
  var inputLines = input.split('\n');
  // console.log('error at this line:', inputLines[err.line-1]);
  var tmp = inputLines[err.line-1].split(',');
  // console.log(tmp);
  inputLines[err.line-1] = tmp[0]+'",';

  var fixed = inputLines.join('\n');
  // console.log('fixed: "'+fixed+'"');

  cb(fixed);
}

function JSONTryFixParseError_CurlyBracket(input, err, cb) {
  // JSONFix.message = 'TODO: fix {';

  // if(err.expecting === "':'") {
  //   console.log('} & :');
  // } else if(err.expecting === "'STRING'") {
  //     console.log('} & STRING');
  // } else {
  //   fixParseError_CurlyBracket(input, err, cb);
  // };




  console.info('call fixParseError_CurlyBracket');

  var inputLines = input.split('\n');
  console.info('error at this line:', inputLines[err.line-1]);

  if(err.expecting === "'STRING'") {
    console.log('too much "," ?');
    // check if comma is last char
    var totalchars = inputLines[err.line-1].length;
    var lastChar = inputLines[err.line-1][totalchars-1];
    console.log('totalchars:', totalchars);
    console.log('lastChar:', lastChar);

    if(lastChar === ',') {
      console.info('remove last char (,)');
      // fix it...
      inputLines[err.line-1] = inputLines[err.line-1].replace(',', '');
    }

    var fixed = inputLines.join('\n');
    err.fix = fixed;
    // console.log('fixed: "'+fixed+'"');

    cb(fixed);
  }
  else if(err.expecting === "'EOF', '}', ':', ',', ']'") {
  }
}

function JSONTryFixParseError_Colon(input, err, cb) {
  JSONFix.message = 'TODO: Fix ":" errors';

  var firstChar = input[0];
  var lastChar = input[input.length-1];
  console.log('firstChar', firstChar);
  console.log('lastChar', lastChar);

  // check if { is missing...
  if(firstChar !== '{') {
    console.log('missing { at the beginning of the json');
  }

  // check if [ is missing...
  if(firstChar !== '[') {
    console.log('missing [ at the beginning of the json');
  }
}

function JSONTryFixParseError_STRING(input, err, cb) {
  var inputLines = input.split('\n');
  // console.log('inputLines:', inputLines);
  // console.log('buggyCode:', inputLines[err.line-1]);

  if(err.expecting === "'EOF', '}', ',', ']'") {
    err.message = 'missing comma';
    // console.log(err.messsage);
    var fixed = inputLines[err.line-1]+',';
    err.fix = fixed;
    inputLines[err.line-1] = fixed;
  }

  else if(err.expecting === "'EOF', '}', ':', ',', ']'") {
    err.message = 'missing :';
    // console.log(err.message);
    var tmpFixed = fixMissingColon(inputLines[err.line-1]);
    err.fix = tmpFixed;
    inputLines[err.line-1] = tmpFixed;
  }

  else {
    JSONFix.message = 'cannot fix this ugly bug... sorry!';
    JSONFix.wasFixed = false;
  }

  var fixedResult = inputLines.join('\n');
  // console.info('fixedResult: "'+fixedResult+'"');
  cb(fixedResult);
  return fixedResult;
}

// fix missing :
function fixMissingColon(input) {
  // console.info('call fixMissingColon', input);
  var tmp = input.split('"');
  var fixedLine = tmp[0]+'"'+tmp[1]+'"'+ ':'+ /* the fix */ tmp[2]+'"'+tmp[3]+'"'+tmp[4];
  return fixedLine;
}
