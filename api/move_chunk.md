## move_chunk() <tag type="community">Community</tag>
TimescaleDB allows you to move data and indexes to different tablespaces. This
allows you to move data to more cost-effective storage as it ages.

The `move_chunk` function acts like a combination of the
[PostgreSQL CLUSTER command][postgres-cluster] and
[PostgreSQL ALTER TABLE...SET TABLESPACE][postgres-altertable] commands. Unlike
these PostgreSQL commands, however, the `move_chunk` function uses lower lock
levels so that the chunk and hypertable are able to be read for most of the
process. This comes at a cost of slightly higher disk usage during the
operation. For a more detailed discussion of this capability, see the [Data
Tiering][using-data-tiering] documentation.

### Required arguments

|Name|Type|Description|
|-|-|-|
|`chunk`|REGCLASS|Name of chunk to be moved|
|`destination_tablespace`|TEXT|Target tablespace for chunk being moved|
|`index_destination_tablespace`|TEXT|Target tablespace for index associated with the chunk you are moving|

### Optional arguments

|Name|Type|Description|
|-|-|-|
|`reorder_index`|REGCLASS|The name of the index (on either the hypertable or chunk) to order by|
|`verbose`|BOOLEAN|Setting to true will display messages about the progress of the move_chunk command. Defaults to false.|


### Sample usage

``` sql
SELECT move_chunk(
  chunk => '_timescaledb_internal._hyper_1_4_chunk',
  destination_tablespace => 'tablespace_2',
  index_destination_tablespace => 'tablespace_3',
  reorder_index => 'conditions_device_id_time_idx',
  verbose => TRUE
);
```

[postgres-cluster]: https://www.postgresql.org/docs/current/sql-cluster.html
[postgres-altertable]: https://www.postgresql.org/docs/13/sql-altertable.html
[using-data-tiering]: /timescaledb/:currentVersion:/how-to-guides/data-tiering/
