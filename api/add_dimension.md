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

<Highlight type="cloud" header="These instructions are for self-hosted TimescaleDB deployments" button="Try Timescale Cloud">
Best practice is to not use additional dimensions. However, Timescale Cloud transparently provides seamless storage scaling, 
both in terms of storage capacity and available storage IOPS/bandwidth. 
</Highlight>

You can only execute this `add_dimension` command on an empty hypertable. To convert a normal table to a hypertable, 
call [create hypertable][create_hypertable].

The column you select as the dimension can use either:
 
- Interval partitions: For example, for a second range partition.
- [hash partitions][hash-partition]: to enable parallelization across multiple disks.

This page describes the generalized hypertable API introduced in [TimescaleDB v2.13.0][rn-2130].
For information about the deprecated interface, see [add_dimension(), deprecated interface][add-dimension-old].

### Hash partitions 

Every distinct item in hash partitioning is hashed to one of *N* buckets. By default, 
TimescaleDB uses flexible range intervals to manage chunk sizes. The main purpose of hash
partitioning is to enable parallelization across multiple disks within the same time 
interval.

### Parallelizing disk I/O 

You use Parallel I/O in the following scenarios:

- Two or more concurrent queries should be able to read from different disks in parallel.
- A single query should be able to use query parallelization to read from multiple disks in parallel.

For the following options:

- **RAID**: use a RAID setup across multiple physical disks, and expose a single logical disk to the hypertable.
  That is, using a single tablespace.

  Best practice is to use RAID when possible, as you do not need to manually manage tablespaces
  in the database. 

- **Multiple tablespaces**: for each physical disk, add a separate tablespace to the database. TimescaleDB allows you to add 
  multiple tablespaces to a *single* hypertable. However, although under the hood, a hypertable's
  chunks are spread across the tablespaces associated with that hypertable.


When using multiple tablespaces, a best practice is to also add a second hash-partitioned dimension to your hypertable and to have at least one hash partition per disk. While a single time dimension would also work, it would mean that the first chunk is written to one tablespace, the second to another, and so on, and thus would parallelize only if a query's time range exceeds a single chunk.

When adding a hash partitioned dimension, set the number of partitions to a multiple of number of disks. For example, the number of 
partitions P=N*Pd where N is the number of disks and Pd is the number of partitions per 
disk. This enables you to add more disks later and move partitions to the new disk from other disks.


TimescaleDB does *not* benefit from a very large number of hash
partitions, such as the number of unique items you expect in partition
field.  A very large number of hash partitions leads both to poorer
per-partition load balancing (the mapping of items to partitions using
hashing), as well as much increased planning latency for some types of
queries.

### Required arguments

|Name|Type|Description|
|-|-|-|
|`hypertable`|REGCLASS|Hypertable to add the dimension to|
|`dimension`|DIMENSION_INFO | Dimension to partition by|

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
|`created`|BOOLEAN|True if the dimension was added, false when `if_not_exists` is true and no dimension was added|

### Sample use

First convert table `conditions` to hypertable with just range
partitioning on column `time`, then add an additional partition key on
`location` with four partitions:

```sql
SELECT create_hypertable('conditions', by_range('time'));
SELECT add_dimension('conditions', by_hash('location', 4));
```

<Highlight type="note">
The `by_range` and `by_hash` dimension builders are an addition to TimescaleDB 2.13.
</Highlight>

Convert table `conditions` to hypertable with range partitioning on
`time` then add three additional dimensions: one hash partitioning on
`location`, one range partition on `time_received`, and one hash
partitionining on `device_id`.

```sql
SELECT create_hypertable('conditions', by_range('time'));
SELECT add_dimension('conditions', by_hash('location', 2));
SELECT add_dimension('conditions', by_range('time_received', INTERVAL '1 day'));
SELECT add_dimension('conditions', by_hash('device_id', 2));
SELECT add_dimension('conditions', by_hash('device_id', 2), if_not_exists => true);
```

In a multi-node example for distributed hypertables with a cluster
of one access node and two data nodes, configure the access node for
access to the two data nodes. Then, convert table `conditions` to
a distributed hypertable with just range partitioning on column `time`,
and finally add a hash partitioning dimension on `location`
with two partitions (as the number of the attached data nodes).

```sql
SELECT add_data_node('dn1', host => 'dn1.example.com');
SELECT add_data_node('dn2', host => 'dn2.example.com');
SELECT create_distributed_hypertable('conditions', 'time');
SELECT add_dimension('conditions', by_range('time'), by_hash('location', 2));
```

[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[distributed-hypertable-partitioning-best-practices]: /use-timescale/:currentVersion:/hypertables/about-hypertables/#space-partitioning
[distributed-hypertables]: /api/:currentVersion:/distributed-hypertables/create_distributed_hypertable/
[regular-hypertables]: /api/:currentVersion:/hypertable/create_hypertable/
[add-dimension-old]: /api/:currentVersion:/hypertable/add_dimension_old/
[rn-2130]: /about/:currentVersion:/release-notes/#timescaledb-2130-on-2023-11-28
[hash-partition]: /api/:currentVersion:/hypertable/add_dimension/#hash-partitions
