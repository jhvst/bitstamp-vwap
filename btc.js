
var request = require("request");
var fs = require('fs');
var blob = [];

switch (process.argv[2]) {
  case "day":
    var interval = 3600000;
    break;
  case "hour":
    var interval = 600000;
    break;
  case "minute":
    var interval = 10000;
    break;
  default:
    var interval = 10000;
    break;
}

setInterval(function() {
  request("https://www.bitstamp.net/api/ticker/", function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var ticker = JSON.parse(body);
      blob.push(JSON.stringify([new Date().getTime(), parseFloat(ticker.last)]));
      if (blob.length >= 2) {
        fs.writeFile("btc-"+ process.argv[2] + ".json" || "hour.json", "["+ blob +"]", function (err) {
          if (err) throw err;
        });
      }
      console.log("$" + parseFloat(ticker.last) + " (" + process.argv[2] + ")");
    }
  });
}, interval);
