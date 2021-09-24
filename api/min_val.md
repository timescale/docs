## min_val()  <tag type="toolkit">Toolkit</tag>

```SQL
min_val(digest TDigest) RETURNS DOUBLE PRECISION
```

Get the minimum value from a t-digest (does not work with `percentile_agg` or `uddsketch` based estimators).
This is provided in order to save space
when both a minimum and a percentile estimate are required as part of continuous aggregates. 
You can simply compute a single percentile estimator and do not need to specify a separate 
`min` aggregate, just extract the `min_val` from the percentile estimator.

### Required Arguments
|Name|Type|Description|
|---|---|---|
| `digest` | `TDigest` | The digest to extract the min value from. |

### Returns

|Column|Type|Description|
|---|---|---|
| `min_val` | `DOUBLE PRECISION` | The minimum value entered into the t-digest. |

### Sample Usages

```SQL
SELECT min_val(tdigest(100, data))
FROM generate_series(1, 100) data;
```

```bash
 min_val
-----------
         1
```