---
title: Import data into TimescaleDB from .csv
excerpt: Import data into your TimescaleDB instance from an external .csv file
keywords: [migrate]
tags: [import, csv]
---

# Import data into TimescaleDB from .csv
If you have data stored in an external `.csv` file, you can import it into TimescaleDB.

## Prerequisites
Before beginning, make sure you have [installed and set up][install] TimescaleDB
within your PostgreSQL instance.

## Import data
Import data from a `csv`.

<procedure>

### Importing data

<highlight type="note">
Timescale provides an open source 
[parallel importer](https://github.com/timescale/timescaledb-parallel-copy) program,
`timescaledb-parallel-copy`, to speed up data copying. The program parallelizes
migration by using several workers to run multiple `COPY`s concurrently. It also
offers options to improve the copying experience. If you prefer not to download
`timescaledb-parallel-copy`, you can also use regular PostgreSQL `COPY`. 
</highlight>

1.  Connect to your database and create a new empty table. Use a schema that
    matches the data in your `.csv` file. In this example, the `.csv` file
    contains the columns `time`, `location`, and `temperature`.
    ```sql
    CREATE TABLE <TABLE_NAME> (
        ts        TIMESTAMPTZ           NOT NULL,
        location    TEXT                NOT NULL,
        temperature DOUBLE PRECISION    NULL
    );
    ```
1.  Convert the empty table to a hypertable using the
    [`create_hypertable`][create_hypertable] function. Replace `ts` with the
    name of the column storing time values in your table.
    ```sql
    SELECT create_hypertable('<TABLE_NAME>', 'ts')
    ```
1.  At the command line, insert data into the hypertable from your `csv`. Use
    `timescaledb-parallel-copy` to speed up migration. Adjust the number of
    workers as desired. Alternatively see the next step.
    ```bash
    timescaledb-parallel-copy --db-name <DATABASE_NAME> --table <TABLE_NAME> \
        --file <FILENAME>.csv --workers 4 --copy-options "CSV"
    ``` 
1.  **OPTIONAL** If you don't want to use `timescaledb-parallel-copy`,
    insert data into the hypertable by using PostgreSQL's native `COPY`command.
    At the command line, run:
    ```bash
    psql -d <DATABASE_NAME> -c "\COPY <TABLE_NAME> FROM <FILENAME>.csv CSV"
    ```

<highlight type="note">
Don't set the number of workers for `timescaledb-parallel-copy` higher than the
number of available CPU cores. Above that, workers compete with each other for
resources and reduce the performance improvements.
</highlight>

</procedure>

[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable
[install]: /install/latest/
[parallel importer]: https://github.com/timescale/timescaledb-parallel-copy
