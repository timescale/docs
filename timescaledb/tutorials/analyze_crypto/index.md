---
title: Analyze cryptocurrency data
excerpt: Analyze cryptocurrency data
keywords: [tutorials, query, learn, crypto, financial]
tags: [tutorials, intermediate]
---

# Query cryptocurrency data with TimescaleDB

Cryptocurrency records are a good example of a time-series dataset that changes
rapidly, and contains a lot of different information. This tutorial shows you
how to set up access to the cryptocurrency data provided by
[CryptoCompare][cryptocompare], and then shows you a few different queries to
get you started with exploring Bitcoin and Ethereum price fluctuations over time.

When you have completed this tutorial, you can move on to more advanced
tutorials in this series that use the same dataset. The next one in the series
[uses Tableau to visualize cryptocurrency data][tutorial-tableau].

## Prerequisites

Before you begin, make sure you have:

*   Signed up for a [free Timescale Cloud account][cloud-install].

<highlight type="cloud" header="Run all tutorials free" button="Try for free">
Your Timescale Cloud trial is completely free for you to use for the first
thirty days. This gives you enough time to complete all the tutorials and run
a few test projects of your own.
</highlight>

## Steps in this tutorial

This tutorial covers:

1.  [Setting up up your dataset][dataset-crypto]: Set up and connect a Timescale
    Cloud service, and connect to the [CryptoCompare][cryptocompare] dataset.
1.  [Querying your dataset][query-crypto]: Analyze your cryptocurrency dataset
    using TimescaleDB and PostgreSQL.

## About querying cryptocurrency data with TimescaleDB

For more information about analyzing cryptocurrency, you can read
this analysis of over 4100 cryptocurrencies [on our blog][crypto-blog].

[cloud-install]: install/:currentVersion:/installation-cloud/
[dataset-crypto]: /timescaledb/tutorials/analyze_crypto/dataset-crypto/
[query-crypto]: /timescaledb/tutorials/analyze_crypto/query-crypto/
[crypto-blog]: https://blog.timescale.com/blog/analyzing-bitcoin-ethereum-and-4100-other-cryptocurrencies-using-postgresql-and-timescaledb/
[cryptocompare]: https://www.cryptocompare.com
[tutorial-tableau]: /timescaledb/:currentVersion:/tutorials/visualize-with-tableau/
