---
title: Migrate data to TimescaleDB from the same PostgreSQL instance
excerpt: Migrate data into a TimescaleDB hypertable from a regular PostgreSQL table
keywords: [migrate, PostgreSQL]
tags: [import]
---

# Migrate data to TimescaleDB from the same PostgreSQL instance
You can migrate data into a TimescaleDB hypertable from a regular PostgreSQL
table. This method assumes that you have TimescaleDB set up in the same database
instance as your existing table. To migrate between PostgreSQL instances, see
the instructions for [migrating data from a different database][different-db].

## Prerequisites
Before beginning, make sure you have [installed and set up][install] TimescaleDB
within your PostgreSQL instance.

You also need a table with existing data. In this example, the source table is
named `old_table`. Replace the table name with your actual table name. The
example also names the destination table `new_table`, but you might want to use
a more descriptive name.

## Migrate data
Migrate your data into TimescaleDB from within the same database.

<procedure>

## Migrating data
1.  Create a new table based on your existing table. You can create your indexes
    at the same time, so you don't have to recreate them manually. Or you can
    create the table without indexes, which makes data migration faster.

    <terminal>
    
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

    </terminal>

1.  Convert the new table to a hypertable using the
    [`create_hypertable`][create_hypertable] function. Replace `ts` with the
    name of the column that holds time values in your table.
    ```sql
    SELECT create_hypertable('new_table', 'ts');
    ```
1.  Insert data from the old table to the new table.
    ```sql
    INSERT INTO new_table
      SELECT * FROM old_table;
    ```
1.  If you created your new table without indexes, recreate your indexes now.

</procedure>

## Troubleshooting
If you have unique or primary indexes on your old table, you might get an error
about indexes and partitioning. See the [hypertables and unique indexes
section][unique-indexes] section for more information.

[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[different-db]: /timescaledb/:currentVersion:/how-to-guides/migrate-data/different-db/
[install]: /install/latest/
[unique-indexes]: /timescaledb/:currentVersion:/how-to-guides/hypertables/hypertables-and-unique-indexes/
