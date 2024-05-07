---
api_name: cleanup_copy_chunk_operation()
excerpt: Clean up after a failed chunk move or chunk copy operation
topics: [distributed hypertables, multi-node]
keywords: [chunks, multi-node, distributed hypertables, move, copy]
api:
  license: community
  type: function
---
import MultiNodeDeprecation from "versionContent/_partials/_multi-node-deprecation.mdx";

<MultiNodeDeprecation />

import Experimental from 'versionContent/_partials/_experimental.mdx';

## cleanup_copy_chunk_operation() <Tag type="community">Community</Tag> <Tag type="experimental">Experimental</Tag>

You can [copy][copy_chunk] or [move][move_chunk] a
chunk to a new location within a multi-node environment. The
operation happens over multiple transactions so, if it fails, it
is manually cleaned up using this function. Without cleanup,
the failed operation might hold a replication slot open, which in turn
prevents storage from being reclaimed. The operation ID is logged in
case of a failed copy or move operation and is required as input to
the cleanup function.

<Experimental />

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
