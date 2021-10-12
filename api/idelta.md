# idelta_left() and idelta_right() <tag type="toolkit" content="toolkit" />
The instantaneous change in the counter at the left (earlier) and right (later)
side of the time range.

For more information about counter aggregation, see the
[Hyperfunction documentation][howto-hyperfunctions]

## idelta_left()
The instantaneous change in the counter at the left (earlier) side of the time
range. Essentially, the first value subtracted from the second value seen in the
time range (handling resets appropriately). This can be especially useful for
fast moving counters.

```sql
idelta_left(
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
|idelta_left|DOUBLE PRECISION|The instantaneous delta computed from the left (earlier) side of the CounterSummary|

### Sample Usage
<!---Single sentence description of what this example does-->

```sql
SELECT
    id,
    bucket,
    idelta_left(summary)
FROM (
    SELECT
        id,
        time_bucket('15 min'::interval, ts) AS bucket,
        counter_agg(ts, val) AS summary
    FROM foo
    GROUP BY id, time_bucket('15 min'::interval, ts)
) t
```

## idelta_right()
The instantaneous change in the counter at the right (later) side of the time
range. Essentially, the penultimate value subtracted from the last value seen in
the time range (handling resets appropriately). This can be especially useful
for fast moving counters.

```sql
idelta_right(
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
|idelta_right|DOUBLE PRECISION|The instantaneous delta computed from the right (later) side of the CounterSummary|

### Sample Usage
<!---Single sentence description of what this example does-->

```sql
SELECT
    id,
    bucket,
    idelta_right(summary)
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
