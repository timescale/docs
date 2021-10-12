# time_delta() <tag type="toolkit" content="toolkit" />
The observed change in time. Calculated by subtracting the first observed time
from the last observed time over the period aggregated. Measured in seconds.

```sql
time_delta(
    summary CounterSummary
) RETURNS DOUBLE PRECISION
```

For more information about counter aggregation, see the
[Hyperfunction documentation][howto-hyperfunctions]

## Required Arguments

|Name|Type|Description|
|-|-|-|
|summary|CounterSummary|The input CounterSummary from a counter_agg call|

## Returns

|Name|Type|Description|
|-|-|-|
|time_delta|DOUBLE PRECISION|The total duration in seconds between the first and last observed times in the CounterSummary|

## Sample Usage
<!---Single sentence description of what this example does-->

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

[howto-hyperfunctions]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/
