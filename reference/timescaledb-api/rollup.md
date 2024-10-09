---
api_name: rollup()
excerpt: Roll up multiple `OpenHighLowClose` aggregates
topics: [hyperfunctions]
tags: [hyperfunctions, finance]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
  version:
    experimental: 1.10.1
hyperfunction:
  family: financial analysis
  type: rollup
  aggregates:
    - ohlc()
---

# rollup <Tag type="toolkit" content="Toolkit" /><Tag type="experimental-toolkit" content="Experimental" />

import Experimental from 'versionContent/_partials/_experimental.mdx';

Combines multiple `OpenHighLowClose` aggregates. Using `rollup`, you can
reaggregate a continuous aggregate into larger [time buckets][time_bucket].

```sql
rollup(
    ohlc OpenHighLowClose
) RETURNS OpenHighLowClose
```

<Experimental />

## Required arguments

|Name|Type|Description|
|-|-|-|
|`ohlc`|`OpenHighLowClose`|The aggregate to roll up|

## Returns

|Column|Type|Description|
|-|-|-|
|`ohlc`|`OpenHighLowClose`|A new aggregate, which is an object storing (timestamp, value) pairs for each of the opening, high, low, and closing prices.|

## Sample usage

Roll up your by-minute continuous aggregate into hourly buckets and return the OHLC prices:

```sql
SELECT time_bucket('1 hour'::interval, ts) AS hourly_bucket,
    symbol,
    toolkit_experimental.open(toolkit_experimental.rollup(ohlc)),
    toolkit_experimental.high(toolkit_experimental.rollup(ohlc)),
    toolkit_experimental.low(toolkit_experimental.rollup(ohlc)),
    toolkit_experimental.close(toolkit_experimental.rollup(ohlc)),
  FROM ohlc
 GROUP BY hourly_bucket, symbol
;
```

Roll up your by-minute continuous aggregate into a daily aggregate and return the OHLC prices:

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

[time_bucket]: /api/:currentVersion:/hyperfunctions/time_bucket/
