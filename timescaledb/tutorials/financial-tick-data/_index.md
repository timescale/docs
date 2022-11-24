---
title: Analyze financial tick data with TimescaleDB
excerpt: Learn how to store financial tick data and create candlestick views to analyze price changes
keywords: [tutorials, finance, learn]
tags: [tutorials, intermediate]
---

# Analyze financial tick data with TimescaleDB

To analyze financial data, you can chart the open, high, low, close, and volume
(OHLCV) information for a financial asset. Using this data, you can create
candlestick charts that make it easier to analyze the price changes of financial
assets over time. You can use candlestick charts to examine trends in stock,
cryptocurrency, or NFT prices.

In this tutorial, you use real raw financial data provided by [Twelve Data][twelve-data],
store it efficiently in your TimescaleDB database, create different candlestick
views, and query aggregated data. In the final section, it also covers how to
download sample data containing real-world transactions for cryptocurrencies.

## Prerequisites

Before you begin, make sure you have:

*   A TimescaleDB instance running locally or on the cloud. For more
    information, see [installation options][install-docs].
*   [`psql`][psql], or any other PostgreSQL client.

## Steps in this tutorial

A numbered list of the sub-pages in the tutorial. Remember that this is
curricula content, so these steps must be in order:

1.  [Set up up your dataset][financial-tick-dataset]: Load data from
    [Twelve Data][twelve-data] into your TimescaleDB database.
1.  [Query your dataset][financial-tick-query]: Create candlestick views and
    query the aggregated data.
1.  [More things to try][financial-tick-advanced]: Learn how to analyze
    candlestick data from other data sources.

## About OHLCV data and candlestick charts

The financial sector regularly uses [candlestick charts][charts] to visualize
the price change of an asset. Each candlestick represents a time period, such as
1 minute, or an hour, and shows how the asset's price changed during that time.

Candlestick charts are generated from the open, high, low, close, and volume
data for each financial asset during the time period. This is often abbreviated as OHLCV:

*   Open: opening price
*   High: highest price
*   Low: lowest price
*   Close: closing price
*   Volume: volume of transactions

![candlestick](https://assets.timescale.com/docs/images/tutorials/intraday-stock-analysis/candlestick_fig.png)

TimescaleDB is well suited to storing and analyzing financial candlestick data,
and many Timescale community members use it for exactly this purpose. Check out
these stories from some Timescale community members:

*   [How Trading Strategy built a data stack for crypto quant trading][trading-strategy]
*   [How Messari uses data to open the cryptoeconomy to everyone][messari]
*   [How I power a (successful) crypto trading bot with TimescaleDB][bot]

[install-docs]: install/:currentVersion:/
[psql]: timescaledb/:currentVersion:/how-to-guides/connecting/
[tutorial-dataset]: timescaledb/tutorials/_template/_dataset-tutorial
[tutorial-query]: timescaledb/tutorials/_template/_query-template
[tutorial-advanced]: timescaledb/tutorials/_template/_advanced-tutorial
[charts]: https://www.investopedia.com/terms/c/candlestick.asp
[twelve-data]: https://twelvedata.com/
[trading-strategy]: https://www.timescale.com/blog/how-trading-strategy-built-a-data-stack-for-crypto-quant-trading/
[messari]: https://www.timescale.com/blog/how-messari-uses-data-to-open-the-cryptoeconomy-to-everyone/
[bot]: https://www.timescale.com/blog/how-i-power-a-successful-crypto-trading-bot-with-timescaledb/
