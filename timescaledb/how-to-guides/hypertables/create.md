---
title: Create hypertables
excerpt: Create a hypertable to store time-series data
keywords: [hypertables, create]
---

# Create hypertables
After [creating a TimescaleDB database][install], you're ready to create your
first hypertable. Creating a hypertable is a 2-step process:
1.  Create a PostgreSQL table as usual
2.  Convert it to a TimescaleDB hypertable

You can [create a distributed hypertable][create-distributed-hypertable]
similarly.

## Create a hypertable
To create a hypertable, you need to create a standard PostgreSQL table, and then
convert it into a TimescaleDB hypertable.

Hypertables are intended for time-series data, so your table needs a column that
holds time values. This can be a timestamp, date, or integer.

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
1.  Convert the table to a hypertable. Specify the name of the table you want to
    convert, and the column that holds its time values.
     ```sql
     SELECT create_hypertable('conditions', 'time');
     ```

<highlight type="note">
If your table already has data, you can migrate the data when creating the
hypertable. Set the `migrate_data` argument to true when you call the
`create_hypertable` function. This might take a long time if you have a lot of
data. To learn other ways of migrating data, see the [migration
section](/timescaledb/latest/how-to-guides/migrate-data).
</highlight>

</procedure>

[create-distributed-hypertable]: /timescaledb/:currentVersion:/how-to-guides/distributed-hypertables/create-distributed-hypertables/
[install]: /install/:currentVersion:/
[postgres-createtable]: https://www.postgresql.org/docs/current/sql-createtable.html
