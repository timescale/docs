---
api_name: first_val() | last_val()
excerpt: Get the first and last values seen by `CounterSummary` aggregates
topics: [hyperfunctions]
tags: [counters, hyperfunctions, toolkit]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
  version:
    experimental: 1.11.0
hyperfunction:
  family: metric aggregation
  type: accessor
  aggregates:
    - counter_agg()
---

import Experimental from 'versionContent/_partials/_experimental.mdx';

# first_val, last_val <tag type="toolkit" content="Toolkit" /><tag type="experimental-toolkit" content="Experimental" />

This pair of functions returns the values of the first and last points in a `CounterSummary` aggregate.

```sql
first_val(
    cs CounterSummary
) RETURNS DOUBLE PRECISION
```

```sql
last_val(
    cs CounterSummary
) RETURNS DOUBLE PRECISION
```

<Experimental />

## Required arguments

|Name| Type |Description|
|-|-|-|
|`cs`|CounterSummary|The input CounterSummary from a previous `counter_agg` (point form) call, often from a continuous aggregate|

## Returns

|Column|Type|Description|
|-|-|-|
|`first_val`|`DOUBLE PRECISION`|The value of the first point in the `CounterSummary`|

|Column|Type|Description|
|-|-|-|
|`last_val`|`DOUBLE PRECISION`|The value of the last point in the `CounterSummary`|

## Sample usage

This example produces a CounterSummary from timestamps and associated values, then applies the `first_val` and `last_val` accessors:

```sql
WITH t as (
    SELECT
        time_bucket('1 day'::interval, ts) as dt,
        counter_agg(ts, val) AS cs -- get a CounterSummary
    FROM table
    GROUP BY time_bucket('1 day'::interval, ts)
)
SELECT
    dt,
    first_val(cs) -- extract the value of the first point in the CounterSummary
    last_val(cs) -- extract the value of the last point in the CounterSummary
FROM t;
```
