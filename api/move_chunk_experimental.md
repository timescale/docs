---
api_name: move_chunk()
excerpt: Move a chunk to a different data node in a multi-node cluster
license: community
tags: [multi-node]
---

## move_chunk() <tag type="community">Community</tag> <tag type="experimental">Experimental</tag>
TimescaleDB allows you to move chunks to other data nodes. Moving
chunks is useful in order to rebalance a multi-node cluster or remove
a data node from the cluster.

<highlight type="warning">
Experimental features could have bugs! They might not be backwards compatible,
and could be removed in future releases. Use these features at your own risk, and
do not use any experimental features in production.
</highlight>

### Required arguments

|Name|Type|Description|
|-|-|-|
|`chunk`|REGCLASS|Name of chunk to be copied|
|`source_node`|NAME|Data node where the chunk currently resides|
|`destination_node`|NAME|Data node where the chunk is to be copied|

### Required settings
When moving a chunk, the destination data node needs a way to
authenticate with the data node that holds the source chunk. It is
currently recommended to use a [password file][password-config] on the
data node.

The `wal_level` setting must also be set to `logical` or higher on
data nodes from which chunks are moved. If you are copying or moving
many chunks in parallel, you can increase `max_wal_senders` and
`max_replication_slots`.

### Failures
When a move operation fails, it sometimes creates objects and metadata on 
the destination data node. It can also hold a replication slot open on the
source data node. To clean up these objects and metadata, use
[`cleanup_copy_chunk_operation`][cleanup_copy_chunk].

### Sample usage

``` sql
CALL timescaledb_experimental.move_chunk('_timescaledb_internal._dist_hyper_1_1_chunk', 'data_node_2', 'data_node_3');
```

[password-config]: /timescaledb/:currentVersion:/how-to-guides/multinode-timescaledb/multinode-auth/#v1-set-the-password-encryption-method-for-access-node-and-data-nodes
[cleanup_copy_chunk]: /api/:currentVersion:/distributed-hypertables/cleanup_copy_chunk_operation_experimental

