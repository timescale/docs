---
api_name: disable_column_stats()
excerpt: Disable range tracking for columns of chunks from a hypertable  
topics: [hypertables]
keywords: [hypertables, chunks, range-tracking]
tags: [columns, ranges, min-max, chunks]
api:
  license: apache
  type: function
---

# disable_column_stats()

Allow users to disable ranges (min/max values) tracking 
for a specific column of chunks belonging to a hypertable.

### Required arguments

|Name|Type|Description|
|-|-|-|
|`hypertable`|REGCLASS|Hypertable to which the column belongs to|
|`column_name`|TEXT|Column to disable tracking range statistics for|

### Optional arguments

|Name|Type|Description|
|-|-|-|
|`if_not_exists`|BOOLEAN|Set to true to avoid throwing an error if ranges are not being tracked for the column. A notice is issued instead. Defaults to false|

### Returns

|Column|Type|Description|
|-|-|-|
|`hypertable_id`|INTEGER|ID of the hypertable in TimescaleDB.|
|`column_name`|TEXT|Name of the column to disable range tracking for|
|`disabled`|BOOLEAN|True if the tracking was disabled, false when `if_not_exists` is true and entry was not removed|

<Highlight type="note">
 The range tracking has to have been enabled earlier on the column of the
 hypertable via the [enable_column_stats][enable_column_stats] function.

</Highlight>

### Sample use

First convert table `conditions` to hypertable with time
partitioning on column `time`, then specify and enable additional columns to track ranges for.
Then disable the range tracking:

```sql
SELECT create_hypertable('conditions', 'time');
SELECT enable_column_stats('conditions', 'device_id');
SELECT disable_column_stats('conditions', 'device_id');
```

<Highlight type="note">
 It's recommended to enable range tracking on columns which are correlated to the
 partitioning column. In other words, enable tracking on secondary columns which are
 referenced in WHERE clauses of queries. Use this API to disable range tracking
 on columns if the query patterns don't use this secondary column anymore.
</Highlight>

[enable_column_stats]: /api/:currentVersion:/hypertable/enable_column_stats/
