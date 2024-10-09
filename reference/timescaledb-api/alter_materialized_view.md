---
api_name: ALTER MATERIALIZED VIEW (Continuous Aggregate)
excerpt: Change an existing continuous aggregate
topics: [continuous aggregates]
keywords: [continuous aggregates]
tags: [materialized views, hypertables, alter, change]
api:
  license: community
  type: command
---

# ALTER MATERIALIZED VIEW (Continuous Aggregate) <Tag type="community">Community</Tag>

`ALTER MATERIALIZED VIEW` statement can be used to modify some of the `WITH`
clause [options][create_materialized_view] for the continuous aggregate view.
`ALTER MATERIALIZED VIEW` statement also supports the following
[PostgreSQL clauses][postgres-alterview] on the
continuous aggregate view:

*   `RENAME TO` clause to rename the continuous aggregate view
*   `RENAME [COLUMN]` clause to rename the continuous aggregate column
*   `SET SCHEMA` clause to set the new schema for the continuous aggregate view
*   `SET TABLESPACE` clause to move the materialization of the continuous
  aggregate view to the new tablespace
*   `OWNER TO` clause to set new owner for the continuous aggregate view

``` sql
ALTER MATERIALIZED VIEW <view_name> SET ( timescaledb.<option> =  <value> [, ... ] )
```

### Parameters

|Name|Type|Description|
|---|---|---|
|`<view_name>`|TEXT|Name (optionally schema-qualified) of continuous aggregate view to be created.|

### Options

|Name|Description|
|-|-|
|`timescaledb.materialized_only`|Enable and disable real time aggregation|
|`timescaledb.compress`|Enable and disable compression|
|`timescaledb.compress_orderby`|TEXT|Order used by compression, specified in the same way as the ORDER BY clause in a SELECT query. The default is the descending order of the hypertable's time column.|
|`timescaledb.compress_segmentby`|TEXT|Column list on which to key the compressed segments. An identifier representing the source of the data such as `device_id` or `tags_id` is usually a good candidate. The default is no `segment by` columns.|
|`timescaledb.compress_chunk_time_interval`|TEXT|EXPERIMENTAL: Set compressed chunk time interval used to roll compressed chunks into. This parameter compresses every chunk, and then merges it into a previous adjacent chunk if possible, to reduce the total number of chunks in the hypertable. It should be set to a multiple of the current chunk interval. This option can be changed independently of other compression settings and does not require the `timescaledb.compress` argument.|

### Sample usage

To disable real-time aggregates for a
continuous aggregate:

```sql
ALTER MATERIALIZED VIEW contagg_view SET (timescaledb.materialized_only);
```

To enable compression for a continuous aggregate:

```sql
ALTER MATERIALIZED VIEW contagg_view SET (timescaledb.compress);
```

To rename a column for a continuous aggregate:

```sql
ALTER MATERIALIZED VIEW contagg_view RENAME COLUMN old_name TO new_name;
```

The only options that currently can be modified with `ALTER
MATERIALIZED VIEW` are `materialized_only` and `compress`. The other options
`continuous` and `create_group_indexes` can only be set when creating
the continuous aggregate.

[create_materialized_view]: /api/:currentVersion:/continuous-aggregates/create_materialized_view/#parameters
[postgres-alterview]: https://www.postgresql.org/docs/current/sql-alterview.html
