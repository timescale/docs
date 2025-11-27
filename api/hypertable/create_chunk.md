---
api_name: create_chunk()
excerpt: Create a chunk with specified dimensional constraints
topics: [hypertables]
keywords: [chunks, hypertables, create]
api:
  license: apache
  type: function
products: [cloud, mst, self_hosted]
---

# create_chunk()

Manually create a chunk with specific time ranges and space partition boundaries in a [$HYPERTABLE][hypertable-docs]. 

You can either create a new chunk, or attach an existing table as a chunk. When you add an existing table, it is attached to the $HYPERTABLE and used as the data table for 
the new chunk. If necessary, $TIMESCALE_DB renames the table, and/or moves the table to the specified schema.

Creating a chunk requires `INSERT` privileges on the $HYPERTABLE. If `chunk_table` is provided, the table must 
have the same columns and compatible constraints as the $HYPERTABLE. CHECK constraints must have the same names 
as the parent table.

## Samples

- **Create a new chunk for a $HYPERTABLE with specific time and space constraints**:

  ```sql
  SELECT * FROM _timescaledb_functions.create_chunk(
      'conditions',
      '{"time": [1514419200000000, 1515024000000000], "device": [-9223372036854775808, 1073741823]}'
  );
  ```

- **Create a chunk with a custom schema and table name**:

  ```sql
  SELECT * FROM _timescaledb_functions.create_chunk(
      'conditions',
      '{"time": [1515024000000000, 1519024000000000], "device": [-9223372036854775808, 1073741823]}',
      'custom_schema',
      'custom_chunk_name'
  );
  ```

- **Create a chunk from an existing table**:

  ```sql
  -- Create a table with the same structure as your hypertable
  CREATE TABLE my_chunk_table (time timestamptz NOT NULL, device int, temp float);

  -- Attach it as a chunk
  SELECT * FROM _timescaledb_functions.create_chunk(
      'conditions',
      '{"time": [1519024000000000, 1519628800000000]}',
      schema_name => 'public',
      table_name => 'my_chunk',
      chunk_table => 'my_chunk_table'
  );
  ```

- **For timestamp dimensions, you can also use string values**:

  ```sql
  SELECT * FROM _timescaledb_functions.create_chunk(
      'conditions',
      '{"time": ["2018-01-01 00:00:00", "2018-01-08 00:00:00"]}'
  );
  ```

## Arguments

|Name|Type|Default|Required| Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|-|-|-|-|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`hypertable`|REGCLASS||✔| The $HYPERTABLE_CAP to create the chunk for                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|`slices`|JSONB||✔| A JSONB object specifying the dimensional constraints for the chunk. Each dimension must be specified with a two-element array `[range_start, range_end]`. <br/><br/>Each key is a dimension column name as defined in `hypertable`, and each value is a two-element array `[range_start, range_end]`. <br/><br/>For timestamp dimensions, use numeric values representing microseconds from Unix epoch or ISO 8601 timestamp strings. For example, `"2018-01-01 00:00:00"`). For integer or space dimensions, use numeric values matching the dimension's data type. <br/><br/>All dimensions defined in the $HYPERTABLE must be specified. For example: `{"time": [1514419200000000, 1515024000000000], "device": [-9223372036854775808, 1073741823]}` |
|`schema_name`|NAME|`NULL`|✖| Schema name for the chunk. If not specified,  $TIMESCALE_DB uses the default chunk schema                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|`table_name`|NAME|`NULL`|✖| Table name for the chunk. If not specified, $TIMESCALE_DB generates a default chunk name                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|`chunk_table`|REGCLASS|`NULL`|✖| Attach an existing table as the chunk. The table is renamed and/or moved as necessary to match `schema_name` and `table_name`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

## Returns

|Column|Type| Description                                                                                                                                                                                |
|-|-|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`chunk_id`|INTEGER| The internal ID of the chunk                                                                                                                                                               |
|`hypertable_id`|INTEGER| The internal ID of the $HYPERTABLE                                                                                                                                                         |
|`schema_name`|NAME| Schema name of the new chunk                                                                                                                                                           |
|`table_name`|NAME| Table name of the new chunk                                                                                                                                                            |
|`relkind`|CHAR| The relation kind (usually 'r' for regular table)                                                                                                                                          |
|`slices`|JSONB| The dimensional constraints that define the chunk                                                                                                                                          |
|`created`|BOOLEAN| `true` if a new chunk was new. If a chunk with the same dimensional constraints already exists, the function returns information about the existing chunk with `created` set to `false` |

[hypertable-docs]: /use-timescale/:currentVersion:/hypertables/
