# Create hypertables
When you have created your database, you're ready to create your first
hypertable. Creating a hypertable is a two-step process; you need to create a
standard PostgreSQL table, and then convert it into a TimescaleDB hypertable.
The method for creating distributed hypertable on a multi-node cluster is
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
[multi-node section][multi-node].
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

</procedure>


[migrate-data]: /how-to-guides/migrate-data
[postgres-createtable]: https://www.postgresql.org/docs/9.1/sql-createtable.html
[multi-node]: /timescaledb/:currentVersion:/how-to-guides/multinode-timescaledb/
