# Dimension Builders

<Highlight type="note">
Dimension builders were introduced in TimescaleDB 2.13.
</Highlight>

The `create_hypertable` and `add_dimension` are used together with
dimension builders to specify the dimensions to partition a
hypertable on.

TimescaleDB currently supports two partition types: partitioning by
range and partitioning by hash.

<Highlight type="tip">
For incompatible data types (for example, `jsonb`) you can specify a function to
the `partition_func` argument of the dimension build to extract a compatible
data type. Look in the example section below.
</Highlight>

## Partition Function

It is possible to specify a custom partitioning function for both
range and hash partitioning. A partitioning function should take a
`anyelement` argument as the only parameter and return a positive
`integer` hash value. Note that this hash value is _not_ a partition
identifier, but rather the inserted value's position in the
dimension's key space, which is then divided across the partitions.

If no custom partitioning function is specified, the default
partitioning function is used, which calls PostgreSQL's internal hash
function for the given type. Thus, a custom partitioning function can
be used for value types that do not have a native PostgreSQL hash
function.

## by_range()

Creates a by-range dimension builder that can be used with
`create_hypertable` and `add_dimension`.

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

A *dimension builder*, which is an opaque type
`_timescaledb_internal.dimension_info`, holding the dimension
information.

### Notes

The `partition_interval` should be specified as follows:

- If the column to be partitioned is a `TIMESTAMP`, `TIMESTAMPTZ`, or
  `DATE`, this length should be specified either as an `INTERVAL` type
  or an integer value in *microseconds*.

  <Highlight type="note">
  While both `timestamp` and `timestamptz` data types are supported for partitioning columns, a best practice is to use `timestamptz`. For why the use of `timestamp` is discouraged, see [PostgreSQL timestamp](https://wiki.postgresql.org/wiki/Don't_Do_This#Don.27t_use_timestamp_.28without_time_zone.29).
  </Highlight>

- If the column is some other integer type, this length should be an
  integer that reflects the column's underlying semantics (for example, the
  `partition_interval` should be given in milliseconds if this column
  is the number of milliseconds since the UNIX epoch).

A summary of the partition type and default value depending on the
column type is summarized below.

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

In this case, the dimension builder can be excluded since
`create_hypertable` by default assumes that a single provided column
is range partitioned by time.

If you have a table with a non-time column containing the time, for
example a JSON column, you can add a partition function to extract the
time. 

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
