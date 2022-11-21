---
api_name: with_bounds()
excerpt: Add bounds to a `CounterSummary`
topics: [hyperfunctions]
keywords: [counters, hyperfunctions, toolkit]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.2.0
    stable: 1.3.0
hyperfunction:
  family: metric aggregation
  type: mutator
  aggregates:
    - counter_agg()
    - gauge_agg()
---

# with_bounds() <tag type="toolkit" content="Toolkit" />

A utility function to add bounds to an already-computed CounterSummary. The
bounds represent the outer limits of the timestamps allowed for this
CounterSummary as well as the edges of the range to extrapolate to in functions
that allow it.

```sql
with_bounds(
    summary CounterSummary,
    bounds TSTZRANGE,
) RETURNS CounterSummary
```

For more information about counter aggregation functions, see the
[hyperfunctions documentation][hyperfunctions-counter-agg].

## Required arguments

|Name|Type|Description|
|-|-|-|
|summary|CounterSummary|The input CounterSummary|
|bounds|TSTZRANGE|A range of timestamptz representing the largest and smallest allowed times in this CounterSummary|

## Returns

|Name|Type|Description|
|-|-|-|
|counter_agg|CounterSummary|A CounterSummary object that can be passed to accessor functions or other objects in the counter aggregate API|

## Sample usage

```sql
SELECT
    id,
    bucket,
    extrapolated_rate(
        with_bounds(
            summary,
            time_bucket_range('15 min'::interval, bucket)
        )
    )
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
