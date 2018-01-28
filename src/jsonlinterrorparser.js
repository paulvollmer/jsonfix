'use strict';

/**
 * jsonlintErrorParser
 *
 * die funktion parsed den error message string und
 * returned ein Error object
 */
function jsonlintErrorParser(msg) {
  const errorLines = msg.split('\n');

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

module.exports = jsonlintErrorParser
