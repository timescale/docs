---
api_name: CREATE TABLE
excerpt: Create a table or a hypertable
topics: [hypertables]
keywords: [hypertables, create]
api:
  license: apache
  type: function
---

import Since2200 from "versionContent/_partials/_since_2_18_0.mdx";
import DimensionInfo from "versionContent/_partials/_dimension_info.mdx";

# CREATE TABLE

Create a standard $PG relational table or a [$HYPERTABLE][hypertable-docs] that is partitioned on a single dimension. 

A $HYPERTABLE is a specialized $PG table that automatically partitions your data by time. A dimension defines the 
way your data is partitioned. All actions work on tables and $HYPERTABLEs. For example, `ALTER TABLE`, and `SELECT`.

`CREATE TABLE` extends the standard $PG [CREATE TABLE][pg-create-table]. This page explains the features and 
arguments specific to $TIMESCALE_DB. To convert an existing relational table into a hypertable, call 
[create_hypertable][create_hypertable].

By default, creates default indexes on time/partitioning columns.

clever stuff for hypertables, use /add_dimension/, partition table by_range or by_hash 
clever stuff for hypercore, use /alter_table/

<Since2200 />

## Samples

Yay,  more samples

## Arguments

The syntax is:

``` sql
CREATE TABLE <table_name> SET (
   Standard 
) 
WITH (
   timescaledb.hypertable = true | false
   timescaledb.time_column = '<column_name> [, ...]',
   timescaledb.enable_columnstore = true | false
)

```


| Name                              | Type             | Default | Required | Description                                                                                                                                       |
|-----------------------------------|------------------|---------|-|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `timescaledb.hypertable`  |BOOLEAN| `true` | ✖ | Make this new table a [hypertable][hypertable-docs].                                                                                              |
| `timescaledb.time_column`  |TEXT| `true` | ✖ | Set the time column to automatically partition your time-series data by.                                                                          |
| `timescaledb.enable_columnstore`  |BOOLEAN| `true` | ✖ | Enable columnstore.                                                                                                                               |


<DimensionInfo />

## Returns

|Column|Type| Description                                                                                                 |
|-|-|-------------------------------------------------------------------------------------------------------------|
|`hypertable_id`|INTEGER| The ID of the hypertable you created.                                                                   |
|`created`|BOOLEAN| `TRUE` when the hypertable is created. `FALSE` when `if_not_exists` is `true` and no hypertable was created. |



[pg-create-table]: https://www.postgresql.org/docs/current/sql-createtable.html
[create_distributed_hypertable]: /api/:currentVersion:/distributed-hypertables/create_distributed_hypertable
[hash-partitions]: /use-timescale/:currentVersion:/hypertables/about-hypertables/#hypertable-partitioning
[hypertable-docs]: /use-timescale/:currentVersion:/hypertables/
[declarative-partitioning]: https://www.postgresql.org/docs/current/ddl-partitioning.html#DDL-PARTITIONING-DECLARATIVE
[inheritance]: https://www.postgresql.org/docs/current/ddl-partitioning.html#DDL-PARTITIONING-USING-INHERITANCE
[migrate-data]: /api/:currentVersion:/hypertable/create_table/#arguments
[dimension-info]: /api/:currentVersion:/hypertable/create_table/#dimension-info
[chunk_time_interval]: /api/:currentVersion:/hypertable/set_chunk_time_interval/
[about-constraints]: /use-timescale/:currentVersion:/schema-management/about-constraints
[share-row-exclusive]: https://www.postgresql.org/docs/current/sql-lock.html
[by-range]: /api/:currentVersion:/hypertable/create_table/#by_range
[by-hash]: /api/:currentVersion:/hypertable/create_table/#by_hash
[sample-time-range]: /api/:currentVersion:/hypertable/create_table/#time-partition-a-hypertable-by-time-range
[sample-composite-columns]: /api/:currentVersion:/hypertable/create_table/#time-partition-a-hypertable-using-composite-columns-and-immutable-functions
[sample-iso-formatting]: /api/:currentVersion:/hypertable/create_table/#time-partition-a-hypertable-using-iso-formatting
[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
