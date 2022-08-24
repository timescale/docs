---
api_name: ohlc()
excerpt: Aggregate financial data in a OHLC
topics: [hyperfunctions]
tags: [hyperfunctions, finance]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
hyperfunction:
  family: financial analysis
  type: aggregate
# fields below will be deprecated
api_category: hyperfunction
api_experimental: true
toolkit: true
hyperfunction_family: 'financial analysis'
hyperfunction_subfamily: OpenHighLowClose
hyperfunction_type: aggregate
---
import Experimental from 'versionContent/_partials/_experimental.mdx';

# ohlc <tag type="toolkit" content="Toolkit" /><tag type="experimental-toolkit" content="Experimental" />
Produces an `OpenHighLowClose` aggregate which stores the opening, high, low, and closing prices
alongside the times at which they each occurred.  This aggregate can either be later re-aggregated
using `rollup` or passed directly to any of the following hyperfunctions: `open`, `high`, `low`,
`close`, `open_at`, `high_at`, `low_at`, `close_at`.

```sql
ohlc(
    ts TIMESTAMPTZ,
	price DOUBLE PRECISION
) RETURNS OpenHighLowClose
```

<Experimental />

## Required arguments

|Name|Type|Description|
|-|-|-|
|`ts`|`TIMESTAMPTZ`|Timestamp column|
|`price`|`DOUBLE PRECISION`|Stock quote price at the given timestamp|

## Returns

|Column|Type|Description|
|-|-|-|
|`agg`|`OpenHighLowClose`|An object storing (timestamp, value) pairs for each of the opening, high, low, and closing prices.|

## Sample usage
Create a Continuous Aggregate on your stock trade data.

```sql
CREATE MATERIALIZED VIEW ohlc
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 minute'::interval, "time") AS ts,
  symbol,
  toolkit_experimental.ohlc("time", price)
FROM stocks_real_time
GROUP BY ts, symbol
 ```


# `open`, `high`, `low`, `close` <tag type="toolkit" content="Toolkit" /><tag type="experimental-toolkit" content="Experimental" />
This group of functions each return the component of the OHLC for which it is named. 
For example, the `open()` hyperfunction returns the opening price during the aggregated time period.

```sql
open(
    ohlc OpenHighLowClose
) RETURNS DOUBLE PRECISION
```

```sql
high(
    ohlc OpenHighLowClose
) RETURNS DOUBLE PRECISION
```

```sql
low(
    ohlc OpenHighLowClose
) RETURNS DOUBLE PRECISION
```

```sql
close(
    ohlc OpenHighLowClose
) RETURNS DOUBLE PRECISION
```

<Experimental />

## Required arguments

|Name|Type|Description|
|-|-|-|
|`ohlc`|`OpenHighLowClose`|OHLC aggregate|

## Returns

|Column|Type|Description|
|-|-|-|
|`open`|`DOUBLE PRECISION`|The opening price|

|Column|Type|Description|
|-|-|-|
|`high`|`DOUBLE PRECISION`|The high price|

|Column|Type|Description|
|-|-|-|
|`low`|`DOUBLE PRECISION`|The low price|

|Column|Type|Description|
|-|-|-|
|`close`|`DOUBLE PRECISION`|The closing price|

## Sample usage
Query your Continuous Aggregate on stock trade data.

```sql
SELECT ts,
  symbol,
  toolkit_experimental.open(ohlc),
  toolkit_experimental.high(ohlc),
  toolkit_experimental.low(ohlc),
  toolkit_experimental.close(ohlc)
FROM ohlc
;
 ```
 
Compute the minutely OHLC on your tick data table and return the component prices.
 
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
  toolkit_experimental.open(ohlc),
  toolkit_experimental.high(ohlc),
  toolkit_experimental.low(ohlc),
  toolkit_experimental.close(ohlc)
FROM ohlc
;
```



# `open_at`, `high_at`, `low_at`, `close_at` <tag type="toolkit" content="Toolkit" /><tag type="experimental-toolkit" content="Experimental" />
This group of functions each return the timestamp of the component of the OHLC for which it is named. 
For example, the `high_at()` hyperfunction returns the timestamp of the highest price during the aggregated time period.

```sql
open_at(
    ohlc OpenHighLowClose
) RETURNS TIMESTAMPTZ
```

```sql
high_at(
    ohlc OpenHighLowClose
) RETURNS TIMESTAMPTZ
```

```sql
low_at(
    ohlc OpenHighLowClose
) RETURNS TIMESTAMPTZ
```

```sql
close_at(
    ohlc OpenHighLowClose
) RETURNS TIMESTAMPTZ
```

<Experimental />

## Required arguments

|Name|Type|Description|
|-|-|-|
|`ohlc`|`OpenHighLowClose`|OHLC aggregate|

## Returns

|Column|Type|Description|
|-|-|-|
|`open_at`|`TIMESTAMPTZ`|The time at which the opening price|

|Column|Type|Description|
|-|-|-|
|`high_at`|`TIMESTAMPTZ`|The first time at which the high price occurred|

|Column|Type|Description|
|-|-|-|
|`low_at`|`TIMESTAMPTZ`|The first time at which the low price occurred|

|Column|Type|Description|
|-|-|-|
|`close_at`|`TIMESTAMPTZ`|The time at which closing price occurred|

## Sample usage
Query your Continuous Aggregate on stock trade data.

```sql
SELECT ts,
  symbol,
  toolkit_experimental.open_at(ohlc),
  toolkit_experimental.open(ohlc),
  toolkit_experimental.high_at(ohlc),
  toolkit_experimental.high(ohlc),
  toolkit_experimental.low_at(ohlc),
  toolkit_experimental.low(ohlc),
  toolkit_experimental.close_at(ohlc)
  toolkit_experimental.close(ohlc)
FROM ohlc
;
 ```
 
Compute the minutely OHLC on your tick data table and return the component prices and their timestamps.
 
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
  toolkit_experimental.open_at(ohlc),
  toolkit_experimental.open(ohlc),
  toolkit_experimental.high_at(ohlc),
  toolkit_experimental.high(ohlc),
  toolkit_experimental.low_at(ohlc),
  toolkit_experimental.low(ohlc),
  toolkit_experimental.close_at(ohlc)
  toolkit_experimental.close(ohlc)
FROM ohlc
;
```

# rollup <tag type="toolkit" content="Toolkit" /><tag type="experimental-toolkit" content="Experimental" />
Combines multiple `OpenHighLowClose` aggregates. `rollup` works especially well with re-aggregating a Continuous Aggregate according to a larger [`time_bucket()`][time_bucket].

## Required arguments

|Name|Type|Description|
|-|-|-|
|`ohlc`|`OpenHighLowClose`|OHLC aggregate|


## Returns

|Column|Type|Description|
|-|-|-|
|`agg`|`OpenHighLowClose`|An object storing (timestamp, value) pairs for each of the opening, high, low, and closing prices.|

## Sample usage
Roll up your minutely Continuous Aggregate into hourly buckets and return the OHLC prices.

```sql
SELECT time_bucket('1 hour'::interval, ts) AS hourly_bucket
     , symbol
     , toolkit_experimental.open(toolkit_experimental.rollup(ohlc))
     , toolkit_experimental.high(toolkit_experimental.rollup(ohlc))
     , toolkit_experimental.low(toolkit_experimental.rollup(ohlc))
     , toolkit_experimental.close(toolkit_experimental.rollup(ohlc))
  FROM ohlc
 GROUP BY hourly_bucket, symbol
;
```

Rollup your minutely OHLC aggregate on your tick data table into a daily aggregate and return the OHLC prices.
 
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
GROUP BY daily_bucket, symbol
;
```
