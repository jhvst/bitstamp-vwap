
var fs = require('fs');
var request = require('request');
var highcharts = require('node-highcharts');

/*

    Fetches the latest BTC price from https://www.bitstamp.net/api/ticker/
    Returns array with [ UNIX timestamp, actual price ]
    Example output: [1383667157746,244.23]
    (!) Notice that there are some limits how frequently you can fetch the prices. See: https://www.bitstamp.net/api/ 

    */

exports.BTC = function (cb) {
  request("https://www.bitstamp.net/api/ticker/", function (error, response, body) {
    if (!error && response.statusCode == 200) {
      this.ticker = JSON.parse(body);
      return cb(null, [new Date().getTime(), parseFloat(this.ticker.last)])
    } else {
      return cb("Error at BTC ticker HTTP request", null)
    }
  })
}

/*

    Calculates the latest VWAP (https://en.wikipedia.org/wiki/Volume-weighted_average_price) from latest transactions.
    Takes in timespan argument, which can be altered with options found on https://www.bitstamp.net/api/ under "Public data functions" -> "Transactions"
    Similar to BTC function, returns calculated price with UNIX timestamp in front of the actual data.
    (!) Notice that this function normally takes slightly longer to run than the BTC function.
    (!) Notice that there are some limits how frequently you can fetch the prices. See: https://www.bitstamp.net/api/ 

    */

exports.VWAP = function (timerange, cb) {
  request("https://www.bitstamp.net/api/transactions/?time="+timerange, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var transactions = JSON.parse(body);
      var vwap = 0, multiplier = 0, divider = 0;
      transactions.forEach(function (value, index) {
        multiplier = multiplier + parseFloat(value.price) * parseFloat(value.amount);
        divider = divider + parseFloat(value.amount);
        if (index == transactions.length - 1) {
          this.vwap = multiplier / divider;
          cb(null, [new Date().getTime(), parseFloat(this.vwap.toPrecision(5))])
        }
      })
    } else {
      cb("Error at VWAP HTTP request", null)
    }
  })
}

/*

    Draws Highcharts (http://www.highcharts.com/) with node-highcharts (https://github.com/davidpadbury/node-highcharts)
    to give some kind of visual perception of the data gathered.
    By default, only 500 last data entries are rendered, as else the image gets cluttered because
    of the fixed image dimensions. In addition, the program would run out of memory very quick.
    If you want to draw graphs from longer timespan, state new image dimensions to options (see: https://github.com/davidpadbury/node-highcharts#usage)
    and alter the slice integer on the first two lines of the function.
    It would be advisable to also save the data from BTC and VWAP function to .json file rather than into your RAM.
    The default output filename is result.png.

    */

exports.drawGraph = function (btc, vwap) {

  this.vwap = JSON.parse(vwap).slice(-500);
  this.btc = JSON.parse(btc).slice(-500);

  options = {
    chart: {
      defaultSeriesType: 'line',
      marginRight: 25,
      marginBottom: 40,
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false
    },
    title: {
      text: 'Bitstamp VWAP/Last Price',
      x: -20 //center
    },
    subtitle: {
      text: '',
      x: -20
    },
    xAxis: {
      type: 'datetime'
    },
    yAxis: {
      labels: {
          formatter: function() {
        if(this.value === 0.00001){
            return 0;
        } else {
            return this.value;
        }
          }
      },
      showFirstLabel: false,
      title: {
        text: 'Market Price (USD)'
      },
      plotLines: [{
        width: 1,
        color: '#808080'
      }]
    },
    tooltip: {
      formatter: function() {
        return '<b>'+ this.series.name +'</b> ' + this.y;
      }
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false
        }
      }
    },
    credits: {
      enabled: false
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      x: -10,
      y: 100,
      borderWidth: 0
    },
    series: [{
      name: 'VWAP',
      data: this.vwap,
      showInLegend: true
    },
    {
      name: 'Price',
      data: this.btc,
      showInLegend: true
    }]
  };

  highcharts.render(options, function(err, data) {
    if (err) {
      console.log('Error: ' + err);
    } else {
      fs.writeFile('result.png', data);
    }
  });

}
