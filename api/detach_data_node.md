---
api_name: detach_data_node()
excerpt: Detach a data node from one or all hypertables
topics: [distributed hypertables, multi-node]
keywords: [multi-node, detach]
tags: [distributed hypertables, cluster, data nodes]
api:
  license: community
  type: function
---

# detach_data_node() <Tag type="community">Community</Tag>

Detach a data node from one hypertable or from all hypertables.

Reasons for detaching a data node include:

*   A data node should no longer be used by a hypertable and needs to be
removed from all hypertables that use it
*   You want to have fewer data nodes for a distributed hypertable to
partition across

### Required arguments

| Name        | Type|Description                       |
|-------------|----|-------------------------------|
| `node_name` | TEXT | Name of data node to detach from the distributed hypertable |

### Optional arguments

| Name          | Type|Description                            |
|---------------|---|-------------------------------------|
| `hypertable`  | REGCLASS | Name of the distributed hypertable where the data node should be detached. If NULL, the data node is detached from all hypertables. |
| `if_attached` | BOOLEAN | Prevent error if the data node is not attached. Defaults to false. |
| `force`       | BOOLEAN | Force detach of the data node even if that means that the replication factor is reduced below what was set. Note that it is never allowed to reduce the replication factor below 1 since that would cause data loss.         |
| `repartition` | BOOLEAN | Make the number of hash partitions equal to the new number of data nodes (if such partitioning exists). This ensures that the remaining data nodes are used evenly. Defaults to true. |

### Returns

The number of hypertables the data node was detached from.

#### Errors

Detaching a node is not permitted:

*   If it would result in data loss for the hypertable due to the data node
containing chunks that are not replicated on other data nodes
*   If it would result in under-replicated chunks for the distributed hypertable
(without the `force` argument)

<Highlight type="tip">
Replication is currently experimental, and not a supported feature
</Highlight>

Detaching a data node is under no circumstances possible if that would
mean data loss for the hypertable. Nor is it possible to detach a data node,
unless forced, if that would mean that the distributed hypertable would end
up with under-replicated chunks.

The only safe way to detach a data node is to first safely delete any
data on it or replicate it to another data node.

### Sample usage

Detach data node `dn3` from `conditions`:

```sql
SELECT detach_data_node('dn3', 'conditions');
```
