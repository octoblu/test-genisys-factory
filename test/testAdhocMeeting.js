var path = require ('path')
var Room = require("../lib/room.js")
var room = new Room("../config/skydyne/room.json","../config/meshblu_PROD.json");
var btnCredFile = {filename: path.join(__dirname, '../config/skydyne/hue_button.json')}
var expect        = require('chai').expect;
var assert = require('assert');



describe('Ad hoc meeting test:', function(){
  this.timeout(20000)



  xit('Old Before', function(done) {
    console.log("in BEFORE");
    room.isBooked(function(error, result){
      console.log("In before isBooked");
      if (error) done (error)
      console.log("isBooked result : " + result);
      if(result){
        room.pressButton(btnCredFile, function(error,result){
          if (error) done (error)
          //console.log("bookRoom result : " , result);
          })
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
  xit('When the hue button in the room is pressed', function(done){
    room.pressButton(btnCredFile, function(error){
      if(error) return done(error)
      return done()

    })
  }
)

it("Then the Skype should be running", function(done){
  room.isSkypeOn(function(error, status){
    console.log("Skype Status ", status);


  })
})

})
