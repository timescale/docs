---
api_name: ALTER TABLE (hypercore)
excerpt: Enable the columnstore for a hypertable.
topics: [hypercore, columnstore]
keywords: [columnstore, hypercore]
tags: [settings, hypertables, alter, change]
api:
  license: community
  type: command
products: [cloud, self_hosted]
---

import Since2180 from "versionContent/_partials/_since_2_18_0.mdx";
import EarlyAccess from "versionContent/_partials/_early_access_2_18_0.mdx";

# ALTER TABLE ($HYPERCORE)<Tag type="community" content="community" />

Enable the $COLUMNSTORE for a hypertable.  

After you have enabled the $COLUMNSTORE, either: 
- [add_columnstore_policy][add_columnstore_policy]: create a [job][job] that automatically moves chunks in a hypertable to the $COLUMNSTORE at a
  specific time interval.
- [convert_to_columnstore][convert_to_columnstore]: manually add a specific chunk in a hypertable to the $COLUMNSTORE.

<Since2180 />

## Samples

To enable the $COLUMNSTORE:

- **Configure a hypertable that ingests device data to use the $COLUMNSTORE**: 

   In this example, the `metrics` hypertable is often queried about a specific device or set of devices. 
   Segment the hypertable by `device_id` to improve query performance. 

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

- **Enable secondary indexing on all data you add to the $COLUMNSTORE** <EarlyAccess />
 
   ```sql
   alter table metrics
      set access method hypercore,
      set (timescaledb.compress_orderby = 'created_at',
   	       timescaledb.compress_segmentby = 'location_id');
   ```

- **Enable secondary indexing on a chunk you are adding to the $COLUMNSTORE** <EarlyAccess />
  
   ```sql
   alter table _timescaledb_internal._hyper_1_21_chunk
   set access method hypercore;
   ```
   

## Arguments

The syntax is:

``` sql
ALTER TABLE <table_name> SET (timescaledb.enable_columnstore,
   timescaledb.orderby = '<column_name> [ASC | DESC] [ NULLS { FIRST | LAST } ] [, ...]',
   timescaledb.segmentby = '<column_name> [, ...]',
   timescaledb.compress_chunk_time_interval='interval',
   timescaledb.enable_segmentwise_recompression = 'ON' | 'OFF',
   SET ACCESS METHOD { new_access_method | DEFAULT }
);
```

| Name | Type | Default                                              | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|--|--|------------------------------------------------------|--|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`table_name`|TEXT| -                                                    | ✖ | The hypertable to enable columstore for.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|`timescaledb.enable_columnstore`|BOOLEAN| `true`                                               | ✖ | Enable $COLUMNSTORE.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|`timescaledb.orderby`|TEXT| Descending order on the time column in `table_name`. | ✖| The order in which items are used in the $COLUMNSTORE. Specified in the same way as an `ORDER BY` clause in a `SELECT` query.                                                                                                                                                                                                                                                                                                                                                                                                     |
|`timescaledb.segmentby`|TEXT| No segementation by column.                          | ✖| Set the list of columns used to segment data in the $COLUMNSTORE for `table`. An identifier representing the source of the data such as `device_id` or `tags_id` is usually a good candidate.                                                                                                                                                                                                                                                                                                                                     |
|`column_name`|TEXT| -                                                    | ✖ | The name of the column to `orderby` or `segmentby`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|`timescaledb.compress_chunk_time_interval`|TEXT| -                                                    | ✖ | EXPERIMENTAL: reduce the total number of chunks in the $COLUMNSTORE for `table`. If you set `compress_chunk_time_interval`, chunks added to the $COLUMNSTORE are merged with the previous adjacent chunk within `chunk_time_interval` whenever possible. These chunks are irreversibly merged. If you call [convert_to_rowstore][convert_to_rowstore], merged chunks are not split up. You can call `compress_chunk_time_interval` independently of other compression settings; `timescaledb.enable_columnstore` is not required. |
|`interval`|TEXT| -                                                    | ✖ | Set to a multiple of the [chunk_time_interval][chunk_time_interval] for `table`.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|`timescaledb.enable_segmentwise_recompression`|TEXT| ON                                                   | ✖| Set to `OFF` to disable segmentwise recompression on chunks in the $COLUMNSTORE. This can be beneficial for some user workloads where segmentwise recompression is slow, and full recompression is more performant.                                                                                                                                                                                                                                                                                                               |
|`SET ACCESS METHOD`|TEXT| DEFAULT ([heap][default_table_access_method])| ✖| To enable indexing on the $COLUMNSTORE, set to `hypercore` after you [create a hypertable][create-hypertable].    <EarlyAccess />                                                                                                                                                                                                                                                                                                                                                                                                 |

[chunk_time_interval]: /api/:currentVersion:/hypertable/set_chunk_time_interval/
[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[convert_to_columnstore]: /api/:currentVersion:/hypercore/convert_to_columnstore/
[convert_to_rowstore]: /api/:currentVersion:/hypercore/convert_to_rowstore/
[job]: /api/:currentVersion:/jobs-automation/add_job/
[default_table_access_method]: https://www.postgresql.org/docs/17/runtime-config-client.html#GUC-DEFAULT-TABLE-ACCESS-METHOD
[create-hypertable]: /api/:currentVersion:/hypertable/create_hypertable
