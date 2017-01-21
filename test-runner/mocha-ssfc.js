'use strict'

var colors = require('colors')

var fs   = require("fs")
var path = require("path")
var JSON = require('JSON')
var jsonQ = require('JSONQ')
var glob = require("glob")
var Mocha = require('mocha')
var async = require('async')
var _ = require('lodash')
var now = require("performance-now")

const testRunnerLog = require('debug')('test-runner')

//var mocha = new Mocha({})
var listDir = []

var results = ''

var root = {
  'rooms' : []
}
var resultsJSON = jsonQ(root)


function runTestForConfig(entry, callback) {
  process.env.ROOM = entry
  var roomName = entry.split('/')[2]
  msg = '===================== Starting the test for room : ' + roomName + ' ================================================'
  results +=msg
  testRunnerLog(msg);


  resultsJSON.find('rooms').append({roomName})

  var mocha = new Mocha({ reporter : 'doc' })

  var resolved = require.resolve(path.join(__dirname, '../test/Test-Instant-Meeting.js'));
  delete require.cache[resolved];

  var resolved = require.resolve(path.join(__dirname, '../test/Test-Instant-Meeting-Without-Skype.js'));
  delete require.cache[resolved];

  // var resolved = require.resolve(path.join(__dirname, '../test/envtest.js'));
  // delete require.cache[resolved];
  // mocha.addFile('../test/envtest.js')



  mocha.addFile('../test/Test-Instant-Meeting.js')
  mocha.addFile('../test/Test-Instant-Meeting-Without-Skype.js')

  var testStartTime = null
  var testEndTime = null
  var hookStartTime = null
  var hookEndTime = null
  var execStartTime = null
  var execEndTime = null
  var suiteStartTime = null
  var suiteEndTime = null

  var msg = null;

  var runner = mocha.run(callback)

  runner.on('test', function(test){
      testStartTime = now()
    })
  runner.on('test end', function(test){
      testEndTime = now()
      //console.log('Test : ' + test.title + ' took ' + (testEndTime - testStartTime).toFixed(3) + ' ms');
    })

    runner.on('pass', function(test){
      msg = '\n\t\tTest: ' + test.title.green + ' passed'.green.bold
      results += msg
      testRunnerLog(msg)
      //console.log("********** TEST FULL TITLE " , test.fullTitle());
    })

  runner.on('fail', function(test){
      msg = '\n\t\tTest: ' + test.title.red + ' failed'.red.bold
      results += msg
      testRunnerLog(msg)

      msg = '\n\t\t' + test.err.stack.red.dim
      results += msg
      testRunnerLog(msg);
    })

    .on('hook', function(hook){
      hookStartTime = now()
    })

    .on('hook end', function(hook){
       if(hook.title == '' || hook.title == null) return
       hookEndTime = now()
        msg = '\n\t\tAction :' + hook.title.split(':')[1] + ' took ' + (hookEndTime - hookStartTime).toFixed(3) + ' ms'
        results += msg
        testRunnerLog(msg);
    })

    .on('suite', function(suite){
      if (suite.title == ''  || suite.title == null) return
      suiteStartTime = now()
      msg = '\n\t\tSuite :' + suite.title.bold + ' started'.bold
      results += msg
      testRunnerLog(msg);
      //console.log("MOCHA OBJECT " , mocha.Mocha);

    })

    .on('suite end' , function(suite){
      if (suite.title == '' || suite.title == null ) return
      suiteEndTime = now()
      msg = '\n\t\tSuite:'+ suite.title + ' ended and it took ' + (suiteEndTime - suiteStartTime).toFixed(3) + ' ms\n\n'
      results += msg
      var aRoom = resultsJSON.find('Skydyne')
      aRoom.append('Suite 1')
      testRunnerLog(msg);

    })

    runner.on('end', function () {
    //console.log(JSON.stringify(['end', runner.stats]));
  });



}

glob("../config/*", function (error, files) {
  if (error) {
    console.log('Error Parsing directory');
  }

  var files = _.filter(files, function(file){
    return fs.lstatSync(file).isDirectory()
  })

  async.eachSeries(files, async.reflect(runTestForConfig), function(error, out){
    console.log('done with all tests!')

    //console.log("Results : " , results);

    //console.log("RESULTS JSON : " + JSON.stringify(resultsJSON, null, 2));
  })


})
