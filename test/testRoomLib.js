

var Room = require("../lib/room.js")
var room = new Room("../config/room.json");

room.isBooked();
//var status = room.isLightInMeeting();

room.isLightInMeeting(function(error,status){
  if(error){
    console.log("Error : " + error);
  }
  else {
    console.log("Light Status : " + status);
  }
});
