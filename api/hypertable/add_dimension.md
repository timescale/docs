---
api_name: add_dimension()
excerpt: Add a space-partitioning dimension to a hypertable
topics: [hypertables]
keywords: [hypertables, partitions]
tags: [dimensions, chunks]
api:
  license: apache
  type: function
products: [cloud, mst, self_hosted]
---

import DimensionInfo from "versionContent/_partials/_dimensions_info.mdx";

# add_dimension()

Add an additional partitioning dimension to a $TIMESCALE_DB hypertable. You can only execute this `add_dimension` command 
on an empty hypertable. To convert a normal table to a hypertable, call [create hypertable][create_hypertable].

The column you select as the dimension can use either:

- [Interval partitions][range-partition]: for example, for a second range partition.
- [hash partitions][hash-partition]: to enable parallelization across multiple disks.

<Highlight type="cloud" header="These instructions are for self-hosted TimescaleDB deployments" button="Try Tiger">

Best practice is to not use additional dimensions. However, $CLOUD_LONG transparently provides seamless storage
scaling, both in terms of storage capacity and available storage IOPS/bandwidth.

</Highlight>

This page describes the generalized hypertable API introduced in [$TIMESCALE_DB v2.13.0][rn-2130].
For information about the deprecated interface, see [add_dimension(), deprecated interface][add-dimension-old].

## Samples

First convert table `conditions` to hypertable with just range
partitioning on column `time`, then add an additional partition key on
`location` with four partitions:

```sql
SELECT create_hypertable('conditions', by_range('time'));
SELECT add_dimension('conditions', by_hash('location', 4));
```

<Highlight type="note">

The `by_range` and `by_hash` dimension builders are an addition to $TIMESCALE_DB 2.13.

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

## Arguments

| Name | Type             | Default | Required | Description                                                                                                                                       |
|-|------------------|-|-|---------------------------------------------------------------------------------------------------------------------------------------------------|
|`chunk_time_interval` | INTERVAL         | -       | ✖ | Interval that each chunk covers. Must be > 0.                                                                                                     |
|`dimension` | [DIMENSION_INFO][dimension-info] | -       | ✔ | To create a `_timescaledb_internal.dimension_info` instance to partition a hypertable, you call  [`by_range`][range-partition] and [`by_hash`][hash-partition]. |     
|`hypertable`| REGCLASS         | - | ✔ | The hypertable to add the dimension to.                                                                                                           |
|`if_not_exists` | BOOLEAN          | `false` | ✖ | Set to `true` to print an error if a dimension for the column already exists. By default an exception is raised.                                  |
|`number_partitions` | INTEGER          | -       | ✖ | Number of hash partitions to use on `column_name`. Must be > 0.                                                                                   |
|`partitioning_func` | REGCLASS         | -       | ✖ | The function to use for calculating a value's partition. See [`create_hypertable`][create_hypertable] for more information.                       |

<DimensionInfo />

## Returns

|Column|Type| Description                                                                                                 |
|-|-|-------------------------------------------------------------------------------------------------------------|
|`dimension_id`|INTEGER| ID of the dimension in the TimescaleDB internal catalog                                                     |
|`created`|BOOLEAN| `true` if the dimension was added, `false` when you set `if_not_exists` to `true` and no dimension was added. |

[add-dimension-old]: /api/:currentVersion:/hypertable/add_dimension_old/
[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[dimension-info]: /api/:currentVersion:/hypertable/add_dimension/#dimension-info
[hash-partition]: /api/:currentVersion:/hypertable/add_dimension/#by_hash
[range-partition]: /api/:currentVersion:/hypertable/add_dimension/#by_range
[rn-2130]: https://github.com/timescale/timescaledb/releases/tag/2.13.0
