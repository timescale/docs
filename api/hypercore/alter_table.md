---
api_name: ALTER TABLE (hypercore)
excerpt: Enable the columnstore for a hypertable.
topics: [hypercore, columnstore]
keywords: [columnstore, hypercore]
tags: [settings, hypertables, alter, change]
api:
  license: community
  type: command
products: [cloud, mst, self_hosted]
---

import Since2180 from "versionContent/_partials/_since_2_18_0.mdx";
import EarlyAccess from "versionContent/_partials/_early_access_2_18_0.mdx";

# ALTER TABLE ($HYPERCORE)<Tag type="community" content="community" />

Enable the $COLUMNSTORE or change the $COLUMNSTORE settings for a $HYPERTABLE. The settings are applied on a per-chunk 
basis. You **do not** need to convert the entire $HYPERTABLE back to the $ROWSTORE before changing the settings. The new 
settings apply only to the chunks that have not yet been converted to $COLUMNSTORE, the existing chunks in the 
$COLUMNSTORE do not change. This means that chunks with different $COLUMNSTORE settings can co-exist in the 
same $HYPERTABLE.

$TIMESCALE_DB calculates default $COLUMNSTORE settings for each chunk when it is created. These settings apply to each 
chunk, and not the entire hypertable. To explicitly disable the defaults, set a setting to an empty string. To remove 
the current configuration and re-enable the defaults, call `ALTER TABLE <your_table_name> RESET (<columnstore_setting>);`. 

After you have enabled the $COLUMNSTORE, either: 
- [add_columnstore_policy][add_columnstore_policy]: create a [job][job] that automatically moves chunks in a hypertable to the $COLUMNSTORE at a
  specific time interval.
- [convert_to_columnstore][convert_to_columnstore]: manually add a specific chunk in a hypertable to the $COLUMNSTORE.

<Since2180 />

## Samples

To enable the $COLUMNSTORE using `ALTER TABLE`:

- **Configure a $HYPERTABLE that ingests device data to use the $COLUMNSTORE**: 

   In this example, the `metrics` $HYPERTABLE is often queried about a specific device or set of devices. 
   Segment the $HYPERTABLE by `device_id` to improve query performance. 

   ```sql
    ALTER TABLE metrics SET(
      timescaledb.enable_columnstore, 
      timescaledb.orderby = 'time DESC', 
      timescaledb.segmentby = 'device_id');
   ```

- **Specify the chunk interval without changing other $COLUMNSTORE settings**:

   - Set the time interval when chunks are added to the $COLUMNSTORE:
  
      ```sql
      ALTER TABLE metrics SET (timescaledb.compress_chunk_time_interval = '24 hours');
      ```

   - To disable the option you set previously, set the interval to 0:

      ```sql
      ALTER TABLE metrics SET (timescaledb.compress_chunk_time_interval = '0');
      ```

## Arguments

The syntax is:

``` sql
ALTER TABLE <table_name> SET (timescaledb.enable_columnstore,
   timescaledb.compress_orderby = '<column_name> [ASC | DESC] [ NULLS { FIRST | LAST } ] [, ...]',
   timescaledb.compress_segmentby = '<column_name> [, ...]',
   timescaledb.sparse_index = '<index>(<column_name>), <index>(<column_name>)'
   timescaledb.compress_chunk_time_interval='interval',
   ALTER <column name> SET NOT NULL,
   ADD CONSTRAINT <constraint_name> UNIQUE (<column name>, ... ) 
);
```

| Name  | Type    | Default                                                                                                                                                                                                                           | Required | Description  |
|-------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|--------------|
| `table_name`                               | TEXT    | -                                                                                                                                                                                                                                 | ✖        | The hypertable to enable columstore for.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `timescaledb.enable_columnstore`           | BOOLEAN | `true`                                                                                                                                                                                                                            | ✖        | Set to `false` to disable $COLUMNSTORE.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `timescaledb.compress_orderby`                      | TEXT    | Descending order on the time column in `table_name`.                                                                                                                                                                              | ✖        | The order in which items are used in the $COLUMNSTORE. Specified in the same way as an `ORDER BY` clause in a `SELECT` query. Setting `timescaledb.compress_orderby` automatically creates an implicit min/max sparse index on the `orderby` column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `timescaledb.compress_segmentby`                    | TEXT    | $TIMESCALE_DB looks at [`pg_stats`](https://www.postgresql.org/docs/current/view-pg-stats.html) and determines an appropriate column based on the data cardinality and distribution. If `pg_stats` is not available, $TIMESCALE_DB looks for an appropriate column from the existing indexes. | ✖        | Set the list of columns used to segment data in the $COLUMNSTORE for `table`. An identifier representing the source of the data such as `device_id` or `tags_id` is usually a good candidate.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `column_name`                              | TEXT    | -                                                                                                                                                                                                                                 | ✖        | The name of the column to `orderby` or `segmentby`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|`timescaledb.sparse_index`| TEXT    | $TIMESCALE_DB evaluates the columns you already have indexed, checks which data types are a good fit for sparse indexing, then creates a sparse index as an optimization.                                                         | ✖        | Configure the sparse indexes for compressed chunks. Requires setting `timescaledb.compress_orderby`. Supported index types include: <li> `bloom(<column_name>)`: a probabilistic index, effective for `=` filters. Cannot be applied to `timescaledb.compress_orderby` columns.</li> <li> `minmax(<column_name>)`: stores min/max values for each compressed chunk. Setting `timescaledb.compress_orderby` automatically creates an implicit min/max sparse index on the `orderby` column. </li> Define multiple indexes using a comma-separated list. You can set only one index per column. Set to an empty string to avoid using sparse indexes and explicitly disable the default behavior. To remove the current sparse index configuration and re-enable default sparse index selection, call `ALTER TABLE your_table_name RESET (timescaledb.sparse_index);`. |
| `timescaledb.compress_chunk_time_interval` | TEXT    | -                                                                                                                                                                                                                                 | ✖        | EXPERIMENTAL: reduce the total number of chunks in the $COLUMNSTORE for `table`. If you set `compress_chunk_time_interval`, chunks added to the $COLUMNSTORE are merged with the previous adjacent chunk within `chunk_time_interval` whenever possible. These chunks are irreversibly merged. If you call [convert_to_rowstore][convert_to_rowstore], merged chunks are not split up. You can call `compress_chunk_time_interval` independently of other compression settings; `timescaledb.enable_columnstore` is not required.                                                                                                                                                                                                                                                                                                                             |
| `interval`                                 | TEXT    | -                                                                                                                                                                                                                                 | ✖        | Set to a multiple of the [chunk_time_interval][chunk_time_interval] for `table`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `ALTER`                                    | TEXT    |                                                                                                                                                                                                                                   | ✖        | Set a specific column in the columnstore to be `NOT NULL`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `ADD CONSTRAINT`                           | TEXT    |                                                                                                                                                                                                                                   | ✖        | Add `UNIQUE` constraints to data in the columnstore.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

[chunk_time_interval]: /api/:currentVersion:/hypertable/set_chunk_time_interval/
[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[convert_to_columnstore]: /api/:currentVersion:/hypercore/convert_to_columnstore/
[convert_to_rowstore]: /api/:currentVersion:/hypercore/convert_to_rowstore/
[job]: /api/:currentVersion:/jobs-automation/add_job/
[default_table_access_method]: https://www.postgresql.org/docs/17/runtime-config-client.html#GUC-DEFAULT-TABLE-ACCESS-METHOD
[create-hypertable]: /api/:currentVersion:/hypertable/create_hypertable
[bloom-filters]: https://en.wikipedia.org/wiki/Bloom_filter
