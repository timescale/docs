## move_chunk() <tag type="community">Community</tag>
TimescaleDB allows you to move chunks to other data nodes. This can be used
when new data nodes are added to a cluster and you want to rebalance the storage
across more nodes. It is also helpful when a node needs to be removed from the 
cluster, which can only happen once all chunks are replicated on other data
nodes.

### Required arguments

|Name|Type|Description|
|-|-|-|
|`chunk`|REGCLASS|Name of chunk to be copied|
|`source_node`|NAME|Data node where the chunk currently resides|
|`destination_node`|NAME|Data node where the chunk is to be copied|


### Sample usage

``` sql
CALL timescaledb_experimental.move_chunk(‘_timescaledb_internal._dist_hyper_1_1_chunk’, ‘data_node_2’, ‘data_node_3’);
```
```

[postgres-cluster]: https://www.postgresql.org/docs/current/sql-cluster.html
[postgres-altertable]: https://www.postgresql.org/docs/13/sql-altertable.html
[using-data-tiering]: timescaledb/how-to-guides/data-tiering/
