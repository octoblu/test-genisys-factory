'use strict'
var jsonFile      = require('jsonfile');
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
    this.lightId = this.roomJSON.lightId;

    var meshbluConfig = new MeshbluConfig().toJSON();
    this.meshblu = new MeshbluHttp(meshbluConfig);

    this.api = new HueApi(this.roomJSON.bridgeIp, hueUsername);
    //console.log("Status of Hue Api " + JSON.stringify(status));
  }
  isBooked(){
    meshblu.device(this.roomId, function(error, device){
      if(error) return error
      //JSON.stringify(device.genisys.booked)
      var status = device.genisys.booked;
      console.log("Room Status " + status);
      if (status == true) {
        console.log("Room is not avaialble (booked) ");
      }
      if (status == false) {
        console.log("Room is avaialble");
      }

      console.log("isBooked called!");
      return status;

    })
  }
  isLightInMeeting(callback){
    //console.log("isLightInMeeting Called!");
    this.api.lightStatus(this.lightId, function(error, result) {
      if (error) {
        callback(error);
      }
      console.log("isLightInMeeting Called without error!");
      console.log("Light Status : " + JSON.stringify(result.state.hue));
      if (result.state.hue == 21844){
        console.log("Light status is set to  be available");
        callback(null,true); //Room is available
      }
      else if (result.state.hue == 0){
        console.log("Light status is set to be in-meeting");
        callback(null,false); //Room is not available(booked).
      }
    })

  }
}
