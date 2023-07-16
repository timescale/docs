---
title: Ingest real-time financial websocket data
excerpt: Set up a data pipeline to get data from different financial APIs
products: [cloud, mst, self_hosted]
keywords: [finance, analytics, websockets, data pipeline]
---

import CandlestickIntro from "versionContent/_partials/_candlestick_intro.mdx";

# Ingest real-time financial websocket data

This tutorial shows you how to ingest real-time time-series data into
TimescaleDB using a websocket connection. The tutorial sets up a data pipeline
to ingest real-time data from our data partner, [Twelve Data][twelve-data].
Twelve Data provides a number of different financial APIs, including stock,
cryptocurrencies, foreign exchanges, and ETFs. It also supports websocket
connections in case you want to update your database frequently. With
websockets, you need to connect to the server, subscribe to symbols, and you can
start receiving data in real-time during market hours.

When you complete this tutorial, you'll have a data pipeline set
up that ingests real-time financial data into your Timescale.

This tutorial uses Python and the API
[wrapper library][twelve-wrapper] provided by Twelve Data.

## Prerequisites

Before you begin, make sure you have:

*   Signed up for a [free Timescale account][cloud-install].
*   Installed Python 3
*   Signed up for [Twelve Data][twelve-signup]. The free tier is perfect for
    this tutorial.
*   Made a note of your Twelve Data [API key](https://twelvedata.com/account/api-keys).

## Steps in this tutorial

This tutorial covers:

1.  [Setting up your dataset][financial-ingest-dataset]: Load data from
    [Twelve Data][twelve-data] into your TimescaleDB database.
1.  [Querying your dataset][financial-ingest-query]: Create candlestick views, query
    the aggregated data, and visualize the data in Grafana.

    This tutorial shows you how to ingest real-time time-series data into a Timescale
    database using a websocket connection. To create candlestick views, query the
    aggregated data, and visualize the data in Grafana.

## About OHLCV data and candlestick charts

<CandlestickIntro />

![candlestick](https://assets.timescale.com/docs/images/tutorials/intraday-stock-analysis/candlestick_fig.png)

TimescaleDB is well suited to storing and analyzing financial candlestick data,
and many Timescale community members use it for exactly this purpose.


[financial-ingest-dataset]: /tutorials/:currentVersion:/financial-ingest-real-time/financial-ingest-dataset/
[financial-ingest-query]: /tutorials/:currentVersion:/financial-ingest-real-time/financial-ingest-query/
[twelve-data]: https://twelvedata.com/
[twelve-signup]: https://twelvedata.com/login
[twelve-wrapper]: https://github.com/twelvedata/twelvedata-python
