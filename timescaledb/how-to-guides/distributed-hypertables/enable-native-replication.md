## Native Replication [](native-replication)

A distributed hypertable can be configured to write each chunk to
multiple data nodes in order to replicate data at the chunk
level. This *native replication* ensures that a distributed hypertable
is protected against data node failures and provides an alternative to
fully replicating each data node using streaming replication.

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
functionality for a complete high-availability solution. Some
functionality described in this section is not yet implemented or
might have only a partial feature set. For instance, there is
currently no implementation for (re-)replicating existing chunks in
the background after a data node failure or increase in replication
factor. We therefore recommend keeping the replication factor set at
the default value of 1, and instead use streaming replication on each
data node.
</highlight>

Once enabled, native replication happens as part of normal inserts, by
writing each row to multiple data nodes, and therefore requires no
additional mechanism for replicating newly inserted data. Existing
chunks, which are not replicated according to the configured
replication factor, needs to be re-replicated by a background job in
order to achieve the set replication factor.

To view the data nodes each chunk is replicated to, the following
query can be used:

```sql
SELECT chunk_name, data_nodes
FROM timescaledb_information.chunks
WHERE hypertable_name = 'conditions';

	   chunk_name       |              data_nodes
------------------------+---------------------------------------
 _dist_hyper_1_1_chunk  | {data_node_1,data_node_2,data_node_3}
 _dist_hyper_1_2_chunk  | {data_node_1,data_node_2,data_node_3}
 _dist_hyper_1_3_chunk  | {data_node_1,data_node_2,data_node_3}
```

When querying a distributed hypertable using native replication, the
query planner knows how to include only one replica of each chunk in
the query plan. The planner can employ different strategies to pick
the set of chunk replicas in order to, e.g., evenly spread the query
load across the data nodes.

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


[create_distributed_hypertable]: /api#create_distributed_hypertable
[set_replication_factor]:  /api#set_replication_factor
