---
api_name: irate_left() | irate_right()
excerpt: Calculate the instantaneous rate of change from values in a `CounterSummary`
topics: [hyperfunctions]
keywords: [counters, hyperfunctions, toolkit]
tags: [rate]
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

# irate_left() and irate_right() <tag type="toolkit" content="Toolkit" />

The instantaneous rate of change of the counter at the left (earlier) and right
(later) side of the time range.

For more information about counter aggregation functions, see the
[hyperfunctions documentation][hyperfunctions-counter-agg].

## irate_left()

The instantaneous rate of change of the counter at the left (earlier) side of
the time range. Essentially, the `idelta_left` divided by the duration between the
first and second observed points in the CounterSummary. This can be especially
useful for fast moving counters.

```sql
irate_left(
    summary CounterSummary
) RETURNS DOUBLE PRECISION
```

### Required arguments

|Name|Type|Description|
|-|-|-|
|summary|CounterSummary|The input CounterSummary from a counter_agg call|

### Returns

|Name|Type|Description|
|-|-|-|
|irate_left|DOUBLE PRECISION|The instantaneous rate computed from the left (earlier) side of the CounterSummary|

### Sample usage

```sql
SELECT
    id,
    bucket,
    irate_left(summary)
FROM (
    SELECT
        id,
        time_bucket('15 min'::interval, ts) AS bucket,
        counter_agg(ts, val) AS summary
    FROM foo
    GROUP BY id, time_bucket('15 min'::interval, ts)
) t
```

## irate_right()

The instantaneous rate of change of the counter at the right (later) side of the
time range. Essentially, the `idelta_right` divided by the duration between the
first and second observed points in the CounterSummary. This can be especially
useful for fast moving counters.

```sql
irate_right(
    summary CounterSummary
) RETURNS DOUBLE PRECISION
```

### Required arguments

|Name|Type|Description|
|-|-|-|
|summary|CounterSummary|The input CounterSummary from a counter_agg call|

### Returns

|Name|Type|Description|
|-|-|-|
|irate_right|DOUBLE PRECISION|The instantaneous rate computed from the right (later) side of the CounterSummary|

### Sample usage

```sql
SELECT
    id,
    bucket,
    irate_right(summary)
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
