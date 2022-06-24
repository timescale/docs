---
api_name: cleanup_copy_chunk_operation()
excerpt: Clean up after a failed chunk move or chunk copy operation
license: community
topic: multi-node
tags: [chunks, multi-node, move, copy, distributed hypertables]
---

## cleanup_copy_chunk_operation() <tag type="community">Community</tag> <tag type="experimental">Experimental</tag>
You can [copy][copy_chunk] or [move][move_chunk] a
chunk to a new location within a multi-node environment. The
operation happens over multiple transactions so, if it fails, it 
is manually cleaned up using this function. Without cleanup,
the failed operation might hold a replication slot open, which in turn
prevents storage from being reclaimed. The operation ID is logged in
case of a failed copy or move operation and is required as input to
the cleanup function.

<highlight type="warning">
Experimental features could have bugs! They might not be backwards compatible,
and could be removed in future releases. Use these features at your own risk, and
do not use any experimental features in production.
</highlight>

### Required arguments

|Name|Type|Description|
|-|-|-|
|`operation_id`|NAME|ID of the failed operation|

### Sample usage

Clean up a failed operation:

```sql
CALL timescaledb_experimental.cleanup_copy_chunk_operation('ts_copy_1_31');
```

Get a list of running copy or move operations:

```sql
SELECT * FROM _timescaledb_catalog.chunk_copy_operation;
```


[copy_chunk]: /api/:currentVersion:/distributed-hypertables/copy_chunk_experimental
[move_chunk]: /api/:currentVersion:/distributed-hypertables/move_chunk_experimental

