---
api_name: counter_zero_time()
excerpt: Predict the time when a counter was at zero
license: community
toolkit: true
api_category: hyperfunction
api_experimental: false
hyperfunction_toolkit: true
hyperfunction_family: 'metric aggregation'
hyperfunction_subfamily: 'counter and gauge aggregation'
hyperfunction_type: accessor
---

# counter_zero_time() <tag type="toolkit" content="Toolkit" />
The time at which the counter value is predicted to have been zero based on the
least squares fit line computed from the points in the CounterSummary.

```sql
counter_zero_time(
    summary CounterSummary
) RETURNS TIMESTAMPTZ
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
|counter_zero_time|TIMESTAMPTZ|The time at which the counter value is predicted to have been zero based onthe least squares fit of the points input to the CounterSummary|

## Sample usage

```sql
SELECT
    id,
    bucket,
    counter_zero_time(summary)
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
