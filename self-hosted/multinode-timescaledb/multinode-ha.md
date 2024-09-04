---
title: High availability with multi-node
excerpt: How to configure multi-node TimescaleDB for high availability
products: [self_hosted]
keywords: [multi-node, high availability]
---

import MultiNodeDeprecation from "versionContent/_partials/_multi-node-deprecation.mdx";

<MultiNodeDeprecation />

# High availability with multi-node

A multi-node installation of TimescaleDB can be made highly available
by setting up one or more standbys for each node in the cluster, or by
natively replicating data at the chunk level.

Using standby nodes relies on streaming replication and you set it up
in a similar way to [configuring single-node HA][single-ha], although the
configuration needs to be applied to each node independently.

To replicate data at the chunk level, you can use the built-in
capabilities of multi-node TimescaleDB to avoid having to
replicate entire data nodes. The access node still relies on a
streaming replication standby, but the data nodes need no additional
configuration. Instead, the existing pool of data nodes share
responsibility to host chunk replicas and handle node failures.

There are advantages and disadvantages to each approach.
Setting up standbys for each node in the cluster ensures that
standbys are identical at the instance level, and this is a tried
and tested method to provide high availability. However, it also
requires more setting up and maintenance for the mirror cluster.

Native replication typically requires less resources, nodes, and
configuration, and takes advantage of built-in capabilities, such as
adding and removing data nodes, and different replication factors on
each distributed hypertable. However, only chunks are replicated on
the data nodes.

The rest of this section discusses native replication. To set up
standbys for each node, follow the instructions for [single node
HA][single-ha].

## Native replication

Native replication is a set of capabilities and APIs that allow you to
build a highly available multi-node TimescaleDB installation. At the
core of native replication is the ability to write copies of a chunk
to multiple data nodes in order to have alternative _chunk replicas_
in case of a data node failure. If one data node fails, its chunks
should be available on at least one other data node. If a data node is
permanently lost, a new data node can be added to the cluster, and
lost chunk replicas can be re-replicated from other data nodes to
reach the number of desired chunk replicas.

<Highlight type="warning">
Native replication in TimescaleDB is under development and
currently lacks functionality for a complete high-availability
solution. Some functionality described in this section is still
experimental. For production environments, we recommend setting up
standbys for each node in a multi-node cluster.
</Highlight>

### Automation

Similar to how high-availability configurations for single-node
PostgreSQL uses a system like Patroni for automatically handling
fail-over, native replication requires an external entity to
orchestrate fail-over, chunk re-replication, and data node
management. This orchestration is _not_ provided by default in
TimescaleDB and therefore needs to be implemented separately. The
sections below describe how to enable native replication and the steps
involved to implement high availability in case of node failures.

### Configuring native replication

The first step to enable native replication is to configure a standby
for the access node. This process is identical to setting up a [single
node standby][single-ha].

The next step is to enable native replication on a distributed
hypertable. Native replication is governed by the
`replication_factor`, which determines how many data nodes a chunk is
replicated to. This setting is configured separately for each
hypertable, which means the same database can have some distributed
hypertables that are replicated and others that are not.

By default, the replication factor is set to `1`, so there is no
native replication. You can increase this number when you create the
hypertable. For example, to replicate the data across a total of three
data nodes:

```sql
SELECT create_distributed_hypertable('conditions', 'time', 'location',
 replication_factor => 3);
```

Alternatively, you can use the
[`set_replication_factor`][set_replication_factor] call to change the
replication factor on an existing distributed hypertable. Note,
however, that only new chunks are replicated according to the
updated replication factor. Existing chunks need to be re-replicated
by copying those chunks to new data nodes (see the [node
failures section](#node-failures) below).

When native replication is enabled, the replication happens whenever
you write data to the table. On every `INSERT` and `COPY` call, each
row of the data is written to multiple data nodes. This means that you
don't need to do any extra steps to have newly ingested data
replicated. When you query replicated data, the query planner only
includes one replica of each chunk in the query plan.

### Node failures

When a data node fails, inserts that attempt to write to the failed
node result in an error. This is to preserve data consistency in
case the data node becomes available again. You can use the
[`alter_data_node`][alter_data_node] call to mark a failed data node
as unavailable by running this query:

```sql
SELECT alter_data_node('data_node_2', available => false);
```

Setting `available => false` means that the data node is no longer
used for reads and writes queries.

To fail over reads, the [`alter_data_node`][alter_data_node] call finds
all the chunks for which the unavailable data node is the primary query
target and fails over to a chunk replica on another data node.
However, if some chunks do not have a replica to fail over to, a warning
is raised. Reads continue to fail for chunks that do not have a chunk
replica on any other data nodes.

To fail over writes, any activity that intends to write to the failed
node marks the involved chunk as stale for the specific failed
node by changing the metadata on the access node. This is only done
for natively replicated chunks. This allows you to continue to write
to other chunk replicas on other data nodes while the failed node has
been marked as unavailable. Writes continue to fail for chunks that do
not have a chunk replica on any other data nodes. Also note that chunks
on the failed node which do not get written into are not affected.

When you mark a chunk as stale, the chunk becomes under-replicated.
When the failed data node becomes available then such chunks can be
re-balanced using the [`copy_chunk`][copy_chunk] API.

If waiting for the data node to come back is not an option, either because
it takes too long or the node is permanently failed, one can delete it instead.
To be able to delete a data node, all of its chunks must have at least one
replica on other data nodes. For example:

```sql
SELECT delete_data_node('data_node_2', force => true);
WARNING:  distributed hypertable "conditions" is under-replicated
```

Use the `force` option when you delete the data node if the deletion
means that the cluster no longer achieves the desired replication
factor. This would be the normal case unless the data node has no
chunks or the distributed hypertable has more chunk replicas than the
configured replication factor.

<Highlight type="important">
You cannot force the deletion of a data node if it would mean that a multi-node
cluster permanently loses data.
</Highlight>

When you have successfully removed a failed data node, or marked a
failed data node unavailable, some data chunks might lack replicas but
queries and inserts work as normal again. However, the cluster stays in
a vulnerable state until all chunks are fully replicated.

When you have restored a failed data node or marked it available again, you can
see the chunks that need to be replicated with this query:

{/* Still experimental? --LKB 2021-10-20*/}

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

{/* Still experimental? --LKB 2021-10-20*/}

```sql
CALL timescaledb_experimental.copy_chunk('_timescaledb_internal._dist_hyper_1_1_chunk', 'data_node_3', 'data_node_2');
```

<Highlight type="important">
When you restore chunk replication, the operation uses more than one transaction. This means that it cannot be automatically rolled back. If you cancel the operation before it is completed, an operation ID for the copy is logged. You can use this operation ID to clean up any state left by the cancelled operation. For example:

{/* Still experimental? --LKB 2021-10-20*/}

```sql
CALL timescaledb_experimental.cleanup_copy_chunk_operation('ts_copy_1_31');
```

</Highlight>

[set_replication_factor]:  /api/:currentVersion:/distributed-hypertables/set_replication_factor
[single-ha]: /self-hosted/:currentVersion:/replication-and-ha/
[alter_data_node]: /api/:currentVersion:/distributed-hypertables/alter_data_node/
[copy_chunk]:/api/:currentVersion:/distributed-hypertables/copy_chunk_experimental
