/**
 * jsonfix/app.js
 * this is code for the web frontend.
 */

function update() {
  JSONFix.process(document.getElementById('source').value);

  if (JSONFix.isValid) {
    setResult(JSONFix.input);
    setResultMessage(JSONFix.message, 'pass');
  } else {
    // if(JSONFix.wasFixed === true) {

      setResult(JSON.stringify(JSONFix.result, null, 2));
      setResultMessage(JSONFix.message, 'fixed');

    // } else {
    //   setResult('');
    //   setResultMessage(JSONFixResult.error, 'fail');
    // }
  }

  setResultData(JSONFix);
  setResultViz(JSONFix.stats);
}

function setResult(text) {
  var result = document.getElementById('result');
  result.innerHTML = text;
}

function setResultMessage(text, type) {
  var resultMessage = document.getElementById('result-message');
  resultMessage.innerHTML = text;
  resultMessage.className = type;
}

function setResultData(data) {
  var resultData = document.getElementById('result-data');
  resultData.innerHTML = '<pre>'+JSON.stringify(data, null, 2)+'</pre>';
}

function setResultViz(stats) {
  var resultViz = document.getElementById('result-viz');
  var text = ''
  text += '<p>Total number of tries: '+stats.totalTries+'</p>'

  for (var i = 0; i < stats.errorList.length; i++) {
    text += '<div>'

    text += '<p>'
    text += '<b>' + (i+1) + '. Fix</b>'
    text += ' expecting: <code>' + stats.errorList[i].expecting + '</code>'
    text += ' got: <code>' + stats.errorList[i].got + '</code>'
    text += '</p>'

    text += '<pre>' + stats.errorList[i].fix + '</pre>'
    text += '</div>'
  }

  resultViz.innerHTML = text;
}
