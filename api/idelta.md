---
api_name: idelta_left() | idelta_right()
excerpt: Calculate the instantaneous change from values in a `CounterSummary`
topics: [hyperfunctions]
keywords: [counters, hyperfunctions, toolkit]
tags: [delta, change]
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

# idelta_left() and idelta_right() <tag type="toolkit" content="Toolkit" />

The instantaneous change in the counter at the left (earlier) and right (later)
side of the time range.

For more information about counter aggregation functions, see the
[hyperfunctions documentation][hyperfunctions-counter-agg].

## idelta_left()

The instantaneous change in the counter at the left (earlier) side of the time
range. Essentially, the first value subtracted from the second value seen in the
time range (handling resets appropriately). This can be especially useful for
fast moving counters.

```sql
idelta_left(
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
|idelta_left|DOUBLE PRECISION|The instantaneous delta computed from the left (earlier) side of the CounterSummary|

### Sample usage

```sql
SELECT
    id,
    bucket,
    idelta_left(summary)
FROM (
    SELECT
        id,
        time_bucket('15 min'::interval, ts) AS bucket,
        counter_agg(ts, val) AS summary
    FROM foo
    GROUP BY id, time_bucket('15 min'::interval, ts)
) t
```

## idelta_right()

The instantaneous change in the counter at the right (later) side of the time
range. Essentially, the penultimate value subtracted from the last value seen in
the time range (handling resets appropriately). This can be especially useful
for fast moving counters.

```sql
idelta_right(
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
|idelta_right|DOUBLE PRECISION|The instantaneous delta computed from the right (later) side of the CounterSummary|

### Sample usage

```sql
SELECT
    id,
    bucket,
    idelta_right(summary)
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
