---
api_name: CREATE TABLE
excerpt: Create a table or a hypertable
topics: [hypertables]
keywords: [hypertables, create]
api:
  license: apache
  type: function
---

import Since2200 from "versionContent/_partials/_since_2_20_0.mdx";
import DimensionInfo from "versionContent/_partials/_dimension_info.mdx";

# CREATE TABLE

Create a [$HYPERTABLE][hypertable-docs] partitioned on a single dimension with [$COLUMNSTORE][hypercore] enabled, or 
a standard $PG relational table. 

A $HYPERTABLE is a specialized $PG table that automatically partitions your data by time. All actions that work on a 
$PG table, work on $HYPERTABLEs. For example, [ALTER TABLE][alter_table_hypercore] and [SELECT][sql-select].

As the data cools and becomes more suited for analytics, it is automatically converted to the $COLUMNSTORE. This 
columnar format enables fast scanning and aggregation, optimizing performance for analytical workloads while also 
saving significant storage space. In the $COLUMNSTORE conversion, hypertable chunks are compressed by more than 90%, and 
organized for efficient, large-scale queries. This columnar format enables fast scanning and aggregation, optimizing 
performance for analytical workloads.

By default, you partition a $HYPERTABLE on the time dimension. To add secondary dimensions to a $HYPERTABLE, 
call [add_dimension][add-dimension]. 

To convert an existing relational table into a $HYPERTABLE, call [create_hypertable][create_hypertable].

`CREATE TABLE` extends the standard $PG [CREATE TABLE][pg-create-table]. This page explains the features and 
arguments specific to $TIMESCALE_DB. 

<Since2200 />

## Samples

- Create a hypertable partitioned on the time dimension with $COLUMNSTORE enabled:

   ```sql
   CREATE TABLE my_hypertable IF NOT EXISTS  (
      time        TIMESTAMPTZ       NOT NULL,
      location    TEXT              NOT NULL,
      device      TEXT              NOT NULL,
      temperature DOUBLE PRECISION  NULL,
      humidity    DOUBLE PRECISION  NULL
   ) WITH (
      tsdb.hypertable,
      tsdb.partition_column='time'
   );
   ```

- Create a hypertable partitioned on the time with fewer chunks based on time interval:

   ```sql
   CREATE TABLE IF NOT EXISTS hypertable_control_chunk_interval(
    time int4 NOT NULL, 
    device text, 
    value float
   ) WITH (
    tsdb.hypertable,
    tsdb.partition_column='time',
    tsdb.chunk_interval=3453
   );
   ```

- Create a $PG relational table
   ```sql
   CREATE TABLE IF NOT EXISTS relational_table(
    device text, 
    value float
   );
   ```


## Arguments

The syntax is:

``` sql
CREATE TABLE <table_name> (
   -- Standard PostgreSQL syntax for CREATE TABLE  
) 
WITH (
   tsdb.hypertable = true | false
   tsdb.partition_column = '<column_name> [, ...]',
   tsdb.chunk_interval = '<interval>'
   tsdb.create_default_indexes =  true | false
   tsdb.associated_schema = '<schema_name> [, ...]',
   tsdb.associated_table_prefix = '<prefix> [, ...]'
)
```

| Name                           | Type             | Default  | Required                                                    | Description                                                                                                                                                                                                                               |
|--------------------------------|------------------|----------|-------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `tsdb.hypertable`              |BOOLEAN| `true`   | ✖                                                           | Create a new [hypertable][hypertable-docs] for time-series data rather than a standard $PG relational table.                                                                                                                              |
| `tsdb.partition_column`             |TEXT| `true`   | ✖                                                           | Set the time column to automatically partition your time-series data by.                                                                                                                                                                  |
| `tsdb.chunk_interval`     |TEXT| `7 days` | ✖                                                           | Change this to better suit your needs. For example, if you set `chunk_interval` to 1 day, each chunk stores data from the same day. Data from different days is stored in different chunks.                                          |
| `tsdb.create_default_indexes`  | BOOLEAN | `true`   | ✖                                                           | Set to `false` to not automatically create indexes. <br/> The default indexes are: <ul><li>On all hypertables, a descending index on `partition_column`</li><li>On hypertables with space partitions, an index on the space parameter and `partition_column`</li></ul> |
| `tsdb.associated_schema`       |REGCLASS| `_timescaledb_internal` |  ✖  | Set the schema name for internal hypertable tables.                                                                                                                                                                                       |
| `tsdb.associated_table_prefix` |TEXT|`_hyper`| ✖  | Set the prefix for the names of internal hypertable chunks.                                                                                                                                                                               |





## Returns

$TIMESCALE_DB returns a simple message indicating success or failure. 


[pg-create-table]: https://www.postgresql.org/docs/current/sql-createtable.html
[create_distributed_hypertable]: /api/:currentVersion:/distributed-hypertables/create_distributed_hypertable
[hash-partitions]: /use-timescale/:currentVersion:/hypertables/#hypertable-partitioning
[hypertable-docs]: /use-timescale/:currentVersion:/hypertables/
[declarative-partitioning]: https://www.postgresql.org/docs/current/ddl-partitioning.html#DDL-PARTITIONING-DECLARATIVE
[inheritance]: https://www.postgresql.org/docs/current/ddl-partitioning.html#DDL-PARTITIONING-USING-INHERITANCE
[migrate-data]: /api/:currentVersion:/hypertable/create_table/#arguments
[dimension-info]: /api/:currentVersion:/hypertable/create_table/#dimension-info
[chunk_interval]: /api/:currentVersion:/hypertable/set_chunk_time_interval/
[about-constraints]: /use-timescale/:currentVersion:/schema-management/about-constraints
[share-row-exclusive]: https://www.postgresql.org/docs/current/sql-lock.html
[by-range]: /api/:currentVersion:/hypertable/create_table/#by_range
[by-hash]: /api/:currentVersion:/hypertable/create_table/#by_hash
[sample-time-range]: /api/:currentVersion:/hypertable/create_table/#time-partition-a-hypertable-by-time-range
[sample-composite-columns]: /api/:currentVersion:/hypertable/create_table/#time-partition-a-hypertable-using-composite-columns-and-immutable-functions
[sample-iso-formatting]: /api/:currentVersion:/hypertable/create_table/#time-partition-a-hypertable-using-iso-formatting
[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[alter_table_hypercore]: /api/:currentVersion:/hypercore/alter_table/
[sql-select]:https://www.postgresql.org/docs/current/sql-select.html
[add-dimension]: /api/:currentVersion:/hypertable/add_dimension/
[hypercore]: /use-timescale/:currentVersion:/hypercore/
[columnstore-default-arguments]: /api/:currentVersion:/hypercore/alter_table/#arguments
[setup-hypercore]: /use-timescale/:currentVersion:/hypercore/real-time-analytics-in-hypercore/
