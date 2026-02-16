---
api_name: ALTER MATERIALIZED VIEW (Continuous Aggregate)
excerpt: Change an existing continuous aggregate
topics: [continuous aggregates]
keywords: [continuous aggregates]
tags: [materialized views, hypertables, alter, change]
api:
  license: community
  type: command
products: [cloud, self_hosted, mst]
---

import Since2180 from "versionContent/_partials/_since_2_18_0.mdx";
import Since2220 from "versionContent/_partials/_since_2_22_0.mdx";

# ALTER MATERIALIZED VIEW (Continuous Aggregate) <Tag type="community">Community</Tag>

You use the `ALTER MATERIALIZED VIEW` statement to modify some of the `WITH`
clause [options][create_materialized_view] for a continuous aggregate view. You can only set the `continuous` and `create_group_indexes` options when you [create a continuous aggregate][create_materialized_view]. `ALTER MATERIALIZED VIEW` also supports the following
[$PG clauses][postgres-alterview] on the continuous aggregate view:

*   `RENAME TO`: rename the continuous aggregate view
*   `RENAME [COLUMN]`: rename the continuous aggregate column
*   `SET SCHEMA`: set the new schema for the continuous aggregate view
*   `SET TABLESPACE`: move the materialization of the continuous aggregate view to the new tablespace
*   `OWNER TO`: set a new owner for the continuous aggregate view


## Samples

- Enable real-time aggregates for a continuous aggregate:

   ```sql
   ALTER MATERIALIZED VIEW contagg_view SET (timescaledb.materialized_only = false);
   ```

- Enable hypercore for a continuous aggregate <Since2180 />:

   ```sql
    ALTER MATERIALIZED VIEW contagg_view SET (
     timescaledb.enable_columnstore = true,
     timescaledb.segmentby = 'symbol' );
   ```

- Rename a column for a continuous aggregate:

   ```sql
   ALTER MATERIALIZED VIEW contagg_view RENAME COLUMN old_name TO new_name;
   ```



## Arguments

The syntax is:

``` sql
ALTER MATERIALIZED VIEW <view_name> SET ( timescaledb.<argument> =  <value> [, ... ] )
```

| Name                                                                      | Type      | Default                                              | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|---------------------------------------------------------------------------|-----------|------------------------------------------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `view_name`                                                               | TEXT      | -                                                    | ✖        | The name  of the continuous aggregate view to be altered.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `timescaledb.materialized_only`                                           | BOOLEAN   | `true`                                               | ✖        | Enable real-time aggregation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `timescaledb.enable_columnstore`                                          | BOOLEAN   | `true`                                               | ✖        | <Since2180 /> Enable columnstore. Effectively the same as `timescaledb.compress`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 
| `timescaledb.compress`                                                    | TEXT      | Disabled.                                            | ✖        | Enable compression.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |    
| `timescaledb.orderby`                                                     | TEXT      | Descending order on the time column in `table_name`. | ✖        | <Since2180 /> Set the order in which items are used in the columnstore. Specified in the same way as an `ORDER BY` clause in a `SELECT` query.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `timescaledb.compress_orderby`                                            | TEXT      | Descending order on the time column in `table_name`. | ✖        | Set the order used by compression. Specified in the same way as the `ORDER BY` clause in a `SELECT` query.                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `timescaledb.segmentby`                                                   | TEXT      | No segementation by column.                          | ✖        | <Since2180 /> Set the list of columns used to segment data in the columnstore for `table`. An identifier representing the source of the data such as `device_id` or `tags_id` is usually a good candidate.                                                                                                                                                                                                                                                                                                                                                             |
| `timescaledb.compress_segmentby`                                          | TEXT      | No segementation by column.                          | ✖        | Set the list of columns used to segment the compressed data. An identifier representing the source of the data such as `device_id` or `tags_id` is usually a good candidate.                                                                                                                                                                                                                                                                                                                                                                                           |
| `column_name`                                                             | TEXT      | -                                                    | ✖        | Set the name of the column to order by or segment by.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `timescaledb.compress_chunk_time_interval`                                | TEXT      | -                                                    | ✖        | Reduce the total number of compressed/columnstore chunks for `table`. If you set `compress_chunk_time_interval`, compressed/columnstore chunks are merged with the previous adjacent chunk within `chunk_time_interval` whenever possible. These chunks are irreversibly merged. If you call to [decompress][api-reference-decompress]/[convert_to_rowstore][convert_to_rowstore], merged chunks are not split up. You can call `compress_chunk_time_interval` independently of other compression settings; `timescaledb.compress`/`timescaledb.enable_columnstore` is not required. |
| `timescaledb.chunk_interval` (formerly `timescaledb.chunk_time_interval`) | INTERVAL  | 10x the original hypertable.                         | ✖        | Set the chunk interval. Renamed in $TIMESCALE_DB V2.20.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

[api-reference-decompress]: /api/:currentVersion:/compression/decompress_chunk/
[convert_to_rowstore]: /api/:currentVersion:/hypercore/convert_to_rowstore/
[create_materialized_view]: /api/:currentVersion:/continuous-aggregates/create_materialized_view/#parameters
[postgres-alterview]: https://www.postgresql.org/docs/current/sql-alterview.html
