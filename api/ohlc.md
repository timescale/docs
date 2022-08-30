---
api_name: ohlc()
excerpt: Aggregate data in a `OpenHighLowClose` aggregate for financial analysis
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

Produces an `OpenHighLowClose` aggregate which stores the opening, high, low,
and closing prices alongside the times at which they each occurred. This
aggregate can either be later re-aggregated using `rollup` or passed directly to
any of the following hyperfunctions: `open`, `high`, `low`, `close`, `open_at`,
`high_at`, `low_at`, or `close_at`.

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

Create a continuous aggregate on your stock trade data:

```sql
CREATE MATERIALIZED VIEW ohlc
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 minute'::interval, "time") AS ts,
  symbol,
  toolkit_experimental.ohlc("time", price)
FROM stocks_real_time
GROUP BY ts, symbol
 ```
