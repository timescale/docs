# counter_zero_time() <tag type="toolkit" content="toolkit" />
The time at which the counter value is predicted to have been zero based on the
least squares fit line computed from the points in the CounterSummary.

```sql
counter_zero_time(
    summary CounterSummary
) RETURNS TIMESTAMPTZ
```

For more information about counter aggregation functions, see the
[hyperfunctions documentation][hyperfunctions-counter-agg].

## Required Arguments

|Name|Type|Description|
|-|-|-|
|summary|CounterSummary|The input CounterSummary from a counter_agg call|

## Returns

|Name|Type|Description|
|-|-|-|
|counter_zero_time|TIMESTAMPTZ|The time at which the counter value is predicted to have been zero based onthe least squares fit of the points input to the CounterSummary|

## Sample Usage
<!---Single sentence description of what this example does-->

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
