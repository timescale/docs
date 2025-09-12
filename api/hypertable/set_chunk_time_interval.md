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

If you change chunk time interval from 7-days to 3-days, you may have a remainder in the transition chunk: 1 day + 3-days + 3-days = 7.
This happens because the `chunk_time_interval` divides the timeline starting from epoch 0. For example, two 7-day 
chunks cover 14 days. Switching to 3-day chunks aligns with a 15-day cycle, leaving a remainder 1-day chunk. 



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
