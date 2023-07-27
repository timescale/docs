---
title: Design schema and ingest tick data
excerpt: Ingest and store real-time cryptocurrency or stock data in TimescaleDB
keywords: [finance, analytics]
tags: [candlestick]
---

# Design schema and ingest tick data

This tutorial shows you how to store real-time cryptocurrency or stock
tick data in TimescaleDB. The initial schema provides the foundation to
store tick data only. Once you begin to store individual transactions, you can
calculate the candlestick values using TimescaleDB continuous aggregates
based on the raw tick data. This means that our initial schema doesn't need to
specifically store candlestick data.

## Schema

This schema uses two tables:

*   **crypto_assets**: a relational table that stores the symbols to monitor.
   You can also include additional information about each
   symbol, such as social links.
*   **crypto_ticks**: a time-series table that stores the real-time tick data.

**crypto_assets:**

|Field|Description|
|-|-|
|symbol|The symbol of the crypto currency pair, such as BTC/USD|
|name|The name of the pair, such as Bitcoin USD|

**crypto_ticks:**

|Field|Description|
|-|-|
|time|Timestamp, in UTC time zone|
|symbol|Crypto pair symbol from the `crypto_assets` table|
|price|The price registered on the exchange at that time|
|day_volume|Total volume for the given day (incremental)|

Create the tables:

```sql
CREATE TABLE crypto_assets (
    symbol TEXT UNIQUE,
    "name" TEXT
);

CREATE TABLE crypto_ticks (
    "time" TIMESTAMPTZ,
    symbol TEXT,
    price DOUBLE PRECISION,
    day_volume NUMERIC
);
```

You also need to turn the time-series table into a [hypertable][hypertable]:

```sql
-- convert the regular 'crypto_ticks' table into a TimescaleDB hypertable with 7-day chunks
SELECT create_hypertable('crypto_ticks', 'time');
```

This is an important step in order to efficiently store your time-series
data in TimescaleDB.

### Using TIMESTAMP data types

It is best practice to store time values using the `TIMESTAMP WITH TIME ZONE` (`TIMESTAMPTZ`)
data type. This makes it easier to query your data
using different time zones. TimescaleDB
stores `TIMESTAMPTZ` values in UTC internally and makes the necessary
conversions for your queries.

## Insert tick data

With the hypertable and relational table created, download the sample files
containing crypto assets and tick data from the last three weeks. Insert the data
into your TimescaleDB instance.

<Procedure>

### Inserting sample data

1.  Download the sample `.csv` files (provided by [Twelve Data][twelve-data]): <Tag type="download">[crypto_sample.csv](https://assets.timescale.com/docs/downloads/candlestick/crypto_sample.zip)</Tag>

    ```bash
    wget https://assets.timescale.com/docs/downloads/candlestick/crypto_sample.zip
    ```

1.  Unzip the file and change the directory if you need to:

    ```bash
    unzip crypto_sample.zip
    cd crypto_sample
    ```

1.  At the `psql` prompt, insert the content of the `.csv` files into the database.

    ```bash
    psql -x "postgres://tsdbadmin:{YOUR_PASSWORD_HERE}@{YOUR_HOSTNAME_HERE}:{YOUR_PORT_HERE}/tsdb?sslmode=require"

    \COPY crypto_assets FROM 'crypto_assets.csv' CSV HEADER;
    \COPY crypto_ticks FROM 'crypto_ticks.csv' CSV HEADER;
    ```

</Procedure>

If you want to ingest real-time market data, instead of sample data, check out
our complementing tutorial Ingest real-time financial websocket data to
ingest data directly from the [Twelve Data][twelve-data] financial API.

[hypertable]: /use-timescale/:currentVersion:/hypertables/
[twelve-data]: https://twelvedata.com/
