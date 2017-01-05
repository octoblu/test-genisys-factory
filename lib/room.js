'use strict'
var jsonFile      = require('jsonfile');
var request       = require('request');
var _ = require('lodash');
var HueApi        = require('node-hue-api').HueApi;
var MeshbluHttp   = require ('meshblu-http');
var MeshbluConfig = require ('meshblu-config');
var meshbluConfig = new MeshbluConfig().toJSON()
var meshblu = new MeshbluHttp(meshbluConfig)

var hueUsername = 'newdeveloper';


module.exports = class Room {
  constructor(roomJSONFile){
    this.roomJSON = jsonFile.readFileSync(roomJSONFile);
    this.roomId  = this.roomJSON.roomId;
    this.roomUrl = this.roomJSON.url;
    this.lightId = this.roomJSON.lightId;11

    var meshbluConfig = new MeshbluConfig().toJSON();
    this.meshblu = new MeshbluHttp(meshbluConfig);

    this.api = new HueApi(this.roomJSON.bridgeIp, hueUsername);
    //console.log("Status of Hue Api " + JSON.stringify(status));
  }
  isBooked(callback){
    meshblu.device(this.roomId, function(error, device){
      if(error) {
        return callback(error);
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

  triggerSwitch(callback){
    request.post(this.roomUrl,
    {
      json: {'roomId': this.roomId}
    },
    function (error, theResponse)
    {
      if(error) return callback(error)
      //var response = theResponse
      //_.delay(callback, 15000)
      //console.log("Response : " , theResponse);
      callback(null, theResponse)
    })

  }
}
