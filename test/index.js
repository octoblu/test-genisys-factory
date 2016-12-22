process.env.NODE_ENV = 'test';

var expect   = require("chai").expect;
var jsonFile = require("jsonfile");
var hue      = require("node-hue-api");
var HueApi   = require("node-hue-api").HueApi;
var request  = require("request");


var api = null;
var meeting_room = null;
var meeting_room_file = "./config/rooms/Skydyne.json";
var username = "newdeveloper";
var meshblu_trigger = "https://triggers.octoblu.com/v2/flows/"
var meshblu_hue_integration_flow = "f0e859b8-17e2-4dee-87fe-e71f733cc1d0"
var meshblu_hue_trigger = "9c516ba1-c251-11e6-8ac8-5588f11c4255"
var hue_in_meeting_state = 0;   //21844 is green(available), 0 is red(in meeting)


var displayStatus = function(status) {
    console.log(JSON.stringify(status, null, 2));
};

describe("Ad hoc meeting test:", function(){``
  beforeEach("Setting up the test:", function(){
    meeting_room = jsonFile.readFileSync(meeting_room_file);
    api = new HueApi(meeting_room.bridge_ip, username);
    roomId = meeting_room.roomId
    //console.log("Using Config: \n" + JSON.stringify(meeting_room, null, 2));
  });

  /*
  afterEach("close the bridge connection", function(done){
    api.close(done)
  })
  */

  it("When you start an Ad hoc meeting by pressing Hue tap swicth", function(done){
    console.log("I am in set meeting")
    request.post("https://triggers.octoblu.com/v2/flows/f0e859b8-17e2-4dee-87fe-e71f733cc1d0/triggers/9c516ba1-c251-11e6-8ac8-5588f11c4255", {
      json: {"roomId": "64bf33c0-e1e8-443c-8e0b-f79cb0b81284"},
    }, function (error, response, body) {
      if (error) return done(error);
      if (response.statusCode !== 201) return done(new Error('Unexpected status code: ' + response.statusCode))
      console.log("error: " + error)
      console.log("response.statusCode: " + response.statusCode)
      console.log("response.statusText: " + response.statusText)
      done()
    })
  })

  it("Then the color of the light should change to red", function(done){
    api.lightStatus(meeting_room.light_id, function(error, result) {
      if (error) return done(error)
      displayStatus(result)
      expect(result.state.hue).to.equal(hue_in_meeting_state)
      done()
    });
  });
});
