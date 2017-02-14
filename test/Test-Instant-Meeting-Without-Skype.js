'use strict'

var path          = require('path')
var expect        = require('chai').expect;
var assert        = require('assert');

var meshbluConfig  = require('../meshblu.json')
var Room           = require('../lib/room.js')
var _              = require('lodash')

// var room = new Room({
//   room: roomOptions,
//   meshbluConfig: meshbluConfig,
//   inquisitorFile : inquisitorFile,
//   btnCredFile : btnCredFile
// });
// var message = {}
const buttonTimeout = 55000;

var currentRoomState = {}


xdescribe('Instant meeting without Skype:', function() {
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


    after(function(done){
      room.closeFirehose(function(error){
        if (error) done(error)
        done()
      })
    })

  })
})
