---
api_name: delta
api_category: hyperfunction
api_experimental: false
hyperfunction_toolkit: true
hyperfunction_family: 'metric aggregation'
hyperfunction_subfamily: 'counter and gauge aggregation'
hyperfunction_type: accessor
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

[hyperfunctions-counter-agg]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/counter-aggregation/
