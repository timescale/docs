# High availability (HA) with multi-node
A multi-node installation can be configured to write each chunk to multiple data
to natively replicate data at the chunk level. This protects against data node
failures and provides an alternative to fully replicating each data node using
streaming replication in order to provide high availability.

The data nodes themselves require no additional setup to use native replication,
but the access node relies on streaming replication by default, so it requires
some configuration to make it highly available.

When data is written to a chunk, it uses the `replication_factor` setting to
determine how many nodes it replicates the data to. By default, this is set to
`1`, so there is no native replication. You can increase this number when you
create the hypertable. For example, to replicate the data across a total of
three data nodes:
```sql
SELECT create_distributed_hypertable('conditions', 'time', 'location',
	replication_factor => 3);
```

Alternatively, you can set the `replication_factor` setting on an existing
hypertable in a multi-node environment using the
[`set_replication_factor`][set_replication_factor] call.

When native replication is enabled, the replication happens whenever you ingest
data into the table. On each `INSERT` call, each row of the data is written to
multiple data nodes. This means that you don't need to do any extra steps to
have newly ingested data replicated. When you query replicated data, the query
planner only includes one replica of each chunk in the query plan.

## Handling node failures
When a data node fails, you cannot complete queries and inserts that attempt to write to the failed node. This is to maintain data consistency until the data node becomes available again. For example:
```sql
SELECT delete_data_node('data_node_2', force => true);
WARNING:  distributed hypertable "conditions" is under-replicated
```

If the data node cannot be recovered, native replication allows the node to be
deleted from the multi-node cluster without losing data.

<highlight type="important">
You cannot force the deletion of a data node if it would mean that a multi-node
cluster permanently loses data.
</highlight>

When you have successfully removed a failed data node, some data chunks lack
replicas, but queries and inserts work as normal again. However, the cluster
stays in a vulnerable state until all chunks that lack replicas are fully
replicated again. This happens only when the failed data node is replaced, and
the data successfully replicated.

When you have restored a failed data node, you can see the chunks that need to
be replicated with this query:
<!-- Still experimental? --LKB 2021-10-20-->
```sql
SELECT chunk_schema, chunk_name, replica_nodes, non_replica_nodes
FROM timescaledb_experimental.chunk_replication_status
WHERE hypertable_name = 'conditions' AND num_replicas < desired_num_replicas;
```

The output from this query looks like this:
```sql
     chunk_schema      |      chunk_name       | replica_nodes |     non_replica_nodes
-----------------------+-----------------------+---------------+---------------------------
 _timescaledb_internal | _dist_hyper_1_1_chunk | {data_node_3} | {data_node_1,data_node_2}
 _timescaledb_internal | _dist_hyper_1_3_chunk | {data_node_1} | {data_node_2,data_node_3}
 _timescaledb_internal | _dist_hyper_1_4_chunk | {data_node_3} | {data_node_1,data_node_2}
(3 rows)
```

With the information from the chunk replication status view, an
under-replicated chunk can be copied to a new node to ensure the chunk
has the sufficient number of replicas. For example:
<!-- Still experimental? --LKB 2021-10-20-->
```sql
CALL timescaledb_experimental.copy_chunk('_timescaledb_internal._dist_hyper_1_1_chunk', 'data_node_3', 'data_node_2');
```

<highlight type="important">>
When you restore chunk replication, the operation uses more than one transaction. This means that it cannot be automatically rolled back. If you cancel the operation before it is completed, an operation ID for the copy is logged. You can use this operation ID to clean up any state left by the cancelled operation. For example:
<!-- Still experimental? --LKB 2021-10-20-->
```sql
CALL timescaledb_experimental.cleanup_copy_chunk_operation('ts_copy_1_31');
```
</highlight>


[create_distributed_hypertable]: /api/:currentVersion:/distributed-hypertables/create_distributed_hypertable
[set_replication_factor]:  /api/:currentVersion:/distributed-hypertables/set_replication_factor
