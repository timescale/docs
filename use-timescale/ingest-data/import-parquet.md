---
title: Import data into Timescale from an Parquet file
excerpt: Import data into your Timescale instance from an external Parquet file
products: [cloud]
keywords: [data migration]
tags: [import, parquet]
---

# Import data from a Parquet file

## Prerequisites

Before you start, make sure you have:

- Checked that the parquet file schema is compatible with the table you want to import it into.
- Ensured that the time  column in the source data uses the TIMESTAMPTZ  data type.
- Install DuckDB on the source machine where the Parquet file is located. You can download 
  and install DuckDB from https://duckdb.org/docs/installation/

## Import data

Follow these steps to import data from a Parquet file:

1.  Create a new empty table: Use a schema that matches the data in your parquet file. In this example, the parquet file contains the columns ts, location, and temperature with types 
    TIMESTAMP, STRING, and DOUBLE.

    ```sql
    CREATE TABLE <TABLE_NAME> (
        ts          TIMESTAMPTZ         NOT NULL,
        location    TEXT                NOT NULL,
        temperature DOUBLE PRECISION    NULL
    );
    ```

2.  Convert the empty table to a hypertable: Use the create_hypertable function. 
    Replace <TABLE_NAME> and <COLUMN_NAME> with the name of the column storing time values in your table.

    ```sql
    SELECT create_hypertable('<TABLE_NAME>', by_range('<COLUMN_NAME>'))
    ```

3.  Start a new DuckDB interactive session. In your system's command line interface, run:

    ```bash
    duckdb
    ```

4.  In the DuckDB session, replace the following placeholders with the appropriate values 
    and execute the following commands::

    - `<TIMESCALE_DB_PASSWORD>` - Timescale service password
    - `<TIMESCALE_DB_HOST>` - Timescale service host
    - `<TIMESCALE_DB_PORT>` - Timescale service port
    - `<TABLE_NAME>` - Name of the table to import the data into
    - `<FILENAME>` - Name of the Parquet file to import
  

    ```bash
    ATTACH 'postgres://tsdbadmin:<TIMESCALE_DB_PASSWORD>@<TIMESCALE_DB_HOST>:<TIMESCALE_DB_PORT>/tsdb?sslmode=require' AS db (type postgres);
    COPY db.<TABLE_NAME> FROM '<FILENAME>.parquet' (FORMAT parquet);
    ```

5. Exit the DuckDB session:

    ```bash
    EXIT;
    ```

6. Verify the data was imported correctly:

    ```sql
    SELECT * FROM <TABLE_NAME>;
    ```
