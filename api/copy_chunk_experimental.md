## copy_chunk() <tag type="community">Community</tag> <tag type="experimental">Experimental</tag>
TimescaleDB allows you to copy existing chunks to a new location within a
multi-node environment. This allows each data node to work both as a primary for
some chunks and backup for others. If a data node fails, its chunks already
exist on other nodes that can take over the responsibility of serving them.

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
When copying a chunk, the destination data node needs a way to
authenticate with the data node that holds the source chunk. It is
currently recommended to use a [password file][password-config] on the
data node.

The `wal_level` setting must also be set to `logical` or higher on
data nodes from which chunks are copied. If you are copying or moving
many chunks in parallel, you can increase `max_wal_senders` and
`max_replication_slots`.

### Failures
When a copy operation fails, it sometimes creates objects and metadata on 
the destination data node. It can also hold a replication slot open on the
source data node. To clean up these objects and metadata, use
[`cleanup_copy_chunk_operation`][cleanup_copy_chunk].


### Sample usage

``` sql
CALL timescaledb_experimental.copy_chunk('_timescaledb_internal._dist_hyper_1_1_chunk', 'data_node_2', 'data_node_3');
```

[password-config]: /timescaledb/:currentVersion:/how-to-guides/multinode-timescaledb/multinode-auth/
[cleanup_copy_chunk]: /api/:currentVersion:/distributed-hypertables/cleanup_copy_chunk_operation_experimental
