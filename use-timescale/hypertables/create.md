---
title: Create hypertables
excerpt: Create a hypertable to store time-series data
products: [cloud, mst, self_hosted]
keywords: [hypertables, create]
---

# Create hypertables

After [creating a Timescale database][install], you're ready to create your
first hypertable. Creating a hypertable is a two-step process:

1.  Create a PostgreSQL table as usual
1.  Convert it to a hypertable

<Highlight type="note">
This code uses the new generalized hypertable API introduced in
TimescaleDB 2.13. The [old interface for `create_hypertable` is also
available](/api/:currentVersion:/hypertable/create_hypertable_old/).
</Highlight>

## Create a hypertable

To create a hypertable, you create a standard PostgreSQL table and then
convert it into a hypertable.

Hypertables are designed for real-time analytics and typically partitioned by columns that hold time values. These can be of the `timestamptz`, `date`, or `integer` types. While `timestamp` is also supported, best practice is to use `timestamptz` instead. [PostgreSQL timestamp](https://wiki.postgresql.org/wiki/Don't_Do_This#Don.27t_use_timestamp_.28without_time_zone.29) explains why using `timestamp` is discouraged.

<Procedure>

### Creating a hypertable

1.  Create a standard [PostgreSQL table][postgres-createtable]:

    ```sql
    CREATE TABLE conditions (
       time        TIMESTAMPTZ       NOT NULL,
       location    TEXT              NOT NULL,
       device      TEXT              NOT NULL,
       temperature DOUBLE PRECISION  NULL,
       humidity    DOUBLE PRECISION  NULL
    );
    ```

1.  Convert the table to a hypertable. Specify the name of the table you want to
    convert, and the column that holds its time values.

     ```sql
     SELECT create_hypertable('conditions', by_range('time'));
     ```

<Highlight type="note">

If your table already has data, you can migrate the data when creating the
hypertable. Set the `migrate_data` argument to true when you call the
`create_hypertable` function. This might take a long time if you have a lot of
data. For more information about migrating data, see the
[Migrate your data to Timescale Cloud][data-migration].

</Highlight>

</Procedure>

[create-distributed-hypertable]: /self-hosted/:currentVersion:/distributed-hypertables/create-distributed-hypertables/
[install]: /getting-started/:currentVersion:/
[postgres-createtable]: https://www.postgresql.org/docs/current/sql-createtable.html
[postgresql-timestamp]: https://wiki.postgresql.org/wiki/Don't_Do_This#Don.27t_use_timestamp_.28without_time_zone.29
[data-migration]: /migrate/:currentVersion:/
