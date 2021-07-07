# mean

```SQL
mean(sketch UddSketch) RETURNS DOUBLE PRECISION
```

Get the exact average of all the values in the percentile estimate. (Percentiles
returned are estimates, the average is exact.

### Required arguments

|Name|Type|Description|
|---|---|---|
| `sketch` | `UddSketch` |  The sketch to extract the mean value from, usually from a [`percentile_agg()`](#aggregate-functions) call. |

### Returns

|Column|Type|Description|
|---|---|---|
| `mean` | `DOUBLE PRECISION` | The average of the values in the percentile estimate. |

### Sample usage

```SQL
SELECT mean(percentile_agg(data))
FROM generate_series(0, 100) data;
```
```output
 mean
------
 50
```
