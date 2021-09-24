## average() <tag type="toolkit">Toolkit</tag>

```SQL
average(
    tws TimeWeightSummary
) RETURNS DOUBLE PRECISION
```

A function to compute a time weighted average from a `TimeWeightSummary`.

### Required arguments

|Name|Type|Description|
|---|---|---|
|`tws`|`TimeWeightSummary`|The input TimeWeightSummary from a [`time_weight`](/hyperfunctions/time-weighted-averages/time_weight/) call|

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

