---
api_name: _timescaledb_functions.chunk_rewrite_cleanup()
excerpt: Clean up state from an aborted chunk rewrite operation
topics: [hypertables]
keywords: [hypertables, chunk, merge]
api:
  license: community
  type: procedure
products: [cloud, mst, self_hosted]
---

# _timescaledb_functions.chunk_rewrite_cleanup()

Chunks can be rewritten by, for example, a [merge][merge-chunks] or a
[split][split-chunk] operation. When such a rewrite runs in concurrent mode it
happens across two transactions: the first one rewrites the data to new
temporary relations without blocking reads, while the second transaction
completes the operation by swapping the relations using heavy locks. If the
second transaction does not complete successfully there might be temporary
relations left on disk. These relations can take up a significant amount of
disk space so they need to be cleaned up using this procedure.

The procedure only cleans up relations that:

*   the current user has owner privileges for
*   the current user can lock without blocking

## Samples

*   Check for any non-completed rewrite operations:

```sql
SELECT * FROM _timescaledb_catalog.chunk_rewrite;
              chunk_relid               |              new_relid
----------------------------------------+-------------------------------------
 _timescaledb_internal._hyper_1_2_chunk | _timescaledb_internal.pg_temp_18942
 _timescaledb_internal._hyper_1_1_chunk | _timescaledb_internal.pg_temp_18942
(2 rows)
```

*   Clean up non-completed rewrite operations:

```sql
CALL _timescaledb_functions.chunk_rewrite_cleanup();
NOTICE:  cleaned up 2 orphaned rewrite relations, skipped 0

SELECT * FROM _timescaledb_catalog.chunk_rewrite;
 chunk_relid | new_relid
-------------+-----------
(0 rows)
```

[merge-chunks]: /api/:currentVersion:/hypertable/merge_chunks
[split-chunk]: /api/:currentVersion:/hypertable/split_chunk
