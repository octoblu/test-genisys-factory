var _             = require('lodash');
var expect        = require('chai').expect;
var hue           = require('node-hue-api');
var HueApi        = require('node-hue-api').HueApi;
var jsonFile      = require('jsonfile');
var MeshbluConfig = require('meshblu-config');
var MeshbluHttp   = require('meshblu-http');
var request       = require('request');

var api = null;
var meeting_room = null;
var meeting_room_file = './config/rooms/Skydyne.json';
var username = 'newdeveloper';
var meshblu_trigger = 'https://triggers.octoblu.com/v2/flows/'
var meshblu_hue_integration_flow = 'f0e859b8-17e2-4dee-87fe-e71f733cc1d0'
var meshblu_hue_trigger = '9c516ba1-c251-11e6-8ac8-5588f11c4255'
var hue_in_meeting_state = 0;   //21844 is green(available), 0 is red(in meeting)
var meshblu = null;
var response = null;
var currentMeeting = null;

var displayStatus = function(status) {
    console.log(JSON.stringify(status, null, 2));
};

describe('Instant meeting test', function(){
  this.timeout(20000)

  before('Setting up the test', function(){
    meeting_room = jsonFile.readFileSync(meeting_room_file);
    api = new HueApi(meeting_room.bridge_ip, username);
    roomId = meeting_room.roomId
    var meshbluConfig = new MeshbluConfig().toJSON()
    meshblu = new MeshbluHttp(meshbluConfig)
  });

  before('Trigger to book a meeting', function(done){
    request.post('https://triggers.octoblu.com/v2/flows/f0e859b8-17e2-4dee-87fe-e71f733cc1d0/triggers/9c516ba1-c251-11e6-8ac8-5588f11c4255',
    {
      json: {'roomId': roomId}
    },
    function (error, theResponse)
    {
      if(error) return done(error)
      response = theResponse
      _.delay(done, 15000)
    })
  })

  before('Get the room data', function(done){
    meshblu.device(roomId, function(error, device){
      if(error) return done(error)
      currentMeeting = device.genisys.currentMeeting
      done()
    })
  })

  it('Toogle the trigger', function(){
    expect(response.statusCode).to.equal(201)
  })


  it('Checking if the light respond accordingly', function(done){
    api.lightStatus(meeting_room.light_id, function(error, result) {
      if (error) return done(error)
      if (result.state.hue == 0){
        var color = 'red'
      }
      else {
        color = 'green'
      }
      if (currentMeeting == null) {
        expect(result.state.hue).to.equal(21844)
        console.log('The room is avaible and light is ' + color)
      }
      if (currentMeeting != null){
        expect(result.state.hue).to.equal(0)
        console.log('The room is booked and light is ' + color)
      }
      done()
    });
  });


});
