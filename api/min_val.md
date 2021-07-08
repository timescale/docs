## min_val()

```SQL
min_val(digest TDigest) RETURNS DOUBLE PRECISION
```

Get the minimum value from a t-digest.

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