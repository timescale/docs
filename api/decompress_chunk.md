---
api_name: decompress_chunk()
excerpt: Decompress a compressed chunk
topics: [compression]
keywords: [compression, decompression, chunks, backfilling]
api:
  license: community
  type: function
---

# decompress_chunk() <tag type="community">Community</tag>

If you need to modify or add data to a chunk that has already been
compressed, you need to decompress the chunk first. This is especially
useful for backfilling old data.

<highlight type="important">
Before decompressing chunks, stop any compression policy on the hypertable you
are decompressing. You can use `SELECT alter_job(JOB_ID, scheduled => false);`
to prevent scheduled execution. When you finish backfilling or updating data,
turn the policy back on. The database automatically recompresses your chunks in
the next scheduled job.
</highlight>

### Required arguments

|Name|Type|Description|
|-|-|-|
|`chunk_name`|`REGCLASS`|Name of the chunk to be decompressed.|

### Optional arguments

|Name|Type|Description|
|-|-|-|
|`if_compressed`|`BOOLEAN`|Setting to true skips chunks that are not compressed. Defaults to false.|

### Sample usage

Decompress a single chunk:

``` sql
SELECT decompress_chunk('_timescaledb_internal._hyper_2_2_chunk');
```

Decompress all compressed chunks in a hypertable named `metrics`:

```sql
SELECT decompress_chunk(c, true) FROM show_chunks('metrics') c;
```
