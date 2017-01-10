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

  isBooked(callback) {
    console.log('isBooked()');

    const roomId = this.room.roomId
    this.meshblu.device(roomId, function(error, device) {
      if(error) {
        console.log("Error in isBooked: ", error.message);
        return callback(error)
      }

      const currentMeeting = _.get(device, 'genisys.currentMeeting')

      return callback(null, !_.isEmpty(currentMeeting))
    })
  }


  isLightInMeeting(callback){
    meshblu.device(this.roomId, function(error, device){
      if(error) {
        return callback(error);
      }
      var currentMeeting = device.genisys.currentMeeting
      console.log("Room Status(currentMeeting) : " + currentMeeting + " \n Booked : " , device.genisys.booked);
      if (currentMeeting == null){
        console.log("Room is available");
        callback(null, false);
      }
      else {
        console.log("Room is booked");
        callback(null, true);
      }

    })
  }

  createAdHocMeeting(callback){
    const message = {devices: ['*'], data:{"device":{"genisys":{roomId: this.room.roomId}}}}
    this.btnMeshblu.message(message, (error) => {
      if (error) {
        console.log('Error in createAdHocMeeting : ' , error.message);
        return callback (error)
      }

    })
  }

getRoomState(callback) {
  var state = {};
  this.meshblu.device(this.room.roomId, function (error, device){
    console.log('After get device');
    if (error) return callback (error)
    var hi = 'hi'
    var currentMeeting = _.get(device, 'genisys.currentMeeting')
    state = { currentMeeting : currentMeeting }
    return callback(state)
  })
}



  isSkypeOn(callback){
    meshblu.device(this.roomId, function(error, device) {
      if (error) return callback(error)
      console.log("Inside inSkypeOn");

      var inSkype = _.get(device, 'genisys.inSkype', false)

      console.log ('inSkype', inSkype)

      console.log('Device in isSkypeOn : ', device);
      callback(null, inSkype)
    })
  }

  getMeshbluHTTP(meshbluCredFile){
    const MeshbluConfig = require ('meshblu-config');
    console.log("Using Meshblu Cred File: " + meshbluCredFile );
    const meshbluConfig    = new MeshbluConfig(meshbluCredFile).toJSON()
    const meshblu          = new MeshbluHttp(meshbluConfig)
    if(meshblu){
      console.log("Returning Meshblu object as : ", meshblu);
      return meshblu
    }
    console.log("Error connecting to meshblu!", meshblu);
    return null

  }


  // verifySkypeAV(callback) {
  //   meshblu.device(this.roomId, function(error, roomDevice) {
  //     if (error) return callback(error)
  //     if (_.isEmpty(roomDevice)) return callback(new Error('Room is empty'))
  //
  //     //console.log("Room Device from verifySkypeAV : ", roomDevice);
  //     const skypeDeviceUuid = _.get(roomDevice, 'genisys.skypeDeviceUuid', null)
  //     console.log("Skype Device UUID : ", skypeDeviceUuid);
  //
  //     if (_.isEmpty(skypeDeviceUuid)) return callback(new Error('Skype Device not Found'))
  //
  //     meshblu.device(skypeDeviceUuid, function(error, skypeDevice) {
  //       if (error) return callback(error)
  //
  //       return callback(null, {
  //         audio: _.get(skypeDevice, 'state.audioEnabled', false),
  //         video: _.get(skypeDevice, 'state.videoEnabled', false)
  //       })
  //     })
  //   })
  // }

  verifySkypeAV(callback) {
    this.isSkypeOn(function(error, inSkype){
      if(error) return callback(error)
      if(inSkype){
        meshblu.device(this.roomId, function(error, roomDevice) {
          if (error) return callback(error)
          if (_.isEmpty(roomDevice)) return callback(new Error('Room is empty'))

          //console.log("Room Device from verifySkypeAV : ", roomDevice);
          const skypeDeviceUuid = _.get(roomDevice, 'genisys.skypeDeviceUuid', null)
          console.log("Skype Device UUID : ", skypeDeviceUuid);

          if (_.isEmpty(skypeDeviceUuid)) return callback(new Error('Skype Device not Found'))

          meshblu.device(skypeDeviceUuid, function(error, skypeDevice) {
            if (error) return callback(error)

            return callback(null, {
              audio: _.get(skypeDevice, 'state.audioEnabled', false),
              video: _.get(skypeDevice, 'state.videoEnabled', false)
            })
          })
        })

      }

      else{
        return callback(new Error('Skype is not in session'))
      }


    })

  }

  isSkypePropertyOn(property, callback){

  }

}


module.exports = Room
