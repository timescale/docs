# Data node management

When a distributed hypertable is created, it will use all the
available data nodes by default. It is possible, however, to use only
a subset of data nodes with a particular distributed hypertable. This
is useful to, e.g., tie a distributed hypertable to data nodes that
have a specific performance profile.

To view the data nodes used by a distributed hypertable, use the
following query:

```sql
SELECT hypertable_name, data_nodes
FROM timescaledb_information.hypertables
WHERE hypertable_name = 'conditions';

 hypertable_name |              data_nodes
-----------------+---------------------------------------
 conditions      | {data_node_1,data_node_2,data_node_3}
```

If you add additional data nodes to a database, they are
not automatically associated with existing distributed
hypertables. Instead, you need to explicitly attach a data node
using [`attach_data_node`][attach_data_node]:

```sql
SELECT add_data_node('node3', host => 'dn3.example.com');
SELECT attach_data_node('node3', hypertable => 'conditions');
```

When you attach a data node, the partitioning configuration of the
distributed hypertable is also updated to account for the additional
data node (the number of space partitions are automatically
increased to match), unless the function parameter `repartition` is
set to `FALSE`. The updated partitioning configuration ensures that
the data node is able to take on newly created chunks.

In a similar way, if you want to remove a data node from a distributed
hypertable, you can use [`detach_data_node`][detach_data_node].

```sql
SELECT detach_data_node('node1', hypertable => 'conditions');
```

Note that you cannot detach a data node that still holds data for the
hypertable. To be able to detach a data node, ensure that either (1)
all its data is deleted first, or (2) the data is replicated on other
data nodes (see the next section on native replication).

## Moving data between nodes

When you attach a new data node to a distributed hypertable, you might
prefer to move data to the new node to free up storage on the
existing nodes and make queries use the added capacity. Data can be
moved between nodes at the chunk level:

```sql
CALL timescaledb_experimental.move_chunk('_timescaledb_internal._dist_hyper_1_1_chunk', 'data_node_3', 'data_node_2');

```

<highlight type="warning"> 
The ability to move chunks between data nodes is an experimental
feature that is under active development. We recommend that you
do not use this feature in a production environment.
</highlight>

The move operation involves several transactions and therefore cannot
be rolled back automatically. If a move operation fails, the failure
is logged with an operation ID that later can be used to cleanup any
state left on the involved nodes.

```sql
CALL timescaledb_experimental.cleanup_copy_chunk_operation('ts_copy_1_31');
```


[add_data_node]: /api/:currentVersion:/distributed-hypertables/add_data_node
[attach_data_node]: /api/:currentVersion:/distributed-hypertables/attach_data_node
[delete_data_node]: /api/:currentVersion:/distributed-hypertables/delete_data_node
[detach_data_node]: /api/:currentVersion:/distributed-hypertables/detach_data_node
