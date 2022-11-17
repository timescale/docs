---
api_name: time_delta()
excerpt: Calculate the difference between the start and end times from data in a `CounterSummary`
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
  type: accessor
  aggregates:
    - counter_agg()
    - gauge_agg()
---

# time_delta() <tag type="toolkit" content="Toolkit" />

The observed change in time. Calculated by subtracting the first observed time
from the last observed time over the period aggregated. Measured in seconds.

```sql
time_delta(
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
|time_delta|DOUBLE PRECISION|The total duration in seconds between the first and last observed times in the CounterSummary|

## Sample usage

```sql
SELECT
    id,
    bucket,
    time_delta(summary)
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
