---
title: Analyze financial tick data with TimescaleDB
excerpt: Use Tiger Cloud to store financial tick data and create candlestick views to perform real-time analysis of price changes
products: [cloud, self_hosted, mst]
keywords: [tutorials, finance, learn]
tags: [tutorials, beginner]
layout_components: [next_prev_large]
content_group: Analyze financial tick data
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";
import CandlestickIntro from "versionContent/_partials/_candlestick_intro.mdx";
import FinancialIndustry from "versionContent/_partials/_financial-industry-data-analysis.mdx";

# Analyze financial tick data

<FinancialIndustry />

To analyze financial data, you can chart the open, high, low, close, and volume
(OHLCV) information for a financial asset. Using this data, you can create
candlestick charts that make it easier to analyze the price changes of financial
assets over time. You can use candlestick charts to examine trends in stock,
cryptocurrency, or NFT prices.

In this tutorial, you use real raw financial data provided by
[Twelve Data][twelve-data], create an aggregated candlestick view, query the
aggregated data, and visualize the data in Grafana.

## OHLCV data and candlestick charts

<CandlestickIntro />

![candlestick](https://assets.timescale.com/docs/images/tutorials/intraday-stock-analysis/timescale_cloud_candlestick.png)

$TIMESCALE_DB is well suited to storing and analyzing financial candlestick data,
and many $COMPANY community members use it for exactly this purpose. Check out
these stories from some $COMPANYcommunity members:

*   [How Trading Strategy built a data stack for crypto quant trading][trading-strategy]
*   [How Messari uses data to open the cryptoeconomy to everyone][messari]
*   [How I power a (successful) crypto trading bot with $TIMESCALE_DB][bot]

## Steps in this tutorial

This tutorial shows you how to ingest real-time time-series data into a $SERVICE_LONG:

1.  [Ingest data into a $SERVICE_SHORT][financial-tick-dataset]: load data from
    [Twelve Data][twelve-data] into your $TIMESCALE_DB database.
1.  [Query your dataset][financial-tick-query]: create candlestick views, query
    the aggregated data, and visualize the data in Grafana.

To create candlestick views, query the aggregated data, and visualize the data in Grafana, see the
[ingest real-time websocket data section][advanced-finance].

[advanced-finance]: /tutorials/:currentVersion:/financial-ingest-real-time/
[financial-tick-dataset]: /tutorials/:currentVersion:/financial-tick-data/financial-tick-dataset/
[financial-tick-query]: /tutorials/:currentVersion:/financial-tick-data/financial-tick-query/
[twelve-data]: https://twelvedata.com/
[trading-strategy]: https://www.timescale.com/blog/how-trading-strategy-built-a-data-stack-for-crypto-quant-trading
[messari]: https://www.timescale.com/blog/how-messari-uses-data-to-open-the-cryptoeconomy-to-everyone
[bot]: https://www.timescale.com/blog/how-i-power-a-successful-crypto-trading-bot-with-timescaledb
