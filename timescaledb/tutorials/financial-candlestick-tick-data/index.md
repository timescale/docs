# Store financial tick data in TimescaleDB using the OHLCV (candlestick) format
[Candlestick charts][charts] are the standard way to analyze the price changes of
various financial assets. Be it stock prices, cryptocurrency prices, or even
NFT prices, candlestick charts are essential to analyze this type of time-series
data. To generate candlestick charts you need to have candlestick data in
the OHLCV format. 

This tutorial shows you how to efficiently store raw financial tick
data, create different candlestick views, and query aggregated data in
TimescaleDB using the OHLCV format. It also shows you how to download sample
data containing real-world crypto tick transactions for cryptocurrencies like
BTC, ETH, and other popular assets.

## What's candlestick data and OHLCV?
Candlestick charts are used in the financial sector to visualize the price
change of a specific financial asset. Each candlestick represents a time
frame (for example, 1 minute, 5 minutes, 1 hour, or similar) and conveys how the asset's
price changed in that time frame.

![candlestick](https://assets.timescale.com/docs/images/tutorials/intraday-stock-analysis/candlestick_fig.png)

On the other hand, candlestick *data* is the collection of data points that
one needs in order to generate a candlestick chart. This is often abbreviated
as OHLCV (open-high-low-close-volume):

* Open: opening price
* High: highest price 
* Low: lowest price 
* Close: closing price
* Volume: volume of transactions

And remember, all these data points represent only that given bucket of time
(for example, 1 minute).

In the Timescale community, there are many users who are successfully using
TimescaleDB to store and analyze candlestick data. Here are some examples:
* [How Trading Strategy built a data stack for crypto quant trading][trading-strategy]
* [How Messari uses data to open the cryptoeconomy to everyone][messari]
* [How I power a (successful) crypto trading bot with TimescaleDB][bot]

Follow this tutorial and see how to set up your TimescaleDB database to consume real-time tick or aggregated financial data and generate candlestick views efficiently.

* Create candlestick (open-high-low-close-volume) aggregates
* Query the candlestick views
* Advanced data management

## Prerequisites
* TimescaleDB (see [installation options][install-timescale])
* [Psql][psql-install] or any other PostgreSQL client (e.g. DBeaver)


[charts]: https://www.investopedia.com/terms/c/candlestick.asp
[trading-strategy]: https://www.timescale.com/blog/how-trading-strategy-built-a-data-stack-for-crypto-quant-trading/
[messari]: https://www.timescale.com/blog/how-messari-uses-data-to-open-the-cryptoeconomy-to-everyone/
[bot]: https://www.timescale.com/blog/how-i-power-a-successful-crypto-trading-bot-with-timescaledb/
[install-timescale]: /install/latest/
[psql-install]: /how-to-guides/connecting/psql
