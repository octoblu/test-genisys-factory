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


describe('Instant Meeting', function() {
  this.timeout(70000)

  before('Test is run reset the room:', function(done){

    room.resetRoom(function(error, result){
      if (error) done(error)
      console.log('Room RESET Complete with result state of room : ', result)
      done()
    })

  })


  describe('Instant meeting without Skype:', function() {
  var roomState = {};
  var light = null;

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



    describe('Verify Instant Meeting is created successfully', function(){

      it('Should that currentMeeting exists', function() {
        console.log('currentMeeting', roomState.currentMeeting);
        expect(roomState.currentMeeting).to.exist
      })

      it('Should that meetingUrl exists', function() {
         expect(roomState.meetingUrl).to.exist
      })

      it('Should that inSkype property is set to false', function() {
        expect(roomState.inSkype).to.be.false
      })

      it('Should that the subject is set to Instant Meeting', function() {
        expect(roomState.subject).to.equal('Instant Meeting')
      })

    })

    describe('Verify that the light color is changed to red', function () {
      var actualColor = null;

      before('Get the light status', function(done) {
        room.waitForLight('Red', _.once(function(error, color) {
          actualColor = color
          if (error) done(error)
          done()

        }))
      })

      it('Should change to red', function(){
        expect(actualColor).to.equal('Red')
      })

    })

  })


  // describe('Test Skype within Ad hoc meeting:', function(){
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
