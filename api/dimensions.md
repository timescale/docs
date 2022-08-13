---
api_name: timescaledb_information.dimensions
excerpt: Get information on the dimensions of hypertables
topics: [hypertables]
keywords: [hypertables, information]
tags: [dimensions, partitions]
api:
  license: community
  type: view
---

## timescaledb_information.dimensions

Get metadata about the dimensions of hypertables, returning one row of metadata
for each dimension of a hypertable. For a time-and-space-partitioned
hypertable, for example, two rows of metadata are returned for the
hypertable.

A time-based dimension column has either an integer datatype
(bigint, integer, smallint) or a time-related datatype
(timestamptz, timestamp, date).
The `time_interval` column is defined for hypertables that use time datatypes.
Alternatively, for hypertables that use integer datatypes,
 the `integer_interval` and `integer_now_func` columns are defined.

For space-based dimensions, metadata is returned that specifies their number
of `num_partitions`. The `time_interval` and `integer_interval` columns are
not applicable for space based dimensions.

### Available columns

|Name|Type|Description|
|---|---|---|
| `hypertable_schema` | TEXT | Schema name of the hypertable |
| `hypertable_name` | TEXT | Table name of the hypertable |
| `dimension_number` | BIGINT | Dimension number of the hypertable, starting from 1 |
| `column_name` | TEXT | Name of the column used to create this dimension |
| `column_type` | REGTYPE | Type of the column used to create this dimension|
| `dimension_type` | TEXT | Is this time based or space based dimension?|
| `time_interval` | INTERVAL | Time interval for primary dimension if the column type is based on Postgres time datatypes |
| `integer_interval` | BIGINT | Integer interval for primary dimension if the column type is an integer datatype |
| `integer_now_func` | TEXT | integer_now function for primary dimension if the column type is integer based datatype|
| `num_partitions` | SMALLINT | Number of partitions for the dimension |

### Sample usage

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
