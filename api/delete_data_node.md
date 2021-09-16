## delete_data_node() 

This function is executed on an access node in order to remove a data
node from the local database. As part of the deletion, the data node
will be detached from all hypertables that are using it if permissions
and data integrity requirements are satisfied. For more information,
see [`detach_data_node`](/distributed-hypertables/detach_data_node).

Note that deleting a data node is strictly a local operation; the data
node itself will not be affected and the corresponding remote database
on the data node will be left intact, including all its data. The
operation is local as to ensure it can complete even if the remote
data node is not responding and to avoid unintentional data loss on
the data node.

Also note that it is not possible to use
[`add_data_node`](/distributed-hypertables/add_data_node) to add the
same data node again without first deleting the database on the data
node or using another database. This is to prevent adding a data node
that was previously part of the same or another distributed database
but is no longer in sync.

#### Errors

An error will be generated if the data node cannot be detached from
all attached hypertables.

### Required Arguments

|Name|Type|Description|
|---|---|---|
| `node_name` | TEXT | Name of the data node. |

### Optional Arguments

|Name|Type|Description|
|---|---|---|
| `if_exists`   | BOOLEAN | Prevent error if the data node does not exist. Defaults to false. |
| `force`       | BOOLEAN | Force removal of data nodes from hypertables unless that would result in data loss.  Defaults to false. |
| `repartition` | BOOLEAN | Make the number of space partitions equal to the new number of data nodes (if such partitioning exists). This ensures that the remaining data nodes are used evenly. Defaults to true. |

### Returns 

A boolean indicating if the operation was successful or not.

### Sample Usage 

To delete a data node named `dn1`:
```sql
SELECT delete_data_node('dn1');
```
