## create_distributed_hypertable()

Creates a TimescaleDB hypertable distributed across a multinode
environment.  Use this function in place of [`create_hypertable`][create-hypertable].
when creating distributed hypertables.

### Required Arguments

|Name|Type|Description|
|---|---|---|
| `relation` | REGCLASS | Identifier of table to convert to hypertable. |
| `time_column_name` | TEXT | Name of the column containing time values as well as the primary column to partition by. |

### Optional Arguments

|Name|Type|Description|
|---|---|---|
| `partitioning_column` | TEXT | Name of an additional column to partition by. |
| `number_partitions` | INTEGER | Number of hash partitions to use for `partitioning_column`. Must be > 0. Default is the number of `data_nodes`. |
| `associated_schema_name` | TEXT | Name of the schema for internal hypertable tables. Default is "_timescaledb_internal". |
| `associated_table_prefix` | TEXT | Prefix for internal hypertable chunk names. Default is "_hyper". |
| `chunk_time_interval` | INTERVAL | Interval in event time that each chunk covers. Must be > 0. As of TimescaleDB v0.11.0, default is 7 days, unless adaptive chunking (DEPRECATED)  is enabled, in which case the interval starts at 1 day. For previous versions, default is 1 month. |
| `create_default_indexes` | BOOLEAN | Boolean whether to create default indexes on time/partitioning columns. Default is TRUE. |
| `if_not_exists` | BOOLEAN | Boolean whether to print warning if table already converted to hypertable or raise exception. Default is FALSE. |
| `partitioning_func` | REGCLASS | The function to use for calculating a value's partition.|
| `migrate_data` | BOOLEAN | Set to TRUE to migrate any existing data from the `relation` table to chunks in the new hypertable. A non-empty table will generate an error without this option. Large tables may take significant time to migrate. Default is FALSE. |
| `time_partitioning_func` | REGCLASS | Function to convert incompatible primary time column values to compatible ones. The function must be `IMMUTABLE`. |
| `replication_factor` | INTEGER | The number of data nodes to which the same data is written to. This is done by creating chunk copies on this amount of data nodes.  Must be >= 1; default is 1.  Read [the best practices](/distributed-hypertables/create_distributed_hypertable-best-practices) before changing the default. |
| `data_nodes` | ARRAY | The set of data nodes used for the distributed hypertable.  If not present, defaults to all data nodes known by the access node (the node on which the distributed hypertable is created). |

### Returns

|Column|Type|Description|
|---|---|---|
| `hypertable_id` | INTEGER | ID of the hypertable in TimescaleDB. |
| `schema_name` | TEXT | Schema name of the table converted to hypertable. |
| `table_name` | TEXT | Table name of the table converted to hypertable. |
| `created` | BOOLEAN | TRUE if the hypertable was created, FALSE when `if_not_exists` is TRUE and no hypertable was created. |

### Sample Usage

Create a table `conditions` which will be partitioned across data
nodes by the 'location' column.  Note that the number of space
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

#### Best Practices

**Space partitions:** As opposed to the normal
[`create_hypertable` best practices][create-hypertable],
space partitions are highly recommended for distributed hypertables.
Incoming data will be divided among data nodes based upon the space
partition (the first one if multiple space partitions have been
defined).  If there is no space partition, all the data for each time
slice will be written to a single data node.

**Time intervals:** Follow the same guideline in setting the `chunk_time_interval`
as with [`create_hypertable`][create-hypertable],
bearing in mind that the calculation needs to be based on the memory
capacity of the data nodes.  However, one additional thing to
consider, assuming space partitioning is being used, is that the
hypertable will be evenly distributed across the data nodes, allowing
a larger time interval.

For example, assume you are ingesting 10GB of data per day and you
have five data nodes, each with 64GB of memory.  If this is the only
table being served by these data nodes, then you should use a time
interval of 1 week (7 * 10GB / 5 * 64GB ~= 22% main memory used for
most recent chunks).

If space partitioning is not being used, the `chunk_time_interval`
should be the same as the non-distributed case, as all of the incoming
data will be handled by a single node.

**Replication factor:**  The hypertable's `replication_factor` defines to how
many data nodes a newly created chunk will be replicated.  That is, a chunk
with a `replication_factor` of three will exist on three separate data nodes,
and rows written to that chunk will be inserted (as part of a two-phase
commit protocol) to all three chunk copies.  For chunks replicated more
than once, if a data node fails or is removed, no data will be lost, and writes
can continue to succeed on the remaining chunk copies.  However, the chunks
present on the lost data node will now be under-replicated.  Currently, it is
not possible to restore under-replicated chunks, although this limitation will
be removed in a future release. To avoid such inconsistency, we do not yet
recommend using `replication_factor` > 1, and instead rely on physical
replication of each data node if such fault-tolerance is required.

[create-hypertable]: /timescaledb/:currentVersion:/how-to-guides/hypertables/best-practices
