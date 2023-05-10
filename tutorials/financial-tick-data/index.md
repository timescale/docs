---
title: Analyze financial tick data with TimescaleDB
excerpt: Learn how to store financial tick data and create candlestick views to analyze price changes
products: [cloud, mst, self_hosted]
keywords: [tutorials, finance, learn]
tags: [tutorials, beginner]
---

# Analyze financial tick data with TimescaleDB

To analyze financial data, you can chart the open, high, low, close, and volume
(OHLCV) information for a financial asset. Using this data, you can create
candlestick charts that make it easier to analyze the price changes of financial
assets over time. You can use candlestick charts to examine trends in stock,
cryptocurrency, or NFT prices.

In this tutorial, you use real raw financial data provided by
[Twelve Data][twelve-data], create an aggregated candlestick view, query the
aggregated data, and visualize the data in Grafana.

## Prerequisites

Before you begin, make sure you have:

*   Signed up for a [free Timescale account][cloud-install].

<Highlight type="cloud" header="Run all tutorials free" button="Try for free">
Your Timescale trial is completely free for you to use for the first
thirty days. This gives you enough time to complete all the tutorials and run
a few test projects of your own.
</Highlight>

## Steps in this tutorial

This tutorial covers:

1.  [Set up up your dataset][financial-tick-dataset]: Load data from
    [Twelve Data][twelve-data] into your TimescaleDB database.
1.  [Query your dataset][financial-tick-query]: Create candlestick views, query
    the aggregated data, and visualize the data in Grafana.

## About OHLCV data and candlestick charts

The financial sector regularly uses [candlestick charts][charts] to visualize
the price change of an asset. Each candlestick represents a time period, such as
one minute or one hour, and shows how the asset's price changed during that time.

Candlestick charts are generated from the open, high, low, close, and volume
data for each financial asset during the time period. This is often abbreviated
as OHLCV:

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

[cloud-install]: /getting-started/latest/
[financial-tick-dataset]: /tutorials/:currentVersion:/financial-tick-data/financial-tick-dataset/
[financial-tick-query]: /tutorials/:currentVersion:/financial-tick-data/financial-tick-query/
[charts]: https://www.investopedia.com/terms/c/candlestick.asp
[twelve-data]: https://twelvedata.com/
[trading-strategy]: https://www.timescale.com/blog/how-trading-strategy-built-a-data-stack-for-crypto-quant-trading/
[messari]: https://www.timescale.com/blog/how-messari-uses-data-to-open-the-cryptoeconomy-to-everyone/
[bot]: https://www.timescale.com/blog/how-i-power-a-successful-crypto-trading-bot-with-timescaledb/
