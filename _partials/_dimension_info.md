
### Dimension info

To create a `_timescaledb_internal.dimension_info` instance, you call  
`by_range` and `by_hash` when you [create a hypertable][create_hypertable], or [add a dimension][add_dimension] 
to an existing hypertable. 

#### Samples

Hypertables must always have a primary range dimension, followed by an arbitrary number of additional
dimensions that can be either range or hash, Typically this is just one hash. For example:

```sql
SELECT create_hypertable('conditions', by_range('time'));
SELECT add_dimension('conditions', by_hash('location', 2));
```

For incompatible data types such as `jsonb`, you can specify a function to the `partition_func` argument
of the dimension build to extract a compatible data type. Look in the example section below.

#### Custom partitioning

By default, TimescaleDB calls PostgreSQL's internal hash function for the given type.
You use a custom partitioning function for value types that do not have a native PostgreSQL hash function.

You can specify a custom partitioning function for both range and hash partitioning. A partitioning function should 
take a `anyelement` argument as the only parameter and return a positive `integer` hash value. This hash value is 
_not_ a partition identifier, but rather the inserted value's position in the dimension's key space, which is then 
divided across the partitions.

#### by_range()

Create a by-range dimension builder. You can partition `by_range` on it's own.

##### Samples

The simplest usage is to partition on a time column:

```sql
SELECT create_hypertable('my_table', by_range('time'));
```

This is the default partition, you do not need to add it explicitly.

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

##### Arguments

| Name | Type     | Default | Required | Description                                                                                                                 |
|-|----------|---------|-|-|
|`column_name`| `NAME`   | -       |✔|Name of column to partition on.|
|`partition_func`| `REGPROC` | -       |✖|The function to use for calculating the partition of a value.|
|`partition_interval`|`ANYELEMENT` | - |✖|Interval to partition column on.|

If the column to be partitioned is a:

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


#### by_hash()

The main purpose of hash partitioning is to enable parallelization across multiple disks within the same time interval. 
Every distinct item in hash partitioning is hashed to one of *N* buckets. By default, TimescaleDB uses flexible range 
intervals to manage chunk sizes. 

### Parallelizing disk I/O

You use Parallel I/O in the following scenarios:

- Two or more concurrent queries should be able to read from different disks in parallel.
- A single query should be able to use query parallelization to read from multiple disks in parallel.

For the following options:

- **RAID**: use a RAID setup across multiple physical disks, and expose a single logical disk to the hypertable.
  That is, using a single tablespace.

  Best practice is to use RAID when possible, as you do not need to manually manage tablespaces
  in the database.

- **Multiple tablespaces**: for each physical disk, add a separate tablespace to the database. TimescaleDB allows you to
  add multiple tablespaces to a *single* hypertable. However, although under the hood, a hypertable's
  chunks are spread across the tablespaces associated with that hypertable.

  When using multiple tablespaces, a best practice is to also add a second hash-partitioned dimension to your hypertable 
  and to have at least one hash partition per disk. While a single time dimension would also work, it would mean that 
  the first chunk is written to one tablespace, the second to another, and so on, and thus would parallelize only if a 
  query's time range exceeds a single chunk.

When adding a hash partitioned dimension, set the number of partitions to a multiple of number of disks. For example, 
the number of partitions P=N*Pd where N is the number of disks and Pd is the number of partitions per
disk. This enables you to add more disks later and move partitions to the new disk from other disks.

TimescaleDB does *not* benefit from a very large number of hash
partitions, such as the number of unique items you expect in partition
field.  A very large number of hash partitions leads both to poorer
per-partition load balancing (the mapping of items to partitions using
hashing), as well as much increased planning latency for some types of
queries.

##### Samples

```sql
SELECT create_hypertable('conditions', by_range('time'));
SELECT add_dimension('conditions', by_hash('location', 2));
SELECT add_dimension('conditions', by_range('time_received', INTERVAL '1 day'));
```

##### Arguments

| Name | Type     | Default | Required | Description                                              |
|-|----------|---------|-|----------------------------------------------------------|
|`column_name`| `NAME`   | -       |✔| Name of column to partition on.                          |
|`partition_func`| `REGPROC` | -       |✖| The function to use to calcule the partition of a value. |
|`number_partitions`|`ANYELEMENT` | - |✔| Number of hash partitions to use for `partitioning_column`. Must be greater than 0. |


#### Returns

`by_range` and `by-hash` return an opaque `_timescaledb_internal.dimension_info` instance, holding the 
dimension information used by this function. 


[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[add_dimension]: /api/:currentVersion:/hypertable/add_dimension/
[by-range]: /api/:currentVersion:/hypertable/create_hypertable/#by_range
[by-hash]: /api/:currentVersion:/hypertable/create_hypertable/#by_hash

