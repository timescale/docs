# Time-weighted average functions
The functions related to time-weighted averages.



## average()

```SQL
average(
    tws TimeWeightSummary
) RETURNS DOUBLE PRECISION
```

A function to compute a time weighted average from a `TimeWeightSummary`.

### Required arguments

|Name|Type|Description|
|---|---|---|
|`tws`|`TimeWeightSummary`|The input TimeWeightSummary from a `time_weight` call|

### Returns

|Column|Type|Description|
|---|---|---|
|`average`|`DOUBLE PRECISION`|The time weighted average computed from the `TimeWeightSummary`|

### Sample usage

```SQL
SELECT
    id,
    average(tws)
FROM (
    SELECT
        id,
        time_weight('LOCF', ts, val) AS tws
    FROM foo
    GROUP BY id
) t
```

This ends up being equal to the rectangle with width equal to the duration
between two points and height the midpoint between the two magnitudes. Once we
have this weighted sum, we can divide by the total duration to get the time
weighted average.
