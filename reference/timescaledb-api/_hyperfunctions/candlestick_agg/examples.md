---
section: hyperfunction
subsection: candlestick_agg()
---

### Get candlestick values from tick data

Query your tick data table for the opening, high, low, and closing prices, and
the trading volume, for each 1 hour period in the last day:

``` sql
SELECT
    time_bucket('1 hour'::interval, "time") AS ts,
    symbol,
    open(candlestick_agg("time", price, volume)),
    high(candlestick_agg("time", price, volume)),
    low(candlestick_agg("time", price, volume)),
    close(candlestick_agg("time", price, volume)),
    volume(candlestick_agg("time", price, volume))
FROM stocks_real_time
WHERE "time" > now() - '1 day'::interval
GROUP BY ts, symbol
;

-- or

WITH cs AS (
    SELECT time_bucket('1 hour'::interval, "time") AS hourly_bucket,
      symbol,
      candlestick_agg("time", price, volume) AS candlestick
    FROM stocks_real_time
    WHERE "time" > now() - '1 day'::interval
    GROUP BY hourly_bucket, symbol
)
SELECT hourly_bucket,
  symbol,
  open(candlestick),
  high(candlestick),
  low(candlestick),
  close(candlestick),
  volume(candlestick)
FROM cs
;
```

### Create a continuous aggregate from tick data and roll it up

Create a continuous aggregate on your stock trade data:

```sql
CREATE MATERIALIZED VIEW candlestick
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 minute'::interval, "time") AS ts,
  symbol,
  candlestick_agg("time", price, volume) AS candlestick
FROM stocks_real_time
GROUP BY ts, symbol
;
```

Query your by-minute continuous aggregate over stock trade data for the opening,
high, low, and closing (OHLC) prices, along with their timestamps, in the last
hour:

``` sql
SELECT ts,
  symbol,
    open_time(candlestick),
    open(candlestick),
    high_time(candlestick),
    high(candlestick),
    low_time(candlestick),
    low(candlestick),
    close_time(candlestick),
    close(candlestick)
FROM candlestick
WHERE ts > now() - '1 hour'::interval
;
```

Roll up your by-minute continuous aggregate into daily buckets and return the
Volume Weighted Average Price for `AAPL` for the last month:

``` sql
SELECT
    time_bucket('1 day'::interval, ts) AS daily_bucket,
    symbol,
    vwap(rollup(candlestick))
FROM candlestick
WHERE symbol = 'AAPL'
      AND ts > now() - '1 month'::interval
GROUP BY daily_bucket
ORDER BY daily_bucket
;
```

Roll up your by-minute continuous aggregate into hourly buckets and return the
the opening, high, low, and closing prices and the volume for each 1 hour period
in the last day:

``` sql
SELECT
    time_bucket('1 hour'::interval, ts) AS hourly_bucket,
    symbol,
    open(rollup(candlestick)),
    high(rollup(candlestick)),
    low(rollup(candlestick)),
    close(rollup(candlestick)),
    volume(rollup(candlestick))
FROM candlestick
WHERE ts > now() - '1 day'::interval
GROUP BY hourly_bucket
;
```

### Starting from already-aggregated data

If you have a table of pre-aggregated stock data, it might look similar this
this format:

``` sql
           ts           │ symbol │  open  │  high  │  low   │ close  │  volume
────────────────────────┼────────┼────────┼────────┼────────┼────────┼──────────
 2022-11-17 00:00:00-05 │ VTI    │ 195.67 │  197.9 │ 195.45 │ 197.49 │  3704700
 2022-11-16 00:00:00-05 │ VTI    │ 199.45 │ 199.72 │ 198.03 │ 198.32 │  2905000
 2022-11-15 00:00:00-05 │ VTI    │  201.5 │ 202.14 │ 198.34 │ 200.36 │  4606200
 2022-11-14 00:00:00-05 │ VTI    │ 199.26 │ 200.92 │ 198.21 │ 198.35 │  4248200
 2022-11-11 00:00:00-05 │ VTI    │ 198.58 │  200.7 │ 197.82 │ 200.16 │  4538500
 2022-11-10 00:00:00-05 │ VTI    │ 194.35 │ 198.31 │ 193.65 │ 198.14 │  3981600
 2022-11-09 00:00:00-05 │ VTI    │ 190.46 │ 191.04 │ 187.21 │ 187.53 │ 13959600
 2022-11-08 00:00:00-05 │ VTI    │ 191.25 │ 193.31 │ 189.42 │ 191.66 │  4847500
 2022-11-07 00:00:00-05 │ VTI    │ 189.59 │ 190.97 │ 188.47 │ 190.66 │  3420000
 2022-11-04 00:00:00-04 │ VTI    │ 189.32 │  190.3 │ 185.75 │ 188.94 │  3584600
 2022-11-03 00:00:00-04 │ VTI    │  186.5 │ 188.09 │ 185.13 │ 186.54 │  3935600
 2022-11-02 00:00:00-04 │ VTI    │ 193.07 │ 195.27 │ 188.29 │ 188.34 │  4686000
 2022-11-01 00:00:00-04 │ VTI    │    196 │ 196.44 │ 192.76 │ 193.43 │  9873800
 2022-10-31 00:00:00-04 │ VTI    │ 193.99 │ 195.17 │ 193.51 │ 194.03 │  5053900
 2022-10-28 00:00:00-04 │ VTI    │ 190.84 │ 195.53 │ 190.74 │ 195.29 │  3178800
 2022-10-27 00:00:00-04 │ VTI    │ 192.46 │ 193.47 │ 190.61 │ 190.85 │  3556300
 2022-10-26 00:00:00-04 │ VTI    │ 191.26 │ 194.64 │ 191.26 │ 191.75 │  4091100
 2022-10-25 00:00:00-04 │ VTI    │ 189.57 │ 193.16 │ 189.53 │ 192.94 │  3287100
 2022-10-24 00:00:00-04 │ VTI    │ 188.38 │ 190.12 │ 186.69 │ 189.51 │  4527800
 2022-10-21 00:00:00-04 │ VTI    │ 182.99 │ 187.78 │ 182.29 │ 187.49 │  3381200
 2022-10-20 00:00:00-04 │ VTI    │ 184.54 │ 186.99 │ 182.81 │ 183.27 │  2636200
 2022-10-19 00:00:00-04 │ VTI    │ 185.25 │ 186.64 │ 183.34 │ 184.87 │  2589100
 2022-10-18 00:00:00-04 │ VTI    │ 188.14 │  188.7 │ 184.71 │ 186.46 │  3906800
```

You can use the [`candlestick`](#candlestick) function to transform the data
into a form that you'll be able pass to all of the accessors and
[`rollup`](#rollup) functions. To show that your data is preserved, this example
shows how these accessors return a table that looks just like your data:

``` sql
SELECT
    ts,
    symbol,
    open(candlestick),
    high(candlestick),
    low(candlestick),
    close(candlestick),
    volume(candlestick)
FROM (
    SELECT
        ts,
        symbol,
        candlestick(ts, open, high, low, close, volume)
    FROM historical_data
) AS _(ts, symbol, candlestick);
;

-- or

WITH cs AS (
    SELECT ts
      symbol,
      candlestick(ts, open, high, low, close, volume)
    FROM historical_data
)
SELECT 
    ts
    symbol,
    open(candlestick),
    high(candlestick),
    low(candlestick),
    close(candlestick),
    volume(candlestick)
FROM cs
;
```

The advantage of transforming your data into the candlestick aggergate form is
that you can then use other functions in this group, such as [`rollup`](#rollup)
and [`vwap`](#vwap).

Roll up your by-day historical data into weekly buckets and return the Volume
Weighted Average Price:

``` sql
SELECT
    time_bucket('1 week'::interval, ts) AS weekly_bucket,
    symbol,
    vwap(rollup(candlestick))
FROM (
    SELECT
        ts,
        symbol,
        candlestick(ts, open, high, low, close, volume)
    FROM historical_data
) AS _(ts, symbol, candlestick)
GROUP BY weekly_bucket, symbol
;
```
