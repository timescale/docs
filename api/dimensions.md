---
api_name: timescaledb_information.dimensions
excerpt: Get information on the dimensions of hypertables
topics: [information, hypertables]
keywords: [hypertables, information]
tags: [dimensions, partitions]
api:
  license: community
  type: view
---

# timescaledb_information.dimensions

Returns information about the dimensions of a hypertable. Hypertables can be
partitioned on a range of different dimensions. By default, all hypertables are
partitioned on time, but it is also possible to partition on other dimensions in
addition to time.

For hypertables that are partitioned solely on time,
`timescaledb_information.dimensions` returns a single row of metadata. For
hypertables that are partitioned on more than one dimension, the call returns a
row for each dimension.

For time-based dimensions, the metadata returned indicates the integer datatype,
such as BIGINT, INTEGER, or SMALLINT, and the time-related datatype, such as
TIMESTAMPTZ, TIMESTAMP, or DATE. For space-based dimension, the metadata
returned specifies the number of `num_partitions`.

If the hypertable uses time data types, the `time_interval` column is defined.
Alternatively, if the hypertable uses integer data types, the `integer_interval`
and `integer_now_func` columns are defined.

## Available columns

|Name|Type|Description|
|-|-|-|
|`hypertable_schema`|TEXT|Schema name of the hypertable|
|`hypertable_name`|TEXT|Table name of the hypertable|
|`dimension_number`|BIGINT|Dimension number of the hypertable, starting from 1|
|`column_name`|TEXT|Name of the column used to create this dimension|
|`column_type`|REGTYPE|Type of the column used to create this dimension|
|`dimension_type`|TEXT|Is this a time based or space based dimension|
|`time_interval`|INTERVAL|Time interval for primary dimension if the column type is a time datatype|
|`integer_interval`|BIGINT|Integer interval for primary dimension if the column type is an integer datatype|
|`integer_now_func`|TEXT|`integer_now`` function for primary dimension if the column type is an integer datatype|
|`num_partitions`|SMALLINT|Number of partitions for the dimension|

<Highlight type="note">
The `time_interval` and `integer_interval` columns are not applicable for space
based dimensions.
</Highlight>

## Sample usage

Get information about the dimensions of hypertables.

```sql
--Create a time and space partitioned hypertable
CREATE TABLE dist_table(time timestamptz, device int, temp float);
SELECT create_hypertable('dist_table', 'time',  'device', chunk_time_interval=> INTERVAL '7 days', number_partitions=>3);

SELECT * from timescaledb_information.dimensions
  ORDER BY hypertable_name, dimension_number;

-[ RECORD 1 ]-----+-------------------------
hypertable_schema | public
hypertable_name   | dist_table
dimension_number  | 1
column_name       | time
column_type       | timestamp with time zone
dimension_type    | Time
time_interval     | 7 days
integer_interval  |
integer_now_func  |
num_partitions    |
-[ RECORD 2 ]-----+-------------------------
hypertable_schema | public
hypertable_name   | dist_table
dimension_number  | 2
column_name       | device
column_type       | integer
dimension_type    | Space
time_interval     |
integer_interval  |
integer_now_func  |
num_partitions    | 2
```

Get information about dimensions of a hypertable that has two time-based dimensions.

``` sql
CREATE TABLE hyper_2dim (a_col date, b_col timestamp, c_col integer);
SELECT table_name from create_hypertable('hyper_2dim', 'a_col');
SELECT add_dimension('hyper_2dim', 'b_col', chunk_time_interval=> '7 days');

SELECT * FROM timescaledb_information.dimensions WHERE hypertable_name = 'hyper_2dim';

-[ RECORD 1 ]-----+----------------------------
hypertable_schema | public
hypertable_name   | hyper_2dim
dimension_number  | 1
column_name       | a_col
column_type       | date
dimension_type    | Time
time_interval     | 7 days
integer_interval  |
integer_now_func  |
num_partitions    |
-[ RECORD 2 ]-----+----------------------------
hypertable_schema | public
hypertable_name   | hyper_2dim
dimension_number  | 2
column_name       | b_col
column_type       | timestamp without time zone
dimension_type    | Time
time_interval     | 7 days
integer_interval  |
integer_now_func  |
num_partitions    |
```
