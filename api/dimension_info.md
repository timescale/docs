# Dimension Info Constructurs

<Highlight type="note">
Dimension info constructors were introduced in TimescaleDB 2.13.
</Highlight>

The `create_hypertable` and `add_dimension` are used together with
dimension info constructors to specify the dimensions to partition a
hypertable on.

TimescaleDB currently supports two partition types: partitioning by
range and partitioning by hash.

<Highlight type="tip">
For incompatible data types (for example, `jsonb`) you can specify a function to
the `time_partitioning_func` argument which can extract a compatible
data type
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

Creates a by-range dimension info object that can be used with
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

An instance of `_timescaledb_internal.dimension_info`, which is an
opaque type holding the dimension information.

### Notes

The `partition_interval` should be specified as follows:

- If the column to be partitioned is a `TIMESTAMP`, `TIMESTAMPTZ`, or
  `DATE`, this length should be specified either as an `INTERVAL` type
  or an integer value in *microseconds*.

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

An instance of `_timescaledb_internal.dimension_info`, which is an
opaque type holding the dimension information.
