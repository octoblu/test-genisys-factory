var Room = require("../lib/room.js")
var room = new Room("../config/room.json");

room.isBooked(function(error, result){
  if(error){
    console.log("isBooked Error : " + error);
  }
  else {
    console.log("isBooked result : " + result);
  }
});
//var status = room.isLightInMeeting();

/*room.isLightInMeeting(function(error, result){
  if(error){
    console.log("islIghtInMeeting Error : " + error);
  }
  else {
    console.log("islIghtInMeeting result : " + result);
  }
});*/

// room.triggerSwitch(function(error,result){
//   if(error){
//     console.log("bookRoom Error : " + error);
//   }
//   else {
//     console.log("bookRoom result : " , result);
//   }
// }
//
// )
