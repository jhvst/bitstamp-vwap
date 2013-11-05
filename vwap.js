
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
  request("https://www.bitstamp.net/api/transactions/?time=" + process.argv[2] || "hour", function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var transactions = JSON.parse(body);
      var vwap = 0, kerroin = 0, jakaja = 0;
      transactions.forEach(function (value, index) {
        kerroin = kerroin + parseFloat(value.price) * parseFloat(value.amount);
        jakaja = jakaja + parseFloat(value.amount);
        if (index == transactions.length - 1) {
          vwap = kerroin / jakaja;
          blob.push(JSON.stringify([new Date().getTime(), parseFloat(vwap.toPrecision(5))]));
          if (blob.length >= 2) {
            fs.writeFile(process.argv[2] + ".json" || "hour.json", "["+ blob +"]", function (err) {
              if (err) throw err;
            });
          }
          console.log("$" + vwap.toPrecision(5) + " (" + process.argv[2] + ")");
        };
      });
    }
  });
}, interval);
