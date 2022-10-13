---
api_name: open() | high() | low() | close()
excerpt: Get the OHLC prices for financial analysis
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

import Experimental from 'versionContent/_partials/_experimental.mdx';

# `open`, `high`, `low`, `close` <tag type="toolkit" content="Toolkit" /><tag type="experimental-toolkit" content="Experimental" />

This group of functions each returns the OHLC component for which it is named.
For example, the `open()` hyperfunction returns the opening price during the
aggregated time period.

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

Query your continuous aggregate on stock trade data:

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

Compute the by-minute OHLC on your tick data table and return the component prices:

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
