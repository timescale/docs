---
api_name: CREATE TABLE
excerpt: Create a table or a hypertable
topics: [hypertables]
keywords: [hypertables, create]
api:
  license: apache
  type: function
products: [cloud, mst, self_hosted]
---


import OldCreateHypertable from "versionContent/_partials/_old-api-create-hypertable.mdx";
import CreateHypertablePolicyNote from "versionContent/_partials/_create-hypertable-columnstore-policy-note.mdx";
import Since2200 from "versionContent/_partials/_since_2_20_0.mdx";
import DimensionInfo from "versionContent/_partials/_dimensions_info.mdx";
import HypercoreDirectCompress from "versionContent/_partials/_hypercore-direct-compress.mdx";

# CREATE TABLE

Create a [$HYPERTABLE][hypertables-section] partitioned on a single dimension with [$COLUMNSTORE][hypercore] enabled, or 
create a standard $PG relational table. 

A $HYPERTABLE is a specialized $PG table that automatically partitions your data by time. All actions that work on a 
$PG table, work on $HYPERTABLEs. For example, [ALTER TABLE][alter_table_hypercore] and [SELECT][postgres-select]. By default, 
a $HYPERTABLE is partitioned on the time dimension. To add secondary dimensions to a $HYPERTABLE, call 
[add_dimension][add-dimension]. To convert an existing relational table into a $HYPERTABLE, call 
[create_hypertable][create_hypertable].

<CreateHypertablePolicyNote />

$HYPERTABLE_CAP to $HYPERTABLE foreign keys are not allowed, all other combinations are permitted.

The [$COLUMNSTORE][hypercore] settings are applied on a per-chunk basis. You can change the settings by calling 
[ALTER TABLE][alter_table_hypercore] without first converting the entire $HYPERTABLE back to the [$ROWSTORE][hypercore]. 
The new settings apply only to the chunks that have not yet been converted to $COLUMNSTORE, the existing chunks in the 
$COLUMNSTORE do not change. Similarly, if you [remove an existing columnstore policy][remove_columnstore_policy] and then 
[add a new one][add_columnstore_policy], the new policy applies only to the unconverted chunks. This means that chunks 
with different $COLUMNSTORE settings can co-exist in the same $HYPERTABLE. 

$TIMESCALE_DB calculates default $COLUMNSTORE settings for each chunk when it is created. These settings apply to each 
chunk, and not the entire hypertable. To explicitly disable the defaults, set a setting to an empty string. 

`CREATE TABLE` extends the standard $PG [CREATE TABLE][postgres-createtable]. This page explains the features and 
arguments specific to $TIMESCALE_DB. 

<Highlight type="note" >

<OldCreateHypertable />

</Highlight> 

<Since2200 />

## Samples

- **Create a $HYPERTABLE partitioned on the time dimension and enable $COLUMNSTORE**:

   ```sql
   CREATE TABLE crypto_ticks (
      "time" TIMESTAMPTZ,
      symbol TEXT,
      price DOUBLE PRECISION,
      day_volume NUMERIC
   ) WITH (
     tsdb.hypertable,
     tsdb.segmentby='symbol',
     tsdb.orderby='time DESC'
   );
   ```

   When you create a $HYPERTABLE using `CREATE TABLE WITH`, $TIMESCALE_DB automatically creates a
   [columnstore policy][add_columnstore_policy] that uses the chunk interval as the compression interval, with a default 
   schedule interval of 1 day. The default partitioning column is automatically selected as the first column with a 
   timestamp or timestampz data type. 

- **Create a $HYPERTABLE partitioned on the time with fewer chunks based on time interval**:

   ```sql
   CREATE TABLE IF NOT EXISTS hypertable_control_chunk_interval(
    time int4 NOT NULL, 
    device text, 
    value float
   ) WITH (
    tsdb.hypertable,
    tsdb.chunk_interval=3453
   );
   ```

- **Create a $HYPERTABLE partitioned using [UUIDv7][uuidv7_functions]**:

   <Terminal>

    <tab label='Postgres 17 and lower'>
  
    ```sql
     -- UUIDv7 compression is enabled by default
     CREATE TABLE events (
        id  uuid PRIMARY KEY DEFAULT generate_uuidv7(),
        payload jsonb
     ) WITH (tsdb.hypertable, tsdb.partition_column = 'id');
    ```
    </tab>

    <tab label='Postgres v18'>

     ```sql
     -- UUIDv7 compression is enabled by default
     CREATE TABLE events (
        id  uuid PRIMARY KEY DEFAULT uuidv7(),
        payload jsonb
     ) WITH (tsdb.hypertable, tsdb.partition_column = 'id');
    ```    
   
    </tab>

    </Terminal>

- **Enable data compression during ingestion**:

    <HypercoreDirectCompress />

    1. Create a $HYPERTABLE:
     ```sql
     CREATE TABLE t(time timestamptz, device text, value float) WITH (tsdb.hypertable);
     ```
   1. Copy data into the $HYPERTABLE:
     You achieve the highest insert rate using binary format. CSV and text format are also supported.
     ```sql
     COPY t FROM '/tmp/t.binary' WITH (format binary);
     ```

- **Create a $PG relational table**:
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
   -- Standard Postgres syntax for CREATE TABLE  
) 
WITH (
   tsdb.hypertable = true | false
   tsdb.partition_column = '<column_name> ',
   tsdb.chunk_interval = '<interval>'
   tsdb.create_default_indexes =  true | false
   tsdb.associated_schema = '<schema_name>',
   tsdb.associated_table_prefix = '<prefix>'
   tsdb.orderby = '<column_name> [ASC | DESC] [ NULLS { FIRST | LAST } ] [, ...]',
   tsdb.segmentby = '<column_name> [, ...]',
   tsdb.sparse_index = '<index>(<column_name>), index(<column_name>)'
)
```

| Name                           | Type             | Default                                                                                                                                                                                                                                                                                       | Required                                                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|--------------------------------|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `tsdb.hypertable`              |BOOLEAN| `true`                                                                                                                                                                                                                                                                                        | ✖                                                           | Create a new [hypertable][hypertables-section] for time-series data rather than a standard $PG relational table.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `tsdb.partition_column`        |TEXT| The first column in the table with a timestamp data type                                                                                                                                                                                                                                      | ✖                                                           | Set the time column to automatically partition your time-series data by.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `tsdb.chunk_interval`          |TEXT| `7 days`                                                                                                                                                                                                                                                                                      | ✖                                                           | Change this to better suit your needs. For example, if you set `chunk_interval` to 1 day, each chunk stores data from the same day. Data from different days is stored in different chunks.                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `tsdb.create_default_indexes`  | BOOLEAN | `true`                                                                                                                                                                                                                                                                                        | ✖                                                           | Set to `false` to not automatically create indexes. <br/> The default indexes are: <ul><li>On all hypertables, a descending index on `partition_column`</li><li>On hypertables with space partitions, an index on the space parameter and `partition_column`</li></ul>                                                                                                                                                                                                                                                                                                                                                                     |
| `tsdb.associated_schema`       |REGCLASS| `_timescaledb_internal`                                                                                                                                                                                                                                                                       |  ✖  | Set the schema name for internal hypertable tables.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `tsdb.associated_table_prefix` |TEXT| `_hyper`                                                                                                                                                                                                                                                                                      | ✖  | Set the prefix for the names of internal hypertable chunks.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `tsdb.orderby`                 |TEXT| Descending order on the time column in `table_name`.                                                                                                                                                                                                                                          | ✖| The order in which items are used in the $COLUMNSTORE. Specified in the same way as an `ORDER BY` clause in a `SELECT` query. Setting `tsdb.orderby` automatically creates an implicit min/max sparse index on the `orderby` column.                                                                                                                                                                                                                                                                                                                                                                                                       |
| `tsdb.segmentby`               |TEXT| $TIMESCALE_DB looks at [`pg_stats`](https://www.postgresql.org/docs/current/view-pg-stats.html) and determines an appropriate column based on the data cardinality and distribution. If `pg_stats` is not available, $TIMESCALE_DB looks for an appropriate column from the existing indexes. | ✖| Set the list of columns used to segment data in the $COLUMNSTORE for `table`. An identifier representing the source of the data such as `device_id` or `tags_id` is usually a good candidate.                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|`tsdb.sparse_index`| TEXT | $TIMESCALE_DB evaluates the columns you already have indexed, checks which data types are a good fit for sparse indexing, then creates a sparse index as an optimization.                                                                                                                     | ✖ | Configure the sparse indexes for compressed chunks. Requires setting `tsdb.orderby`. Supported index types include: <li> `bloom(<column_name>)`: a probabilistic index, effective for `=` filters. Cannot be applied to `tsdb.orderby` columns.</li> <li> `minmax(<column_name>)`: stores min/max values for each compressed chunk. Setting `tsdb.orderby` automatically creates an implicit min/max sparse index on the `orderby` column. </li> Define multiple indexes using a comma-separated list. You can set only one index per column. Set to an empty string to avoid using sparse indexes and explicitly disable the default behavior. |



## Returns

$TIMESCALE_DB returns a simple message indicating success or failure. 

[postgres-createtable]: https://www.postgresql.org/docs/current/sql-createtable.html
[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[alter_table_hypercore]: /api/:currentVersion:/hypercore/alter_table/
[postgres-select]: https://www.postgresql.org/docs/current/sql-select.html
[add-dimension]: /api/:currentVersion:/hypertable/add_dimension/
[hypercore]: /use-timescale/:currentVersion:/hypercore/
[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[remove_columnstore_policy]: /api/:currentVersion:/hypercore/remove_columnstore_policy/
[uuidv7_functions]: /api/:currentVersion:/uuid-functions/
