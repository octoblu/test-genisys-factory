'use strict'

const _ = require('lodash')
const async = require('async')
const MeshbluHttp = require('meshblu-http')

class Creds {
  constructor(meshbluConfig) {
    this.meshbluConfig = meshbluConfig
    this.meshblu = new MeshbluHttp(this.meshbluConfig)
  }

  generateMeshbluConfig(device, key, callback) {
    this.meshblu.generateAndStoreToken(device.uuid, (error, generated) => {
      var creds = { uuid: device.uuid, token: generated.token }
      var meshbluConfig = _.defaults(creds, this.meshbluConfig)
      return callback(error, meshbluConfig)
    })
  }

  generateRoomMeshbluConfigs(room, callback) {
    var uuids = {
      room:   {uuid: room.uuid},
      light:  {uuid: room.genisys.devices.hueLight.uuid},
      button: {uuid: room.genisys.devices.hueButton.uuid},
      skype:  {uuid: room.genisys.devices.skype.uuid},
    }
    async.mapValues(uuids, this.generateMeshbluConfig.bind(this), callback)
  }

  generateMeshbluConfigs(callback) {
    var meshbluConfigs = { customer: this.meshbluConfig }
    this.meshblu.whoami((error, customer) => {
      this.meshblu.search({"type":"octoblu:smartspaces:room"}, {}, (error, rooms) => {
        async.map(rooms, this.generateRoomMeshbluConfigs.bind(this), callback)
      })
    })
  }
}

module.exports = Creds
