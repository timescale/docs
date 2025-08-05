---
api_name: merge_chunks()
excerpt: Merge two or more chunks into one chunk
topics: [hypertables]
keywords: [hypertables, chunk, merge]
api:
  license: community
  type: procedure
products: [cloud, mst, self_hosted]
---

# merge_chunks()

Merge two or more chunks into one. 

The partition boundaries for the new chunk is the union of all partitions of the merged chunks. 
The new chunk retains the name, constraints, and triggers of the _first_ chunk in the partition order.

You can only merge chunks that have directly adjacent partitions. It is not possible to merge 
chunks that have another chunk, or an empty range between them in any of the partitioning 
dimensions.

Chunk merging has the following limitations. You cannot:

* Merge chunks with tiered data
* Read or write from the chunks while they are being merged

<Since2180 />

## Samples

- Merge two chunks:

   ```sql
   CALL merge_chunks('_timescaledb_internal._hyper_1_1_chunk', '_timescaledb_internal._hyper_1_2_chunk');
   ```

- Merge more than two chunks:

   ```sql
   CALL merge_chunks('{_timescaledb_internal._hyper_1_1_chunk, _timescaledb_internal._hyper_1_2_chunk, _timescaledb_internal._hyper_1_3_chunk}');
   ```


## Arguments

You can merge either two chunks, or an arbitrary number of chunks specified as an array of chunk identifiers.
When you call `merge_chunks`, you must specify either `chunk1` and `chunk2`, or `chunks`. You cannot use both 
arguments.


| Name               | Type        | Default | Required | Description                                    |
|--------------------|-------------|--|--|------------------------------------------------|
| `chunk1`, `chunk2` | REGCLASS    | - | ✖ | The two chunk to merge in partition order |
| `chunks`           | REGCLASS[]  |- | ✖ | The array of chunks to merge in partition order |
