## mean()

```SQL
mean(sketch UddSketch) RETURNS DOUBLE PRECISION
```
```SQL
mean(digest tdigest) RETURNS DOUBLE PRECISION
```

Get the exact average of all the values in the percentile estimate. (Percentiles
returned are estimates, the average is exact). This is provided in order to save space
when both a mean and a percentile estimate are required as part of continuous aggregates. 
You can simply compute a single percentile estimator and do not need to specify a separate 
`avg` aggregate, just extract the mean from the percentile estimator.

### Required arguments

|Name|Type|Description|
|---|---|---|
| `sketch` / `digest` | `UddSketch`/`tdigest` |  The sketch to extract the mean value from, usually from a [`percentile_agg()`](/hyperfunctions/percentile-approximation/percentile_agg/) call. |

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
