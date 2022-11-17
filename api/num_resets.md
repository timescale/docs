---
api_name: num_resets()
excerpt: Calculate the total number of times a counter is reset
topics: [hyperfunctions]
keywords: [counters, hyperfunctions, toolkit]
tags: [resets, count]
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
---

# num_resets() <tag type="toolkit" content="Toolkit" />

The total number of times the counter is reset while calculating the
CounterSummary.

```sql
num_resets(
    summary CounterSummary
) RETURNS BIGINT
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
|num_resets|BIGINT|The number of resets detected during the counter_agg call|

## Sample usage

```sql
SELECT
    id,
    bucket,
    num_resets(summary)
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
