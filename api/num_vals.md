# num_vals

```SQL
num_vals(sketch UddSketch) RETURNS DOUBLE PRECISION
```

Get the number of values contained in a percentile estimate.

### Required arguments

|Name|Type|Description|
|---|---|---|
|`sketch`|`UddSketch`| The sketch to extract the number of values from, usually from a `percentile_agg` call|

### Returns

|Column|Type|Description|
|---|---|---|
|`uddsketch_count`|`DOUBLE PRECISION`|The number of values in the percentile estimate|

### Sample usage

```SQL
SELECT num_vals(percentile_agg(data))
FROM generate_series(0, 100) data;
```
```output
 num_vals
-----------
       101
```
