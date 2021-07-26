# Native replication

A distributed hypertable can be configured to write each chunk to
multiple data nodes in order to replicate data at the chunk
level. This *native replication* ensures that a distributed hypertable
is protected against data node failures and provides an alternative to
fully replicating each data node using streaming replication in order
to provide high availability.

While data nodes require no additional setup to use native
replication, the access node continues to rely on streaming
replication, however. In this regard, the access node has similar
requirements for high availability as any regular PostgreSQL instance.

The number of data nodes a chunk is written to is determined by a
distributed hypertable's `replication_factor` (the default value is 1,
i.e., no native replication), and it can be set when calling
[`create_distributed_hypertable`][create_distributed_hypertable]:


```sql
SELECT create_distributed_hypertable('conditions', 'time', 'location',
	replication_factor => 3);
```
Alternatively, the function
[`set_replication_factor`][set_replication_factor] can be used to
enable native replication on an existing distributed hypertable.

<highlight type="warning"> 
Native replication is currently under development and lacks
functionality for a complete high-availability solution. For instance,
if a node fails one might need to (re-)replicate the chunks that had a
replica on the failed node.  While it is possible to copy chunks from
one node to another, this functionality is experimental and not yet
automated. For production environments, we therefore recommend keeping
the replication factor set at the default value of 1, and instead use
streaming replication on each data node.
</highlight>


Once enabled, native replication happens as part of normal inserts by
writing each row to multiple data nodes, and therefore requires no
additional mechanism for replicating newly inserted data. When
querying, the query planner knows how to include only one replica of
each chunk in the query plan.


## Handling node failures

When a data node fails, queries and inserts that involve the failed
node will fail in order to ensure data consistency until the data node
is fully available again. If the data node cannot be recovered, native
replication allows the node to be deleted from the multi-node cluster
without losing data:

```sql
SELECT delete_data_node('data_node_2', force => true);
WARNING:  distributed hypertable "conditions" is under-replicated
```

Note that it is not possible to force the deletion of a data node if
it would mean that a distributed hypertable would permanently lose
data.

Once the failed data has been removed, some data chunks will lack
replicas, but queries and inserts should work as normal
again. However, the multi-node cluster remains in a vulnerable state
until all chunks that lack replicas are fully replicated again.

To view the chunks that need to be replicated use the following query:

```sql
SELECT chunk_schema, chunk_name, replica_nodes, non_replica_nodes 
FROM timescaledb_experimental.chunk_replication_status 
WHERE hypertable_name = 'conditions' AND num_replicas < desired_num_replicas;
     chunk_schema      |      chunk_name       | replica_nodes |     non_replica_nodes
-----------------------+-----------------------+---------------+---------------------------
 _timescaledb_internal | _dist_hyper_1_1_chunk | {data_node_3} | {data_node_1,data_node_2}
 _timescaledb_internal | _dist_hyper_1_3_chunk | {data_node_1} | {data_node_2,data_node_3}
 _timescaledb_internal | _dist_hyper_1_4_chunk | {data_node_3} | {data_node_1,data_node_2}
(3 rows)
```

With the information from the chunk replication status view, an
under-replicated chunk can be copied to a new node to ensure the chunk
has sufficient number of replicas:

```sql
CALL timescaledb_experimental.copy_chunk('_timescaledb_internal._dist_hyper_1_1_chunk', 'data_node_3', 'data_node_2');
```

The chunk copying happens over several transactions and cannot be
rolled back automatically. If the copy operation is aborted or
terminated prematurely by the user, an operation ID for the aborted
copy is logged. This operation ID can later be used to clean up
any state left by the aborted operation:

```sql
CALL timescaledb_experimental.cleanup_copy_chunk_operation('ts_copy_1_31');
```

## Comparing native and streaming replication

Compared to streaming replication, native replication provides several
advantages:

- **Built in**: Native replication is built in and requires no
  additional configuration to use. TimescaleDB instances that serve as
  data nodes need not be configured with standby instances using
  streaming replication.
- **Elasticity**: As long all chunks on a data node have at least one
  replica on another data node, it is possible to delete that
  node. The chunks that are under-replicated after deleting the data
  node would be re-replicated to new data nodes as long as there is
  still capacity (i.e., there remains at least as many data nodes as
  the configured replication factor). This flexibility allows not only
  scaling up a multi-node cluster during peek hours, but also allows
  scaling it down when the extra capacity is no longer needed.
- **Efficient**: While streaming replication needs to replicate every
  mutation at the level of the write-ahead log (WAL), native
  replication only replicates distinct chunks. This makes features
  like, e.g., compression more efficient since only the original
  chunk's data need to be replicated. When a chunk is compressed or
  decompressed, no additional replication is needed since it is a
  local operation on a data node that can be applied to each
  replica. With streaming replication, however, compressing or
  decompressing a chunk would require writing all the data changes to
  one or more standby replica nodes.
- **Query optimizations**: Native replication enables a number of
  interesting optimizations and features that go beyond just providing
  high availability (HA). For instance, when a chunk exists on
  multiple data nodes, the planner could balance queries across
  different chunk replicas for better resource utilization. Similarly,
  if the planner detects a non-responsive or slow data node, it could
  ensure that only responsive nodes are included in the query plan.

There are also disadvantages with native replication. For instance, if
a data node holds data that is not part of a distributed hypertable,
this data won't be replicated. In such situations, streaming
replication is recommended.


[create_distributed_hypertable]: /api/:currentVersion:/distributed-hypertables/create_distributed_hypertable
[set_replication_factor]:  /api/:currentVersion:/distributed-hypertables/set_replication_factor
