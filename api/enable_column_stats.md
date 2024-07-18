---
api_name: enable_column_stats()
excerpt: Enable range tracking for columns of chunks from a hypertable  
topics: [hypertables]
keywords: [hypertables, chunks, range-tracking]
tags: [columns, ranges, min-max, chunks]
api:
  license: apache
  type: function
---

# enable_column_stats()

Allow users to specify that ranges (min/max values) be tracked
for a specific column of chunks belonging to a hypertable.

### Required arguments

|Name|Type|Description|
|-|-|-|
|`hypertable`|REGCLASS|Hypertable to which the column belongs to|
|`column_name`|TEXT|Column to track range statistics for|

### Optional arguments

|Name|Type|Description|
|-|-|-|
|`if_not_exists`|BOOLEAN|Set to true to avoid throwing an error if ranges are already being tracked for the column. A notice is issued instead. Defaults to false|

### Returns

|Column|Type|Description|
|-|-|-|
|`column_stats_id`|INTEGER|ID of the entry in the TimescaleDB internal catalog|
|`enabled`|BOOLEAN|True if the tracking was enabled, true when `if_not_exists` is true and even if new entry was not added|

<Highlight type="note">
 As of now we support tracking min/max ranges for smallint, int,
 bigint, serial, bigserial, date, timestamp, timestamptz data types.

</Highlight>

### Sample use

First convert table `conditions` to hypertable with time
partitioning on column `time`, then specify and enable additional columns to track ranges for:

```sql
SELECT create_hypertable('conditions', 'time');
SELECT enable_column_stats('conditions', 'device_id');
```

<Highlight type="note">
 It's recommended to enable range tracking on columns which are correlated to the
 partitioning column. In other words, enable tracking on secondary columns which are
 referenced in WHERE clauses of queries.

 The actual min/max ranges for such columns is calculated when a chunk belonging to
 this hypertable is compressed using the [compress_chunk][compress_chunk] function.
 The range is stored in start (inclusive) and end (exclusive) form in the
 "chunk_column_stats" catalog table.

 We can thus store the min/max values for such columns in this catalog
 table at the per-chunk level. Note that these min/max range values do
 not participate in partitioning of the data. Such data ranges will be
 used for chunk pruning if the WHERE clause of an SQL query specifies
 ranges on such a column.

 A [DROP COLUMN](https://www.postgresql.org/docs/current/sql-altertable.html#SQL-ALTERTABLE-DESC-DROP-COLUMN)
 on a column with statistics tracking enabled on it ends up removing all relevant entries
 from the catalog table.

 A [decompress_chunk][decompress_chunk] invocation on a compressed chunk resets its entries
 from the "chunk_column_stats" catalog table since now it's available for DML and the
 min/max range values can change on any further data manipulation in the chunk.

</Highlight>

[compress_chunk]: /api/:currentVersion:/compression/compress_chunk/
[decompress_chunk]: /api/:currentVersion:/compression/decompress_chunk/
