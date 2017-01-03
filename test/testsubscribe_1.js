var MeshbluSocketIO = require('meshblu');
var JSON = require('JSON');
var JSONStream = require('JSONStream');
var es = require('event-stream');
var request = require('request');

var options = {
  url : 'https://meshblu.octoblu.com/subscribe/7797ebec-aea8-471c-a6ea-fed4966f19e8',
  headers : {
    'meshblu_auth_uuid':'c0e9a14d-0d4c-4506-acbf-3a5917e74043',
    'meshblu_auth_token': '9ba4c1009a70b08328b78fa22b81d4d392a97473'
  }
}

var stream = request(options)
  .pipe(JSONStream.parse('*.color'))
  .pipe(es.map(function (data) {
    if(data == "#004400"){
      console.log("Color is Green");
      stream.destroy()
      return data
    }
    else if (data == "#440000"){
      console.log("Color is Red");
    } else {
      console.log(data);
    }
    return data
  }))
