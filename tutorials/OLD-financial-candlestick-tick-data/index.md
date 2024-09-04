---
title: Store financial tick data in TimescaleDB using the OHLCV (candlestick) format
excerpt: Store your financial tick data and create candlestick views to analyze price changes
keywords: [finance, analytics]
tags: [candlestick]
---

{/* markdown-link-check-disable */}

# Store financial tick data in TimescaleDB using the OHLCV (candlestick) format

[Candlestick charts][charts] are the standard way to analyze the price changes of
financial assets. They can be used to examine trends in stock prices, cryptocurrency prices,
or even NFT prices. To generate candlestick charts, you need candlestick data in
the OHLCV format. That is, you need the Open, High, Low, Close, and Volume data for
some financial assets.

This tutorial shows you how to efficiently store raw financial tick
data, create different candlestick views, and query aggregated data in
TimescaleDB using the OHLCV format. It also shows you how to download sample
data containing real-world crypto tick transactions for cryptocurrencies like
BTC, ETH, and other popular assets.

## Prerequisites

Before you begin, make sure you have:

*   A TimescaleDB instance running locally or on the cloud. For more
    information, see [the Getting Started guide](/getting-started/latest/)
*   [`psql`][psql], DBeaver, or any other PostgreSQL client

## What's candlestick data and OHLCV?

Candlestick charts are used in the financial sector to visualize the price
change of an asset. Each candlestick represents a time
frame (for example, 1 minute, 5 minutes, 1 hour, or similar) and shows how the asset's
price changed during that time.

![candlestick](https://assets.timescale.com/docs/images/tutorials/intraday-stock-analysis/candlestick_fig.png)

Candlestick charts are generated from candlestick data, which is the collection of data points
used in the chart. This is often abbreviated
as OHLCV (open-high-low-close-volume):

*   Open: opening price
*   High: highest price
*   Low: lowest price
*   Close: closing price
*   Volume: volume of transactions

These data points correspond to the bucket of time covered by the candlestick.
For example, a 1-minute candlestick would need the open and close prices for that minute.

Many Timescale community members use
TimescaleDB to store and analyze candlestick data. Here are some examples:

*   [How Trading Strategy built a data stack for crypto quant trading][trading-strategy]
*   [How Messari uses data to open the cryptoeconomy to everyone][messari]
*   [How I power a (successful) crypto trading bot with TimescaleDB][bot]

Follow this tutorial and see how to set up your TimescaleDB database to consume real-time tick or aggregated financial data and generate candlestick views efficiently.

*   [Design schema and ingest tick data][design]
*   [Create candlestick (open-high-low-close-volume) aggregates][create]
*   [Query candlestick views][query]
*   [Advanced data management][manage]

[charts]: https://www.investopedia.com/terms/c/candlestick.asp
[trading-strategy]: https://www.timescale.com/blog/how-trading-strategy-built-a-data-stack-for-crypto-quant-trading/
[messari]: https://www.timescale.com/blog/how-messari-uses-data-to-open-the-cryptoeconomy-to-everyone/
[bot]: https://www.timescale.com/blog/how-i-power-a-successful-crypto-trading-bot-with-timescaledb/
[design]: /tutorials/:currentVersion:/financial-candlestick-tick-data/design-tick-schema
[create]: /tutorials/:currentVersion:/financial-candlestick-tick-data/create-candlestick-aggregates
[query]: /tutorials/:currentVersion:/financial-candlestick-tick-data/query-candlestick-views
[manage]: /tutorials/:currentVersion:/financial-candlestick-tick-data/advanced-data-management
[psql]: /use-timescale/:currentVersion:/integrations/query-admin/about-psql/
