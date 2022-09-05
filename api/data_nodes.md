---
api_name: timescaledb_information.data_nodes
excerpt: Get information on data nodes in a multi-node cluster
topics: [information, multi-node]
keywords: [multi-node, information]
tags: [data nodes, cluster]
api:
  license: community
  type: view
---

# timescaledb_information.data_nodes

Get information on data nodes. This function is specific to running
TimescaleDB in a multi-node setup.

### Available columns

|Name|Type|Description|
|---|---|---|
| `node_name` | TEXT | Data node name. |
| `owner` | REGCLASS | Oid of the user, who added the data node. |
| `options` | JSONB | Options used when creating the data node. |

### Sample usage

Get metadata related to data nodes.

```sql
SELECT * FROM timescaledb_information.data_nodes;

 node_name    | owner      | options                        
--------------+------------+--------------------------------
 dn1         | postgres   | {host=localhost,port=15431,dbname=test}   
 dn2         | postgres   | {host=localhost,port=15432,dbname=test} 
(2 rows)
```

## timescaledb_information.hypertables

Get metadata information about hypertables.

### Available columns

|Name|Type|Description|
|---|---|---|
| `hypertable_schema` | TEXT | Schema name of the hypertable |
| `hypertable_name` | TEXT | Table name of the hypertable |
| `owner` | TEXT | Owner of the hypertable |
| `num_dimensions` | SMALLINT | Number of dimensions |
| `num_chunks` | BIGINT | Number of chunks |
| `compression_enabled` | BOOLEAN | Is compression enabled on the hypertable?|
| `is_distributed` | BOOLEAN | Is the hypertable distributed?|
| `replication_factor` | SMALLINT | Replication factor for a distributed hypertable|
| `data_nodes` | ARRAY | Nodes on which hypertable is distributed|
| `tablespaces` | ARRAY | Tablespaces attached to the hypertable |

### Sample usage

Get information about a hypertable.

```sql
CREATE TABLE dist_table(time timestamptz, device int, temp float);
SELECT create_distributed_hypertable('dist_table', 'time', 'device', replication_factor => 2);

SELECT * FROM timescaledb_information.hypertables
  WHERE hypertable_name = 'dist_table';

-[ RECORD 1 ]-------+-----------
hypertable_schema   | public
hypertable_name     | dist_table
owner               | postgres 
num_dimensions      | 2
num_chunks          | 3
compression_enabled | f
is_distributed      | t
replication_factor  | 2
data_nodes          | {node_1, node_2}
tablespaces         | 
```
