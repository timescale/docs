## max_val()

```SQL
max_val(digest TDigest) RETURNS DOUBLE PRECISION
```

Get the maximum value from a t-digest.

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