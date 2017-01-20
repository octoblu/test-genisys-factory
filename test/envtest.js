var expect = require('chai').expect
var roomDir = process.env.ROOM;

var inqFile = roomDir + "/inquisitor.json"

var inq = require(inqFile)

describe('Test ENV', function(){
  before('Before block setup the tets', function(done){
    console.log('Inside Before block');
    setTimeout(done, 400)
  })
  before('Before block setup the tets hook', function(done){
    console.log('Inside Before block');
    setTimeout(done, 200)
  })
  it('Test-1', function(done){
    console.log('INQ File : ' + inqFile);
    setTimeout(done, 100)
  })

  it('Test-2', function(){
    console.log('INQ File : ' + inqFile);
    expect(true).to.be.true
  })
  
  describe('Test ENV 2', function(){
    before('Before block setup the tets 2', function(done){
      console.log('Inside Before block');
      setTimeout(done, 400)
    })
    before('Before block setup the tets hook 2', function(done){
      console.log('Inside Before block');
      setTimeout(done, 200)
    })
    it('Test-3', function(done){
      console.log('INQ File : ' + inqFile);
      setTimeout(done, 100)
    })

    it('Test-4', function(){
      console.log('INQ File : ' + inqFile);
      expect(true).to.be.false
    })
  })
})
