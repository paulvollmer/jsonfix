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

  setResultData();
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

function setResultData(stats) {
  var resultData = document.getElementById('result-data');
  var text = '<b>Result Data</b><br>'
  text += 'JSONFix:<pre>'+JSON.stringify(JSONFix, null, 2)+'</pre>';

  // text += '<pre>'+JSON.stringify(JSONFixResult, null, 2)+'</pre>';

  // text += '<table class="table">';
  // text += '<tr><td>total number of tries</td><td>'+JSONFix.stats.totalTries+'</td></tr>';
  // text += '<tr><td>total number of errors</td><td>'+JSONFix.stats.errorList.length+'</td></tr>';
  // text += '<tr><td>list of errors</td><td><pre>'+JSON.stringify(JSONFix.stats.errorList, null, 2)+'</pre></td></tr>';
  // text += '</table>';

  resultData.innerHTML = text;
}
