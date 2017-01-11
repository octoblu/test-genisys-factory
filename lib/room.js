'use strict'

const jsonFile    = require('jsonfile');
const _           = require('lodash');
const MeshbluHttp = require ('meshblu-http');
const HueApi      = require('node-hue-api').HueApi;
const path        = require('path')
const request     = require('request');

class Room {
  constructor(options) {
    this.meshblu = new MeshbluHttp(options.meshbluConfig);
    this.btnMeshblu = new MeshbluHttp(options.btnCredFile)
    this.room = options.room
  }

  // resetRoom(callback) {
  //   var roomState = {}
  //   this.getRoomState(function(error, result) {
  //     if (error) return callback(error, null)
  //     roomState = result
  //     var currentMeeting = roomState.currentMeeting
  //     if (currentMeeting != null) {
  //
  //     }
  //     callback(null, roomState)
  //   })
  // }

  triggerButtonPress(callback) {
    const message = {devices: ['*'], data:{"device":{"genisys":{roomId: this.room.roomId}}}}
    this.btnMeshblu.message(message, function(error){
      if (error) return callback (error)
      callback(null)
    })
  }

  getRoomState(callback) {
    this.meshblu.device(this.room.roomId, function (error, device){
      if (error) return callback(error)

      var roomState = {
        currentMeeting : _.get(device, 'genisys.currentMeeting', undefined),
        meetingUrl     : _.get(device, 'genisys.currentMeeting.meetingUrl', undefined),
        inSkype        : _.get(device, 'genisys.inSkype', undefined),
        subject        : _.get(device, 'genisys.currentMeeting.subject', undefined),
      }
      callback(null, roomState)
    })
  }

  getLightColor(callback){
    this.meshblu.device(this.room.lightId, function (error, light){
      if (error) return callback(error);
      if(light.color == '#430000ff') return callback(null, 'Red')
      if(light.color == '#004300ff') return callback(null, 'Green')
    })
  }

  startSkype(callback){
    const startSkype = {"$set": {"genisys.actions.start-skype": {}}}
    this.meshblu.updateDangerously(this.room.roomId, startSkype, function (error){
      if (error) return callback(error)
      callback()
    })
  }

  endSkype(callback){
    const endSkype   = {"$set": {"genisys.actions.end-skype"  : {}}}
    this.meshblu.updateDangerously(this.room.roomId, endSkype, function (error){
      if (error) return callback(error)
      callback()
    })
  }

  getSkypeState(callback){
    this.meshblu.device(this.room.skypeId, function (error, skype){
      if (error) return callback (error)
      var skypeState = {
        audio: _.get(skype, 'state.audioEnabled', false),
        video: _.get(skype, 'state.videoEnabled', false)
      }
      return callback(skypeState)
    })
  }

}


module.exports = Room
