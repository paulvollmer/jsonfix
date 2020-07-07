'use strict';

/**
 * fix missing colon
 *
 * @param {Srtring} input - part of json data
 * @return {String} fixed json data
 */
exports.missingColon = function(input) {
  if (!input || input === '') {
    return '';
  } else {
    let tmp = input.split('"');
    let fixedLine = '';
    if (tmp.length === 3) {
      fixedLine = `${tmp[0]}"${tmp[1]}":`;
    } else if (tmp.length === 5) {
      fixedLine = `${tmp[0]}"${tmp[1]}":${tmp[2]}"${tmp[3]}"${tmp[4]}`;
    } else {
      throw new Error('cannot set colon');
    }
    return fixedLine;
  }
};

/**
 * fix missing comma
 *
 * @param {Srtring} input - part of json data
 * @return {String} fixed json data
 */
exports.missingComma = function(input) {
  if (!input || input === '') {
    return '';
  } else {
    return input+',';
  }
};
