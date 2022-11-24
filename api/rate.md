---
api_name: rate()
excerpt: Calculate the rate of change from values in a `CounterSummary`
topics: [hyperfunctions]
keywords: [counters, hyperfunctions, Toolkit]
tags: [rate, change]
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

# rate() <tag type="toolkit" content="Toolkit" />

The rate of change of the counter over the observed time period. This is the raw
or simple rate, equivalent to `delta(summary)` or `time_delta(summary)`. After
accounting for resets, the last value is subtracted from the first value and
divided by the duration between the last observed time and the first observed
time.

```sql
rate(
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
|rate|DOUBLE PRECISION|The per second observed rate computed from the CounterSummary|

## Sample usage

```sql
SELECT
    id,
    rate(summary)
FROM (
    SELECT
        id,
        counter_agg(ts, val) AS summary
    FROM foo
    GROUP BY id
) t
```

[hyperfunctions-counter-agg]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/counter-aggregation/
