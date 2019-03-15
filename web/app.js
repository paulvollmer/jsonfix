'use strict';

/**
 * jsonfix/app.js
 * this is code for the web frontend.
 */

const JSONFix = require('../src/jsonfix');
let editorSource;
let editorResult;

window.onload = function() {
  editorSource = CodeMirror.fromTextArea(document.getElementById('source'), {
    lineNumbers: true,
    mode: 'application/json',
  });
  editorResult = CodeMirror.fromTextArea(document.getElementById('result'), {
    lineNumbers: true,
    mode: 'application/json',
  });
};

function update() {
  let jsonfix = new JSONFix(jsonlint);
  let fixed = jsonfix.process(editorSource.getDoc().getValue());

  if (fixed.isValid) {
    editorResult.getDoc().setValue(fixed.input);
    setResultMessage(fixed.message, 'pass');
  } else {
    if(fixed.wasFixed === true) {
      editorResult.getDoc().setValue(JSON.stringify(fixed.result, null, 2));
      setResultMessage(fixed.message, 'fixed');
    } else {
      editorResult.getDoc().setValue('');
      setResultMessage(fixed.message, 'fail');
    }
  }

  // document.getElementById('result-container').style.visibility = ''

  setResultData(fixed);
  setResultViz(fixed);
}

function setResultMessage(text, type) {
  let resultMessage = document.getElementById('result-message');
  resultMessage.innerHTML = text;
  resultMessage.className = type;
}

function setResultData(data) {
  console.log(data);
  let tmpData = {
    input: data.input,
    isValid: data.isValid,
    wasFixed: data.wasFixed,
    message: data.message,
    result: data.result,
    totalTries: data.totalTries,
    errorList: data.errorList,
  };
  let resultData = document.getElementById('result-data');
  resultData.innerHTML = '<pre>'+JSON.stringify(tmpData, null, 2)+'</pre>';
}

function setResultViz(data) {
  let resultViz = document.getElementById('result-viz');
  let text = '';
  text += '<p>Total number of tries: '+data.totalTries+'</p>';
  for (let i = 0; i < data.errorList.length; i++) {
    text += '<div>';
    text += '<p>';
    text += '<b>' + (i+1) + '. Fix</b>';
    text += ' expecting: <code>' + data.errorList[i].expecting + '</code>';
    text += ' got: <code>' + data.errorList[i].got + '</code>';
    text += '</p>';
    text += '<pre>' + data.errorList[i].fix + '</pre>';
    text += '</div>';
  }
  resultViz.innerHTML = text;
}

window.jsonfix = {
  update: update,
};
