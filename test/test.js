
var assert = require("assert");
var vwap = require('../main.js');
var should = require('should');

describe('Bitstamp API', function(){

  describe('BTC ticker', function(){
    it('should return array of length 2', function(done){
      vwap.BTC(function(err, data) {
        if (err) throw err;
        console.log(data);
        data.length.should.equal(2);
        done();
      })
    })
  })

  describe('VWAP calculator', function(){
    it('should return array of length 2', function(done){
      vwap.VWAP("hour", function(err, data) {
        if (err) throw err;
        console.log(data);
        data.length.should.equal(2);
        done();
      })
    })
  })

});
