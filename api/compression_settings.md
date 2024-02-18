---
api_name: timescaledb_information.compression_settings
excerpt: Get information about compression settings for hypertables
topics: [information, compression]
keywords: [compression]
tags: [informational, settings, hypertables, schemas, indexes]
api:
  license: community
  type: view
---

# timescaledb_information.compression_settings

Get information about compression-related settings for hypertables.
Each row of the view provides information about individual `orderby`
and `segmentby` columns used by compression.

How you use `segmentby` is the single most important thing for compression. It
affects compresion rates, query performance, and what is compressed or
decompressed by mutable compression.

### Available columns

|Name|Type|Description|
|---|---|---|
| `hypertable_schema` | TEXT | Schema name of the hypertable |
| `hypertable_name` | TEXT | Table name of the hypertable |
| `attname` | TEXT | Name of the column used in the compression settings |
| `segmentby_column_index` | SMALLINT | Position of attname in the compress_segmentby list |
| `orderby_column_index` | SMALLINT | Position of attname in the compress_orderby list |
| `orderby_asc` | BOOLEAN | True if this is used for order by ASC, False for order by DESC |
| `orderby_nullsfirst` | BOOLEAN | True if nulls are ordered first for this column, False if nulls are ordered last|

### Sample usage

```sql
CREATE TABLE hypertab (a_col integer, b_col integer, c_col integer, d_col integer, e_col integer);
SELECT table_name FROM create_hypertable('hypertab', by_range('a_col', 864000000));

ALTER TABLE hypertab SET (timescaledb.compress, timescaledb.compress_segmentby = 'a_col,b_col',
  timescaledb.compress_orderby = 'c_col desc, d_col asc nulls last');

SELECT * FROM timescaledb_information.compression_settings WHERE hypertable_name = 'hypertab';

-[ RECORD 1 ]----------+---------
hypertable_schema      | public
hypertable_name        | hypertab
attname                | a_col
segmentby_column_index | 1
orderby_column_index   |
orderby_asc            |
orderby_nullsfirst     |
-[ RECORD 2 ]----------+---------
hypertable_schema      | public
hypertable_name        | hypertab
attname                | b_col
segmentby_column_index | 2
orderby_column_index   |
orderby_asc            |
orderby_nullsfirst     |
-[ RECORD 3 ]----------+---------
hypertable_schema      | public
hypertable_name        | hypertab
attname                | c_col
segmentby_column_index |
orderby_column_index   | 1
orderby_asc            | f
orderby_nullsfirst     | t
-[ RECORD 4 ]----------+---------
hypertable_schema      | public
hypertable_name        | hypertab
attname                | d_col
segmentby_column_index |
orderby_column_index   | 2
orderby_asc            | t
orderby_nullsfirst     | f
```

<Highlight type="note">
The `by_range` dimension builder is an addition to TimescaleDB 2.13.
</Highlight>

