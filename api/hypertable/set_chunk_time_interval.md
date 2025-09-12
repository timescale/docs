---
api_name: set_chunk_time_interval()
excerpt: Change the chunk time interval of a hypertable
topics: [hypertables]
keywords: [chunks, hypertables]
tags: [time ranges, time intervals]
api:
  license: apache
  type: function
products: [cloud, mst, self_hosted]
---

# set_chunk_time_interval()

Sets the `chunk_time_interval` on a hypertable. The new interval is used
when new chunks are created, and time intervals on existing chunks are
not changed.

## Samples

For a TIMESTAMP column, set `chunk_time_interval` to 24 hours:

```sql
SELECT set_chunk_time_interval('conditions', INTERVAL '24 hours');
SELECT set_chunk_time_interval('conditions', 86400000000);
```

For a time column expressed as the number of milliseconds since the
UNIX epoch, set `chunk_time_interval` to 24 hours:

```sql
SELECT set_chunk_time_interval('conditions', 86400000);
```

## Arguments


| Name        | Type             | Default | Required                                                             | Description                                                                                                                                      |
|-------------|------------------|---------|----------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
|`hypertable`|REGCLASS| -       | ✔                                                                    | Hypertable or continuous aggregate to update interval for.                                                                                       |
|`chunk_time_interval`|See note|-       | ✔   | Event time that each new chunk covers.                                                                                                           |
|`dimension_name`|REGCLASS|-       | ✖ | The name of the time dimension to set the number of partitions for. Only use `dimension_name` when your hypertable has multiple time dimensions. |

When you create a $HYPERTABLE, the default chunk interval is 7 days. To calculate the interval, $TIMESCALE_DB divides 
the whole time line from epoch 0: two 7 day chunks end at day 14. If you set `chunk_time_interval` to 3 days,
dividing the time line with 3 day chunks ending at a similar point lead to 5 chunks. That is, 15 days. Since the two 
7 day chunks already occupied the first 14 days, the new 3 day chunks are cut to cover day 15 only (3+3+1).

The valid types for the `chunk_time_interval` depend on the type used for the
hypertable `time` column:

|`time` column type|`chunk_time_interval` type|Time unit|
|-|-|-|
|TIMESTAMP|INTERVAL|days, hours, minutes, etc|
||INTEGER or BIGINT|microseconds|
|TIMESTAMPTZ|INTERVAL|days, hours, minutes, etc|
||INTEGER or BIGINT|microseconds|
|DATE|INTERVAL|days, hours, minutes, etc|
||INTEGER or BIGINT|microseconds|
|SMALLINT|SMALLINT|The same time unit as the `time` column|
|INT|INT|The same time unit as the `time` column|
|BIGINT|BIGINT|The same time unit as the `time` column|

For more information, see [hypertable partitioning][hypertable-partitioning].


[hypertable-partitioning]: /use-timescale/:currentVersion:/hypertables/#hypertable-partitioning
