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
    this.timeout(15000)
    before('Create Room test ', function(done) {
      done()
    })



    it('verify that currentMeeting exists', function(done) {
      setTimeout(function(){
        room.getRoomState(function(result){
          state = result
          console.log('the state :', state)
          done()
        })
      }, 7000);
    })

})
