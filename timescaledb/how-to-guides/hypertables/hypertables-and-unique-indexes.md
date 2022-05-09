# Hypertable partitioning and unique indexes
Hypertable partitioning introduces some restrictions on unique indexes.

<highlight type="note">
This section pertains only to unique indexes, not to indexes in general. You
can create a hypertable without any unique index, though you might want one to
enforce constraints.
</highlight>

## Partitioning columns
Before you create a unique index, you need to determine what unique indexes are allowed on your
hypertable. Begin by identifying your partitioning columns.

TimescaleDB uses these columns for partitioning hypertables:
*   The time column used to create the hypertable. Every TimescaleDB hypertable
    is partitioned by time.
*   Any space-partitioning columns. Space partitions are optional and not
    included in every hypertable. You have a space-partitioning column if you
    specify a `partitioning_column` parameter when you call
    [`create_hypertable`][create_hypertable] or
    [`create_distributed_hypertable`][create_distributed_hypertable].

## Partitioning and unique indexes

<highlight type="note">
In PostgreSQL, a primary key is a unique index with a `NOT NULL` constraint.
Any information about unique indexes also applies to primary keys.
</highlight>

When you create a unique index on a hypertable, it must contain all the
partitioning columns of the hypertable. It may contain other columns as well,
and they may be arranged in any order.

This restriction is necessary to guarantee global uniqueness in the index.
<!--TODO: PR for link destination to be merged
For more information, see the section on [indexes in hypertables][local-indexes].
-->

If you don't include all the partitioning columns, you get this error:
```
 ERROR: cannot create a unique index without the column "<COLUMN_NAME>" (used in
partitioning) 
```

### Create unique indexes on a hypertable
Create a unique index as you normally would in PostgreSQL, using `CREATE UNIQUE
INDEX`. Make sure to include all partitioning columns in the index.

For example, say you create a hypertable partitioned on `time` and
`device_id`:
```sql
CREATE TABLE hypertable_example(
  time TIMESTAMPTZ,
  user_id BIGINT,
  device_id BIGINT,
  value FLOAT
);

SELECT * FROM create_hypertable(
  'hypertable_example',
  'time',
  partitioning_column => 'device_id',
  number_partitions => 4
);
```

You can create a unique index on `time` and `device_id`:
```sql
CREATE UNIQUE INDEX idx_deviceid_time
ON hypertable_example(device_id, time);
```

You can create a unique index on `time`, `user_id`, and `device_id`:
```sql
CREATE UNIQUE INDEX idx_userid_deviceid_time
ON hypertable_example(user_id, device_id, time);
```

But you cannot create a unique index without `time`, because `time` is a
partitioning column. This does not work:
```sql
-- This gives you an error
CREATE UNIQUE INDEX idx_deviceid
ON hypertable_example(device_id);
```

Fix the error by adding `device_id` to your unique index.

### Create a hypertable from a table with unique indexes
If you create a unique index on a table before turning it into a hypertable, the
same restrictions apply in reverse. You can only partition the table by columns
in your unique index.

When you create a hypertable, TimescaleDB recreates any indexes as local chunk
indexes. Thus, when you try partition a hypertable by a column that's not in
your unique index, you get the same error as you do when creating a unique index
that doesn't include all your partitioning columns:
```
 ERROR: cannot create a unique index without the column "<COLUMN_NAME>" (used in
partitioning) 
```

For example, say you create a table with a unique index on `time` and
`device_id`:
```sql
CREATE TABLE hypertable_example(
  time TIMESTAMPTZ,
  user_id BIGINT,
  device_id BIGINT,
  value FLOAT
);

CREATE UNIQUE INDEX idx_time_deviceid
ON hypertable_example(time, device_id);
```

You can turn it into a hypertable partitioned by `time` alone:
```sql
SELECT * from create_hypertable('hypertable_example', 'time');
```

You can turn it into a hypertable partitioned by `time` and `device_id`:
```sql
SELECT * FROM create_hypertable(
  'hypertable_example',
  'time',
  partitioning_column => 'device_id',
  number_partitions => 4
);
```

But you cannot turn it into a hypertable partitioned by `time` and `user_id`,
because `user_id` isn't part of the unique index. This does not work:
```sql
-- This gives you an error
SELECT * FROM create_hypertable(
  'hypertable_example',
  'time',
  partitioning_column => 'user_id',
  number_partitions => 4
);
```

Fix the error by adding `user_id` to your unique index.

[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[create_distributed_hypertable]: /api/:currentVersion:/distributed-hypertables/create_distributed_hypertable/