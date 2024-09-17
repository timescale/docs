# Dimension Builders

You call [`create_hypertable`][create_hypertable] and [`add_dimension`][add_dimension] to specify the dimensions to 
partition a hypertable on. TimescaleDB supports partitioning [`by_range`][by-range] and [`by_hash`][by-hash]. You can 
partition `by_range` on it's own. However, because `by_hash` makes a fixed number of partitions which can grow 
very large, best practice is to set `by_range` when you use `by_hash`. 

For incompatible data types such as `jsonb`, you can specify a function to
the `partition_func` argument of the dimension build to extract a compatible
data type. Look in the example section below.

Dimension builders were introduced in TimescaleDB 2.13.



## Partition Function

If you do not set custom partitioning, TimescaleDB calls PostgreSQL's internal hash function for the given type.
You use custom partitioning function for value types that do not have a native PostgreSQL hash
function.

You can specify a custom partitioning function for both
range and hash partitioning. A partitioning function should take a
`anyelement` argument as the only parameter and return a positive
`integer` hash value. This hash value is _not_ a partition identifier, but rather the 
inserted value's position in the dimension's key space, which is then divided across 
the partitions.


## by_range()

Create a by-range dimension builder that can be used with
[`create_hypertable`][create_hypertable] and [`add_dimension`][add_dimension].

### Required Arguments

| Name          | Type | Description                     |
|---------------|------|---------------------------------|
| `column_name` | NAME | Name of column to partition on. |


### Optional Arguments

| Name                 | Type       | Description                                                  |
|----------------------|------------|--------------------------------------------------------------|
| `partition_interval` | ANYELEMENT | Interval to partition column on.                              |
| `partition_func`     | REGPROC    | The function to use for calculating the partition of a value. |
	
### Returns 

A *dimension builder*, which is an which is an opaque type
`_timescaledb_internal.dimension_info`, holding the dimension
information.

### Notes

Specify the `partition_interval` as follows. If the column to be partitioned is a:

- `TIMESTAMP`, `TIMESTAMPTZ`, or `DATE`: specify `partition_interval` either as an `INTERVAL` type
  or an integer value in *microseconds*.

- Another integer type: specify `partition_interval` as an integer that reflects the column's 
  underlying semantics. For example, if this column is in UNIX time, specify `partition_interval` in milliseconds.

The partition type and default value depending on column type is:

| Column Type                  | Partition Type   | Default value |
|------------------------------|------------------|---------------|
| `TIMESTAMP WITHOUT TIMEZONE` | INTERVAL/INTEGER | 1 week        |
| `TIMESTAMP WITH TIMEZONE`    | INTERVAL/INTEGER | 1 week        |
| `DATE`                       | INTERVAL/INTEGER | 1 week        |
| `SMALLINT`                   | SMALLINT         | 10000         |
| `INT`                        | INT              | 100000        |
| `BIGINT`                     | BIGINT           | 1000000       |

### Examples

The simplest usage is to partition on a time column:

```sql
SELECT create_hypertable('my_table', by_range('time'));
```

In this case, the dimension builder can be excluded since by default, 
`create_hypertable`  assumes that a single provided column
is range partitioned by time.

If you have a table with a non-time column containing the time, such as 
a JSON column, add a partition function to extract the time. 

```sql
CREATE TABLE my_table (
   metric_id serial not null,
   data jsonb,
);

CREATE FUNCTION get_time(jsonb) RETURNS timestamptz AS $$
  SELECT ($1->>'time')::timestamptz
$$ LANGUAGE sql IMMUTABLE;

SELECT create_hypertable('my_table', by_range('data', '1 day', 'get_time'));
```

## by_hash()

### Required Arguments

| Name                | Type    | Description                                                                             |
|---------------------|---------|-----------------------------------------------------------------------------------------|
| `column_name`       | NAME    | Name of column to partition on.                                                         |
| `number_partitions` | INTEGER | Number of [hash partitions][] to use for `partitioning_column`. Must be greater than 0. |

### Optional Arguments

| Name             | Type    | Description                                              |
|------------------|---------|----------------------------------------------------------|
| `partition_func` | REGPROC | The function to use for calculating a value's partition. |

### Returns 

An *dimension builder*, which is an which is an opaque type
`_timescaledb_internal.dimension_info`, holding the dimension
information.

[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[add_dimension]: /api/:currentVersion:/hypertable/add_dimension/
[dimension_builders]: /api/:currentVersion://hypertable/dimension_info/
[by-range]: /api/:currentVersion:/hypertable/dimension_info/#by_range
[by-hash]: /api/:currentVersion:/hypertable/dimension_info/#by_hash

