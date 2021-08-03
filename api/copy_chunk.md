## copy_chunk() <tag type="community">Community</tag>
TimescaleDB allows you to copy existing chunks to a new location within a
multi-node environment. This allows each data node to work both as a primary for
some chunks and backup for others. If a data node fails, its chunks already
exist on other nodes that can take over the responsibility of serving them.

### Required arguments

|Name|Type|Description|
|-|-|-|
|`chunk`|REGCLASS|Name of chunk to be copied|
|`destination_tablespace`|TEXT|Target tablespace for chunk being copied|
|`index_destination_tablespace`|TEXT|Target tablespace for index associated with the chunk you are copying|

### Optional arguments

|Name|Type|Description|
|-|-|-|
|`reorder_index`|REGCLASS|The name of the index (on either the hypertable or chunk) to order by|
|`verbose`|BOOLEAN|Setting to true will display messages about the progress of the copy_chunk command. Defaults to false.|


### Sample usage

``` sql
CALL timescaledb_experimental.copy_chunk(‘_timescaledb_internal._dist_hyper_1_1_chunk’, ‘data_node_2’, ‘data_node_3’);
```
