---
api_name: intercept()
excerpt: Calculate the intercept from values in a `CounterSummary`
topics: [hyperfunctions]
keywords: [counters, hyperfunctions, toolkit]
tags: [intercept, least squares, linear regression]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.2.0
    stable: 1.3.0
hyperfunction:
  family: metric aggregation
  type: accessor
  aggregates:
    - counter_agg()
    - gauge_agg()
---

# intercept() <tag type="toolkit" content="Toolkit" />

The intercept of the [least squares fit][least-squares] line computed from the adjusted counter
values and times input in the CounterSummary. This corresponds to the projected
value at the PostgreSQL epoch (2000-01-01 00:00:00+00). This is useful for
drawing the best fit line on a graph, using the slope and the intercept.

```sql
intercept(
    summary CounterSummary
) RETURNS DOUBLE PRECISION
```

For more information about counter aggregation functions, see the
[hyperfunctions documentation][hyperfunctions-counter-agg].

## Required arguments

|Name|Type|Description|
|-|-|-|
|summary|CounterSummary|The input CounterSummary from a counter_agg call|

## Returns

|Name|Type|Description|
|-|-|-|
|intercept|DOUBLE PRECISION|The intercept of the least squares fit line computed from the points input to the CounterSummary|

## Sample usage

```sql
SELECT
    id,
    bucket,
    intercept(summary)
FROM (
    SELECT
        id,
        time_bucket('15 min'::interval, ts) AS bucket,
        counter_agg(ts, val) AS summary
    FROM foo
    GROUP BY id, time_bucket('15 min'::interval, ts)
) t
```

[hyperfunctions-counter-agg]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/counter-aggregation/
[least-squares]:https://en.wikipedia.org/wiki/Least_squares
