---
api_name: num_elements()
excerpt: Calculate the number of points with distinct times from values in a `CounterSummary`
license: community
toolkit: true
topic: hyperfunctions
tags: [hyperfunctions, distinct, counters, CounterSummary]
api_category: hyperfunction
api_experimental: false
hyperfunction_toolkit: true
hyperfunction_family: 'metric aggregation'
hyperfunction_subfamily: 'counter and gauge aggregation'
hyperfunction_type: accessor
---

# num_elements() <tag type="toolkit" content="Toolkit" />
The total number of points seen while calculating the CounterSummary. Only
points with distinct times are counted, as duplicate times are usually discarded
in these calculations.

```sql
num_elements(
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
|num_elements|BIGINT|The number of points seen during the counter_agg call|

## Sample usage

```sql
SELECT
    id,
    bucket,
    num_elements(summary)
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
