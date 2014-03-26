
var vwap = require('../main.js')

/*

    Fetches BTC and VWAP price every two seconds.
    Draws graph every third second.
    (!) Notice that there are some limits how frequently you can fetch the prices. See: https://www.bitstamp.net/api/ 

    */

function main () {
  //DrawGraph requires you to wrap the data into an array.
  var btcContainer = [];
  var vwapContainer = [];
  setInterval(function () {
    vwap.BTC(function (err, data) {
      if (err) throw err;
      btcContainer.push(data)
    });
    vwap.VWAP('hour', function (err, data) {
      if (err) throw err;
      vwapContainer.push(data)
    });
    //Make sure not to consume too much RAM
    //You could also save the data here into a .json file
    JSON.parse(btcContainer).slice(-500);
    JSON.parse(vwapContainer).slice(-500);
  }, 2000);
  setInterval(function () {
    vwap.drawGraph(btcContainer, vwapContainer);
  }, 3000);
}

main();
