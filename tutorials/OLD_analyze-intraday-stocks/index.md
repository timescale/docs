---
title: Analyze historical intraday stock data
excerpt: Collect, store, and analyze intraday stock data with TimescaleDB
products: [cloud, mst, self_hosted]
keywords: [finance, analytics, psycopg2, pandas, plotly]
tags: [candlestick]
---

# Analyze historical intraday stock data

This tutorial is a step-by-step guide on how to collect, store, and analyze intraday stock data
with TimescaleDB.

This tutorial has a few main steps:

1.  Design database schema.
    You create a table that is capable of storing 1-min candlestick data.
1.  Fetch and ingest stock data
    You learn how to fetch data from the Alpha Vantage API and ingest it into the database in a fast manner.
1.  Explore stock market data
    After all the plumbing work is done, you can see several ways to explore stock price points, lows and highs, price changes over time, symbols with the most daily gains, candlestick charts, and more!

## Prerequisites

*   Python 3
*   TimescaleDB (see [installation options][install-timescale])
*   Alpha Vantage API key ([get one for free][alpha-vantage-apikey])
*   Virtualenv (installation: `pip install virtualenv`)
*   [Psql][psql-install] or any other PostgreSQL client (for example, DBeaver)

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

[alpha-vantage-apikey]: https://www.alphavantage.co/support/#api-key
[design-schema]: /tutorials/:currentVersion:/analyze-intraday-stocks/design-schema
[explore]: /tutorials/:currentVersion:/analyze-intraday-stocks/explore-stocks-data
[fetch-ingest]: /tutorials/:currentVersion:/analyze-intraday-stocks/fetch-and-ingest
[install-timescale]: /getting-started/latest/
[psql-install]: /use-timescale/:currentVersion:/integrations/query-admin/about-psql
