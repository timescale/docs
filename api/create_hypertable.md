---
api_name: create_hypertable()
excerpt: Create a hypertable
topics: [hypertables]
keywords: [hypertables, create]
api:
  license: apache
  type: function
---

import DimensionInfo from "versionContent/_partials/_dimension_info.mdx";

# create_hypertable()

Replace a standard PostgreSQL relational table with a [hypertable][hypertable-docs]
that is partitioned on a single dimension. 

A hypertable is a PostgreSQL table that automatically partitions your data by time. A dimension defines the way your 
data is partitioned.  All actions work on the resulting hypertable. For example, `ALTER TABLE`, and `SELECT`.

If the table to convert already contains data, set [migrate_data][migrate-data] to `TRUE`.
However, this may take a long time and there are limitations when the table contains foreign
key constraints.

You cannot run `create_hypertable()` on a table that is already partitioned using
[declarative partitioning][declarative-partitioning] or [inheritance][inheritance]. The time column must be defined 
as `NOT NULL`. If this is not already specified on table creation, `create_hypertable` automatically adds
this constraint on the table when it is executed.

This page describes the generalized hypertable API introduced in TimescaleDB v2.13.
The [old interface for `create_hypertable` is also available](/api/:currentVersion:/hypertable/create_hypertable_old/).

## Samples

The examples in this section show you how to:

- [Time partition a hypertable by time range][sample-time-range]
- [Time partition a hypertable using composite columns and immutable functions][sample-composite-columns]
- [Time partition a hypertable using ISO formatting][sample-iso-formatting]

### Time partition a hypertable by time range

The following examples show different ways to convert the `conditions` relational table to a
hypertable:

- Convert with range partitioning on the `time` column:

  ```sql
  SELECT create_hypertable('conditions', by_range('time'));
  ```

- Convert with a [chunk_time_interval][chunk_time_interval] of 24 hours:
  Either:
  ```sql
  SELECT create_hypertable('conditions', by_range('time', 86400000000));
  ```
  or:
  ```sql
  SELECT create_hypertable('conditions', by_range('time', INTERVAL '1 day'));
  ```

- with range partitioning on the `time` column, do not raise a warning if `conditions` is already a hypertable:

  ```sql
  SELECT create_hypertable('conditions', by_range('time'), if_not_exists => TRUE);
  ```

<Highlight type="note">

If you call `SELECT * FROM create_hypertable(...)` the return value is formatted as a table with column headings.

</Highlight>


### Time partition a hypertable using composite columns and immutable functions

The following example shows how to time partition the `measurements` relational table on a composite
column type using a range partitioning function.

1. Create the report type, then an immutable function that converts the column value into a supported column value:

    ```sql
    CREATE TYPE report AS (reported timestamp with time zone, contents jsonb);
    
    CREATE FUNCTION report_reported(report)
      RETURNS timestamptz
      LANGUAGE SQL
      IMMUTABLE AS
      'SELECT $1.reported';
    
    SELECT create_hypertable('measurements', by_range('report', partition_func => 'report_reported'));
    ```

1. Create the hypertable using the immutable function:
    ```sql
    SELECT create_hypertable('measurements', by_range('report', partition_func => 'report_reported'));
    ```

### Time partition a hypertable using ISO formatting

The following example shows how to time partition the `events` table on a `jsonb` (`event`) column
type, which has a top level `started` key that contains an ISO 8601 formatted timestamp:

```sql
CREATE FUNCTION event_started(jsonb)
    RETURNS timestamptz
    LANGUAGE SQL
    IMMUTABLE AS
  $func$SELECT ($1->>'started')::timestamptz$func$;

SELECT create_hypertable('events', by_range('event', partition_func => 'event_started'));
```

## Arguments

| Name        | Type             | Default | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|-------------|------------------|---------|-|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`create_default_indexes`| `BOOLEAN`        | `TRUE`  | ✖ | Create default indexes on time/partitioning columns.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|`dimension`| [DIMENSION_INFO][dimension-info] | -       | ✔ | To create a `_timescaledb_internal.dimension_info` instance to partition a hypertable, you call  [`by_range`][by-range] and [`by_hash`][by-hash].                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |      
|`if_not_exists` | `BOOLEAN`        | `FALSE` | ✖ | Set to `TRUE` to print a warning if `relation` is already a hypertable. By default, an exception is raised.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|`migrate_data`| `BOOLEAN`        | `FALSE` | ✖ | Set to `TRUE` to migrate any existing data in `relation` in to chunks in the new hypertable. Depending on the amount data to be migrated, setting `migrate_data` can lock the table for a significant amount of time. If there are [foreign key constraints](https://docs.timescale.com/use-timescale/latest/schema-management/about-constraints/) to other tables in the data to be migrated, `create_hypertable()` can run into deadlock. A hypertable can contain foreign keys to normal SQL table columns, but the reverse is not allowed. `UNIQUE` and `PRIMARY` constraints must include the partitioning key. <br></br> Deadlock may happen when concurrent transactions simultaneously try to insert data into tables that are referenced in the foreign key constraints, and into the converting table itself. To avoid deadlock, manually obtain a [SHARE ROW EXCLUSIVE](https://www.postgresql.org/docs/current/sql-lock.html) lock on the referenced tables before you call `create_hypertable` in the same transaction. <br></br> If you leave `migrate_data` set to the default, non-empty tables generate an error when you call `create_hypertable`. |
|`relation`| REGCLASS         | -       | ✔ | Identifier of the table to convert to a hypertable.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |


<DimensionInfo />

## Returns

|Column|Type| Description                                                                                                 |
|-|-|-------------------------------------------------------------------------------------------------------------|
|`hypertable_id`|INTEGER| The ID of the hypertable you created.                                                                   |
|`created`|BOOLEAN| `TRUE` when the hypertable is created. `FALSE` when `if_not_exists` is `true` and no hypertable was created. |



[create_distributed_hypertable]: /api/:currentVersion:/distributed-hypertables/create_distributed_hypertable
[hash-partitions]: /use-timescale/:currentVersion:/hypertables/about-hypertables/#hypertable-partitioning
[hypertable-docs]: /use-timescale/:currentVersion:/hypertables/
[declarative-partitioning]: https://www.postgresql.org/docs/current/ddl-partitioning.html#DDL-PARTITIONING-DECLARATIVE
[inheritance]: https://www.postgresql.org/docs/current/ddl-partitioning.html#DDL-PARTITIONING-USING-INHERITANCE
[migrate-data]: /api/:currentVersion:/hypertable/create_hypertable/#arguments
[dimension-info]: /api/:currentVersion:/hypertable/create_hypertable/#dimension-info
[chunk_time_interval]: /api/:currentVersion:/hypertable/set_chunk_time_interval/
[about-constraints]: /use-timescale/:currentVersion:/schema-management/about-constraints
[share-row-exclusive]: https://www.postgresql.org/docs/current/sql-lock.html
[by-range]: /api/:currentVersion:/hypertable/create_hypertable/#by_range
[by-hash]: /api/:currentVersion:/hypertable/create_hypertable/#by_hash
[sample-time-range]: /api/:currentVersion:/hypertable/create_hypertable/#time-partition-a-hypertable-by-time-range
[sample-composite-columns]: /api/:currentVersion:/hypertable/create_hypertable/#time-partition-a-hypertable-using-composite-columns-and-immutable-functions
[sample-iso-formatting]: /api/:currentVersion:/hypertable/create_hypertable/#time-partition-a-hypertable-using-iso-formatting
