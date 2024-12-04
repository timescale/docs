---
title: Create hypertables
excerpt: Create a hypertable to store time-series data
products: [cloud, mst, self_hosted]
keywords: [hypertables, create]
---

# Create hypertables


Hypertables are designed for real-time analytics, they are PostgreSQL tables that automatically partition your data by 
time. Typically, you partition hypertables on columns that hold time values. These partitioning columns can be of 
the `timestamptz`, `date`, or `integer` types. While `timestamp` is also supported, 
[best practice is to use `timestamptz`][timestamps-best-practice].

This code uses the best practice [`create_hypertable`][api-create-hypertable] API introduced in TimescaleDB 2.13. 
You can also use the [old interface](/api/:currentVersion:/hypertable/create_hypertable_old/).


## Create a hypertable

After you have [created a Timescale Cloud service][install], you're ready to create your first hypertable:

<Procedure>

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

1.  [Convert the table to a hypertable][api-create-hypertable]. 

    Specify the name of the table to convert and the column that holds its time values. For example:

     ```sql
     SELECT create_hypertable('conditions', by_range('time'));
     ```

<Highlight type="note">

If your table already has data, set [`migrate_data` to `true`][api-create-hypertable-arguments] when 
you create the hypertable.

However, if you have a lot of data, this may take a long time. For more information about migrating data, see 
[Migrate your data to Timescale Cloud][data-migration].

</Highlight>

</Procedure>

[install]: /getting-started/:currentVersion:/
[postgres-createtable]: https://www.postgresql.org/docs/current/sql-createtable.html
[postgresql-timestamp]: https://wiki.postgresql.org/wiki/Don't_Do_This#Don.27t_use_timestamp_.28without_time_zone.29
[data-migration]: /migrate/:currentVersion:/
[api-create-hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[api-create-hypertable-arguments]: /api/:currentVersion:/hypertable/create_hypertable/#arguments
[timestamps-best-practice]: https://wiki.postgresql.org/wiki/Don't_Do_This#Don.27t_use_timestamp_.28without_time_zone.29
