---
api_name: compress_chunk()
excerpt: Manually compress a given chunk
topics: [compression]
keywords: [compression]
tags: [chunks]
api:
  license: community
  type: function
products: [cloud, mst, self_hosted]
---

import Deprecated2180 from "versionContent/_partials/_deprecated_2_18_0.mdx";

# compress_chunk() <Tag type="community">Community</Tag>

<Deprecated2180 /> Superseded by <a href="https://www.tigerdata.com/docs/api/:currentVersion:/hypercore/convert_to_columnstore/">convert_to_columnstore()</a>.
However, compression APIs are still supported, you do not need to migrate to the hypercore APIs.

The `compress_chunk` function is used for synchronous compression (or recompression, if necessary) of 
a specific chunk. This is most often used instead of the
[`add_compression_policy`][add_compression_policy] function, when a user
wants more control over the scheduling of compression. For most users, we
suggest using the policy framework instead.

You can also compress chunks by
[running the job associated with your compression policy][run-job].
`compress_chunk` gives you more fine-grained control by
allowing you to target a specific chunk that needs compressing.

<Highlight type="tip">

You can get a list of chunks belonging to a hypertable using the
[`show_chunks` function][show_chunks-function].

</Highlight>

## Samples

Compress a single chunk.

``` sql
SELECT compress_chunk('_timescaledb_internal._hyper_1_2_chunk');
```

## Required arguments

|Name|Type|Description|
|---|---|---|
| `chunk_name` | REGCLASS | Name of the chunk to be compressed|

## Optional arguments

| Name                 | Type | Default | Required | Description                                                                                                                    |
|----------------------|--|---------|--|--------------------------------------------------------------------------------------------------------------------------------|
| `chunk`         | REGCLASS | -       |✔| Name of the chunk to add to the $COLUMNSTORE.                                                                                  |
| `if_not_columnstore` | BOOLEAN | `true`  |✖| Set to `false` so this job fails with an error rather than a warning if `chunk` is already in the $COLUMNSTORE.                |
| `recompress`         | BOOLEAN | `false` |✖| Set to true to recompress. In-memory recompression is attempted first; it falls back to internal decompress/compress. |

## Returns

|Column|Type|Description|
|---|---|---|
| `compress_chunk` | REGCLASS | Name of the chunk that was compressed|

[add_compression_policy]: /api/:currentVersion:/compression/add_compression_policy/
[run-job]: /api/:currentVersion:/jobs-automation/run_job/
[show_chunks-function]: /api/:currentVersion:/hypertable/show_chunks/
