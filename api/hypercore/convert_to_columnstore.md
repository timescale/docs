---
api_name: convert_to_columnstore()
excerpt: Manually add a chunk to the columnstore
topics: [hypercore, columnstore, rowstore]
keywords: [columnstore, rowstore, hypercore]
tags: [chunks, hypercore]
api:
  license: community
  type: procedure
products: [cloud, self_hosted]
---

import Since2180 from "versionContent/_partials/_since_2_18_0.mdx";

# convert_to_columnstore() <Tag type="community">Community</Tag>

Manually convert a specific chunk in the hypertable $ROWSTORE to the $COLUMNSTORE.

Although `convert_to_columnstore` gives you more fine-grained control, best practice is to use
[`add_columnstore_policy`][add_columnstore_policy]. You can also add chunks to the $COLUMNSTORE at a specific time 
[running the job associated with your $COLUMNSTORE policy][run-job] manually. 

To move a chunk from the $COLUMNSTORE back to the $ROWSTORE, use [`convert_to_rowstore`][convert_to_rowstore].

<Since2180 />

## Samples

To convert a single chunk to $COLUMNSTORE:

``` sql
CALL convert_to_columnstore('_timescaledb_internal._hyper_1_2_chunk');
```

## Arguments

| Name                 | Type | Default | Required | Description                                                                                                                                        |
|----------------------|--|---------|--|----------------------------------------------------------------------------------------------------------------------------------------------------|
| `chunk`         | REGCLASS | -       |✔| Name of the chunk to add to the $COLUMNSTORE.                                                                                                      |
| `if_not_columnstore` | BOOLEAN | `true`  |✖| Set to `false` so this job fails with an error rather than a warning if `chunk` is already in the $COLUMNSTORE.                                    |
| `recompress`         | BOOLEAN | `false` |✖| Set to `true` to add a chunk that had more data inserted after being added to the $COLUMNSTORE.                                                    |
| `hypercore_use_access_method`         | BOOLEAN | `NULL` |✖| Set to `true` to use $HYPERCORE table access method. If set to `NULL` it will use the value from `timescaledb.default_hypercore_use_access_method`. |

## Returns

Calls to `convert_to_columnstore` return:

| Column            | Type               | Description                                                                                        |
|-------------------|--------------------|----------------------------------------------------------------------------------------------------|
| `chunk name` or `table` | REGCLASS or String | The name of the chunk added to the $COLUMNSTORE, or a table-like result set with zero or more rows. |


[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[run-job]: /api/:currentVersion:/jobs-automation/run_job/
[convert_to_rowstore]: /api/:currentVersion:/hypercore/convert_to_rowstore/
