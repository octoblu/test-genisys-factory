var MeshbluSocketIO = require('meshblu');
var JSON = require('JSON');
var JSONStream = require('JSONStream');
var es = require('event-stream');

var meshblu = new MeshbluSocketIO({
  resolveSrv: true,
  uuid: 'c0e9a14d-0d4c-4506-acbf-3a5917e74043',
  token: '9ba4c1009a70b08328b78fa22b81d4d392a97473'
})

function getColor() {
  meshblu.on('config', function(device){
    meshblu.subscribe({uuid: '7797ebec-aea8-471c-a6ea-fed4966f19e8'})

    var desiredState = JSON.parse(JSON.stringify(device)).desiredState
    if(desiredState != undefined && desiredState.color == "#004400") {
      console.log("GREEN");
      meshblu.close();
    }
    if(desiredState != undefined && desiredState.color == "#440000") {
      console.log("RED");
      meshblu.close();
    }
  });

  meshblu.connect();
}

module.exports = {
  getColor
}
