---
api_name: rollup()
excerpt: Roll up multiple `CounterSummary` aggregates
topics: [hyperfunctions]
keywords: [counters, rollup, hyperfunctions, toolkit]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.3.0
    stable: 1.3.0
hyperfunction:
  family: metric aggregation
  type: rollup
  aggregates:
    - counter_agg()
    - gauge_agg()
# fields below will be deprecated
api_category: hyperfunction
toolkit: true
hyperfunction_family: 'metric aggregation'
hyperfunction_subfamily: 'counter and gauge aggregation'
hyperfunction_type: rollup
---

# rollup(CounterSummary) <tag type="toolkit">Toolkit</tag>

```SQL
rollup(
    cs CounterSummary
) RETURNS CounterSummary
```

An aggregate to compute a combined `CounterSummary` from a series of
non-overlapping `CounterSummaries`. Non-disjointed `CounterSummaries` cause
errors.

For more information about counter aggregation functions, see the
[hyperfunctions documentation][hyperfunctions-counter-agg].

## Required arguments

|Name| Type |Description|
|-|-|-|
|`cs`|CounterSummary|The input CounterSummary from a previous `counter_agg` (point form) call, often from a continuous aggregate|

## Returns

|Column|Type|Description|
|-|-|-|
|`counter_agg`|CounterSummary|A CounterSummary object that can be passed to accessor functions or other objects in the counter aggregate API|

## Sample usage

```SQL
WITH t as (
    SELECT
        date_trunc('day', ts) as dt,
        counter_agg(ts, val) AS counter_summary -- get a time weight summary
    FROM foo
    WHERE id = 'bar'
    GROUP BY date_trunc('day')
), q as (
    SELECT rollup(counter_summary) AS full_cs -- do a second level of aggregation to get the full CounterSummary
    FROM t
)
SELECT
    dt,
    delta(counter_summary),  -- extract the delta from the  CounterSummary
    delta(counter_summary) / (SELECT delta(full_cs) FROM q LIMIT 1)  as normalized -- get the fraction of the delta that happened each day compared to the full change of the counter
FROM t;
```

[hyperfunctions-counter-agg]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/counter-aggregation/
