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
    var query = {
      "owner": this.meshbluConfig.uuid,
      "type":  "octoblu:smartspaces:room",
    }
    this.meshblu.search(query, {}, (error, rooms) => {
      async.map(rooms, this.generateRoomMeshbluConfigs.bind(this), callback)
    })
  }

  revokeAuth(auth, callback) {
    this.meshblu.revokeToken(auth.uuid, auth.token, callback)
  }

  revokeMeshbluConfigs(meshbluConfigs, callback) {
    async.map(meshbluConfigs, (roomConfigData, done) => {
      async.map(roomConfigData, this.revokeAuth.bind(this), done)
    }, callback)
  }
}

module.exports = Creds
