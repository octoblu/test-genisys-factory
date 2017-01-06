const _               = require ('lodash');
const MeshbluConfig   = require ('meshblu-config');
const MeshbluFirehose = require ('meshblu-firehose-socket.io')
const moment          = require ('moment')

var  path = require ('path')


var roomOptions = {filename:path.join(__dirname, 'meshblu_skydyne_room.json')}

//console.log("Options : " , roomOptions);
const meshbluConfig = new MeshbluConfig(roomOptions).toJSON()
console.log("Room MeshbluConfig: ", meshbluConfig);
const roomFirehose      = new MeshbluFirehose({meshbluConfig})

roomFirehose.connect(function(error){
  if (error) return console.error('Error Connecting', error)

  console.log('CONNECTED!');
})

roomFirehose.on('message', function(message) {
  console.log(JSON.stringify(message, null, 2))
})
