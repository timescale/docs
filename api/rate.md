# rate() <tag type="toolkit" content="toolkit" />
The rate of change of the counter over the observed time period. This is the raw
or simple rate, equivalent to `delta(summary)` or `time_delta(summary)`. After
accounting for resets, the last value is suvtracted from the first value and
divided by the duration between the last observed time and the first observed
time.

```sql
rate(
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
|rate|DOUBLE PRECISION|The per second observed rate computed from the CounterSummary|

## Sample Usage
<!---Single sentence description of what this example does-->

```sql
SELECT
    id,
    rate(summary)
FROM (
    SELECT
        id,
        counter_agg(ts, val) AS summary
    FROM foo
    GROUP BY id
) t
```

[howto-hyperfunctions]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/
