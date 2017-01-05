const _               = require ('lodash');
const MeshbluConfig   = require ('meshblu-config');
const MeshbluFirehose = require ('meshblu-firehose-socket.io')
const moment          = require ('moment')

const meshbluConfig = new MeshbluConfig().toJSON()
const firehose      = new MeshbluFirehose({ meshbluConfig })

firehose.connect(function(error){
  if (error) return console.error('Error Connecting', error)

  console.log('CONNECTED!');
})

firehose.on('message', function(message) {
  console.log(JSON.stringify(message, null, 2))
})
