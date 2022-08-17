---
api_name: num_changes()
excerpt: Calculate the number of times a value changed within the time period of a `CounterSummary`
topics: [hyperfunctions]
keywords: [counters, hyperfunctions, toolkit]
tags: [count, change]
api:
  license: community
  type: function
  toolkit: true
hyperfunction:
  family: metric aggregation
  type: accessor
  aggregates:
    - counter_agg()
    - gauge_agg()
# fields below will be deprecated
api_category: hyperfunction
toolkit: true
hyperfunction_family: 'metric aggregation'
hyperfunction_subfamily: 'counter and gauge aggregation'
hyperfunction_type: accessor
---

# num_changes() <tag type="toolkit" content="Toolkit" />

The number of times the value changed within the period over which the
CounterSummary is calculated. This is determined by evaluating consecutive
points. Any change in the value is counted, including counter resets where the
counter is reset to zero. This can result in the same adjusted counter value for
consecutive points, but is still treated as a change.

```sql
num_changes(
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
|num_changes|BIGINT|The number of times the value changed|

## Sample usage

```sql
SELECT
    id,
    bucket,
    num_changes(summary)
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
