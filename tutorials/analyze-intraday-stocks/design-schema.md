---
title: Design database schema
excerpt: Design a database schema to store your financial candlestick data
products: [cloud, mst, self_hosted]
keywords: [finance, analytics]
tags: [candlestick]
---

# Design database schema

When you design a database schema, you need to think about what kind of data it stores.

This tutorial is about analyzing intraday stock data, so you need to create a schema that can
handle candlestick data. This is what a typical candlestick looks like:

At least four data points are needed to create a candlestick chart: high, open, close, low.

![candlestick](https://assets.timescale.com/docs/images/tutorials/intraday-stock-analysis/candlestick_fig.png)

You also need to have fields for the ticker symbol, time, and trading volume. The data fields we are using are:

|Field          |Description                  |
|---------------|-----------------------------|
|time           |starting time of the minute  |
|symbol         |ticker symbol                |
|price_open     |opening price of the stock   |
|price_close    |closing price of the stock   |
|price_low      |lowest price in the minute   |
|price_high     |highest price in the minute  |
|trading_volume |trading volume in the minute |

Based on this, you can create a table called `stocks_intraday`:

```sql
CREATE TABLE public.stocks_intraday (
    "time" timestamptz NOT NULL,
    symbol text NULL,
 price_open double precision NULL,
 price_close double precision NULL,
 price_low double precision NULL,
 price_high double precision NULL,
 trading_volume int NULL
);
```

This creates a regular PostgreSQL table with all the columns needed to ingest candlestick data records.

# Create hypertable

To use TimescaleDB features, you need to enable TimescaleDB, and create a hypertable from the `stocks_intraday` table.

**Enable TimescaleDB extension:**

```sql
CREATE EXTENSION IF NOT EXISTS timescaledb;
```

**Create hypertable from `stocks_intraday` table:**

```sql
/*
stocks_intraday: name of the table
time: name of the timestamp column
*/
SELECT create_hypertable('stocks_intraday', 'time');
```

At this point, you have an empty hypertable, ready to ingest time-series data.
