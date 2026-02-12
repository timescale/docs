---
api_name: detach_chunk()
excerpt: Detach a chunk from a hypertable.
topics: [hypertables]
keywords: [chunks, hypertables, split]
api:
  license: community
  type: function
products: [cloud, mst, self_hosted]
---

import Since2210 from "versionContent/_partials/_since_2_21_0.mdx";

# detach_chunk() <Tag type="community">Community</Tag>

Separate a chunk from a [hypertable][hypertables-section]. 

![Hypertable structure][hypertable-structure]

`chunk` becomes a standalone hypertable with the same name and schema. All existing constraints and 
indexes on `chunk` are preserved after detaching. Foreign keys are dropped.

In this initial release, you cannot detach a chunk that has been [converted to the $COLUMNSTORE][setup-hypercore].

<Since2210 />

## Samples

Detach a chunk from a hypertable:

```sql
CALL detach_chunk('_timescaledb_internal._hyper_1_2_chunk');
```


## Arguments

|Name|Type| Description                  |
|---|---|------------------------------|
| `chunk` | REGCLASS | Name of the chunk to detach. |


## Returns

This function returns void.

[hypertable-structure]: https://assets.timescale.com/docs/images/hypertable-structure.png
[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
[setup-hypercore]: /use-timescale/:currentVersion:/hypercore/real-time-analytics-in-hypercore/
