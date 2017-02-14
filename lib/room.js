'use strict'

const _ = require('lodash');
const MeshbluHttp = require('meshblu-http');
const MeshbluFirehose = require('meshblu-firehose-socket.io')

class Room {
  constructor(options) {
    this.meshbluHttp = {}
    this.meshbluHttp.customer = new MeshbluHttp(options.meshbluConfigs.customer);
    this.meshbluHttp.button   = new MeshbluHttp(options.meshbluConfigs.room[0].buttton);

    this.firehose = {}
    this.firehose.room  = new MeshbluFirehose({meshbluConfig: options.meshbluConfigs.room[0].room})
    this.firehose.light = new MeshbluFirehose({meshbluConfig: options.meshbluConfigs.room[0].light})
    this.firehose.skype = new MeshbluFirehose({meshbluConfig: options.meshbluConfigs.room[0].skype})

    // this.firehose = new MeshbluFirehose({meshbluConfig: options.inquisitorFile})

    this.room = options.room;
    this.availableRoomState = {
      currentMeeting: undefined,
      meetingUrl: undefined,
      inSkype: false,
      subject: undefined
    };

    // this.firehose.connect(function(error) {
    //   if (error)
    //     return console.error('Error Connecting', error)
    //   var connect = 'CONNECTED'
    // })
  }

  resetRoom(callback) {
    let roomState = {}

    this.getRoomState((error, roomState) => {
      if (error)
      return callback(error)

      const currentMeeting = roomState.currentMeeting

      if (_.isEmpty(currentMeeting))
      return callback(null, 'Available')

      this.triggerButtonPress((error) => {
        if (error)
        callback(error)

        this.waitForMeeting('Available', _.once((error, result) => {
          if (error)
          callback(error)
          callback(null, result)
        }))
      })
    })
  }

  waitForMeeting(expected, callback) {
    let result = undefined

    callback = _.once(callback)
    setTimeout(function() {
      callback(null, result)
    }, 40000)

    this.firehose.on('message', function(message) {
      if (message.data.type !== 'octoblu:smartspaces:room') return

      result = message.data.genisys.currentMeeting

      if (expected === 'Booked' && result !== undefined) callback(null, 'Booked')
      else if (expected === 'Available' && result === undefined) callback(null, 'Available')

    })
  }

  triggerButtonPress(callback) {
    const message = {
      devices: ['*'],
      data: {
        "device": {
          "genisys": {
            roomId: this.room.roomId
          }
        }
      }
    }
    this.btnMeshblu.message(message, function(error) {
      if (error)
      return callback(error)
      callback(null)

    })
  }

  getRoomState(callback) {
    this.meshblu.device(this.room.roomId, function(error, device) {
      if (error)
      return callback(error)
      var roomState = {
        currentMeeting: _.get(device, 'genisys.currentMeeting', undefined),
        meetingUrl: _.get(device, 'genisys.currentMeeting.meetingUrl', undefined),
        inSkype: _.get(device, 'genisys.inSkype', undefined),
        subject: _.get(device, 'genisys.currentMeeting.subject', undefined)
      }
      callback(null, roomState)
    })
  }

  waitForLight(expected, callback) {
    let result = null

    callback = _.once(callback)
    setTimeout(function() {
      callback(null, result)
    }, 40000)

    this.firehose.on('message', function(message) {
      if (message.data.type !== 'device:hue-light') return

      result = message.data.color
      if (result === '#430000ff') result = 'Red'
      if (result === '#004300ff') result = 'Green'

      if (expected === 'Red' && result === '#430000ff')
      return callback(null, 'Red')
      else if (expected === 'Green' && result === '#004300ff')
      return callback(null, 'Green')
    })

  }

  startSkype(callback) {
    const startSkype = {
      "$set": {
        "genisys.actions.start-skype": {}
      }
    }
    this.meshblu.updateDangerously(this.room.roomId, startSkype, function(error) {
      if (error)
      return callback(error)

      callback()
    })
  }

  endSkype(callback) {
    const endSkype = {
      "$set": {
        "genisys.actions.end-skype": {}
      }
    }
    this.meshblu.updateDangerously(this.room.roomId, endSkype, function(error) {
      if (error)
      return callback(error)
      callback()
    })
  }


  waitForRoomInSkype(expected, callback) {
    callback = _.once(callback)
    let result = null

    setTimeout(function() {
      callback(null, result)
    }, 40000)


    this.firehose.on('message', function(message) {
      if (message.data.type !== 'octoblu:smartspaces:room') return

      result = message.data.genisys.inSkype

      if (expected === 'inSkype' && message.data.genisys.inSkype === true)
      callback(null, true)
      if (expected === 'outSkype' && message.data.genisys.inSkype === false)
      callback(null, false)
    })
  }

  waitforSkypeAV(expected, callback) {
    if (this.room.skypeId === undefined)
    return callback(new Error('Skype ID is not defined. Please check Room JSON.'))

    let result = {
      audio: false,
      video: false
    }

    callback = _.once(callback)
    setTimeout(function() {
      callback(result)
    }, 40000)

    this.firehose.on('message', function(message) {
      if (message.data.type !== 'device:skype')
      return

      result.audio = message.data.state.audioEnabled
      result.video = message.data.state.videoEnabled

      if (expected === 'inSkype' && result.audio && result.video) {
        callback(result)
      }
    })
  }

  closeFirehose(callback){
    this.firehose.close(function(error){
      callback(error)
    })
  }
}

module.exports = Room
