'use strict'
const jsonFile         = require('jsonfile');
const request          = require('request');
const _                = require('lodash');
const HueApi           = require('node-hue-api').HueApi;
const MeshbluHttp      = require ('meshblu-http');
const MeshbluConfig    = require ('meshblu-config');
const meshbluConfig    = new MeshbluConfig().toJSON()
const meshblu          = new MeshbluHttp(meshbluConfig)
const meshblu_firehose = require ('meshblu-firehose-socket.io')
//var firehose       = new meshblu_firehose(meshbluConfig)

const hueUsername = 'newdeveloper';


module.exports = class Room {
  constructor(roomJSONFile){
    this.roomJSON = jsonFile.readFileSync(roomJSONFile);
    this.roomId = this.roomJSON.roomId;
    this.roomUrl = this.roomJSON.url;
    this.lightId = this.roomJSON.lightId;
    const meshbluConfig = new MeshbluConfig().toJSON();
    this.meshblu = new MeshbluHttp(meshbluConfig);
    this.api = new HueApi(this.roomJSON.bridgeIp, hueUsername);
    this.skypeId = null
    //console.log("Status of Hue Api " + JSON.stringify(status));
  }
  isBooked(callback){
    meshblu.device(this.roomId, function(error, device){
      if(error) return error
      //JSON.stringify(device.genisys.booked)
      var status = device.genisys.currentMeeting;
      console.log("Room Status " + status);
      if (status != null) {
        console.log("Room is not avaialble (booked) ");
      }
      if (status == null) {
        console.log("Room is avaialble");
      }
      //JSON.stringify(device.genisys.booked)
      //var status = device.genisys.booked; //Somehow there is inconsitency between "booked" and "currentMeeting" fields so using currentMeeting instead
      //var currentMeeting = device.genisys.currentMeeting
      //console.log("Room Status(currentMeeting) : " + currentMeeting + " \n Booked : " , device.genisys.booked);
      console.log("Complete Room Device ", device);
      // if (currentMeeting == null){
      //   console.log("Room is available");
      //   callback(null, false);
      // }
      // else {
      //   console.log("Room is booked");
      //   callback(null, true);
      // }

    })
  }
  isLightInMeeting(callback){
    //console.log("isLightInMeeting Called!");
    meshblu.device(this.roomId, function(error, device){
      if(error) {
        return callback(error);
      }
      //JSON.stringify(device.genisys.booked)
      //var status = device.genisys.booked; //Somehow there is inconsitency between "booked" and "currentMeeting" fields so using currentMeeting instead
      var currentMeeting = device.genisys.currentMeeting
      console.log("Room Status(currentMeeting) : " + currentMeeting + " \n Booked : " , device.genisys.booked);
      //console.log("Complete Room Device ", device);
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

  toggleButton(callback) {
    const options =  { json: {'roomId': this.roomId} }

    request.post(this.roomUrl, options, function (error, response) {
      if (error) return callback(error)

      callback(null, response)
    })
  }

  pressButton(btnCredFile, callback){
    const BtnMeshbluConfig = require ('meshblu-config');
    console.log("Btn Cred File: " , btnCredFile);

    const btnMeshbluConfig    = new BtnMeshbluConfig(btnCredFile).toJSON()
    const btnMeshblu          = new MeshbluHttp(btnMeshbluConfig)
    console.log(btnMeshbluConfig);
    const message = {devices: ['*'], data:{"device":{"genisys":{roomId:"64bf33c0-e1e8-443c-8e0b-f79cb0b81284"}}}}
    btnMeshblu.message(message, function(error, response){
      if (error) return callback (error)
      callback(null)
    })

  }
  isSkypeOn(callback){
    meshblu.device(this.roomId, function(error, device) {
      if (error) return callback(error)

      var inSkype = _.get(device, 'genisys.inSkype', false)

      console.log ('inSkype', inSkype)
      callback(null, inSkype)
    })
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
