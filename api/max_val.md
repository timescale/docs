## max_val()  <tag type="toolkit">Toolkit</tag>

```SQL
max_val(digest TDigest) RETURNS DOUBLE PRECISION
```

Get the maximum value from a t-digest (does not work with `percentile_agg` or `uddsketch` based estimators).
This is provided in order to save space
when both a maximum and a percentile estimate are required as part of continuous aggregates.
You can simply compute a single percentile estimator and do not need to specify a separate
`max` aggregate, just extract the `max_val` from the percentile estimator.

For more information about percentile approximation functions, see the
[hyperfunctions documentation][hyperfunctions-percentile-approx].

### Required Arguments
|Name|Type|Description|
|---|---|---|
| `digest` | `TDigest` | The digest to extract the max value from. |

### Returns
|Column|Type|Description|
|---|---|---|
| `max_val` | `DOUBLE PRECISION` | The maximum value entered into the t-digest. |

### Sample Usage

```SQL
SELECT max_val(tdigest(100, data))
FROM generate_series(1, 100) data;
```

```bash
 max_val
---------
     100
```

[hyperfunctions-percentile-approx]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/
