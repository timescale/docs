---
api_name: add_dimension()
excerpt: Add a space-partitioning dimension to a hypertable
topics: [hypertables]
keywords: [hypertables, partitions]
tags: [dimensions, chunks]
api:
  license: apache
  type: function
---

# add_dimension()

Add an additional partitioning dimension to a Timescale hypertable.
The column selected as the dimension can either use interval
partitioning (for example, for a second time partition) or hash partitioning.

<Highlight type="warning">
The `add_dimension` command can only be executed after a table has been
converted to a hypertable (via `create_hypertable`), but must similarly
be run only on an empty hypertable.
</Highlight>

**Space partitions**: Using space partitions is highly recommended
for [distributed hypertables][distributed-hypertables] to achieve
efficient scale-out performance. For [regular hypertables][regular-hypertables]
that exist only on a single node, additional partitioning can be used
for specialized use cases and not recommended for most users.

Space partitions use hashing: Every distinct item is hashed to one of
*N* buckets. Remember that we are already using (flexible) time
intervals to manage chunk sizes; the main purpose of space
partitioning is to enable parallelization across multiple
data nodes (in the case of distributed hypertables) or
across multiple disks within the same time interval
(in the case of single-node deployments).

### Parallelizing queries across multiple data nodes

In a distributed hypertable, space partitioning enables inserts to be
parallelized across data nodes, even while the inserted rows share
timestamps from the same time interval, and thus increases the ingest rate.
Query performance also benefits by being able to parallelize queries
across nodes, particularly when full or partial aggregations can be
"pushed down" to data nodes (for example, as in the query
`avg(temperature) FROM conditions GROUP BY hour, location`
when using `location` as a space partition). Please see our
[best practices about partitioning in distributed hypertables][distributed-hypertable-partitioning-best-practices]
for more information.

### Parallelizing disk I/O on a single node

Parallel I/O can benefit in two scenarios: (a) two or more concurrent
queries should be able to read from different disks in parallel, or
(b) a single query should be able to use query parallelization to read
from multiple disks in parallel.

Thus, users looking for parallel I/O have two options:

1.  Use a RAID setup across multiple physical disks, and expose a
single logical disk to the hypertable (that is, via a single tablespace).

1.  For each physical disk, add a separate tablespace to the
database. Timescale allows you to actually add multiple tablespaces
to a *single* hypertable (although under the covers, a hypertable's
chunks are spread across the tablespaces associated with that hypertable).

We recommend a RAID setup when possible, as it supports both forms of
parallelization described above (that is, separate queries to separate
disks, single query to multiple disks in parallel).  The multiple
tablespace approach only supports the former. With a RAID setup,
*no spatial partitioning is required*.

That said, when using space partitions, we recommend using 1
space partition per disk.

Timescale does *not* benefit from a very large number of space
partitions (such as the number of unique items you expect in partition
field).  A very large number of such partitions leads both to poorer
per-partition load balancing (the mapping of items to partitions using
hashing), as well as much increased planning latency for some types of
queries.

### Required arguments

|Name|Type|Description|
|-|-|-|
|`hypertable`|REGCLASS|Hypertable to add the dimension to|
|`column_name`|TEXT|Column to partition by|

### Optional arguments

|Name|Type|Description|
|-|-|-|
|`number_partitions`|INTEGER|Number of hash partitions to use on `column_name`. Must be > 0|
|`chunk_time_interval`|INTERVAL|Interval that each chunk covers. Must be > 0|
|`partitioning_func`|REGCLASS|The function to use for calculating a value's partition (see `create_hypertable` [instructions][create_hypertable])|
|`if_not_exists`|BOOLEAN|Set to true to avoid throwing an error if a dimension for the column already exists. A notice is issued instead. Defaults to false|

### Returns

|Column|Type|Description|
|-|-|-|
|`dimension_id`|INTEGER|ID of the dimension in the TimescaleDB internal catalog|
|`schema_name`|TEXT|Schema name of the hypertable|
|`table_name`|TEXT|Table name of the hypertable|
|`column_name`|TEXT|Column name of the column to partition by|
|`created`|BOOLEAN|True if the dimension was added, false when `if_not_exists` is true and no dimension was added|

When executing this function, either `number_partitions` or
`chunk_time_interval` must be supplied, which dictates if the
dimension uses hash or interval partitioning.

The `chunk_time_interval` should be specified as follows:

*   If the column to be partitioned is a TIMESTAMP, TIMESTAMPTZ, or
DATE, this length should be specified either as an INTERVAL type or
an integer value in *microseconds*.

*   If the column is some other integer type, this length
should be an integer that reflects
the column's underlying semantics (for example, the
`chunk_time_interval` should be given in milliseconds if this column
is the number of milliseconds since the UNIX epoch).

<Highlight type="warning">
 Supporting more than **one** additional dimension is currently
 experimental. For any production environments, users are recommended
 to use at most one "space" dimension.

</Highlight>

### Sample use

First convert table `conditions` to hypertable with just time
partitioning on column `time`, then add an additional partition key on `location` with four partitions:

```sql
SELECT create_hypertable('conditions', 'time');
SELECT add_dimension('conditions', 'location', number_partitions => 4);
```

Convert table `conditions` to hypertable with time partitioning on `time` and
space partitioning (2 partitions) on `location`, then add two additional dimensions.

```sql
SELECT create_hypertable('conditions', 'time', 'location', 2);
SELECT add_dimension('conditions', 'time_received', chunk_time_interval => INTERVAL '1 day');
SELECT add_dimension('conditions', 'device_id', number_partitions => 2);
SELECT add_dimension('conditions', 'device_id', number_partitions => 2, if_not_exists => true);
```

Now in a multi-node example for distributed hypertables with a cluster
of one access node and two data nodes, configure the access node for
access to the two data nodes. Then, convert table `conditions` to
a distributed hypertable with just time partitioning on column `time`,
and finally add a space partitioning dimension on `location`
with two partitions (as the number of the attached data nodes).

```sql
SELECT add_data_node('dn1', host => 'dn1.example.com');
SELECT add_data_node('dn2', host => 'dn2.example.com');
SELECT create_distributed_hypertable('conditions', 'time');
SELECT add_dimension('conditions', 'location', number_partitions => 2);
```

[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[distributed-hypertable-partitioning-best-practices]: /use-timescale/:currentVersion:/hypertables/about-hypertables/#space-partitioning
[distributed-hypertables]: /api/:currentVersion:/distributed-hypertables/create_distributed_hypertable/
[regular-hypertables]: /api/:currentVersion:/hypertable/create_hypertable/
