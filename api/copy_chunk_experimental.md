## copy_chunk() <tag type="community">Community</tag> <tag type="experimental">Experimental</tag>
TimescaleDB allows you to copy existing chunks to a new location within a
multi-node environment. This allows each data node to work both as a primary for
some chunks and backup for others. If a data node fails, its chunks already
exist on other nodes that can take over the responsibility of serving them.

<highlight type="warning">
Experimental features could have bugs! They might not be backwards compatible,
and could be removed in future releases. Use these features at your own risk, and
do not use any experimental features in production.
</highlight>

### Required arguments

|Name|Type|Description|
|-|-|-|
|`chunk`|REGCLASS|Name of chunk to be copied|
|`source_node`|NAME|Data node where the chunk currently resides|
|`destination_node`|NAME|Data node where the chunk is to be copied|

### Sample usage

``` sql
CALL timescaledb_experimental.copy_chunk(‘_timescaledb_internal._dist_hyper_1_1_chunk’, ‘data_node_2’, ‘data_node_3’);
```
