---
section: hyperfunction
subsection: ohlc()
---

### Calculate by-minute stock-tick prices

Combine stock tick data into one-minute buckets. Return the asset prices and
timestamps for each minute:

```sql
WITH ohlc AS (
    SELECT time_bucket('1 minute'::interval, ts) AS minute_bucket,
      symbol,
      toolkit_experimental.ohlc(ts, price)
    FROM stocks_real_time
    GROUP BY minute_bucket, symbol
)
SELECT minute_bucket,
  symbol,
  toolkit_experimental.open_time(ohlc),
  toolkit_experimental.open(ohlc),
  toolkit_experimental.high_time(ohlc),
  toolkit_experimental.high(ohlc),
  toolkit_experimental.low_time(ohlc),
  toolkit_experimental.low(ohlc),
  toolkit_experimental.close_time(ohlc)
  toolkit_experimental.close(ohlc)
FROM ohlc;
```

### Roll up multiple continuous aggregates

Roll up a by-minute continuous aggregate into hourly buckets and return the OHLC
prices:

```sql
SELECT time_bucket('1 hour'::interval, ts) AS hourly_bucket,
    symbol,
    toolkit_experimental.open(toolkit_experimental.rollup(ohlc)),
    toolkit_experimental.high(toolkit_experimental.rollup(ohlc)),
    toolkit_experimental.low(toolkit_experimental.rollup(ohlc)),
    toolkit_experimental.close(toolkit_experimental.rollup(ohlc)),
FROM ohlc
GROUP BY hourly_bucket, symbol;
```

Roll up a by-minute aggregate into a daily aggregate and return the OHLC prices:

```sql
WITH ohlc AS (
    SELECT time_bucket('1 minute'::interval, ts) AS minute_bucket,
      symbol,
      toolkit_experimental.ohlc(ts, price)
    FROM stocks_real_time
    GROUP BY minute_bucket, symbol
)
SELECT time_bucket('1 day'::interval , bucket) AS daily_bucket
  symbol,
  toolkit_experimental.open(toolkit_experimental.rollup(ohlc)),
  toolkit_experimental.high(toolkit_experimental.rollup(ohlc)),
  toolkit_experimental.low(toolkit_experimental.rollup(ohlc)),
  toolkit_experimental.close(toolkit_experimental.rollup(ohlc))
FROM ohlc
GROUP BY daily_bucket, symbol;
```
