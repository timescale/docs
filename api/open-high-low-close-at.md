---
api_name: open_at() | high_at() | low_at() | close_at()
excerpt: Get the timestamp corresponding to OHLC points in financial analysis
topics: [hyperfunctions]
tags: [hyperfunctions, finance]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
hyperfunction:
  family: financial analysis
  type: accessor
  aggregates:
    - ohlc()
# fields below will be deprecated
api_category: hyperfunction
api_experimental: true
toolkit: true
hyperfunction_family: 'financial analysis'
hyperfunction_subfamily: OpenHighLowClose
hyperfunction_type: accessor
---

# `open_at`, `high_at`, `low_at`, `close_at` <tag type="toolkit" content="Toolkit" /><tag type="experimental-toolkit" content="Experimental" />

import Experimental from 'versionContent/_partials/_experimental.mdx';

This group of functions each returns the timestamp of the OHLC component for
which it is named. For example, the `high_at()` hyperfunction returns the
timestamp of the highest price during the aggregated time period.

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
|`open_at`|`TIMESTAMPTZ`|The time at which the opening price occurred|

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

Query your continuous aggregate on stock trade data:

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

Compute the by-minute OHLC on your tick data table and return the component
prices and their timestamps:

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
