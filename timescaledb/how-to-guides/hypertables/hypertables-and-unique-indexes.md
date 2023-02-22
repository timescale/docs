---
title: Create unique indexes on a hypertable
excerpt: How to create a unique index on a hypertable, and some limitations on unique indexes
keywords: [hypertables, unique indexes, primary keys]
---

# Create unique indexes on a hypertable

Hypertables have some restrictions on unique indexes, caused by partitioning.
When you create a unique index, it must contain all the partitioning columns of
the hypertable.

To create a unique index on a hypertable:

1.  Determine your partitioning columns
1.  Create a unique index that includes all those columns, and optionally
    additional columns

<Highlight type="note">
This section pertains only to unique indexes, not to indexes in general. You
can create a hypertable without any unique index, though you might want one to
enforce constraints.

If you have a primary key, you have a unique index. In PostgreSQL, a primary key
is a unique index with a `NOT NULL` constraint.
</Highlight>

## Determine the partitioning columns

Before you create a unique index, you need to determine what unique indexes are
allowed on your hypertable. Begin by identifying your partitioning columns.

TimescaleDB uses these columns to partition hypertables:

*   The time column used to create the hypertable. Every TimescaleDB hypertable
    is partitioned by time.
*   Any space-partitioning columns. Space partitions are optional and not
    included in every hypertable. You have a space-partitioning column if you
    specify a `partitioning_column` parameter when you call
    [`create_hypertable`][create_hypertable] or
    [`create_distributed_hypertable`][create_distributed_hypertable].

## Create a unique index on a hypertable

When you create a unique index on a hypertable, it must contain all the
partitioning columns you identified earlier. It may contain other columns as
well, and they may be arranged in any order.

<Highlight type="note">
This restriction is necessary to guarantee global uniqueness in the index.
</Highlight>

Create a unique index as you normally would in PostgreSQL, using `CREATE UNIQUE
INDEX`. Make sure to include all partitioning columns in the index. You can
include other columns as well if needed.

For example, for a hypertable named `hypertable_example`, partitioned on `time`
and `device_id`, create an index on `time` and `device_id`:

```sql
CREATE UNIQUE INDEX idx_deviceid_time
  ON hypertable_example(device_id, time);
```

You can also create a unique index on `time`, `user_id`, and `device_id`. Note
that `device_id` is not a partitioning column, but this still works:

```sql
CREATE UNIQUE INDEX idx_userid_deviceid_time
  ON hypertable_example(user_id, device_id, time);
```

<Highlight type="note">
You cannot create a unique index without `time`, because `time` is a
partitioning column. This does not work:

```sql
-- This gives you an error
CREATE UNIQUE INDEX idx_deviceid
  ON hypertable_example(device_id);
```

You get the error:

```bash
ERROR: cannot create a unique index without the column "<COLUMN_NAME>" (used in partitioning) 
```

Fix the error by adding `time` to your unique index.
</Highlight>

## Create a hypertable from a table with unique indexes

If you create a unique index on a table before turning it into a hypertable, the
same restrictions apply in reverse. You can only partition the table by columns
in your unique index.

<Procedure>

### Creating a hypertable from a table with unique indexes

1.  Create your table. For example:

    ```sql
    CREATE TABLE hypertable_example(
      time TIMESTAMPTZ,
      user_id BIGINT,
      device_id BIGINT,
      value FLOAT
    );
    ```

1.  Create a unique index on the table. In this example, the index is on
    `device_id` and `time`:

    ```sql
    CREATE UNIQUE INDEX idx_deviceid_time
      ON hypertable_example(device_id, time);
    ```

1.  Turn the table into a hypertable partitioned on `time` alone:

    ```sql
    SELECT * from create_hypertable('hypertable_example', 'time');
    ```

    Alternatively, turn the table into a hypertable partitioned on `time` and
    `device_id`:

    ```sql
    SELECT * FROM create_hypertable(
      'hypertable_example',
      'time',
      partitioning_column => 'device_id',
      number_partitions => 4
    );
    ```

</Procedure>

<Highlight type="note">
You cannot turn the table into a hypertable partitioned by `time` and `user_id`,
because `user_id` isn't part of the unique index. This doesn't work:

```sql
-- This gives you an error
SELECT * FROM create_hypertable(
  'hypertable_example',
  'time',
  partitioning_column => 'user_id',
  number_partitions => 4
);
```

You get the error:

```bash
ERROR: cannot create a unique index without the column "<COLUMN_NAME>" (used in partitioning) 
```

Note that the error arises from creating an index, not from creating a
hypertable. This happens because TimescaleDB recreates indexes after converting
a table to a hypertable.

Fix the error by adding `user_id` to your unique index.

</Highlight>

[create_distributed_hypertable]: /api/:currentVersion:/distributed-hypertables/create_distributed_hypertable/
[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
