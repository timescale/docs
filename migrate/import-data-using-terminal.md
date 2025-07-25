---
title: Import data using the terminal
excerpt: 
products: [cloud, self_hosted]
keywords: [import]
---

import ImportPrerequisites from "versionContent/_partials/_prereqs-cloud-and-self.mdx";
import SetupConnectionString from "versionContent/_partials/_migrate_import_setup_connection_strings_parquet.mdx";

# Import data into your $SERVICE_SHORT using the terminal

You can import data into your $SERVICE_LONG using the command line. This page shows you how to import from CSV, MySQL, and Parquet.

<Tabs label="Import data using the terminal">

<Tab title="From CSV">

CSV is a file format that is widely used for data migration. This page shows you how to import data into your $SERVICE_LONG from a CSV file.

## Prerequisites

<ImportPrerequisites />

- Install [Go](https://go.dev/doc/install) v1.13 or later

- Install [timescaledb-parallel-copy][install-parallel-copy]

  [timescaledb-parallel-copy][parallel importer] improves performance for large datasets by parallelizing the import
  process. It also preserves row order and uses a round-robin approach to optimize memory management and disk operations.

  To verify your installation, run `timescaledb-parallel-copy --version`.

- Ensure that the time column in the CSV file uses the `TIMESTAMPZ` data type.

For faster data transfer, best practice is that your target $SERVICE_SHORT and the system
running the data import are in the same region.

## Import data into your $SERVICE_SHORT

To import data from a CSV file:

<Procedure>

1. **Set up your $SERVICE_SHORT connection string**

    <SetupConnectionString />

1. **Create a [hypertable][hypertable-docs] to hold your data**

    1.  Create a new empty table with a schema that is compatible with the data in your parquet file.

        For example, if your parquet file contains the columns `ts`, `location`, and `temperature` with types
        `TIMESTAMP`, `STRING`, and `DOUBLE`:

        ```sql
        psql $TARGET -c  "CREATE TABLE <TABLE_NAME> ( \
           ts          TIMESTAMPTZ         NOT NULL,  \
           location    TEXT                NOT NULL,  \
           temperature DOUBLE PRECISION    NULL  \
        );"
        ```
        If you prefer using a secure UI to the command line, use [Data mode in $CONSOLE][data-mode].

    1.  Convert the empty table to a hypertable:

        In the following command, replace `<TABLE NAME>` with the name of the table you just created, and `<COLUMN_NAME>`
        with the partitioning column in `<TABLE NAME>`.
        ```sql
        psql $TARGET -c  "SELECT create_hypertable('<TABLE_NAME>', by_range('<COLUMN_NAME>'))"
        ```

1. **Import your data**

   In the folder containing your CSV files, either:

    - Use [timescaledb-parallel-copy][install-parallel-copy]:

      ```bash
        timescaledb-parallel-copy \
        --connection $TARGET \
        --table <TABLE_NAME> \
        --file <FILE_NAME>.csv \
        --workers <NUM_WORKERS> \
        --reporting-period 30s
      ```

      For the best performances while avoiding resource competition, set `<NUM_WORKERS>` to twice the
      number of CPUs in your $SERVICE_SHORT, but less than the available CPU cores.

      For self-hosted $TIMESCALE_DB, set `$TARGET` to `host=localhost user=postgres sslmode=disable`

    - Use `psql`:

       ```bash 
       psql $TARGET
       \c <DATABASE_NAME> 
       \COPY <TABLE_NAME> FROM <FILENAME>.csv CSV"
       ```

      `psql` COPY is single-threaded, and may be slower for large datasets.

1. **Verify the data was imported correctly into your $SERVICE_SHORT**

</Procedure>

And that is it, you have imported your data from a CSV file.
    
</Tab>

<Tab title="From MySQL">

MySQL is an open-source relational database management system (RDBMS). This page shows you how to import data into your $SERVICE_LONG from a database running on MySQL version 8 or earlier.

## Prerequisites

<ImportPrerequisites />

- [Install Docker][install-docker] on your migration machine.

  This machine needs sufficient space to store the buffered changes that occur while your data is
  being copied. This space is proportional to the amount of new uncompressed data being written to
  the $SERVICE_LONG during migration. A general rule of thumb is between 100GB and 500GB.

For faster data transfer, best practice is for your source database, target $SERVICE_SHORT, and
the system running the data import are in the same region .

## Import data into your $SERVICE_SHORT

To import data from a MySQL database:

<Procedure>

1. **Set up the connection string for your target $SERVICE_SHORT**

    <SetupConnectionString />

1. **Set up the connection string for your source database**

   ```bash
   SOURCE="mysql://<mysql_username>:<mysql_password>@<mysql_host>:<mysql_port>/<mysql_database>?sslmode=require"
   ```
   where:

    - `<mysql_username>`: your MySQL username
    - `<mysql_password>`: your MySQL password
    - `<mysql_host>`: the MySQL server hostname or IP address
    - `<mysql_port>`: the MySQL server port, the default is 3306
    - `<mysql_database>`: the name of your MySQL database

1. **Import your data**

   On your data import machine, run the following command:

    ```docker
    docker run -it ghcr.io/dimitri/pgloader:latest pgloader 
    --no-ssl-cert-verification \
    "$SOURCE" \
    "$TARGET"
    ```

1. **Verify the data was imported correctly into your $SERVICE_SHORT**

</Procedure>

And that is it, you have imported your data from MySQL.
    
</Tab>

<Tab title="From Parquet">

[Apache Parquet][apache-parquet] is a free and open-source column-oriented data storage format in the
Apache Hadoop ecosystem. It provides efficient data compression and encoding schemes with
enhanced performance to handle complex data in bulk. This page shows you how to import data into your $SERVICE_LONG from a Parquet file.

## Prerequisites

<ImportPrerequisites />

- [Install DuckDB][install-duckdb] on the source machine where the Parquet file is located.
- Ensure that the time column in the Parquet file uses the `TIMESTAMP` data type.

For faster data transfer, best practice is that your target $SERVICE_SHORT and the system
running the data import are in the same region.

## Import data into your $SERVICE_SHORT

To import data from a Parquet file:

<Procedure>

1. **Set up your $SERVICE_SHORT connection string**

    <SetupConnectionString />

1. **Create a [hypertable][hypertable-docs] to hold your data**

    1.  Create a new empty table with a schema that is compatible with the data in your parquet file.

        For example, if your parquet file contains the columns `ts`, `location`, and `temperature` with types
        `TIMESTAMP`, `STRING`, and `DOUBLE`:

        ```sql
        psql $TARGET -c  "CREATE TABLE <TABLE_NAME> ( \
            ts          TIMESTAMPTZ         NOT NULL,  \
            location    TEXT                NOT NULL,  \
            temperature DOUBLE PRECISION    NULL  \
        );"
        ```
        If you prefer using a secure UI to the command line, use [Data mode in $CONSOLE][data-mode].

    1.  Convert the empty table to a hypertable:

        In the following command, replace `<TABLE NAME>` with the name of the table you just created, and `<COLUMN_NAME>`
        with the partitioning column in `<TABLE NAME>`.
        ```sql
        psql $TARGET -c  "SELECT create_hypertable('<TABLE_NAME>', by_range('<COLUMN_NAME>'))"
        ```

1. **Set up a DuckDB connection to your $SERVICE_SHORT**

    1.  In a terminal on the source machine with your Parquet files, start a new DuckDB interactive session:

        ```bash
        duckdb
        ```
    1. Connect to your $SERVICE_SHORT in your DuckDB session:

       ```bash
       ATTACH '<Paste the value of $TARGET here' AS db (type postgres);
       ```
       `$TARGET` is the connection string you used to connect to your $SERVICE_SHORT using psql.

1. **Import data from Parquet to your $SERVICE_SHORT**

    1. In DuckDB, upload the table data to your $SERVICE_SHORT
       ```bash
       COPY db.<TABLE_NAME> FROM '<FILENAME>.parquet' (FORMAT parquet);
       ```
       Where:

        - `<TABLE_NAME>`: the hypertable you created to import data to
        - `<FILENAME>`: the Parquet file to import data from

    1. Exit the DuckDB session:

        ```bash
        EXIT;
        ```

1. **Verify the data was imported correctly into your $SERVICE_SHORT**

   In your `psql` session, or using [Data mode in $CONSOLE][data-mode], view the data in <TABLE_NAME>
   ```sql
   SELECT * FROM <TABLE_NAME>;
   ```

</Procedure>

And that is it, you have imported your data from a Parquet file to your $SERVICE_LONG.

</Tab>

</Tabs>


[apache-parquet]: https://parquet.apache.org/
[apache-parquet-file-format]: https://parquet.apache.org/docs/file-format/
[data-mode]: /getting-started/:currentVersion:/run-queries-from-console/#data-mode
[hypertable-docs]: /use-timescale/:currentVersion:/hypertables/
[install-docker]: https://docs.docker.com/engine/install/
[install-duckdb]: https://duckdb.org/docs/installation/
[install-parallel-copy]: https://github.com/timescale/timescaledb-parallel-copy?tab=readme-ov-file#go
[parallel importer]: https://github.com/timescale/timescaledb-parallel-copy