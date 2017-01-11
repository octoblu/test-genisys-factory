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


describe('Ad hoc meeting test:', function() {
  this.timeout(35000)

  describe('Reset the room:', function() {

    before('test', function(done){
      room.resetRoom(function(error, result){
        var output = result
        done(error)
      })
    })

    it('Reset test', function() {
      expect(true).to.be.true
    })

  })

  describe('Start Ad-hoc meeting test:', function() {
    let roomState = {}

    before('Start an Ad-hoc meeting', function(done) {
      room.triggerButtonPress(function(error) {
        if(error) done(error)

        setTimeout(function() {
          room.getRoomState(function(error, result) {
            roomState = result
            done(error)
          })
        }, 15000)
      })
    })

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


  describe('Test Skype within Ad hoc meeting:', function(){
    var skypeState = {}

    before('Start Skype', function(done) {
      room.startSkype(function(error) {
        if (error) return done (error)
      })
      setTimeout(function(){
        room.getSkypeState(function(result) {
          skypeState = result
          done()
        })
      }, 10000);
    })
    it('verify audio is enabled', function() {
      expect(skypeState.audio).to.be.true
    })
    it('verify video is enabled', function() {
      expect(skypeState.audio).to.be.true
    })
  })
})
