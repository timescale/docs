---
api_name: enable_chunk_skipping()
excerpt: Enable range tracking for columns of chunks from a hypertable  
topics: [hypertables]
keywords: [hypertables, chunks, range-tracking, skipping]
tags: [columns, ranges, min-max, chunks]
api:
  license: apache
  type: function
---

# enable_chunk_skipping()

Enable range statistics for a specific column in a **compressed** hypertable. This tracks a range of values for that column per chunk. Used for chunk pruning during query optimization.

Best practice is to enable range tracking on columns that are correlated to the
partitioning column. In other words, enable tracking on secondary columns which are
referenced in the `WHERE` clauses in your queries.

TimescaleDB supports min/max range tracking for the `smallint`, `int`,
`bigint`, `serial`, `bigserial`, `date`, `timestamp`, and `timestamptz` data types. The 
min/max ranges are calculated when a chunk belonging to
this hypertable is compressed using the [compress_chunk][compress_chunk] function.
The range is stored in start (inclusive) and end (exclusive) form in the
`chunk_column_stats` catalog table.

This way you store the min/max values for such columns in this catalog
table at the per-chunk level. These min/max range values do
not participate in partitioning of the data. These ranges are
used for chunk pruning when the `WHERE` clause of an SQL query specifies
ranges on the column.

A [DROP COLUMN](https://www.postgresql.org/docs/current/sql-altertable.html#SQL-ALTERTABLE-DESC-DROP-COLUMN)
on a column with statistics tracking enabled on it ends up removing all relevant entries
from the catalog table.

A [decompress_chunk][decompress_chunk] invocation on a compressed chunk resets its entries
from the `chunk_column_stats` catalog table since now it's available for DML and the
min/max range values can change on any further data manipulation in the chunk.

By default, this feature is disabled. To enable chunk skipping, set `timescaledb.enable_chunk_skipping = on` in
`postgresql.conf`. When you upgrade from a database instance that uses compression but does not support chunk 
skipping, you need to recompress the previously compressed chunks for chunk skipping to work.

## Samples

In this sample, you convert the `conditions` table to a hypertable with
partitioning on the `time` column. You then specify and enable additional columns to track ranges for.

```sql
SELECT create_hypertable('conditions', 'time');
SELECT enable_chunk_skipping('conditions', 'device_id');
```

## Arguments

| Name        | Type             | Default | Required | Description                            |
|-------------|------------------|---------|-|----------------------------------------|
|`column_name`| `TEXT`        | -       | ✔ | Column to track range statistics for |
|`hypertable`| `REGCLASS`        | -       | ✔ | Hypertable that the column belongs to  |
|`if_not_exists`| `BOOLEAN`        | `false` | ✖ | Set to `true` so that a notice is sent when ranges are not being tracked for a column. By default, an error is thrown |


## Returns

|Column|Type|Description|
|-|-|-|
|`column_stats_id`|INTEGER|ID of the entry in the TimescaleDB internal catalog|
|`enabled`|BOOLEAN|Returns `true` when tracking is enabled, `if_not_exists` is `true`, and when a new entry is not
added|

[compress_chunk]: /api/:currentVersion:/compression/compress_chunk/
[decompress_chunk]: /api/:currentVersion:/compression/decompress_chunk/
