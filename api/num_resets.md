# num_resets() <tag type="toolkit" content="toolkit" />
The total number of times the counter is reset while calculating the
CounterSummary.

```sql
num_resets(
    summary CounterSummary
) RETURNS BIGINT
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
|num_resets|BIGINT|The number of resets detected during the counter_agg call|

## Sample Usage
<!---Single sentence description of what this example does-->

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

[hyperfunctions-counter-agg]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/counter-aggregation/
