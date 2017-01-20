'use strict'

var fs   = require("fs")
var path = require("path")
var JSON = require('JSON')
var glob = require("glob")
var Mocha = require('mocha')
var async = require('async')
var _ = require('lodash')
var now = require("performance-now")
//var mocha = new Mocha({})
var listDir = []

function runTestForConfig(entry, callback) {
  console.log('Got Room : ' + entry);
  process.env.ROOM = entry
  var mocha = new Mocha({})

  // var resolved = require.resolve(path.join(__dirname, '../test/Test-Instant-Meeting.js'));
  // delete require.cache[resolved];

  var resolved = require.resolve(path.join(__dirname, '../test/Test-Instant-Meeting-Without-Skype.js'));
  delete require.cache[resolved];

  //mocha.addFile('../test/Test-Instant-Meeting.js')
  mocha.addFile('../test/Test-Instant-Meeting-Without-Skype.js')


  var testStartTime = null
  var testEndTime = null
  var hookStartTime = null
  var hookEndTime = null
  var execStartTime = null
  var execEndTime = null
  var suiteStartTime = null
  var suiteEndTime = null

  mocha.run(callback)
    .on('test', function(test){
      testStartTime = now()
    })
    .on('test end', function(test){
      testEndTime = now()
      //console.log('*** Test : ' + test.title + ' took ' + (testEndTime - testStartTime).toFixed(3) + ' ms');
    })

    .on('hook', function(hook){
      hookStartTime = now()
    })

    .on('hook end', function(hook){
      hookEndTime = now()
      console.log('*** Hook : ' + hook.title + ' took ' + (hookEndTime - hookStartTime).toFixed(3) + ' ms');
    })

    .on('suite', function(suite){
      suiteStartTime = now()
    })

    .on('suite end', function(suite){
      suiteEndTime = now()
      console.log('*** Suite: ' + suite.title + ' took ' + (suiteEndTime - suiteStartTime).toFixed(3) + ' ms');
    })

    .on('pass', function(test){
      console.log('*** ' + test.title + ' passed.');
    })

    .on('fail', function(test, error){
      console.log('*** ' + test.title + ' failed with error : ' + error.stack)
    })


}

glob("../config/*", function (error, files) {
  if (error) {
    console.log('Error Parsing directory');
  }

  var files = _.filter(files, function(file){
    return fs.lstatSync(file).isDirectory()
  })

  async.eachSeries(files, runTestForConfig, function(error, results){
    console.log('done with all tests!')
  })


})
