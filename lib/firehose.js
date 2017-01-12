'use strict'
var path   = require('path')
var expect = require('chai').expect;
var assert = require('assert');
var sinon  = require('sinon');

// var btnCredFile = {filename: path.join(__dirname, '../config/skydyne/hue_button.json')}

var btnCredFile   = require('../config/octobluconf/button.json')
var roomOptions   = require('../config/octobluconf/room.json')
var meshbluConfig = require('../config/meshblu-dev.json')
var Room          = require('../lib/room.js')

var room = new Room({ room: roomOptions, meshbluConfig: meshbluConfig, btnCredFile: btnCredFile });
// var messageHandler = sinon.stub()
var message = {}
const buttonTimeout = 15000;


describe('Ad hoc meeting test:', function() {
  this.timeout(25000)

  before('Connecting to Firehose', function(done){
    room.connectFirehose(function(result){
      console.log('connected to firehose')
      done()
    })
  })

  it('Setup message handler', function(done){
    room.listen(function(){
      console.log("Completed listening");
      done()
    })

  })

  // before('Send Message', function(done){
  //       room.startSkype(function(error) {
  //         if (error) return done (error)
  //         done()
  //       })
  // })


  it('should call the message handler', function(){
    // // expect(messageHandler).to.have.been.calledOnce
    // // console.log(messageHandler.onCall(0))
    // console.log(messageHandler)
  })




  //   before('Make sure the room is avaialble', function(done){
  //     room.getRoomState(function(error, roomState){
  //       if(error) return done(error)
  //       console.log('Room State in BEFORE ', roomState.currentMeeting);
  //       if(roomState.currentMeeting != undefined){
  //         console.log('room is BOOKED')
  //         room.triggerButtonPress(function(error){
  //           console.log('trigger button')
  //           if (error) return done(error)
  //           setTimeout(function(){
  //             console.log('Time Out Over');
  //             done()
  //           }, 15000)
  //         })
  //       }
  //       else done()
  //     })
  //
  //   })
  //
  // describe('Start Ad-hoc meeting test:', function() {
  //   let roomState = {}
  //
  //   before('Start an Ad-hoc meeting', function(done) {
  //     room.triggerButtonPress(function(error) {
  //       if(error) done(error)
  //
  //       setTimeout(function() {
  //         room.getRoomState(function(error, result) {
  //           roomState = result
  //           done(error)
  //         })
  //       }, 15000)
  //     })
  //   })
  //
  //   it('verify that currentMeeting exists', function() {
  //     expect(roomState.currentMeeting).to.exist
  //   })
  //
  //   it('verify that meetingUrl exists', function() {
  //     expect(roomState.meetingUrl).to.exist
  //   })
  //
  //   it('verify that inSkype property is set to false', function() {
  //     expect(roomState.inSkype).to.be.false
  //   })
  //
  //   it('verify that the color of Hue light is Red', function(done) {
  //     room.getLightColor(function(error, color) {
  //       if(error) {
  //         console.log('Error' + error.message);
  //         done(error)
  //       }
  //       expect(color).to.equal('Red')
  //       done()
  //     })
  //   })
  // })


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
