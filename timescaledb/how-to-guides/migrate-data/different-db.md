---
title: Migrating data to TimescaleDB from a different PostgreSQL database
excerpt: How to migrate your data into TimescaleDB from a different PostgreSQL database
keywords: [data migration, PostgreSQL]
tags: [import]
---

# Migrating data to TimescaleDB from a different PostgreSQL database

You can migrate your data into TimescaleDB from a different PostgreSQL database.

<highlight type="note">
To migrate between TimescaleDB databases, for example from self-hosted
TimescaleDB to Timescale Cloud, see the [guide to migrating your TimescaleDB
database to Cloud](https://docs.timescale.com/cloud/latest/migrate-to-cloud/).
</highlight>

## Prerequisites

Before you begin, check that you have:

*   [Installed and set up TimescaleDB][install] within your PostgreSQL instance
*   Installed the PostgreSQL [`pg_dump`][pg_dump] utility
*   Installed a client for connecting to PostgreSQL. These instructions use
  `psql`, but any client works.

## Migrate your data into TimescaleDB

Migrate your data into TimescaleDB from a different PostgreSQL database.

<procedure>

### Migrating your data into TimescaleDB

1.  Copy the database schema from your source database into a backup file named
    `source_db.bak`. This file contains the SQL commands to recreate all the
    tables in your source database.

    ```bash
    pg_dump --schema-only -f source_db.bak <SOURCE_DB_NAME>
    ```

1.  Recreate these tables in your destination database by copying out of the
    `source_db.bak` file.

    ```bash
    psql -d <DESTINATION_DB_NAME> < source_db.bak
    ```

1.  Connect to your destination database.

    ```bash
    psql -d <DESTINATION_DB_NAME>
    ```

1.  Turn tables that contain time-series data into hypertables by using the
    [`create_hypertable`][create_hypertable] function. This function must be run
    on a table while it's empty. For example, for a time-series table named
    `conditions` that uses `time` as its time partitioning column, run:

    ```sql
    \SELECT create_hypertable('conditions', 'time');
    ```

1.  Copy the data from your source database table into a `.csv`.

    ```bash
    psql -d <SOURCE_DB_NAME> -c "\COPY (SELECT * FROM <TABLE_NAME>) TO <FILENAME>.csv DELIMITER ',' CSV"
    ```

    Repeat for any other tables in your database.

1.  Insert the data from the `.csv` into your destination database's
    hypertables. For detailed instructions, see the [CSV import
    guide][csv-import].

</procedure>

To learn what you can do with your hypertable data, read about common
[hypertable commands][hypertable-commands].

[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[csv-import]: /timescaledb/:currentVersion:/how-to-guides/migrate-data/import-csv/
[hypertable-commands]: /timescaledb/:currentVersion:/how-to-guides/hypertables/
[install]: /install/latest/
[pg_dump]: https://www.postgresql.org/docs/current/app-pgdump.html
