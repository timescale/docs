## delete_data_node() 

This function will remove the data node locally. This will *not*
affect the remote database in any way, it will just update the local
index over all existing data nodes.

The data node will be detached from all hypertables that are using
it if permissions and data integrity requirements are satisfied. For
more information, see [`detach_data_node`](#detach_data_node).

#### Errors

An error will be generated if the data node cannot be detached from
all attached hypertables.

#### Required Arguments 

| Name        | Description            |
| ----------- | -----------            |
| `node_name` | (NAME) Name of the data node. |

#### Optional Arguments 

| Name          | Description                                           |
|---------------|-------------------------------------------------------|
| `if_exists`   | (BOOLEAN) Prevent error if the data node does not exist. Defaults to false. |
| `force`       | (BOOLEAN) Force removal of data nodes from hypertables unless that would result in data loss.  Defaults to false. |
| `repartition` | (BOOLEAN) Make the number of space partitions equal to the new number of data nodes (if such partitioning exists). This ensures that the remaining data nodes are used evenly. Defaults to true. |

#### Returns 

A boolean indicating if the operation was successful or not.

#### Sample usage 

To delete a data node named `dn1`:
```sql
SELECT delete_data_node('dn1');
```