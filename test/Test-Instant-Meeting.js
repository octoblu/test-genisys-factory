'use strict'
var path   = require('path')
var expect = require('chai').expect;
var assert = require('assert');

var inquisitorFile = require ('../config/inquisitor.json')
var btnCredFile    = require('../config/Skydyne/button.json')
var roomOptions    = require('../config/Skydyne/room.json')
var meshbluConfig  = require('../config/meshblu-citrix.json')
var Room           = require('../lib/room.js')
var _              = require('lodash')

var room = new Room({
  room: roomOptions,
  meshbluConfig: meshbluConfig,
  inquisitorFile : inquisitorFile,
  btnCredFile : btnCredFile
});
var message = {}
const buttonTimeout = 55000;

var currentRoomState = {}


describe('Instant meeting with Skype:', function() {
  this.timeout(70000)
  var roomState = {};
  var light = null;
  var actualColor = null;

  before('Test is run reset the room:', function(done){
    room.resetRoom(function(error, result){
      if (error) done(error)
      done()
    })
  })

  before('Start an Instant meeting:', function(done) {
    room.triggerButtonPress(function(error) {
      if(error) done(error)
      room.waitForMeeting('Booked', _.once(function(error, result){
        if (error) done (error)
        room.getRoomState(function(error, state){
          if (error) done(error);
          roomState = state
          done()
        })
      }))
    })
  })

  before('Get the light status', function(done) {
    room.waitForLight('Red', _.once(function(error, color) {
      actualColor = color
      if (error) done(error)
      done()
    }))
  })

  describe('Verify Instant Meeting is created successfully', function(){

    it('Should verify that currentMeeting in room exists', function() {
      expect(roomState.currentMeeting).to.exist
    })

    it('Should verify that meetingUrl in room exists', function() {
       expect(roomState.meetingUrl).to.exist
    })

    it('Should verify that inSkype property of room is set to false', function() {
      expect(roomState.inSkype).to.be.false
    })

    it('Should verify that the meeting subject is set to Instant Meeting', function() {
      expect(roomState.subject).to.equal('Instant Meeting')
    })

    it('Should verify that light color changes to red', function(){
      expect(actualColor).to.equal('Red')
    })

  })



  describe('Verify Skype functionality:', function(){
    var expectedAVState = {audio : true, video : true}
    var actualAVState = {}
    var skypeRoomState = null

    describe('Verify that Skype starts successfully', function(){
      before('Start Skype', function(done) {
        room.startSkype(function(error) {
          if (error) return done (error)

          room.waitForRoomInSkype('inSkype', function(error, state){
            if (error) done(error);
            skypeRoomState = state
            done()
          })

        })
      })

      before('Test Skype Audio/Video', function(done){
        room.waitforSkypeAV('inSkype', function(AVState){
            actualAVState = AVState
            done()
        })
      })

      it('Should verify that inSkype property of room is set to true', function() {
        expect(skypeRoomState).to.be.true
      })


      it('Should verify that audio is enabled', function() {
        expect(actualAVState.audio).to.be.true
      })

      it('Should verify that video is enabled', function() {
        expect(actualAVState.video).to.be.true
      })


    })


    describe('Verify that Skype is Ending successfully', function(){
      before('End Skype Session', function(done){
        room.endSkype(function(error){
          if (error) console.log('Error ending skype : ', error);

          room.waitForRoomInSkype('outSkype', function(error, state){
            if (error) done(error);
            skypeRoomState = state
            done()
          })
        })
      })

      it('Should verify inSkype is false', function() {
        expect(skypeRoomState).to.be.false
      })
    })

  })

  describe('Verify that Meeting is Ending successfully', function(){

    before('End Meeting', function(done){
      room.triggerButtonPress(function(error) {
        if(error) done(error)
        room.waitForMeeting('Available', _.once(function(error, result){
          if (error) done (error)
          room.getRoomState(function(error, state){
            if (error) done(error);
            roomState = state
            done()
          })
        }))
      })
    })

    it('Should verify that currentMeeting in room does not exists', function() {
      expect(roomState.currentMeeting).to.not.exist
    })

    it('Should verify that meetingUrl in room does not exists', function() {
       expect(roomState.meetingUrl).to.not.exist
    })

    it('Should that inSkype property of room is set to false', function() {
      expect(roomState.inSkype).to.be.false
    })
  })
})
