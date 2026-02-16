---
api_name: create_hypertable()
excerpt: Create a hypertable
topics: [hypertables]
keywords: [hypertables, create]
api:
  license: apache
  type: function
products: [cloud, mst, self_hosted]
---

import DimensionInfo from "versionContent/_partials/_dimensions_info.mdx";
import Deprecated2200 from "versionContent/_partials/_deprecated_2_20_0.mdx";

# create_hypertable()

Replace a standard $PG relational table with a [hypertable][hypertables-section] that is partitioned on a single 
dimension. To create a new hypertable, best practice is to call [hypertable-create-table].

A hypertable is a $PG table that automatically partitions your data by time. A dimension defines the way your 
data is partitioned.  All actions work on the resulting hypertable. For example, `ALTER TABLE`, and `SELECT`.

If the table to convert already contains data, set [migrate_data][api-create-hypertable-arguments] to `TRUE`.
However, this may take a long time and there are limitations when the table contains foreign
key constraints.

You cannot run `create_hypertable()` on a table that is already partitioned using
[declarative partitioning][declarative-partitioning] or [inheritance][inheritance]. The time column must be defined 
as `NOT NULL`. If this is not already specified on table creation, `create_hypertable` automatically adds
this constraint on the table when it is executed.

This page describes the generalized hypertable API introduced in TimescaleDB v2.13.
The [old interface for `create_hypertable` is also available][old-interface-for-create_hypertable-is-also-available].

## Samples

Before you call `create_hypertable`, you create a standard $PG relational table. For example: 

```sql
CREATE TABLE conditions (
   time        TIMESTAMPTZ         NOT NULL,
   location    text                NOT NULL,
   temperature DOUBLE PRECISION    NULL
);
```

The following examples show you how to create a hypertable from an existing table or a function:

- [Time partition a hypertable by time range][sample-time-range]
- [Time partition a hypertable using composite columns and immutable functions][sample-composite-columns]
- [Time partition a hypertable using ISO formatting][sample-iso-formatting]
- [Time partition a hypertable using UUIDv7][sample-iso-formatting]


### Time partition a hypertable by time range

The following examples show different ways to create a hypertable:

- Convert with range partitioning on the `time` column:

  ```sql
  SELECT create_hypertable('conditions', by_range('time'));
  ```

- Convert with a [set_chunk_time_interval][chunk_interval] of 24 hours:
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

### Time partition a hypertable using [UUIDv7][uuidv7_functions]:

1. Create a table with a UUIDv7 column:
   <Terminal>

    <tab label='Postgres 17 and lower'>

    ```sql
    CREATE TABLE events (
        id  uuid PRIMARY KEY DEFAULT generate_uuidv7(),
        payload jsonb
    );
    ```
    </tab>

    <tab label='Postgres v18'>
   
    ```sql
    CREATE TABLE events (
        id  uuid PRIMARY KEY DEFAULT uuidv7(),
        payload jsonb
    );
    ```
   
    </tab>

    </Terminal>
   
   
1. Partition the table based on the timestamps embedded within the UUID values:

    ```sql
   SELECT create_hypertable(
        'events',                                      
        by_range('id', INTERVAL '1 month')
    );
    ```

Subsequent data insertion and queries automatically leverage the UUIDv7-based partitioning.

## Arguments

| Name        | Type             | Default | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|-------------|------------------|---------|-|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`create_default_indexes`| `BOOLEAN`        | `TRUE`  | ✖ | Create default indexes on time/partitioning columns.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|`dimension`| [DIMENSION_INFO][dimension-info] | -       | ✔ | To create a `_timescaledb_internal.dimension_info` instance to partition a hypertable, you call  [`by_range`][by-range] and [`by_hash`][by-hash].                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |      
|`if_not_exists` | `BOOLEAN`        | `FALSE` | ✖ | Set to `TRUE` to print a warning if `relation` is already a hypertable. By default, an exception is raised.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|`migrate_data`| `BOOLEAN`        | `FALSE` | ✖ | Set to `TRUE` to migrate any existing data in `relation` in to chunks in the new hypertable. Depending on the amount of data to be migrated, setting `migrate_data` can lock the table for a significant amount of time. If there are [foreign key constraints][foreign-key-constraings] to other tables in the data to be migrated, `create_hypertable()` can run into deadlock. A hypertable can only contain foreign keys to another hypertable. `UNIQUE` and `PRIMARY` constraints must include the partitioning key. <br></br> Deadlock may happen when concurrent transactions simultaneously try to insert data into tables that are referenced in the foreign key constraints, and into the converting table itself. To avoid deadlock, manually obtain a [SHARE ROW EXCLUSIVE][share-row-exclusive] lock on the referenced tables before you call `create_hypertable` in the same transaction. <br></br> If you leave `migrate_data` set to the default, non-empty tables generate an error when you call `create_hypertable`. |
|`relation`| REGCLASS         | -       | ✔ | Identifier of the table to convert to a hypertable.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |


<DimensionInfo />

## Returns

|Column|Type| Description                                                                                                 |
|-|-|-------------------------------------------------------------------------------------------------------------|
|`hypertable_id`|INTEGER| The ID of the hypertable you created.                                                                   |
|`created`|BOOLEAN| `TRUE` when the hypertable is created. `FALSE` when `if_not_exists` is `true` and no hypertable was created. |

[api-create-hypertable-arguments]: /api/:currentVersion:/hypertable/create_hypertable/#arguments
[by-hash]: /api/:currentVersion:/hypertable/create_hypertable/#by_hash
[by-range]: /api/:currentVersion:/hypertable/create_hypertable/#by_range
[chunk_interval]: /api/:currentVersion:/hypertable/set_chunk_time_interval/
[declarative-partitioning]: https://www.postgresql.org/docs/current/ddl-partitioning.html#DDL-PARTITIONING-DECLARATIVE
[dimension-info]: /api/:currentVersion:/hypertable/create_hypertable/#dimension-info
[foreign-key-constraings]: /use-timescale/:currentVersion:/schema-management/about-constraints/
[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
[inheritance]: https://www.postgresql.org/docs/current/ddl-partitioning.html#DDL-PARTITIONING-USING-INHERITANCE
[old-interface-for-create_hypertable-is-also-available]: /api/:currentVersion:/hypertable/create_hypertable_old/
[sample-composite-columns]: /api/:currentVersion:/hypertable/create_hypertable/#time-partition-a-hypertable-using-composite-columns-and-immutable-functions
[sample-iso-formatting]: /api/:currentVersion:/hypertable/create_hypertable/#time-partition-a-hypertable-using-iso-formatting
[sample-time-range]: /api/:currentVersion:/hypertable/create_hypertable/#time-partition-a-hypertable-by-time-range
[share-row-exclusive]: https://www.postgresql.org/docs/current/sql-lock.html
[uuidv7_functions]: /api/:currentVersion:/uuid-functions/
