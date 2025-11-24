---
api_name: decompress_chunk()
excerpt: Decompress a compressed chunk
topics: [compression]
keywords: [compression, decompression, chunks, backfilling]
api:
  license: community
  type: function
products: [cloud, mst, self_hosted]
---

import Deprecated2180 from "versionContent/_partials/_deprecated_2_18_0.mdx";

# decompress_chunk() <Tag type="community">Community</Tag>

<Deprecated2180 /> Replaced by <a href="https://docs.tigerdata.com/api/latest/hypercore/convert_to_rowstore/">convert_to_rowstore()</a>.
If you have already implemented compression, you do not need to migrate to hypercore.

<Highlight type="important">

Before decompressing chunks, stop any compression policy on the hypertable you
are decompressing. You can use `SELECT alter_job(JOB_ID, scheduled => false);`
to prevent scheduled execution.

</Highlight>

## Samples

Decompress a single chunk:

``` sql
SELECT decompress_chunk('_timescaledb_internal._hyper_2_2_chunk');
```

Decompress all compressed chunks in a hypertable named `metrics`:

```sql
SELECT decompress_chunk(c, true) FROM show_chunks('metrics') c;
```

## Required arguments

|Name|Type|Description|
|---|---|---|
|`chunk_name`|`REGCLASS`|Name of the chunk to be decompressed.|

## Optional arguments

|Name|Type|Description|
|---|---|---|
|`if_compressed`|`BOOLEAN`|Disabling this will make the function error out on chunks that are not compressed. Defaults to true.|

## Returns

|Column|Type|Description|
|---|---|---|
|`decompress_chunk`|`REGCLASS`|Name of the chunk that was decompressed.|


