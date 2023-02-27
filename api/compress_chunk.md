---
api_name: compress_chunk()
excerpt: Manually compress a given chunk
topics: [compression]
keywords: [compression]
tags: [chunks]
api:
  license: community
  type: function
---

# compress_chunk() <Tag type="community">Community</Tag>

The compress_chunk function is used to compress a specific chunk. This is
most often used instead of the
[add_compression_policy][add_compression_policy] function, when a user
wants more control over the scheduling of compression. For most users, we
suggest using the policy framework instead.

<Highlight type="tip">
You can get a list of chunks belonging to a hypertable using the
`show_chunks` [function](/api/latest/hypertable/show_chunks/).
</Highlight>

### Required arguments

|Name|Type|Description|
|---|---|---|
| `chunk_name` | REGCLASS | Name of the chunk to be compressed|

### Optional arguments

|Name|Type|Description|
|---|---|---|
| `if_not_compressed` | BOOLEAN | Setting to true skips chunks that are already compressed, but the operation still succeeds. Defaults to false.|

### Returns

|Column|Description|
|---|---|
| `compress_chunk` | (REGCLASS) Name of the chunk that was compressed|

### Sample usage

Compress a single chunk.

``` sql
SELECT compress_chunk('_timescaledb_internal._hyper_1_2_chunk');
```

[add_compression_policy]: /api/:currentVersion:/compression/add_compression_policy/
