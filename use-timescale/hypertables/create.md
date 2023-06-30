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

You can also create distributed hypertables. For more information, see the
[distributed hypertables section][create-distributed-hypertable].

## Create a hypertable

To create a hypertable, you need to create a standard PostgreSQL table, and then
convert it into a hypertable.

Hypertables are intended for time-series data, so your table needs a column that
holds time values. This can be a timestamp, date, or integer.

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
     SELECT create_hypertable('conditions', 'time');
     ```

<Highlight type="note">
If your table already has data, you can migrate the data when creating the
hypertable. Set the `migrate_data` argument to true when you call the
`create_hypertable` function. This might take a long time if you have a lot of
data. For more information about migrating data, see the
[data migration section](/use-timescale/latest/migration).
</Highlight>

</Procedure>

[create-distributed-hypertable]: /use-timescale/:currentVersion:/distributed-hypertables/create-distributed-hypertables/
[install]: /getting-started/latest/
[postgres-createtable]: https://www.postgresql.org/docs/current/sql-createtable.html
