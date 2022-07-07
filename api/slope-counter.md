---
api_name: slope()
excerpt: Calculate the slope from values in a `CounterSummary`
license: community
toolkit: true
topic: hyperfunctions
keywords: [counters, hyperfunctions, toolkit]
tags: [least squares, regression]
api_category: hyperfunction
api_experimental: false
hyperfunction_toolkit: true
hyperfunction_family: 'metric aggregation'
hyperfunction_subfamily: 'counter and gauge aggregation'
hyperfunction_type: accessor
---

# slope() <tag type="toolkit" content="Toolkit" />
The slope of the least squares fit line computed from the adjusted counter
values and times input in the CounterSummary. Because the times are input as
seconds, the slope provides a per-second rate of change estimate based on the
least squares fit, which is often similar to the result of the rate calculation,
but can more accurately reflect the usual behavior if there are infrequent,
large changes in a counter.

```sql
slope(
    summary CounterSummary
) RETURNS DOUBLE PRECISION
```

For more information about counter aggregation functions, see the
[hyperfunctions documentation][hyperfunctions-counter-agg].

## Required arguments

|Name|Type|Description|
|-|-|-|
|summary|CounterSummary|The input CounterSummary from a `counter_agg` call|

## Returns

|Name|Type|Description|
|-|-|-|
|slope|DOUBLE PRECISION|The per second rate of change computed by taking the slope of the least squares fit of the points input in the CounterSummary|

## Sample usage

```sql
SELECT
    id,
    bucket,
    slope(summary)
FROM (
    SELECT
        id,
        time_bucket('15 min'::interval, ts) AS bucket,
        counter_agg(ts, val) AS summary
    FROM foo
    GROUP BY id, time_bucket('15 min'::interval, ts)
) t
```


[hyperfunctions-counter-agg]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/counter-aggregation/
