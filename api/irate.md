# irate_left() and irate_right() <tag type="toolkit" content="toolkit" />
The instantaneous rate of change of the counter at the left (earlier) and right
(later) side of the time range.

For more information about counter aggregation, see the
[Hyperfunction documentation][howto-hyperfunctions]

## irate_left()
The instantaneous rate of change of the counter at the left (earlier) side of
the time range. Essentially, the `idelta_left` divided by the duration between the
first and second observed points in the CounterSummary. This can be especially
useful for fast moving counters.

```sql
irate_left(
    summary CounterSummary
) RETURNS DOUBLE PRECISION
```

### Required Arguments

|Name|Type|Description|
|-|-|-|
|summary|CounterSummary|The input CounterSummary from a counter_agg call|

### Returns

|Name|Type|Description|
|-|-|-|
|irate_left|DOUBLE PRECISION|The instantaneous rate computed from the left (earlier) side of the CounterSummary|

### Sample Usage
<!---Single sentence description of what this example does-->

```sql
SELECT
    id,
    bucket,
    irate_left(summary)
FROM (
    SELECT
        id,
        time_bucket('15 min'::interval, ts) AS bucket,
        counter_agg(ts, val) AS summary
    FROM foo
    GROUP BY id, time_bucket('15 min'::interval, ts)
) t
```

## irate_right()
The instantaneous rate of change of the counter at the right (later) side of the
time range. Essentially, the `idelta_right` divided by the duration between the
first and second observed points in the CounterSummary. This can be especially
useful for fast moving counters.

```sql
irate_right(
    summary CounterSummary
) RETURNS DOUBLE PRECISION
```

### Required Arguments

|Name|Type|Description|
|-|-|-|
|summary|CounterSummary|The input CounterSummary from a counter_agg call|

### Returns

|Name|Type|Description|
|-|-|-|
|irate_right|DOUBLE PRECISION|The instantaneous rate computed from the right (later) side of the CounterSummary|

### Sample Usage
<!---Single sentence description of what this example does-->

```sql
SELECT
    id,
    bucket,
    irate_right(summary)
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
