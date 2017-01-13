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

  }
  connectFirehose(callback){
    this.firehose.connect(function(error){
      if (error) return console.error('Error Connecting', error)
      var connect = 'CONNECTED'
      callback("test")
    })
  }



  resetRoom(callback) {
    let roomState = {}

    this.getRoomState((error, roomState) => {
      if (error) return callback(error)

      const currentMeeting = roomState.currentMeeting

      if (_.isEmpty(currentMeeting)) return callback(null, 'Available')
      console.log('Reseting the room now ......');

      this.triggerButtonPress((error) => {
        console.log('After triggerButtonPress..........');
        if(error) callback(error)

        this.waitForMeeting('Available', (error, result) => {
          if (error) done(error)
          console.log('Room is now set to :  ' , result);
          callback(null, result)
        })
      })
    })
  }

  waitForMeeting(expected,callback) {
    this.firehose.on('message', function(message) {
      if (message.data.type === 'octoblu:smartspaces:room') {
        if((expected === 'Booked') && message.data.genisys.currentMeeting !== undefined){
          console.log('Room is Booked : ',message.data.genisys.currentMeeting );
          callback(null, message.data)
        }
        else if (expected === 'Available' && message.data.genisys.currentMeeting === undefined ){
          console.log('Room is Avaialble');
          callback(null, 'Available')
        }
      }
    })
  }


  triggerButtonPress(callback) {
    const message = {devices: ['*'], data:{"device":{"genisys":{roomId: this.room.roomId}}}}
    console.log('Inside triggerButtonPress ');
    this.btnMeshblu.message(message, function(error){
      if (error) return callback (error)
      console.log("Button Pressed");
      callback(null)

    })
  }



  getRoomState(callback) {
    this.meshblu.device(this.room.roomId, function (error, device){
      if (error) return callback(error)
      //console.log('Room State in getRoomState: ', device);

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

/*
===============

class Room {
  constructor(options) {
    this.messageHandlers = []
    this.meshblu        = new MeshbluHttp(options.meshbluConfig);
    this.btnMeshblu     = new MeshbluHttp(options.btnCredFile)
    this.room           = options.room
    this.firehose       = new MeshbluFirehose({meshbluConfig: options.inquisitorFile})
  }



  connectFirehose(callback){
    this.firehose.connect(function(error){
      if (error) return console.error('Error Connecting', error)
      var connect = 'CONNECTED'
      callback("test")
    })
  }


  getCurrentMeeting(expected,callback) {
    this.firehose.on('message', function(message) {
      if (message.data.type === 'octoblu:smartspaces:room') {
        if((expected === 'Booked') && message.data.genisys.currentMeeting !== undefined){
          console.log('Room is Booked : ',message.data.genisys.currentMeeting );
          callback(null, message.data)
        }
        else if (expected === 'Available' && message.data.genisys.currentMeeting === undefined ){
          console.log('Room is Avaialble');
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

*/
module.exports = Room
