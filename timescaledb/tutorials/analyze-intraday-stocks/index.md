# Analyze historical intraday stock data

This tutorial is a step-by-step guide on how to collect, store, and analyze intraday stock data 
with TimescaleDB.

We are going to follow a simple modular process:

1. [Design database schema][design-schema]
2. [Fetch and ingest stock data][fetch-ingest]
3. [Explore stock market data][explore]

First, you will create a table that will be capable of storing 1-min candlestick data. 

Secondly, you will learn how to fetch data from the Alpha Vantage API and insert it into the database in a fast manner. 

Finally, after all the plumbing work is done, you will see several ways to explore stock price points, lows and highs, price changes over time, symbols with the most daily gains, candlestick charts, and more!

<highlight type="tip">
Ideally, you start off with step 1 and implement each step in order to complete the full project. But you can
also start with step 3 and start exploring a sample dataset right away.
</highlight>

## Prerequisites

* Python 3
* TimescaleDB (see [installation options][install-timescale]) 
* Alpha Vantage API key ([get one for free][alpha-vantage-apikey])
* Virtualenv

## Get started: create a virtual environment

```bash
mkdir intraday-stock-analysis
cd intraday-stock-analysis
virtualenv env
source env/bin/activate
```

[Let's go to step 1, design database schema.][design-schema]


[install-timescale]: /how-to-guides/install-timescaledb/
[alpha-vantage-apikey]: https://www.alphavantage.co/support/#api-key
[design-schema]: /tutorials/analyze-intraday-stocks/design-schema
[fetch-ingest]: /tutorials/analyze-intraday-stocks/fetch-and-ingest
[explore]: /tutorials/analyze-intraday-stocks/explore-stocks-data