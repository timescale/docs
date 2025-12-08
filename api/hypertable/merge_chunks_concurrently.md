---
api_name: merge_chunks_concurrently()
excerpt: Merge two or more chunks into one chunk
topics: [hypertables]
keywords: [hypertables, chunk, merge]
api:
  license: community
  type: procedure
products: [cloud, mst, self_hosted]
---

# merge_chunks_concurrently()

Merge two or more chunks into one in concurrent mode without locking out other
reads. The functionality is equivalent to `merge_chunks()` with the
`concurrently` option set, although this procedure works with more than two
chunks. See [`merge_chunks()`][merge-chunks] for more information.

## Samples

*   Merge three chunks, allowing concurrent reads:

   ```sql
   CALL merge_chunks_concurrently('_timescaledb_internal._hyper_1_1_chunk', '_timescaledb_internal._hyper_1_2_chunk', '_timescaledb_internal._hyper_1_3_chunk');
   ```

## Arguments

You can merge either two chunks, or an arbitrary number of chunks specified as an array of chunk identifiers.

| Name               | Type        | Default | Required | Description                                    |
|--------------------|-------------|--|--|------------------------------------------------|
| `chunks`           | REGCLASS[]  | - | ✖ | The array of chunks to merge in partition order |

[merge-chunks]: /api/:currentVersion:/hypertable/merge_chunks
