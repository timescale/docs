## move_chunk() <tag type="community">Community</tag> 

TimescaleDB allows users to move data (and indexes) to alternative
tablespaces. This allows the user the ability to move data to more cost
effective storage as it ages. This function acts like the combination of the
[PostgreSQL CLUSTER command][postgres-cluster] and the
[PostgreSQL ALTER TABLE...SET TABLESPACE command][postgres-altertable].

Unlike these PostgreSQL commands, however, the `move_chunk` function employs
lower lock levels so that the chunk and hypertable are able to be read for most
of the process. This comes at a cost of slightly higher disk usage during the
operation. For a more detailed discussion of this capability, please see the
[Data Tiering][using-data-tiering] documentation.

### Required Arguments

|Name|Type|Description|
|---|---|---|
| `chunk` | REGCLASS | Name of chunk to be moved. |
| `destination_tablespace` | TEXT | Target tablespace for chunk you are moving. |
| `index_destination_tablespace` | TEXT | Target tablespace for index associated with the chunk you are moving. |

### Optional Arguments

|Name|Type|Description|
|---|---|---|
| `reorder_index` | REGCLASS | The name of the index (on either the hypertable or chunk) to order by.|
| `verbose` | BOOLEAN | Setting to true will display messages about the progress of the move_chunk command. Defaults to false.|


### Sample Usage 

``` sql
SELECT move_chunk(
  chunk => '_timescaledb_internal._hyper_1_4_chunk',
  destination_tablespace => 'tablespace_2',
  index_destination_tablespace => 'tablespace_3',
  reorder_index => 'conditions_device_id_time_idx',
  verbose => TRUE
);
```