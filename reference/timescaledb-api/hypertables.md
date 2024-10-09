---
api_name: timescaledb_information.hypertables
excerpt: Get metadata about hypertables
topics: [information, hypertables]
keywords: [hypertables, information]
tags: [schemas, tablespaces, data nodes, dimensions]
api:
  license: apache
  type: view
---

# timescaledb_information.hypertables

Get metadata information about hypertables.

For more information about using hypertables, including chunk size partitioning,
see the [hypertable section][hypertable-docs].

### Available columns

|Name|Type|Description|
|-|-|-|
|`hypertable_schema`|TEXT|Schema name of the hypertable|
|`hypertable_name`|TEXT|Table name of the hypertable|
|`owner`|TEXT|Owner of the hypertable|
|`num_dimensions`|SMALLINT|Number of dimensions|
|`num_chunks`|BIGINT|Number of chunks|
|`compression_enabled`|BOOLEAN|Is compression enabled on the hypertable?|
|`is_distributed`|BOOLEAN|Is the hypertable distributed?|
|`replication_factor`|SMALLINT|Replication factor for a distributed hypertable|
|`data_nodes`|TEXT|Nodes on which hypertable is distributed|
|`tablespaces`|TEXT|Tablespaces attached to the hypertable |

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

[hypertable-docs]: /use-timescale/:currentVersion:/hypertables/
