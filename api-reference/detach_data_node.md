## detach_data_node() 

Detach a data node from one hypertable or from all hypertables.

Reasons for detaching a data node:

- A data node should no longer be used by a hypertable and needs to be
removed from all hypertables that use it
- You want to have fewer data nodes for a distributed hypertable to
partition across

#### Required Arguments 

| Name        | Description                       |
|-------------|-----------------------------------|
| `node_name` | (NAME) Name of data node to detach from the distributed hypertable |

#### Optional Arguments 

| Name          | Description                            |
|---------------|----------------------------------------|
| `hypertable`  | (REGCLASS) Name of the distributed hypertable where the data node should be detached. If NULL, the data node will be detached from all hypertables. |
| `if_attached` | (BOOLEAN) Prevent error if the data node is not attached. Defaults to false. |
| `force`       | (BOOLEAN) Force detach of the data node even if that means that the replication factor is reduced below what was set. Note that it will never be allowed to reduce the replication factor below 1 since that would cause data loss.         |
| `repartition` | (BOOLEAN) Make the number of space partitions equal to the new number of data nodes (if such partitioning exists). This ensures that the remaining data nodes are used evenly. Defaults to true. |

#### Returns

The number of hypertables the data node was detached from.

#### Errors

Detaching a node is not permitted:
- If it would result in data loss for the hypertable due to the data node
containing chunks that are not replicated on other data nodes
- If it would result in under-replicated chunks for the distributed hypertable
(without the `force` argument)

<highlight type="tip">
Replication is currently experimental, and not a supported feature
</highlight>

Detaching a data node is under no circumstances possible if that would
mean data loss for the hypertable. Nor is it possible to detach a data node,
unless forced, if that would mean that the distributed hypertable would end
up with under-replicated chunks.

The only safe way to detach a data node is to first safely delete any
data on it or replicate it to another data node.

#### Sample Usage 

Detach data node `dn3` from `conditions`:

```sql
SELECT detach_data_node('dn3', 'conditions');
```