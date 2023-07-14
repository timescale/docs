---
title: Analyze financial tick data with TimescaleDB
excerpt: Learn how to store financial tick data and create candlestick views to analyze price changes
products: [cloud, mst, self_hosted]
keywords: [tutorials, finance, learn]
tags: [tutorials, beginner]
layout_components: [next_prev_large]
content_group: Analyze financial tick data
---

import CandlestickIntro from "versionContent/_partials/_candlestick_intro.mdx";

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

## Steps in this tutorial

This tutorial covers:

1.  [Setting up your dataset][financial-tick-dataset]: Load data from
    [Twelve Data][twelve-data] into your TimescaleDB database.
1.  [Querying your dataset][financial-tick-query]: Create candlestick views, query
    the aggregated data, and visualize the data in Grafana.

    This tutorial shows you how to ingest real-time time-series data into a Timescale
    database using a websocket connection. To create candlestick views, query the
    aggregated data, and visualize the data in Grafana, see the
    [ingest real-time websocket data section][advanced-websocket].

## About OHLCV data and candlestick charts

<CandlestickIntro />

![candlestick](https://assets.timescale.com/docs/images/tutorials/intraday-stock-analysis/candlestick_fig.png)

TimescaleDB is well suited to storing and analyzing financial candlestick data,
and many Timescale community members use it for exactly this purpose. Check out
these stories from some Timescale community members:

*   [How Trading Strategy built a data stack for crypto quant trading][trading-strategy]
*   [How Messari uses data to open the cryptoeconomy to everyone][messari]
*   [How I power a (successful) crypto trading bot with TimescaleDB][bot]

[advanced-websocket]: /tutorials/:currentVersion:/ingest-real-time-websocket-data/
[cloud-install]: /getting-started/:currentVersion:/#create-your-timescale-account
[financial-tick-dataset]: /tutorials/:currentVersion:/financial-tick-data/financial-tick-dataset/
[financial-tick-query]: /tutorials/:currentVersion:/financial-tick-data/financial-tick-query/
[twelve-data]: https://twelvedata.com/
[trading-strategy]: https://www.timescale.com/blog/how-trading-strategy-built-a-data-stack-for-crypto-quant-trading/
[messari]: https://www.timescale.com/blog/how-messari-uses-data-to-open-the-cryptoeconomy-to-everyone/
[bot]: https://www.timescale.com/blog/how-i-power-a-successful-crypto-trading-bot-with-timescaledb/
