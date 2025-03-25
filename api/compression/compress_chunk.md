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

import Deprecated2180 from "versionContent/_partials/_deprecated_2_18_0.mdx";

# compress_chunk() <Tag type="community">Community</Tag>

<Deprecated2180 /> Replaced by <a href="https://docs.timescale.com/api/latest/hypercore/convert_to_columnstore/">convert_to_columnstore()</a>.

The `compress_chunk` function is used to compress (or recompress, if necessary) 
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
[`show_chunks` function](/api/latest/hypertable/show_chunks/).
</Highlight>

### Required arguments

|Name|Type|Description|
|---|---|---|
| `chunk_name` | REGCLASS | Name of the chunk to be compressed|

### Optional arguments

|Name|Type|Description|
|---|---|---|
| `if_not_compressed` | BOOLEAN | Disabling this will make the function error out on chunks that are already compressed. Defaults to true.|
| `hypercore_use_access_method`         | BOOLEAN | `NULL` |✖| Set to `true` to use hypercore table access metod. If set to `NULL` it will use the value from `timescaledb.default_hypercore_use_access_method`. |

### Returns

|Column|Type|Description|
|---|---|---|
| `compress_chunk` | REGCLASS | Name of the chunk that was compressed|

### Sample usage

Compress a single chunk.

``` sql
SELECT compress_chunk('_timescaledb_internal._hyper_1_2_chunk');
```

[add_compression_policy]: /api/:currentVersion:/compression/add_compression_policy/
[run-job]: /api/:currentVersion:/jobs-automation/run_job/
