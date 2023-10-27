---
api_name: delete_data_node()
excerpt: Remove a data node from a database and detach it from all hypertables
topics: [distributed hypertables, multi-node]
keywords: [multi-node]
tags: [distributed hypertables, data nodes, detach, delete]
api:
  license: community
  type: function
---

# delete_data_node() <Tag type="community">Community</Tag>

This function is executed on an access node to remove a data
node from the local database. As part of the deletion, the data node
is detached from all hypertables that are using it, if permissions
and data integrity requirements are satisfied. For more information,
see [`detach_data_node`][detach_data_node].

Deleting a data node is strictly a local operation; the data
node itself is not affected and the corresponding remote database
on the data node is left intact, including all its data. The
operation is local to ensure it can complete even if the remote
data node is not responding and to avoid unintentional data loss on
the data node.

<Highlight type="note">
It is not possible to use
[`add_data_node`](/api/latest/distributed-hypertables/add_data_node) to add the
same data node again without first deleting the database on the data
node or using another database. This is to prevent adding a data node
that was previously part of the same or another distributed database
but is no longer synchronized.
</Highlight>

#### Errors

An error is generated if the data node cannot be detached from
all attached hypertables.

### Required arguments

|Name|Type|Description|
|---|---|---|
| `node_name` | TEXT | Name of the data node. |

### Optional arguments

|Name|Type|Description|
|---|---|---|
| `if_exists`   | BOOLEAN | Prevent error if the data node does not exist. Defaults to false. |
| `force`       | BOOLEAN | Force removal of data nodes from hypertables unless that would result in data loss. Defaults to false. |
| `repartition` | BOOLEAN | Make the number of hash partitions equal to the new number of data nodes (if such partitioning exists). This ensures that the remaining data nodes are used evenly. Defaults to true. |

### Returns

A boolean indicating if the operation was successful or not.

### Sample usage

To delete a data node named `dn1`:

```sql
SELECT delete_data_node('dn1');
```

[detach_data_node]: /api/:currentVersion:/distributed-hypertables/detach_data_node
