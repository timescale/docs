---
api_name: attach_chunk()
excerpt: Attach a chunk to a hypertable.
topics: [hypertables]
keywords: [chunks, hypertables, split]
api:
  license: community
  type: function
products: [cloud, mst, self_hosted]
---

import Since2210 from "versionContent/_partials/_since_2_21_0.mdx";

# attach_chunk() <Tag type="community">Community</Tag>

Attach a hypertable as a chunk in another [hypertable][hypertables-section] at a given slice in a dimension.  

![Hypertable structure](https://assets.timescale.com/docs/images/hypertable-structure.png)

The schema, name, existing constraints, and indexes of `chunk` do not change, even 
if a constraint conflicts with a chunk constraint in `hypertable`.

The `hypertable` you attach `chunk` to does not need to have the same dimension columns as the
hypertable you previously [detached `chunk`][hypertable-detach-chunk] from.

While attaching `chunk` to `hypertable`:
- Dimension columns in `chunk` are set as `NOT NULL`.
- Any foreign keys in `hypertable` are created in `chunk`.

You cannot:
- Attaching a chunk that is still attached to another hypertable. First call [detach_chunk][hypertable-detach-chunk].
- Attaching foreign tables are not supported. 


<Since2210 />

## Samples

Attach a hypertable as a chunk in another hypertable for a specific slice in a dimension:

```sql
CALL attach_chunk('ht', '_timescaledb_internal._hyper_1_2_chunk', '{"device_id": [0, 1000]}');
```

## Arguments

|Name|Type| Description                                                                                                                                   |
|---|---|-----------------------------------------------------------------------------------------------------------------------------------------------|
| `hypertable` | REGCLASS | Name of the hypertable to attach `chunk` to.                                                                                                  |
| `chunk` | REGCLASS | Name of the chunk to attach.                                                                                                                  |
| `slices` | JSONB | The slice `chunk` will occupy in `hypertable`. `slices` cannot clash with the slice already occupied by an existing chunk in `hypertable`. |


## Returns

This function returns void.

[hypertable-detach-chunk]: /api/:currentVersion:/hypertable/detach_chunk/
[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
