---
api_name: create_distributed_hypertable()
excerpt: Create a distributed hypertable in a multi-node cluster
topics: [distributed hypertables]
keywords: [distributed hypertables, multi-node, create]
tags: [cluster]
api:
  license: community
  type: function
---

# create_distributed_hypertable()  <Tag type="community">Community</Tag>

Create a TimescaleDB hypertable distributed across a multinode environment.

`create_distributed_hypertable()` replaces [`create_hypertable() (old interface)`][create-hypertable-old]. Distributed tables use the old API. The new generalized [`create_hypertable`][create-hypertable-new] API was introduced in TimescaleDB v2.13.

### Required arguments

|Name|Type| Description                                                                                  |
|---|---|----------------------------------------------------------------------------------------------|
| `relation` | REGCLASS | Identifier of the table you want to convert to a hypertable.                                 |
| `time_column_name` | TEXT | Name of the column that contains time values, as well as the primary column to partition by. |

### Optional arguments

|Name|Type|Description|
|---|---|---|
| `partitioning_column` | TEXT | Name of an additional column to partition by. |
| `number_partitions` | INTEGER | Number of hash partitions to use for `partitioning_column`. Must be > 0. Default is the number of `data_nodes`. |
| `associated_schema_name` | TEXT | Name of the schema for internal hypertable tables. Default is `_timescaledb_internal`. |
| `associated_table_prefix` | TEXT | Prefix for internal hypertable chunk names. Default is `_hyper`. |
| `chunk_time_interval` | INTERVAL | Interval in event time that each chunk covers. Must be > 0. Default is 7 days. |
| `create_default_indexes` | BOOLEAN | Boolean whether to create default indexes on time/partitioning columns. Default is TRUE. |
| `if_not_exists` | BOOLEAN | Boolean whether to print warning if table already converted to hypertable or raise exception. Default is FALSE. |
| `partitioning_func` | REGCLASS | The function to use for calculating a value's partition.|
| `migrate_data` | BOOLEAN | Set to TRUE to migrate any existing data from the `relation` table to chunks in the new hypertable. A non-empty table generates an error without this option. Large tables may take significant time to migrate. Default is FALSE. |
| `time_partitioning_func` | REGCLASS | Function to convert incompatible primary time column values to compatible ones. The function must be `IMMUTABLE`. |
| `replication_factor` | INTEGER | The number of data nodes to which the same data is written to. This is done by creating chunk copies on this amount of data nodes. Must be >= 1; If not set, the default value is determined by the `timescaledb.hypertable_replication_factor_default` GUC. Read [the best practices][best-practices] before changing the default. |
| `data_nodes` | ARRAY | The set of data nodes used for the distributed hypertable. If not present, defaults to all data nodes known by the access node (the node on which the distributed hypertable is created). |

### Returns

|Column|Type|Description|
|---|---|---|
| `hypertable_id` | INTEGER | ID of the hypertable in TimescaleDB. |
| `schema_name` | TEXT | Schema name of the table converted to hypertable. |
| `table_name` | TEXT | Table name of the table converted to hypertable. |
| `created` | BOOLEAN | TRUE if the hypertable was created, FALSE when `if_not_exists` is TRUE and no hypertable was created. |

### Sample usage

Create a table `conditions` which is partitioned across data
nodes by the 'location' column. Note that the number of space
partitions is automatically equal to the number of data nodes assigned
to this hypertable (all configured data nodes in this case, as
`data_nodes` is not specified).

```sql
SELECT create_distributed_hypertable('conditions', 'time', 'location');
```

Create a table `conditions` using a specific set of data nodes.

```sql
SELECT create_distributed_hypertable('conditions', 'time', 'location',
    data_nodes => '{ "data_node_1", "data_node_2", "data_node_4", "data_node_7" }');
```

#### Best practices

* **Hash partitions**: Best practice for distributed hypertables is to enable [hash partitions](https://www.techopedia.com/definition/31996/hash-partitioning).
  With hash partitions, incoming data is divided between the data nodes. Without hash partition, all
  data for each  time slice is written to a single data node.

* **Time intervals**: Follow the guidelines for `chunk_time_interval` defined in [`create_hypertable`]
  [create-hypertable-old].

  When you enable hash partitioning, the hypertable is evenly distributed across the data nodes. This
  means you can set a larger time interval. For example, you ingest 10 GB of data per day shared over
  five data nodes, each node has 64 GB of memory. If this is the only table being served by these data nodes, use a time interval of 1 week:

  ```
   7 days * 10 GB             70
   --------------------  ==  ---  ~= 22% of main memory used for the most recent chunks
   5 data nodes * 64 GB      320 
   ```

  If you do not enable hash partitioning, use the same `chunk_time_interval` settings as a non-distributed
  instance. This is because all incoming data is handled by a single node.

* **Replication factor**: `replication_factor` defines the number of data nodes a newly created chunk is
  replicated in. For example, when you set `replication_factor` to `3`, each chunk exists on 3 separate
  data nodes. Rows written to a chunk are inserted into all data notes in a two-phase commit protocol.

  If a data node fails or is removed, no data is lost. Writes succeed on the other data nodes. However, the
  chunks on the lost data node are now under-replicated. When the failed data node becomes available, re-balance the chunks with a call to [copy_chunk][copy_chunk].


[best-practices]: /use-timescale/:currentVersion:/hypertables/about-hypertables/#best-practices-for-time-partitioning

[create-hypertable-new]: /api/:currentVersion:/hypertable/create_hypertable/

[create-hypertable-old]: /api/:currentVersion:/hypertable/create_hypertable_old
[copy_chunk]: /api/:currentVersion://distributed-hypertables/copy_chunk_experimental/
