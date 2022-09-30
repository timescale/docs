---
api_name: first_val() | last_val()
excerpt: Get the first and last values seen by `TimeWeightSummary` aggregates
topics: [hyperfunctions]
tags: [time-weighted, hyperfunctions, toolkit]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
hyperfunction:
  family: time-weighted averages
  type: accessor
  aggregates:
    - time_weight()
# fields below will be deprecated
api_category: hyperfunction
api_experimental: true
toolkit: true
hyperfunction_family: 'time-weighted averages'
hyperfunction_subfamily: 'time-weighted averages'
hyperfunction_type: accessor
---

import Experimental from 'versionContent/_partials/_experimental.mdx';

# first_val, last_val <tag type="toolkit" content="Toolkit" /><tag type="experimental-toolkit" content="Experimental" />

This pair of functions returns the timestamps of the first and last points in a `TimeWeightSummary` aggregate.

```sql
first_val(
    tw TimeWeightSummary
) RETURNS DOUBLE PRECISION
```

```sql
last_val(
    tw TimeWeightSummary
) RETURNS DOUBLE PRECISION
```

<Experimental />

## Required arguments

|Name| Type |Description|
|-|-|-|
|`tw`|`TimeWeightSummary`|The input TimeWeightSummary from a previous `time_weight` call, often from a continuous aggregate|

## Returns

|Column|Type|Description|
|-|-|-|
|`first_val`|`DOUBLE PRECISION`|The value of the first point in the `CounterSummary`|

|Column|Type|Description|
|-|-|-|
|`last_val`|`DOUBLE PRECISION`|The value of the last point in the `CounterSummary`|

## Sample usage

This example produces a linear TimeWeightSummary from timestamps and associated values, then applies the `first_val` and `last_val` accessors:

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
    first_val(tw) -- extract the value of the first point in the TimeWeightSummary
    last_val(tw) -- extract the value of the last point in the TimeWeightSummary
FROM t;
```
