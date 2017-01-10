'use strict'
var path   = require('path')
var expect = require('chai').expect;
var assert = require('assert');

// var btnCredFile = {filename: path.join(__dirname, '../config/skydyne/hue_button.json')}

var btnCredFile   = require('../config/octobluconf/button.json')
var roomOptions   = require('../config/octobluconf/room.json')
var meshbluConfig = require('../config/meshblu-dev.json')
var Room          = require('../lib/room.js')

var room = new Room({ room: roomOptions, meshbluConfig: meshbluConfig, btnCredFile: btnCredFile });

var state = {}



describe('Create Ad hoc meeting test:', function()  {
    this.timeout(20000)
    let roomState = {}
    before('Create Room test ', function(done) {
      room.createAdHocMeeting(function(error) {
        if(error){
          console.log("Error createAdHocMeeting : " + error.message);
          done(error)
        }
        setTimeout(function(){
          room.getRoomState(function(result){
            roomState = result
            console.log('the state :', roomState)
            done()
          })
        }, 15000);
      })
    })
//
    it('verify that currentMeeting exists', function() {
      expect(roomState.currentMeeting).to.exist
    })

    it('verify that meetingUrl exists', function() {
      expect(roomState.meetingUrl).to.exist
    })

    it('verify that inSkype property is set to false', function() {
      expect(roomState.inSkype).to.be.false
    })

    it('verify that the color of Hue light is Red', function(done) {
      room.getLightColor(function(error, color) {
        if(error) {
          console.log('Error' + error.message);
          done(error)
        }
        expect(color).to.equal('Red')
        done()
      })
    })


})
