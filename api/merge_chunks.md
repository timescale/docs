---
api_name: merge_chunks()
excerpt: Merge two or more chunks into one chunk
topics: [hypertables]
keywords: [hypertables, chunk, merge]
api:
  license: community
  type: procedure
---

# merge_chunks()

Merge two or more chunks into one. The new chunk's partition
boundaries will be the union of all the merged chunks' partitions. The
new chunk will retain the name of the chunk that is _first_ in the
partition order, and it will also inherit that chunk's constraints and
triggers.

It is only possible to merge chunks that have directly adjacent
partitions. In other words, it is not possible to merge chunks that
have another chunk or an empty range in-between them in any of the
partitioning dimensions.

Currently, chunk merging has the following limitations:

* cannot merge compressed chunks
* cannot merge chunks using other table access methods than heap
* cannot merge tiered with tiered data
* cannot read or write from the chunks being merged

<Highlight type="note">
The `merge_chunks()` procedure exists since TimescaleDB 2.18.
</Highlight>

### Required arguments

There are two versions of `merge_chunks` that use the same name but
take different arguments. The first one is convenient to use when only
merging two chunks, while the other one can merge an arbitrary number
of chunks specified as an array of chunk identifiers.

Merge two chunks:

|Name|Type|Description|
|---|---|---|
| `chunk1` | REGCLASS | The first chunk to merge |
| `chunk2` | REGCLASS | The second chunk to merge |


Merge all chunks in the given array:

|Name|Type|Description|
|---|---|---|
| `chunks` | REGCLASS[] | An array of chunks to merge |

### Sample usage

Merge two chunks:

```sql
CALL merge_chunks('_timescaledb_internal._hyper_1_1_chunk', '_timescaledb_internal._hyper_1_2_chunk');
```

Merge more than two chunks at once:

```sql
CALL merge_chunks('{_timescaledb_internal._hyper_1_1_chunk, _timescaledb_internal._hyper_1_2_chunk, _timescaledb_internal._hyper_1_3_chunk}');
```
