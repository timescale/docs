---
api_name: delta()
excerpt: Calculate the change in a counter from values in a `CounterSummary`
topics: [hyperfunctions]
keywords: [counters, hyperfunctions, toolkit]
tags: [delta]
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

# delta() <tag type="toolkit" content="Toolkit" />

The change in the counter over the time period. This is the raw or simple delta
computed by accounting for resets and subtracting the last seen value from the
first.

```sql
delta(
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
|delta|DOUBLE PRECISION|The delta computed from the CounterSummary|

## Sample usage

```sql
SELECT
    id,
    delta(summary)
FROM (
    SELECT
        id,
        counter_agg(ts, val) AS summary
    FROM foo
    GROUP BY id
) t
```

[hyperfunctions-counter-agg]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/counter-aggregation/
