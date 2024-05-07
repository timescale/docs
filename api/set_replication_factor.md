---
api_name: set_replication_factor()
excerpt: Set the replication factor for a distributed hypertable
topics: [distributed hypertables]
keywords: [distributed hypertables, multi-node, replication]
tags: [cluster]
api:
  license: community
  type: function
---

import MultiNodeDeprecation from "versionContent/_partials/_multi-node-deprecation.mdx";

<MultiNodeDeprecation />

# set_replication_factor() <Tag type="community">Community</Tag>

Sets the replication factor of a distributed hypertable to the given value.
Changing the replication factor does not affect the number of replicas for existing chunks.
Chunks created after changing the replication factor are replicated
in accordance with new value of the replication factor. If the replication factor cannot be
satisfied, since the amount of attached data nodes is less than new replication factor,
the command aborts with an error.

If existing chunks have less replicas than new value of the replication factor,
the function prints a warning.

### Required arguments

|Name|Type|Description|
|---|---|---|
| `hypertable` | REGCLASS | Distributed hypertable to update the replication factor for.|
| `replication_factor` | INTEGER | The new value of the replication factor. Must be greater than 0, and smaller than or equal to the number of attached data nodes.|

#### Errors

An error is given if:

*   `hypertable` is not a distributed hypertable.
*   `replication_factor` is less than `1`, which cannot be set on a distributed hypertable.
*   `replication_factor` is bigger than the number of attached data nodes.

If a bigger replication factor is desired, it is necessary to attach more data nodes
by using [attach_data_node][attach_data_node].

### Sample usage

Update the replication factor for a distributed hypertable to `2`:

```sql
SELECT set_replication_factor('conditions', 2);
```

Example of the warning if any existing chunk of the distributed hypertable has less than 2 replicas:

```
WARNING:  hypertable "conditions" is under-replicated
DETAIL:  Some chunks have less than 2 replicas.
```

Example of providing too big of a replication factor for a hypertable with 2 attached data nodes:

```sql
SELECT set_replication_factor('conditions', 3);
ERROR:  too big replication factor for hypertable "conditions"
DETAIL:  The hypertable has 2 data nodes attached, while the replication factor is 3.
HINT:  Decrease the replication factor or attach more data nodes to the hypertable.
```

[attach_data_node]: /api/:currentVersion:/distributed-hypertables/attach_data_node/
