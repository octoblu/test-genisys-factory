var Room = require("../lib/room.js")
var room = new Room("../config/meshblu_skydyne_room.json");
var expect        = require('chai').expect;
var assert = require('assert');


describe('Ad hoc meeting test:', function(){
  this.timeout(20000)
  before('Set the status of the room to be avaialble',function(done) {
    room.isBooked(function(error, result){
      if(error){
        done("there was an error booking the room" + error.message)
      }
      else {
        console.log("isBooked result : " + result);
        if(result){
          //Trigger Switch to unbook the room
          room.triggerSwitch(function(error,result){
            if(error){
              console.log("bookRoom Error : " + error);
            }
            else {
              console.log("bookRoom result : " , result);
            }
          }

          )

        }

      }
    })
    done()

  })
  xit('At the start of the test suit Light Status should be avaialble', function(done){
    console.log('checking for room light')
    room.isLightInMeeting(function(error, result){
      console.log({error,result})

      if(error){
        console.log("isLightInMeeting Error Mocha : " + error);
        return done(error);
      }
      else{
      console.log("islIghtInMeeting result Mocha: " + result);
      assert.equal(false, true);
      done();
    }

    })

  }
)

})
