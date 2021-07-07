# error

```SQL
error(sketch UddSketch) RETURNS DOUBLE PRECISION
```

This returns the maximum relative error that a percentile estimate will have
(relative to the correct value). This means the actual value will fall in the
range defined by `approx_percentile(sketch) +/-
approx_percentile(sketch)*error(sketch)`.

### Required arguments

|Name|Type|Description|
|---|---|---|
|`sketch`|`UddSketch`|The sketch to determine the error of, usually from a `percentile_agg` call|

### Returns

|Column|Type|Description|
|---|---|---|
|`error`|`DOUBLE PRECISION`|The maximum relative error of any percentile estimate|

### Sample usage

```SQL
SELECT error(percentile_agg(data))
FROM generate_series(0, 100) data;
```
```output
 error
-------
 0.001
```
