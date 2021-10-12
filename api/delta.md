# delta() <tag type="toolkit" content="toolkit" />
The change in the counter over the time period. This is the raw or simple delta
computed by accounting for resets and subtracting the last seen value from the
first.

```sql
delta(
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
|delta|DOUBLE PRECISION|The delta computed from the CounterSummary|

## Sample Usage
<!---Single sentence description of what this example does-->

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

[howto-hyperfunctions]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/
