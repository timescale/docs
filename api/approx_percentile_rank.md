# approx_percentile_rank

Estimate what percentile a given value would be located at in a UddSketch.

```SQL
approx_percentile_rank(
    value DOUBLE PRECISION,
    sketch UddSketch
) RETURNS UddSketch
```

### Required arguments

|Name|Type|Description|
|---|---|---|
|`value`|`DOUBLE PRECISION`|The value to estimate the percentile of|
|`sketch`|`UddSketch`|The sketch to compute the percentile on.

### Returns

|Column|Type|Description|
|---|---|---|
|`approx_percentile_rank`|`DOUBLE PRECISION`|The estimated percentile associated with the provided value|

### Sample usage

```SQL
SELECT
    approx_percentile_rank(99, percentile_agg(data))
FROM generate_series(0, 100) data;
```
```output
 approx_percentile_rank
----------------------------
         0.9851485148514851
```
