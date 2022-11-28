---
api_name: first_time() | last_time()
excerpt: Get the first and last timestamps seen by `TimeWeightSummary` aggregates
topics: [hyperfunctions]
tags: [time-weighted, hyperfunctions, toolkit]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
  version:
    experimental: 1.11.0
hyperfunction:
  family: time-weighted averages
  type: accessor
  aggregates:
    - time_weight()
---

import Experimental from 'versionContent/_partials/_experimental.mdx';

# first_time, last_time <tag type="toolkit" content="Toolkit" /><tag type="experimental-toolkit" content="Experimental" />

This pair of functions returns the timestamps of the first and last points in a `TimeWeightSummary` aggregate.

```sql
first_time(
    tw TimeWeightSummary
) RETURNS TIMESTAMPTZ
```

```sql
last_time(
    tw TimeWeightSummary
) RETURNS TIMESTAMPTZ
```

<Experimental />

## Required arguments

|Name| Type |Description|
|-|-|-|
|`tw`|`TimeWeightSummary`|The input TimeWeightSummary from a previous `time_weight` call, often from a continuous aggregate|

## Returns

|Column|Type|Description|
|-|-|-|
|`first_time`|`TIMESTAMPTZ`|The time of the first point in the `TimeWeightSummary`|

|Column|Type|Description|
|-|-|-|
|`last_time`|`TIMESTAMPTZ`|The time of the last point in the `TimeWeightSummary`|

## Sample usage

This example produces a linear TimeWeightSummary from timestamps and associated values, then applies the `first_time` and `last_time` accessors:

```sql
WITH t as (
    SELECT
        time_bucket('1 day'::interval, ts) as dt,
        time_weight('Linear', ts, val) AS tw -- get a TimeWeightSummary
    FROM table
    GROUP BY time_bucket('1 day'::interval, ts)
)
SELECT
    dt,
    first_time(tw) -- extract the timestamp of the first point in the TimeWeightSummary
    last_time(tw) -- extract the timestamp of the last point in the TimeWeightSummary
FROM t;
```
