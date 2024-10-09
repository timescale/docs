---
api_name: decompress_chunk()
excerpt: Decompress a compressed chunk
topics: [compression]
keywords: [compression, decompression, chunks, backfilling]
api:
  license: community
  type: function
---

# decompress_chunk() <Tag type="community">Community</Tag>

If you need to modify or add a lot of data to a chunk that has already been
compressed, you should decompress the chunk first. This is especially
useful for backfilling old data.

<Highlight type="important">
Before decompressing chunks, stop any compression policy on the hypertable you
are decompressing. You can use `SELECT alter_job(JOB_ID, scheduled => false);`
to prevent scheduled execution. When you finish backfilling or updating data,
turn the policy back on. The database automatically recompresses your chunks in
the next scheduled job.
</Highlight>

### Required arguments

|Name|Type|Description|
|-|-|-|
|`chunk_name`|`REGCLASS`|Name of the chunk to be decompressed.|

### Optional arguments

|Name|Type|Description|
|-|-|-|
|`if_compressed`|`BOOLEAN`| Disabling this will make the function error out on chunks that are not compressed. Defaults to true.|

### Sample usage

Decompress a single chunk:

``` sql
SELECT decompress_chunk('_timescaledb_internal._hyper_2_2_chunk');
```

Decompress all compressed chunks in a hypertable named `metrics`:

```sql
SELECT decompress_chunk(c, true) FROM show_chunks('metrics') c;
```
