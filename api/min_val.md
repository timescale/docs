## min_val()  <tag type="toolkit">Toolkit</tag>

```SQL
min_val(digest TDigest) RETURNS DOUBLE PRECISION
```

Get the minimum value from a t-digest (does not work with `percentile_agg` or
`uddsketch` based estimators). This saves space when you require both a minimum
and a percentile estimate as part of a continuous aggregate. You can compute a
single percentile estimator and do not need to specify a separate `min`
aggregate, by extracting the `min_val` from the percentile estimator.

For more information about percentile approximation functions, see the
[hyperfunctions documentation][hyperfunctions-percentile-approx].

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


[hyperfunctions-percentile-approx]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/
