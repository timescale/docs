---
api_name: convert_to_columnstore()
excerpt: Manually add a chunk to thee columnstore
topics: [compression]
keywords: [compression]
tags: [chunks]
api:
  license: community
  type: function
---

# convert_to_columnstore() <Tag type="community">Community</Tag>

Manually control the exact time you move a specific chunk in a hypertable to the columnstore.

Although `convert_to_columnstore` gives you more more fine grained control, best practice is to use
[`add_columnstore_policy`][add_columnstore_policy]. You can also compress chunks at a specific time 
[running the job associated with your compression policy][run-job] manually. 

To move a chunk from the columnstore back to the rowstore, use [`convert_to_rowstore`][convert_to_rowstore].

**@since [TimescaleDB v2.18.0](https://github.com/timescale/timescaledb/releases/tag/2.18.0)**

## Samples

Compress a single chunk.

``` sql
SELECT convert_to_columnstore('_timescaledb_internal._hyper_1_2_chunk');
```

To retrieve the chunks belonging to a hypertable, call [`show_chunks`](/api/latest/hypertable/show_chunks/).


## Arguments

| Name                 | Type | Default | Required | Description                                                                                                         |
|----------------------|--|---------|--|---------------------------------------------------------------------------------------------------------------------|
| `chunk`         | REGCLASS | -       |✔| Name of the chunk to be compressed.                                                                                 |
| `if_not_columnstore` | BOOLEAN | `true`  |✖| Set to `false` so this job fails with an error rather than a warning if `chunk` is already in the columnstore. |
| `recompress`         | BOOLEAN | `false` |✖| Set to `true` to recompresses a compressed chunk that had more data inserted after compression. |

## Returns

|Column| Type                                            | Description                                     |
|-|-------------------------------------------------|-------------------------------------------------|
| `convert_to_columnstore` | REGCLASS | The name of the chunk added to the columnstore. |


[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[run-job]: /api/:currentVersion:/actions/run_job/
[convert_to_rowstore]: /api/:currentVersion:/hypercore/convert_to_rowstore/
