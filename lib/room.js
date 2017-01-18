'use strict'

const jsonFile        = require('jsonfile');
const _               = require('lodash');
const MeshbluHttp     = require ('meshblu-http');
const HueApi          = require('node-hue-api').HueApi;
const path            = require('path')
const request         = require('request');
const MeshbluFirehose = require('meshblu-firehose-socket.io')

class Room {
  constructor(options) {
    this.meshblu    = new MeshbluHttp(options.meshbluConfig);
    this.btnMeshblu = new MeshbluHttp(options.btnCredFile);
    this.firehose   = new MeshbluFirehose({meshbluConfig: options.inquisitorFile})

    this.room = options.room;
    this.availableRoomState = {
      currentMeeting :  undefined,
      meetingUrl     :  undefined,
      inSkype        :  false,
      subject        :  undefined,
    };

    this.firehose.connect(function(error){
      if (error) return console.error('Error Connecting', error)
      var connect = 'CONNECTED'
    })
  }


  resetRoom(callback) {
    let roomState = {}

    this.getRoomState((error, roomState) => {
      if (error) return callback(error)

      const currentMeeting = roomState.currentMeeting

      if (_.isEmpty(currentMeeting)) return callback(null, 'Available')

      this.triggerButtonPress((error) => {
        if(error) callback(error)

        this.waitForMeeting('Available', _.once((error, result) => {
          if (error) callback(error)
          callback(null, result)
        }))
      })
    })
  }



  waitForMeeting(expected,callback) {
    this.firehose.on('message', function(message) {
      if (message.data.type === 'octoblu:smartspaces:room') {
        if(expected === 'Booked' && message.data.genisys.currentMeeting !== undefined){
          callback(null, 'Booked')
        }
        else if (expected === 'Available' && message.data.genisys.currentMeeting === undefined ){
          callback(null, 'Available')
        }
      }
    })
  }



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


  waitForLight(expected, callback){
     this.firehose.on('message', function(message) {
      if (message.data.type === 'device:hue-light') {
        if(expected === 'Red' && message.data.color === '#430000ff') return callback(null, 'Red')
        else if(expected === 'Green' && message.data.color === '#004300ff') return callback(null, 'Green')
      }

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

    if(this.room.skypeId === undefined) return callback(new Error ('Skype ID is not defined. Please check Room JSON.'))

    this.meshblu.device(this.room.skypeId, function (error, skype){
      if (error) return callback (error)

      var skypeState = {
        audio: _.get(skype, 'state.audioEnabled', false),
        video: _.get(skype, 'state.videoEnabled', false)
      }

      return callback(skypeState)
    })
  }

  waitForRoomInSkype(expected, callback){
    callback = _.once(callback)
    this.firehose.on('message', function(message) {
     if (message.data.type !== 'octoblu:smartspaces:room') return
     if (expected === 'inSkype' && message.data.genisys.inSkype === true) callback(null, true)
     if (expected === 'outSkype' && message.data.genisys.inSkype === false) callback(null, false)
    })
  }


  waitforSkypeAV(expected, callback){
    if(this.room.skypeId === undefined) return callback(new Error ('Skype ID is not defined. Please check Room JSON.'))

    let result = {audio: false, video: false}

    callback = _.once(callback)
    setTimeout(function(){ callback(null, result) }, 30000)

    this.firehose.on('message', function(message) {
     if (message.data.type !== 'device:skype') return

     result.audio = message.data.state.audioEnabled
     result.video = message.data.state.videoEnabled

     if (expected === 'inSkype' && result.audio && result.video) {
       callback(null, result)
     }
    })
  }
}

module.exports = Room
