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

Creates a TimescaleDB hypertable from a PostgreSQL table (replacing the latter),
partitioned on one dimension. The PostgreSQL table cannot be an already partitioned table
(declarative partitioning or inheritance). In case of a non-empty table, it is
possible to migrate the data during hypertable creation using the `migrate_data`
option, although this might take a long time and has certain limitations when
the table contains foreign key constraints (see below).

After creation, all actions, such as `ALTER TABLE`, `SELECT`, etc., still work
on the resulting hypertable.

For more information about using hypertables, including chunk size partitioning,
see the [hypertable section][hypertable-docs].

<Highlight type="note">
This reference describes the new generalized hypertable API that was introduced in TimescaleDB 2.13.
The [old interface for `create_hypertable` is also available](/api/:currentVersion:/hypertable/create_hypertable_old/).
</Highlight>

## Required arguments

|Name|Type|Description|
|-|-|-|
|`relation`|REGCLASS|Identifier of table to convert to hypertable.|
| `dimension` | DIMENSION_INFO | Dimension info object for the column to partition on. |

## Optional arguments

|Name|Type|Description|
|-|-|-|
|`create_default_indexes`|BOOLEAN|Whether to create default indexes on time/partitioning columns. Default is TRUE.|
|`if_not_exists`|BOOLEAN|Whether to print warning if table already converted to hypertable or raise exception. Default is FALSE.|
|`migrate_data`|BOOLEAN|Set to TRUE to migrate any existing data from the `relation` table to chunks in the new hypertable. A non-empty table generates an error without this option. Large tables may take significant time to migrate. Defaults to FALSE.|

## Returns

|Column|Type|Description|
|-|-|-|
|`hypertable_id`|INTEGER|ID of the hypertable in TimescaleDB.|
|`created`|BOOLEAN|TRUE if the hypertable was created, FALSE when `if_not_exists` is true and no hypertable was created.|

<Highlight type="note">
If you use `SELECT * FROM create_hypertable(...)` you get the return value
formatted as a table with column headings.
</Highlight>

The use of the `migrate_data` argument to convert a non-empty table can
lock the table for a significant amount of time, depending on how much data is
in the table. It can also run into deadlock if foreign key constraints exist to
other tables.

When converting a normal SQL table to a hypertable, pay attention to how you handle
constraints. A hypertable can contain foreign keys to normal SQL table columns,
but the reverse is not allowed. UNIQUE and PRIMARY constraints must include the
partitioning key.

The deadlock is likely to happen when concurrent transactions simultaneously try
to insert data into tables that are referenced in the foreign key constraints
and into the converting table itself. The deadlock can be prevented by manually
obtaining `SHARE ROW EXCLUSIVE` lock on the referenced tables before calling
`create_hypertable` in the same transaction, see
[PostgreSQL documentation](https://www.postgresql.org/docs/current/sql-lock.html)
for the syntax.

<Highlight type="note">
The time column in `create_hypertable` must be defined as `NOT NULL`. If this is
not already specified on table creation, `create_hypertable` automatically adds
this constraint on the table when it is executed.
</Highlight>

#### Dimension info
 
When creating a hypertable, you need to provide dimension info using
one of the [dimension builders][dimension-builders]). This is used to
specify what column to partition by and in what way to partition.

## Sample use

Convert table `conditions` to hypertable with just range partitioning on column `time`:

```sql
SELECT create_hypertable('conditions', by_range('time'));
```

Convert table `conditions` to hypertable, setting `chunk_time_interval` to 24 hours.

```sql
SELECT create_hypertable('conditions', by_range('time', 86400000000));
SELECT create_hypertable('conditions', by_range('time', INTERVAL '1 day'));
```

Convert table `conditions` to hypertable. Do not raise a warning
if `conditions` is already a hypertable:

```sql
SELECT create_hypertable('conditions', by_range('time'), if_not_exists => TRUE);
```

Time partition table `measurements` on a composite column type `report` using a
range partitioning function. Requires an immutable function that can convert the
column value into a supported column value:

```sql
CREATE TYPE report AS (reported timestamp with time zone, contents jsonb);

CREATE FUNCTION report_reported(report)
  RETURNS timestamptz
  LANGUAGE SQL
  IMMUTABLE AS
  'SELECT $1.reported';

SELECT create_hypertable('measurements', by_range('report', time_partitioning_func => 'report_reported'));
```

Time partition table `events`, on a column type `jsonb` (`event`), which has
a top level key (`started`) containing an ISO 8601 formatted timestamp:

```sql
CREATE FUNCTION event_started(jsonb)
  RETURNS timestamptz
  LANGUAGE SQL
  IMMUTABLE AS
  $func$SELECT ($1->>'started')::timestamptz$func$;

SELECT create_hypertable('events', by_range('event', time_partitioning_func => 'event_started'));
```

[create_distributed_hypertable]: /api/:currentVersion:/distributed-hypertables/create_distributed_hypertable
[hash-partitions]: /use-timescale/:currentVersion:/hypertables/about-hypertables/#hypertable-partitioning
[hypertable-docs]: /use-timescale/:currentVersion:/hypertables/
[dimension-builders]: /api/:currentVersion:/hypertable/dimension_info
[by-range]: /api/:currentVersion:/hypertable/dimension_info/#by_range
