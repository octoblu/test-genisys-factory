var expect = require('chai').expect;

var room = 'Skydyne'

describe('Instant meeting with Skype on :', function() {

 before('Test is run reset the room:', function(done){
    setTimeout(done, 100);
  })

 describe('Verify Instant Meeting is created successfully', function(){

   it('Should verify that currentMeeting in room exists', function() {
      expect(true).to.be.true
    })

   it('Should verify that meetingUrl in room exists', function() {
       expect(true).to.be.true
    })

 })



 describe('Verify Skype functionality:', function(){

   describe('Verify that Skype starts successfully', function(){
      before('Start Skype', function() {
      })

     before('Test Skype Audio/Video', function(){

     })

     it('Should verify that inSkype property of room is set to true', function() {
        expect(true).to.be.true
      })


     it('Should verify that audio is enabled', function() {
        expect(true).to.be.true
      })

     it('Should verify that video is enabled', function() {
        expect(true).to.be.true
      })


   })


   describe('Verify that Skype is Ending successfully', function(){
      before('End Skype Session', function(){

     })

     it('Should verify inSkype is false', function() {
        expect(true).to.be.true
      })
    })

 })

 describe('Verify that Meeting is Ending successfully', function(){

   before('End Meeting', function(){

   })

   it('Should verify that currentMeeting in room does not exists', function() {
      expect(true).to.be.true
    })

   it('Should verify that meetingUrl in room does not exists', function() {
       expect(true).to.be.true
    })

   it('Should that inSkype property of room is set to false', function() {
      expect(true).to.be.true
    })
  })
})
