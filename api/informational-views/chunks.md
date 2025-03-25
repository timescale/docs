---
api_name: timescaledb_information.chunks
excerpt: Get metadata about hypertable chunks
topics: [information, hypertables]
keywords: [chunks, hypertables, information]
tags: [schemas, tablespaces, data nodes, time ranges]
api:
  license: apache
  type: view
---

# timescaledb_information.chunks

Get metadata about the chunks of hypertables.

This view shows metadata for the chunk's primary time-based dimension.
For information about a hypertable's secondary dimensions,
the [dimensions view][dimensions] should be used instead.

If the chunk's primary dimension is of a time datatype, `range_start` and
`range_end` are set. Otherwise, if the primary dimension type is integer based,
`range_start_integer` and `range_end_integer` are set.

### Available columns

|Name|Type|Description|
|---|---|---|
| `hypertable_schema` | TEXT | Schema name of the hypertable |
| `hypertable_name` | TEXT | Table name of the hypertable |
| `chunk_schema` | TEXT | Schema name of the chunk |
| `chunk_name` | TEXT | Name of the chunk |
| `primary_dimension` | TEXT | Name of the column that is the primary dimension|
| `primary_dimension_type` | REGTYPE | Type of the column that is the primary dimension|
| `range_start` | TIMESTAMP WITH TIME ZONE | Start of the range for the chunk's dimension |
| `range_end` | TIMESTAMP WITH TIME ZONE | End of the range for the chunk's dimension |
| `range_start_integer` | BIGINT | Start of the range for the chunk's dimension, if the dimension type is integer based |
| `range_end_integer` | BIGINT | End of the range for the chunk's dimension, if the dimension type is integer based |
| `is_compressed` | BOOLEAN | Is the data in the chunk compressed? <br/><br/> Note that for distributed hypertables, this is the cached compression status of the chunk on the access node. The cached status on the access node and data node is not in sync in some scenarios. For example, if a user compresses or decompresses the chunk on the data node instead of the access node, or sets up compression policies directly on data nodes. <br/><br/> Use `chunk_compression_stats()` function to get real-time compression status for distributed chunks.|
| `chunk_tablespace` | TEXT | Tablespace used by the chunk|
| `data_nodes` | ARRAY | Nodes on which the chunk is replicated. This is applicable only to chunks for distributed hypertables |
| `chunk_creation_time` | TIMESTAMP WITH TIME ZONE | The time when this chunk was created for data addition |

### Sample usage

Get information about the chunks of a hypertable.

<Highlight type="note">
Dimension builder `by_range` was introduced in TimescaleDB 2.13.
The `chunk_creation_time` metadata was introduced in TimescaleDB 2.13.
</Highlight>

```sql
CREATE TABLESPACE tablespace1 location '/usr/local/pgsql/data1';

CREATE TABLE hyper_int (a_col integer, b_col integer, c integer);
SELECT table_name from create_hypertable('hyper_int', by_range('a_col', 10));
CREATE OR REPLACE FUNCTION integer_now_hyper_int() returns int LANGUAGE SQL STABLE as $$ SELECT coalesce(max(a_col), 0) FROM hyper_int $$;
SELECT set_integer_now_func('hyper_int', 'integer_now_hyper_int');

INSERT INTO hyper_int SELECT generate_series(1,5,1), 10, 50;

SELECT attach_tablespace('tablespace1', 'hyper_int');
INSERT INTO hyper_int VALUES( 25 , 14 , 20), ( 25, 15, 20), (25, 16, 20);

SELECT * FROM timescaledb_information.chunks WHERE hypertable_name = 'hyper_int';

-[ RECORD 1 ]----------+----------------------
hypertable_schema      | public
hypertable_name        | hyper_int
chunk_schema           | _timescaledb_internal
chunk_name             | _hyper_7_10_chunk
primary_dimension      | a_col
primary_dimension_type | integer
range_start            |
range_end              |
range_start_integer    | 0
range_end_integer      | 10
is_compressed          | f
chunk_tablespace       |
data_nodes             |
-[ RECORD 2 ]----------+----------------------
hypertable_schema      | public
hypertable_name        | hyper_int
chunk_schema           | _timescaledb_internal
chunk_name             | _hyper_7_11_chunk
primary_dimension      | a_col
primary_dimension_type | integer
range_start            |
range_end              |
range_start_integer    | 20
range_end_integer      | 30
is_compressed          | f
chunk_tablespace       | tablespace1
data_nodes             |
```

[dimensions]: /api/:currentVersion:/informational-views/dimensions/
