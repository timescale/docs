# Analyze historical intraday stock data

This tutorial is a step-by-step guide on how to collect, store, and analyze intraday stock data
with TimescaleDB.

This tutorial has a few main steps:

1. [Design database schema][design-schema]

   You create a table that is capable of storing 1-min candlestick data.
2. [Fetch and ingest stock data][fetch-ingest]

   You learn how to fetch data from the Alpha Vantage API and ingest it into the database in a fast manner.
3. [Explore stock market data][explore]

   After all the plumbing work is done, you can see several ways to explore stock price points, lows and highs, price changes over time, symbols with the most daily gains, candlestick charts, and more!


## Prerequisites

* Python 3
* TimescaleDB (see [installation options][install-timescale])
* Alpha Vantage API key ([get one for free][alpha-vantage-apikey])
* Virtualenv (installation: `pip install virtualenv`)
* [Psql][psql-install] or any other PostgreSQL client (for example, DBeaver)

## Get started: create a virtual environment

It's recommended to create a new Python virtual environment to isolate the packages used
throughout this tutorial.

```bash
mkdir intraday-stock-analysis
cd intraday-stock-analysis
virtualenv env
source env/bin/activate
```

Install Pandas within the virtual environment:
```bash
pip install pandas
```


[install-timescale]: /install/latest/
[alpha-vantage-apikey]: https://www.alphavantage.co/support/#api-key
[design-schema]: /tutorials/analyze-intraday-stocks/design-schema
[fetch-ingest]: /tutorials/analyze-intraday-stocks/fetch-and-ingest
[explore]: /tutorials/analyze-intraday-stocks/explore-stocks-data
[psql-install]: /how-to-guides/connecting/psql
