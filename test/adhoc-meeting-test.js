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

const testTimeout    = 30 * 1000;
const messageTimeout = 20 * 1000;


describe('Instant meeting test suite:', function() {
  this.timeout(testTimeout)

  before('Reset room', function(done){
    room.resetRoom(messageTimeout, function(error, result){
      done(error)
    })
  })

  describe('Instant meeting test without Skype', function() {
    let roomState = {}

    before('Starting an Instant meeting', function(done) {
      room.triggerButtonPress(messageTimeout, function(error) {
        console.log('button press')
        if(error) done(error)
        else done()
      })
    })

    it('should have currentMeeting', function() {
      expect(roomState.currentMeeting).to.exist
    })

    it('should have valid meetingUrl', function() {
      expect(roomState.meetingUrl).to.exist
    })

    it('should not be in a Skype session', function() {
      expect(roomState.inSkype).to.be.false
    })

    it('should have a red light', function(done) {
      room.getLightColor(function(error, color) {
        if(error) {
          console.log('Error' + error.message);
          done(error)
        }
        expect(color).to.equal('Red')
        done()
      })
    })


  describe('Test End instant meeting', function() {
    before('Trigger End Meeting', function(done) {
      room.triggerButtonPress(messageTimeout,function(error) {
        if(error) done(error)

        console.log('Ending meeting')
        done()
      })
    })

      it('fake test', function() {
        expect(true).to.be.true
      })

    })

  })


  // describe('Test Skype within Instant meeting:', function(){
  //   var skypeState = {}
  //
  //   before('Start Skype', function(done) {
  //     room.startSkype(function(error) {
  //       if (error) return done (error)
  //     })
  //     setTimeout(function(){
  //       room.getSkypeState(function(result) {
  //         skypeState = result
  //         done()
  //       })
  //     }, 10000);
  //   })
  //   it('verify audio is enabled', function() {
  //     expect(skypeState.audio).to.be.true
  //   })
  //   it('verify video is enabled', function() {
  //     expect(skypeState.audio).to.be.true
  //   })
  // })

})
