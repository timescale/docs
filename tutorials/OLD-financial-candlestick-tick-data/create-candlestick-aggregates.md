---
title: Create candlestick aggregates
excerpt: Turn raw financial tick data into aggregated candlestick views
keywords: [finance, analytics]
tags: [candlestick]
---

# Create candlestick aggregates

Turning raw, real-time tick data into aggregated candlestick views is a common
task for users who work with financial data. If your data is not tick data, for
example if you receive it in an already aggregated form such as 1-min buckets,
you can still use these functions to help you create
additional aggregates of your data into larger buckets, such as 1-hour or 1-day
buckets. If you want to work with pre-aggregated stock and crypto data, see the
[Analyzing Intraday Stock Data][intraday-tutorial] tutorial for more examples.

TimescaleDB includes [hyperfunctions][hyperfunctions] that you can use to
store and query your financial data more
easily. Hyperfunctions are SQL functions within TimescaleDB that make it
easier to manipulate and analyze time-series data in PostgreSQL with fewer
lines of code. There are three
hyperfunctions that are essential for calculating candlestick values:
[`time_bucket()`][time-bucket], [`FIRST()`][first], and [`LAST()`][last].

The `time_bucket()` hyperfunction helps you aggregate records into buckets of
arbitrary time intervals based on the timestamp value. `FIRST()` and `LAST()`
help you calculate the opening and closing prices. To calculate
highest and lowest prices, you can use the standard PostgreSQL aggregate
functions `MIN` and `MAX`.

In this first SQL example, use the hyperfunctions to query the tick data,
and turn it into 1-min candlestick values in the candlestick format:

```sql
-- Create the candlestick format
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

Hyperfunctions in this query:

*   `time_bucket('1 min', time)`: creates 1-minute buckets
*   `FIRST(price, time)`: selects the first `price` value in the bucket, ordered
    by `time`, which is the
    opening price of the candlestick.
*   `LAST(price, time)` selects
    the last `price` value in the bucket, ordered by `time`, which is
    the closing price of the candlestick

Besides the hyperfunctions, you can see other common SQL aggregate functions
like `MIN` and `MAX`, which calculate the lowest and highest prices in the
candlestick.

<Highlight type="note">
This tutorial uses the `LAST()` hyperfunction to calculate the volume within a bucket, because
the sample tick data already provides an incremental `day_volume` field which
contains the total volume for the given day with each trade. Depending on the
raw data you receive and whether you want to calculate volume in terms of
trade count or the total value of the trades, you might need to use
`COUNT(*)`, `SUM(price)`, or subtraction between the last and first values
in the bucket to get the correct result.
</Highlight>

## Create continuous aggregates for candlestick data

In TimescaleDB, the most efficient way to create candlestick views is to
use [continuous aggregates][caggs]. Continuous aggregates are very similar
to PostgreSQL materialized views but with three major advantages.

First,
materialized views recreate all of the data any time the view
is refreshed, which causes history to be lost. Continuous aggregates only
refresh the buckets of aggregated data where the source, raw data has been
changed or added.

Second, continuous aggregates can be automatically refreshed using built-in,
user-configured policies. No special triggers or stored procedures are
needed to refresh the data over time.

Finally, continuous aggregates are real-time by default. Any new raw
tick data that is inserted between refreshes is automatically appended
to the materialized data. This keeps your candlestick data up-to-date
without having to write special SQL to UNION data from multiple views and
tables.  

Continuous aggregates are often used to power dashboards and other user-facing
applications, like price charts, where query performance and timeliness of
your data matter.

Let's see how to create different candlestick time buckets - 1 minute,
1 hour, and 1 day - using continuous aggregates with different refresh
policies.

### 1-minute candlestick

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

### 1-hour candlestick

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

### 1-day candlestick

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

## Optional: add price change (delta) column in the candlestick view

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

## Using multiple continuous aggregates

You cannot currently create a continuous aggregate on top of another continuous aggregate.
However, this is not necessary in most cases. You can get a similar result and performance by
creating multiple continuous aggregates for the same hypertable. Due
to the efficient materialization mechanism of continuous aggregates, both
refresh and query performance should work well.

[caggs]: /use-timescale/:currentVersion:/continuous-aggregates/
[first]: /api/:currentVersion:/hyperfunctions/first/
[hyperfunctions]: /api/:currentVersion:/hyperfunctions/
[intraday-tutorial]: /tutorials/:currentVersion:/
[last]: /api/:currentVersion:/hyperfunctions/last/
[time-bucket]: /api/:currentVersion:/hyperfunctions/time_bucket/
