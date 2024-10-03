---
api_name: disable_chunk_skipping()
excerpt: Disable range tracking for columns of chunks from a hypertable  
topics: [hypertables]
keywords: [hypertables, chunks, range-tracking, skipping]
tags: [columns, ranges, min-max, chunks]
api:
  license: apache
  type: function
---

# disable_chunk_skipping()

Disable range tracking for a specific column in a **compressed** hypertable.

### Required arguments

|Name|Type|Description|
|-|-|-|
|`hypertable`|REGCLASS|Hypertable that the column belongs to|
|`column_name`|TEXT|Column to disable tracking range statistics for|

### Optional arguments

|Name|Type|Description|
|-|-|-|
|`if_not_exists`|BOOLEAN|Set to `true` so that a notice is sent when ranges are not being tracked for a column. By default, an error is thrown|

### Returns

|Column|Type|Description|
|-|-|-|
|`hypertable_id`|INTEGER|ID of the hypertable in TimescaleDB.|
|`column_name`|TEXT|Name of the column range tracking is disabled for|
|`disabled`|BOOLEAN|Returns `true` when tracking is disabled. `false` when `if_not_exists` is `true` and the entry was
not removed|

<Highlight type="note">
 To `disable_chunk_skipping()`, you must have first called [enable_chunk_skipping][enable_chunk_skipping]
 and enabled range tracking on a column in the hypertable.

</Highlight>

### Sample use

In this sample, you convert the `conditions` table to a hypertable with
partitioning on the `time` column. You then specify and enable additional
columns to track ranges for. You then disable range tracking:

```sql
SELECT create_hypertable('conditions', 'time');
SELECT enable_chunk_skipping('conditions', 'device_id');
SELECT disable_chunk_skipping('conditions', 'device_id');
```

<Highlight type="note">
 Best practice is to enable range tracking on columns which are correlated to the
 partitioning column. In other words, enable tracking on secondary columns that are
 referenced in the `WHERE` clauses in your queries.
 Use this API to disable range tracking on columns when the query patterns don't
 use this secondary column anymore.

</Highlight>

[enable_chunk_skipping]: /api/:currentVersion:/hypertable/enable_chunk_skipping/
