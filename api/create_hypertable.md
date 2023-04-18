---
api_name: create_hypertable()
excerpt: Create a hypertable
topics: [hypertables]
keywords: [hypertables, create]
api:
  license: apache
  type: function
---

# create_hypertable()

Creates a TimescaleDB hypertable from a PostgreSQL table (replacing
the latter), partitioned on time and with the option to partition on
one or more other columns. The PostgreSQL table cannot
be an already partitioned table (declarative partitioning or
inheritance). In case of a non-empty table, it is possible to migrate
the data during hypertable creation using the `migrate_data` option,
although this might take a long time and has certain limitations when
the table contains foreign key constraints (see below).

After creation, all actions, such as `ALTER TABLE`, `SELECT`, etc.,
still work on the resulting hypertable.

For more information about using hypertables, including chunk size partitioning,
see the [hypertable section][hypertable-docs].

#### Required arguments

|Name|Type|Description|
|-|-|-|
|`relation`|REGCLASS|Identifier of table to convert to hypertable.|
|`time_column_name`|REGCLASS| Name of the column containing time values as well as the primary column to partition by.|

### Optional arguments

|Name|Type|Description|
|-|-|-|
|`partitioning_column`|REGCLASS|Name of an additional column to partition by. If provided, the `number_partitions` argument must also be provided.|
|`number_partitions`|INTEGER|Number of [hash partitions][hash-partitions] to use for `partitioning_column`. Must be > 0.|
|`chunk_time_interval`|INTERVAL|Event time that each chunk covers. Must be > 0. Default is 7 days.|
|`create_default_indexes`|BOOLEAN|Whether to create default indexes on time/partitioning columns. Default is TRUE.|
|`if_not_exists`|BOOLEAN|Whether to print warning if table already converted to hypertable or raise exception. Default is FALSE.|
|`partitioning_func`|REGCLASS|The function to use for calculating a value's partition.|
|`associated_schema_name`|REGCLASS|Name of the schema for internal hypertable tables. Default is `_timescaledb_internal`.|
|`associated_table_prefix`|TEXT|Prefix for internal hypertable chunk names. Default is `_hyper`.|
|`migrate_data`|BOOLEAN|Set to TRUE to migrate any existing data from the `relation` table to chunks in the new hypertable. A non-empty table generates an error without this option. Large tables may take significant time to migrate. Defaults to FALSE.|
|`time_partitioning_func`|REGCLASS| Function to convert incompatible primary time column values to compatible ones. The function must be `IMMUTABLE`.|
|`replication_factor`|INTEGER|Replication factor to use with distributed hypertable. If not provided, value is determined by the `timescaledb.hypertable_replication_factor_default` GUC. |
|`data_nodes`|ARRAY|This is the set of data nodes that are used for this table if it is distributed. This has no impact on non-distributed hypertables. If no data nodes are specified, a distributed hypertable uses all data nodes known by this instance.|
|`distributed`|BOOLEAN|Set to TRUE to create distributed hypertable. If not provided, value is determined by the `timescaledb.hypertable_distributed_default` GUC. When creating a distributed hypertable, consider using [`create_distributed_hypertable`][create_distributed_hypertable] in place of `create_hypertable`. Default is NULL. |

### Returns

|Column|Type|Description|
|-|-|-|
|`hypertable_id`|INTEGER|ID of the hypertable in TimescaleDB.|
|`schema_name`|TEXT|Schema name of the table converted to hypertable.|
|`table_name`|TEXT|Table name of the table converted to hypertable.|
|`created`|BOOLEAN|TRUE if the hypertable was created, FALSE when `if_not_exists` is true and no hypertable was created.|

<Highlight type="tip">
 If you use `SELECT * FROM create_hypertable(...)` you get the return value formatted as a table with column headings.

</Highlight>

<Highlight type="warning">
The use of the `migrate_data` argument to convert a non-empty table can
lock the table for a significant amount of time, depending on how much data is
in the table. It can also run into deadlock if foreign key constraints exist to
other tables.

If you would like finer control over index formation and other aspects of your
hypertable, [follow these migration instructions instead](/use-timescale/latest/migrate-data/).

When converting a normal SQL table to a hypertable, pay attention to how you handle
constraints. A hypertable can contain foreign keys to normal SQL table columns,
but the reverse is not allowed. UNIQUE and PRIMARY constraints must include the
partitioning key.

The deadlock is likely to happen when concurrent transactions simultaneously try
to insert data into tables that are referenced in the foreign key constraints
and into the converting table itself. The deadlock can be prevented by manually
obtaining `SHARE ROW EXCLUSIVE` lock on the referenced tables before calling
`create_hypertable` in the same transaction, see
[PostgreSQL documentation](https://www.postgresql.org/docs/current/sql-lock.html) for the syntax.
</Highlight>

#### Units

The 'time' column supports the following data types:

|Types|
|-|
|Timestamp (TIMESTAMP, TIMESTAMPTZ)|
|DATE|
|Integer (SMALLINT, INT, BIGINT)|

<Highlight type="tip">
 The type flexibility of the 'time' column allows the use
of non-time-based values as the primary chunk partitioning column, as long as
those values can increment.
</Highlight>

<Highlight type="tip">
 For incompatible data types (for example, `jsonb`) you can
specify a function to the `time_partitioning_func` argument which can extract
a compatible data type
</Highlight>

The units of `chunk_time_interval` should be set as follows:

*   For time columns having timestamp or DATE types, the
`chunk_time_interval` should be specified either as an `interval` type
or an integral value in *microseconds*.

*   For integer types, the `chunk_time_interval` **must** be set
explicitly, as the database does not otherwise understand the
semantics of what each integer value represents (a second,
millisecond, nanosecond, etc.).  So if your time column is the number
of milliseconds since the UNIX epoch, and you wish to have each chunk
cover 1 day, you should specify `chunk_time_interval => 86400000`.

In case of hash partitioning (in other words, if `number_partitions` is greater
than zero), it is possible to optionally specify a custom partitioning
function. If no custom partitioning function is specified, the default
partitioning function is used. The default partitioning function calls
PostgreSQL's internal hash function for the given type, if one
exists. Thus, a custom partitioning function can be used for value
types that do not have a native PostgreSQL hash function. A
partitioning function should take a single `anyelement` type argument
and return a positive `integer` hash value. Note that this hash value
is *not* a partition ID, but rather the inserted value's position in
the dimension's key space, which is then divided across the partitions.

<Highlight type="tip">
 The time column in `create_hypertable` must be defined as `NOT
 NULL`.  If this is not already specified on table creation,
 `create_hypertable` automatically adds this constraint on the
 table when it is executed.

</Highlight>

### Sample usage

Convert table `conditions` to hypertable with just time partitioning on column `time`:

```sql
SELECT create_hypertable('conditions', 'time');
```

Convert table `conditions` to hypertable, setting `chunk_time_interval` to 24 hours.

```sql
SELECT create_hypertable('conditions', 'time', chunk_time_interval => 86400000000);
SELECT create_hypertable('conditions', 'time', chunk_time_interval => INTERVAL '1 day');
```

Convert table `conditions` to hypertable with time partitioning on `time` and
space partitioning (4 partitions) on `location`:

```sql
SELECT create_hypertable('conditions', 'time', 'location', 4);
```

The same as above, but using a custom partitioning function:

```sql
SELECT create_hypertable('conditions', 'time', 'location', 4, partitioning_func => 'location_hash');
```

Convert table `conditions` to hypertable. Do not raise a warning
if `conditions` is already a hypertable:

```sql
SELECT create_hypertable('conditions', 'time', if_not_exists => TRUE);
```

Time partition table `measurements` on a composite column type `report` using a time partitioning function:
Requires an immutable function that can convert the column value into a supported column value:

```sql
CREATE TYPE report AS (reported timestamp with time zone, contents jsonb);

CREATE FUNCTION report_reported(report)
  RETURNS timestamptz
  LANGUAGE SQL
  IMMUTABLE AS
  'SELECT $1.reported';

SELECT create_hypertable('measurements', 'report', time_partitioning_func => 'report_reported');
```

Time partition table `events`, on a column type `jsonb` (`event`), which has
a top level key (`started`) containing an ISO 8601 formatted timestamp:

```sql
CREATE FUNCTION event_started(jsonb)
  RETURNS timestamptz
  LANGUAGE SQL
  IMMUTABLE AS
  $func$SELECT ($1->>'started')::timestamptz$func$;

SELECT create_hypertable('events', 'event', time_partitioning_func => 'event_started');
```

[create_distributed_hypertable]: /api/:currentVersion:/distributed-hypertables/create_distributed_hypertable
[hash-partitions]: /use-timescale/:currentVersion:/hypertables/about-hypertables/#hypertable-partitioning
[hypertable-docs]: /use-timescale/:currentVersion:/hypertables/
