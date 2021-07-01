# 1. Design database schema

To design the database schema, you need to think about what kind of data it will store.

As this tutorial is about analyzing intraday stock data, you will need to create a schema that can
handle candlestick data. This is what a typical candlestick looks like:

![candlestick](https://assets.timescale.com/docs/images/tutorials/intraday-stock-analysis/candlestick.svg)

At least four data points are needed to create a candlestick chart: high, open, close, low.

Additionally, you will also need to have a field for the ticker symbol, time, and trading volume. The final data fields we will work with:

|Field          |Description                  |
|---------------|-----------------------------|
|time           |starting time of the minute  |
|symbol         |ticker symbol                |
|price_open     |opening price of the stock   |
|price_close    |closing price of the stock   |
|price_low      |lowest price in the minute   |
|price_high     |highest price in the minute  |
|trading_volume |trading volume in the minute |


Based on this, you can create the table called `stocks_intraday`:

```sql
CREATE TABLE public.stocks_intraday (
    "time" timestamp(0) NOT NULL,
    symbol varchar NULL,
	price_open float8 NULL,
	price_close float8 NULL,
	price_low float8 NULL,
	price_high float8 NULL,
	trading_volume int4 NULL,
);
```

This will create a regular PostgreSQL table with all the columns needed to ingest candlestick data records.

# Create hypertable

In order to use TimescaleDB features, you will need to enable TimescaleDB and create a hypertable from `stocks_intraday` table.

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

[Let's see how to fetch that data and insert it!][fetch-ingest]


[fetch-ingest]: /tutorials/analyze-intraday-stocks/fetch-and-ingest
