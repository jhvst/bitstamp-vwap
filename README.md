bitstamp-vwap
=============

Calculates VWAP from Bitstamp.net

The script supports three different update frequencys. The btc.js will fetch the latest market price, while vwap.js will calculate the VWAP of the given timespan.

You can choose either 'minute', 'hour' or 'day' as arguments to btc.js and vwap.js. It will also determine the interval of which the program will fetch new rates. Given no argument the program will fetch hourly rates.

##Example usage

node vwap minute
node btc hour

The data will be saved on corresponding .json file. By copying the data from the file you can also draw a simple graph of the rates by inserting them to app.js. The script takes no arguments.



