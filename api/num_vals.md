## num_vals()

```SQL
num_vals(sketch UddSketch) RETURNS DOUBLE PRECISION
```
```SQL
num_vals(digest tdigest) RETURNS DOUBLE PRECISION
```

Get the number of values contained in a percentile estimate.
This is provided in order to save space when both a count and a percentile estimate are required as part of continuous aggregates. 
You can simply compute a single percentile estimator and do not need to specify a separate 
`count` aggregate, just extract the `num_vals` from the percentile estimator.

### Required arguments

|Name|Type|Description|
|---|---|---|
|`sketch` / `digest` |`UddSketch` or `tdigest` |The percentile estimator to extract the number of values from, usually from a [`percentile_agg()`](/hyperfunctions/percentile-approximation/aggregation-methods/percentile_agg/) call. |

### Returns

|Column|Type|Description|
|---|---|---|
|`num_vals`|`DOUBLE PRECISION`|The number of values in the percentile estimate|

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
