---
title: Migrate data to Timescale from the same PostgreSQL instance
excerpt: Migrate data into a Timescale hypertable from a regular PostgreSQL table
products: [self_hosted]
keywords: [data migration, PostgreSQL]
tags: [import]
---

# Migrate data to Timescale from the same PostgreSQL instance

You can migrate data into a Timescale hypertable from a regular PostgreSQL
table. This method assumes that you have Timescale set up in the same database
instance as your existing table.

## Prerequisites

Before beginning, make sure you have [installed and set up][install] Timescale.

You also need a table with existing data. In this example, the source table is
named `old_table`. Replace the table name with your actual table name. The
example also names the destination table `new_table`, but you might want to use
a more descriptive name.

## Migrate data

Migrate your data into Timescale from within the same database.

<Procedure>

## Migrating data

1.  Create a new table based on your existing table. You can create your indexes
    at the same time, so you don't have to recreate them manually. Or you can
    create the table without indexes, which makes data migration faster.

    <Terminal>

    <tab label="With indexes">

    ```bash
    CREATE TABLE new_table (
        LIKE old_table INCLUDING DEFAULTS INCLUDING CONSTRAINTS INCLUDING INDEXES
    );
    ```

    </tab>

    <tab label="Without indexes">

    ```bash
    CREATE TABLE new_table (
        LIKE old_table INCLUDING DEFAULTS INCLUDING CONSTRAINTS EXCLUDING INDEXES
    );
    ```

    </tab>

    </Terminal>

1.  Convert the new table to a hypertable using the
    [`create_hypertable`][create_hypertable] function. Replace `ts` with the
    name of the column that holds time values in your table.

    ```sql
    SELECT create_hypertable('new_table', by_range('ts'));
    ```

    <Highlight type="note">
    The `by_range` dimension builder is an addition to TimescaleDB 2.13.
    </Highlight>

1.  Insert data from the old table to the new table.

    ```sql
    INSERT INTO new_table
      SELECT * FROM old_table;
    ```

1.  If you created your new table without indexes, recreate your indexes now.

</Procedure>

[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[install]: /getting-started/latest/
