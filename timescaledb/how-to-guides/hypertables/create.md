# Create hypertables
When you have created your database, you're ready to create your first
hypertable. Creating a hypertable is a two-step process; you need to create a
standard PostgreSQL table, and then convert it into a TimescaleDB hypertable.
The method for creating a distributed hypertable on a multi-node cluster is
similar.

## Create a hypertable
To create a hypertable, you need to create a standard PostgreSQL table, and then
convert it into a TimescaleDB hypertable.

<procedure>

### Creating a hypertable
1.  Create a standard [PostgreSQL table][postgres-createtable]:
    ```sql
    CREATE TABLE conditions (
       time        TIMESTAMPTZ       NOT NULL,
       location    TEXT              NOT NULL,
       temperature DOUBLE PRECISION  NULL,
       humidity    DOUBLE PRECISION  NULL
    );
    ```
1.  From the `psql` prompt on your new table, create the hypertable:
     ```sql
     SELECT create_hypertable('conditions', 'time');
     ```

<highlight type="note">
The `time` column used in the `create_hypertable` function supports
timestamp, date, or integer types, so you can use a parameter that is not
explicitly time-based, as long as it can increment. For example, a
monotonically increasing ID works.
</highlight>

<highlight type="note"> 
If your table has a `PRIMARY KEY` or `UNIQUE` constraint, that key or constraint
must include all columns that are used to partition your hypertable. All
TimescaleDB hypertables are partitioned by a time column, so the key or
constraint must include the time column.

It may additionally include columns that aren't partitioning columns. For more
information, see [the troubleshooting
section](https://docs.timescale.com/timescaledb/latest/how-to-guides/hypertables/create/#primary-keys-and-unique-constraints).
</highlight>

</procedure>

If you need to migrate data from an existing table to a hypertable, set the
`migrate_data` argument to `true` when you call the `create_hypertable`
function. For more information about migrating data in your hypertables, see the
[migration section][migrate-data].

## Create a distributed hypertable
When you have set up your [multi-node environment][multi-node], you can create a
distributed hypertable across your data nodes. In this example, we create a
multi-dimensional distributed hypertable across all data nodes, partitioned
along `time` and `location`. Using this partitioning configuration, data is
distributed as evenly as possible using across all attached data nodes based on
a hash of the partitioning columns, allowing concurrent and parallel execution
of a query across the data nodes.

<highlight type="important">
You must have set up your multi-node cluster before you create a distributed
hypertable. If you have not configured multi-node, creating a distributed
hypertable fails. For more information about setting up multi-node, see the
[multi-node section](https://docs.timescale.com/timescaledb/latest/how-to-guides/multinode-timescaledb/).
</highlight>

<procedure>

### Creating a distributed hypertable
1.  On the access node of your multi-node cluster, create a standard
    [PostgreSQL table][postgres-createtable]:
    ```sql
    CREATE TABLE conditions (
      time        TIMESTAMPTZ       NOT NULL,
      location    TEXT              NOT NULL,
      temperature DOUBLE PRECISION  NULL,
      humidity    DOUBLE PRECISION  NULL
    );
    ```
1.  From the `psql` prompt on your new table, create the hypertable:
     ```sql
     SELECT create_distributed_hypertable('conditions', 'time', 'location');
     ```

<highlight type="note"> 
If your table has a `PRIMARY KEY` or `UNIQUE` constraint, that key or constraint
must include all columns that are used to partition your hypertable. In this
example, the key or constraint must include `time` and `location`.

It may additionally include columns that aren't partitioning columns. For more
information, see [the troubleshooting
section](https://docs.timescale.com/timescaledb/latest/how-to-guides/hypertables/create/#primary-keys-and-unique-constraints).
</highlight>

</procedure>

## Troubleshooting

### Primary keys and unique constraints

If your `PRIMARY KEY` or `UNIQUE` constraint doesn't contain all your
partitioning columns, you get an error. Partitioning columns always include the
time column, and optionally include space-partitioning columns defined with the
`partitioning_columns` parameter of `create_hypertable`, or with the third
argument of `create_distributed_hypertable`.

For example, if you create a table with the `PRIMARY KEY (device_id, ts)`, the
`PRIMARY KEY` limits the partitioning schemes you can use:

```sql
CREATE TABLE hypertable_example(
  ts TIMESTAMPTZ,
  user_id BIGINT,
  device_id BIGINT,
  val1 FLOAT,
  val2 FLOAT,
  PRIMARY KEY (device_id, ts)
);
```

You can partition your hypertable by `ts` alone:
```sql
SELECT * FROM create_hypertable('hypertable_example', 'ts');
```

You can partition by both `ts` and `device_id`:
```sql
SELECT * FROM create_hypertable(
  'hypertable_example',
  'ts',
  'partitioning_columns' => 'device_id'
);
```

But you cannot partition by `user_id`, because it is not part of the `PRIMARY
KEY`. This does not work:
```sql
-- This gives you an error
SELECT * from create_hypertable(
  'hypertable_example',
  'ts',
  'partitioning_columns' => 'user_id'
);
```

You get the following error:

```
 ERROR: cannot create a unique index without the column "<COLUMN_NAME>" (used in
partitioning) 
```

To fix such an error, add the time column and any other partitioning columns to
your `PRIMARY KEY` or `UNIQUE` constraint. In this example, you should add the
`user_id` column.

[create-hypertable]: /api/:currentVersion/hypertable/create_hypertable/
[migrate-data]: /how-to-guides/migrate-data
[postgres-createtable]: https://www.postgresql.org/docs/current/sql-createtable.html
[multi-node]: /how-to-guides/multinode-timescaledb/
