## timescaledb_information.compression_settings 

Get information about compression-related settings for hypertables.
Each row of the view provides information about individual orderby
and segmentby columns used by compression.

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
SELECT table_name FROM create_hypertable('hypertab', 'a_col');

ALTER TABLE hypertab SET (timescaledb.compress, timescaledb.compress_segmentby = 'a_col,b_col', 
  timescaledb.compress_orderby = 'c_col desc, d_col asc nulls last');

SELECT * FROM timescaledb_information.compression_settings WHERE hypertable_name = 'hypertab';

 hypertable_schema | hypertable_name | attname | segmentby_column_index | orderby_column_in
dex | orderby_asc | orderby_nullsfirst 
-------------+------------+---------+------------------------+------------------
----+-------------+--------------------
 public      | hypertab   | a_col   |                      1 |
    |             | 
 public      | hypertab   | b_col   |                      2 |
    |             | 
 public      | hypertab   | c_col   |                        |
  1 | f           | t
 public      | hypertab   | d_col   |                        |
  2 | t           | f
(4 rows)
```