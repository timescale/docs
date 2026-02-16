---
api_name: create_chunk()
excerpt: Create a chunk with specified dimensional constraints
topics: [hypertables]
keywords: [chunks, hypertables, create]
api:
  license: community
  type: function
products: [cloud, mst, self_hosted]
---

# create_chunk()

Manually create a $CHUNK with specific time ranges and space partition boundaries in a [$HYPERTABLE][hypertable-docs].

You can either create a new $CHUNK, or attach an existing table as a $CHUNK. When you add an existing table, $TIMESCALE_DB attaches it to the $HYPERTABLE and uses it as the data table for
the new $CHUNK. If necessary, $TIMESCALE_DB renames the table and/or moves the table to the specified schema.

Creating a $CHUNK requires `INSERT` privileges on the $HYPERTABLE. If `chunk_table` is provided, the table must
have the same columns and compatible constraints as the $HYPERTABLE. CHECK constraints must have the same names
as the parent table.

## Samples

- **Create a new $CHUNK for a $HYPERTABLE with a time range**:

  ```sql
  SELECT * FROM _timescaledb_functions.create_chunk(
      'conditions',
      '{"time": ["2018-01-01 00:00:00", "2018-01-08 00:00:00"]}'
  );
  ```

- **Create a $CHUNK with a custom schema and table name**:

  ```sql
  SELECT * FROM _timescaledb_functions.create_chunk(
      'conditions',
      '{"time": ["2018-01-08 00:00:00", "2018-01-15 00:00:00"]}',
      'custom_schema',
      'custom_chunk_name'
  );
  ```

- **Create a $CHUNK from an existing table**:

  ```sql
  -- Create a table with the same structure as your hypertable
  CREATE TABLE my_chunk_table (time timestamptz NOT NULL, device int, temp float);

  -- Attach it as a chunk
  SELECT * FROM _timescaledb_functions.create_chunk(
      'conditions',
      '{"time": ["2018-01-15 00:00:00", "2018-01-22 00:00:00"]}',
      schema_name => 'public',
      table_name => 'my_chunk',
      chunk_table => 'my_chunk_table'
  );
  ```

- **Create a $CHUNK with space partitioning (advanced)**:

  For $HYPERTABLEs with additional space dimensions, specify all dimension constraints:

  ```sql
  SELECT * FROM _timescaledb_functions.create_chunk(
      'conditions',
      '{"time": ["2018-01-22 00:00:00", "2018-01-29 00:00:00"], "device": [-9223372036854775808, 1073741823]}'
  );
  ```

## Arguments

|Name|Type|Default|Required| Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|-|-|-|-|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`hypertable`|REGCLASS||✔| The $HYPERTABLE to create the $CHUNK for                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
|`slices`|JSONB||✔| A JSONB object specifying the dimensional constraints for the $CHUNK. Specify each dimension with a two-element array `[range_start, range_end]`. <br/><br/>Each key is a dimension column name as defined in `hypertable`, and each value is a two-element array `[range_start, range_end]`. <br/><br/>For timestamp dimensions, use numeric values representing microseconds from Unix epoch or ISO 8601 timestamp strings. For example, `"2018-01-01 00:00:00"`. For integer or space dimensions, use numeric values matching the dimension's data type. <br/><br/>Specify all dimensions defined in the $HYPERTABLE. For example, `{"time": [1514419200000000, 1515024000000000], "device": [-9223372036854775808, 1073741823]}` |
|`schema_name`|NAME|`NULL`|✖| Schema name for the $CHUNK. If not specified,  $TIMESCALE_DB uses the default $CHUNK schema                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|`table_name`|NAME|`NULL`|✖| Table name for the $CHUNK. If not specified, $TIMESCALE_DB generates a default $CHUNK name                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|`chunk_table`|REGCLASS|`NULL`|✖| Attach an existing table as the $CHUNK. $TIMESCALE_DB renames and/or moves the table as necessary to match `schema_name` and `table_name`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

## Returns

|Column|Type| Description                                                                                                                                                                                    |
|-|-|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`chunk_id`|INTEGER| The internal ID of the $CHUNK                                                                                                                                                                  |
|`hypertable_id`|INTEGER| The internal ID of the $HYPERTABLE                                                                                                                                                             |
|`schema_name`|NAME| The schema name of the new $CHUNK                                                                                                                                                              |
|`table_name`|NAME| The table name of the new $CHUNK                                                                                                                                                               |
|`relkind`|CHAR| The relation kind, usually `r` for a regular table                                                                                                                                             |
|`slices`|JSONB| The dimensional constraints that define the $CHUNK                                                                                                                                             |
|`created`|BOOLEAN| `true` if a new $CHUNK was created. If a $CHUNK with the same dimensional constraints already exists, the function returns information about the existing $CHUNK with `created` set to `false` |

[hypertable-docs]: /use-timescale/:currentVersion:/hypertables/
