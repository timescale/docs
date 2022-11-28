---
title: Analyze financial tick data - Query the data
excerpt: Create candlestick views and query financial tick data to analyze price changes
keywords: [tutorials, finance, learn]
tags: [tutorials, intermediate]
---

# Query the data

Turning raw, real-time tick data into aggregated candlestick views is a common
task for users who work with financial data. TimescaleDB includes
[hyperfunctions][hyperfunctions]
that you can use to store and query your financial data more easily.
Hyperfunctions are SQL functions within TimescaleDB that make it easier to
manipulate and analyze time-series data in PostgreSQL with fewer lines of code.

There are three hyperfunctions that are essential for calculating candlestick
values: [`time_bucket()`][time-bucket], [`FIRST()`][first], and [`LAST()`][last].
The `time_bucket()` hyperfunction helps you aggregate records into buckets of
arbitrary time intervals based on the timestamp value. `FIRST()` and `LAST()`
help you calculate the opening and closing prices. To calculate highest and
lowest prices, you can use the standard PostgreSQL aggregate functions `MIN` and
`MAX`.

In TimescaleDB, the most efficient way to create candlestick views is to use
[continuous aggregates][caggs].
In this tutorial, you'll create a continuous aggregate for a candlestick time
bucket, and then query the aggregate with different refresh policies.

## Create and query a 1-minute candlestick

To create a continuous aggregate of 1-minute candlestick data, use the same query
that you previously used to get the 1-minute OHLCV values. But this time, put the
query in a continuous aggregate definition:

```sql
/* 1-min candlestick view*/
CREATE MATERIALIZED VIEW one_min_candle
WITH (timescaledb.continuous) AS
    SELECT
        time_bucket('1 min', time) AS bucket,
        symbol,
        FIRST(price, time) AS "open",
        MAX(price) AS high,
        MIN(price) AS low,
        LAST(price, time) AS "close",
        LAST(day_volume, time) AS day_volume
    FROM crypto_ticks
    GROUP BY bucket, symbol
```

When you run this query, TimescaleDB queries 1-minute aggregate values of all
your tick data, creating the continuous aggregate and materializing the
results. But your candlestick data has only been materialized up to the
last data point. If you want the continuous aggregate to stay up to date
as new data comes in over time, you also need to add a continuous aggregate
refresh policy. For example, to refresh the continuous aggregate every two
minutes:

```sql
/* Refresh the continuous aggregate every two minutes */
SELECT add_continuous_aggregate_policy('one_min_candle',
    start_offset => INTERVAL '2 hour',
    end_offset => INTERVAL '10 sec',
    schedule_interval => INTERVAL '2 min');
```

The continuous aggregate refreshes every hour, so every hour new
candlesticks are materialized, **if there's new raw tick data in the hypertable**.

When this job runs, it only refreshes the time period between `start_offset`
and `end_offset`, and ignores modifications outside of this window.

In most cases, set `end_offset` to be the same or bigger as the
time bucket in the continuous aggregate definition. This makes sure that only full
buckets get materialized during the  refresh process.

## 1-min BTC/USD candlestick chart

Start with a `one_min_candle` continuous aggregate, which contains
1-min candlesticks:

```sql
SELECT * FROM one_min_candle
WHERE symbol = 'BTC/USD' AND bucket >= NOW() - INTERVAL '24 hour'
ORDER BY bucket
```

![1-min candlestick](https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/candlestick/one_min.png)

### Create and query a 1-hour candlestick

To create a 1-hour candlestick view, follow the same process as
in the previous step, except this time set the time bucket value to be one
hour in the continuous aggregate definition:

```sql
/* 1-hour candlestick view */
CREATE MATERIALIZED VIEW one_hour_candle
WITH (timescaledb.continuous) AS
    SELECT
        time_bucket('1 hour', time) AS bucket,
        symbol,
        FIRST(price, time) AS "open",
        MAX(price) AS high,
        MIN(price) AS low,
        LAST(price, time) AS "close",
        LAST(day_volume, time) AS day_volume
    FROM crypto_ticks
    GROUP BY bucket, symbol
```

Add a refresh policy to refresh the continuous aggregate every hour:

```sql
/* Refresh the continuous aggregate every hour */
SELECT add_continuous_aggregate_policy('one_hour_candle',
    start_offset => INTERVAL '1 day',
    end_offset => INTERVAL '1 min',
    schedule_interval => INTERVAL '1 hour');
```

Notice how this example uses a different refresh policy with different
parameter values to accommodate the 1-hour time bucket in the continuous
aggregate definition. The continuous aggregate will refresh every hour, so
every hour there will be new candlestick data materialized, if there's
new raw tick data in the hypertable.

## 1-hour BTC/USD candlestick chart

If you find that 1-min candlesticks are too granular, you can query the
`one_hour_candle` continuous aggregate containing 1-hour candlesticks:

```sql
SELECT * FROM one_hour_candle
WHERE symbol = 'BTC/USD' AND bucket >= NOW() - INTERVAL '2 day'
ORDER BY bucket
```

![1-hour candlestick](https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/candlestick/one_hour.png)

### Create and query a 1-day candlestick

Create the final view in this tutorial for 1-day candlesticks using the same
process as above, using a 1-day time bucket size:

```sql
/* 1-day candlestick */
CREATE MATERIALIZED VIEW one_day_candle
WITH (timescaledb.continuous) AS
    SELECT
        time_bucket('1 day', time) AS bucket,
        symbol,
        FIRST(price, time) AS "open",
        MAX(price) AS high,
        MIN(price) AS low,
        LAST(price, time) AS "close",
        LAST(day_volume, time) AS day_volume
    FROM crypto_ticks
    GROUP BY bucket, symbol
```

Add a refresh policy to refresh the continuous aggregate once a day:

```sql
/* Refresh the continuous aggregate every day */
SELECT add_continuous_aggregate_policy('one_day_candle',
    start_offset => INTERVAL '3 day',
    end_offset => INTERVAL '1 day',
    schedule_interval => INTERVAL '1 day');
```

The refresh job runs every day, and materializes two days' worth of
candlesticks.

## 1-day BTC/USD candlestick chart

To zoom out even more, query the `one_day_candle`
continuous aggregate, which has one-day candlesticks:

```sql
SELECT * FROM one_day_candle
WHERE symbol = 'BTC/USD' AND bucket >= NOW() - INTERVAL '14 days'
ORDER BY bucket
```

![1-day candlestick](https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/candlestick/one_day.png)

## Add price change (delta) column in the candlestick view

As an optional step, you can add an additional column in the continuous
aggregate to calculate the price difference between the opening and closing
price within the bucket.

In general, you can calculate the price difference with the formula:

```text
(CLOSE PRICE - OPEN PRICE) / OPEN PRICE = delta
```

Calculate delta in SQL:

```sql
SELECT time_bucket('1 day', time) AS bucket, symbol, (LAST(price, time)-FIRST(price, time))/FIRST(price, time) AS change_pct
FROM crypto_ticks
WHERE price != 0
GROUP BY bucket, symbol
```

The full continuous aggregate definition for a 1-day candlestick with a
price-change column:

```sql
/* 1-day candlestick with price change column*/
CREATE MATERIALIZED VIEW one_day_candle_delta
WITH (timescaledb.continuous) AS
    SELECT
        time_bucket('1 day', time) AS bucket,
        symbol,
        FIRST(price, time) AS "open",
        MAX(price) AS high,
        MIN(price) AS low,
        LAST(price, time) AS "close",
        LAST(day_volume, time) AS day_volume,
        (LAST(price, time)-FIRST(price, time))/FIRST(price, time) AS change_pct
    FROM crypto_ticks
    WHERE price != 0
    GROUP BY bucket, symbol
```

## BTC vs. ETH 1-day price changes delta line chart

You can calculate and visualize the price change differences between
two symbols. In a previous example, you saw how to do this by comparing the
opening and closing prices. But what if you want to compare today's closing
price with yesterday's closing price? Here's an example how you can achieve
this by using the [`LAG()`][lag] window function on an already existing
candlestick view:

```sql
SELECT *, ("close" - LAG("close", 1) OVER (PARTITION BY symbol ORDER BY bucket)) / "close" AS change_pct
FROM one_day_candle
WHERE symbol IN ('BTC/USD', 'ETH/USD') AND bucket >= NOW() - INTERVAL '14 days'
ORDER BY bucket
```

![btc vs eth](https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/candlestick/pct_change.png)

## Using multiple continuous aggregates

You cannot currently create a continuous aggregate on top of another continuous aggregate.
However, this is not necessary in most cases. You can get a similar result and performance by
creating multiple continuous aggregates for the same hypertable. Due
to the efficient materialization mechanism of continuous aggregates, both
refresh and query performance should work well.

[caggs]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/
[first]: /api/:currentVersion:/hyperfunctions/first/
[hyperfunctions]: /api/:currentVersion:/hyperfunctions/
[intraday-tutorial]: /timescaledb/:currentVersion:/tutorials/analyze-intraday-stocks/
[last]: /api/:currentVersion:/hyperfunctions/last/
[time-bucket]: /api/:currentVersion:/hyperfunctions/time_bucket/
[lag]: https://www.postgresqltutorial.com/postgresql-lag-function/
