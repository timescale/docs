---
api_name: ALTER MATERIALIZED VIEW (hypercore)
excerpt: Change an existing continuous aggregate
topics: [hypercore, continuous aggregates, columnstore,]
keywords: [hypercore, continuous aggregates, columnstore, ]
tags: [materialized views, hypertables, alter, change]
api:
  license: community
  type: command
products: [cloud, self_hosted]
---

import Since2180 from "versionContent/_partials/_since_2_18_0.mdx";
import EarlyAccess from "versionContent/_partials/_early_access_2_18_0.mdx";

# ALTER MATERIALIZED VIEW ($HYPERCORE) <Tag type="community">Community</Tag>

`ALTER MATERIALIZED VIEW` statement can be used to modify some of the `WITH`
clause [options][create_materialized_view] for the continuous aggregate view.
`ALTER MATERIALIZED VIEW` statement also supports the following
[$PG clauses][postgres-alterview] on the
continuous aggregate view:

*   `RENAME TO`: rename the continuous aggregate view
*   `RENAME [COLUMN]`: rename the continuous aggregate column
*   `SET SCHEMA`: set the new schema for the continuous aggregate view
*   `SET TABLESPACE`: move the materialization of the continuous aggregate view to the new tablespace
*   `OWNER TO`: set a new owner for the continuous aggregate view

<Since2180 />

## Samples

- Disable real-time aggregates for a continuous aggregate:

   ```sql
   ALTER MATERIALIZED VIEW contagg_view SET (timescaledb.materialized_only);
   ```

- Enable hypercore for a continuous aggregate:

   ```sql
    ALTER MATERIALIZED VIEW assets_candlestick_daily set (
     timescaledb.enable_columnstore = true,
     timescaledb.segmentby = 'symbol' );
   ```

- Rename a column for a continuous aggregate:

   ```sql
   ALTER MATERIALIZED VIEW contagg_view RENAME COLUMN old_name TO new_name;
   ```

The only options that currently can be modified with `ALTER
MATERIALIZED VIEW` are `materialized_only` and `compress`. The other options
`continuous` and `create_group_indexes` can only be set when creating
the continuous aggregate.


## Arguments

The syntax is:


``` sql
ALTER MATERIALIZED VIEW <view_name> SET (timescaledb.enable_columnstore,
   timescaledb.materialized_only = 'true' | 'false',
   timescaledb.orderby = '<column_name> [ASC | DESC] [ NULLS { FIRST | LAST } ] [, ...]',
   timescaledb.segmentby = '<column_name> [, ...]',
   timescaledb.compress_chunk_time_interval='interval',
);
```

| Name      | Type | Default  | Required | Description     |
|----------|--|-------------------|--|----------------------------------|
| `view_name`                                    |TEXT| -                                                    | ✖ | The materialized view to enable columstore for.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `timescaledb.enable_columnstore`               |BOOLEAN| `true`                                               | ✖ | Enable columnstore.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|`timescaledb.materialized_only`|BOOLEAN| `true` | ✖ | Enable and disable real time aggregation                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `timescaledb.orderby`                          |TEXT| Descending order on the time column in `table_name`. | ✖| The order in which items are used in the columnstore. Specified in the same way as an `ORDER BY` clause in a `SELECT` query.                                                                                                                                                                                                                                                                                                                                                                              |
| `timescaledb.segmentby`                        |TEXT| No segementation by column.                          | ✖| Set the list of columns used to segment data in the columnstore for `table`. An identifier representing the source of the data such as `device_id` or `tags_id` is usually a good candidate.                                                                                                                                                                                                                                                                                                              |
| `column_name`                                  |TEXT| -                                                    | ✖ | The name of the column to `orderby` or `segmentby`.                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `timescaledb.compress_chunk_time_interval`     |TEXT| -                                                    | ✖ | EXPERIMENTAL: reduce the total number of chunks in the columnstore for `table`. If you set `compress_chunk_time_interval`, chunks added to the columnstore are merged with the previous adjacent chunk within `chunk_time_interval` whenever possible. These chunks are irreversibly merged. If you call [convert_to_rowstore][convert_to_rowstore], merged chunks are not split up. You can call `compress_chunk_time_interval` independently of other compression settings; `timescaledb.enable_columnstore` is not required. |

[create_materialized_view]: /api/:currentVersion:/continuous-aggregates/create_materialized_view/#parameters
[postgres-alterview]: https://www.postgresql.org/docs/current/sql-alterview.html
[create-cagg]: /use-timescale/:currentVersion:/continuous-aggregates/create-a-continuous-aggregate/
[default_table_access_method]: https://www.postgresql.org/docs/17/runtime-config-client.html#GUC-DEFAULT-TABLE-ACCESS-METHOD
[convert_to_rowstore]: /api/:currentVersion:/hypercore/convert_to_rowstore/
