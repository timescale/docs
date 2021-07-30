# Ingest data
There are serveral different ways of ingesting your data into Managed Service for TimescaleDB (MST). This section contains instructions to:
*   [Bulk upload from a `.csv` file][#bulk-upload-from-csv]
*   Migrate data from an existing PostgreSQL database
*   Migrate data from InfluxDB
*   Insert data directly using a client driver, such as JDBC, Python, or Node.js
*   Insert data directly using the Kafka message queue,

<highlight type="important">
Before you begin, make sure you have [created your MST service][create-service], and can connect to it using `psql`.
</highlight>

## Bulk upload from .csv file
If you have a dataset stored in a `.csv` file, you can import it into an empty
TimescaleDB hypertable. You need to begin by creating the new table, before you
import the data.

### Bulk uploading from a .csv file
1.  Use `psql` to connect to your service. You can retrieve the service URL,
    port, and login credentials from the service overview in the MST dashboard:
    ```sql
    psql -h <HOSTNAME> -p <PORT> -U <USERNAME> -W -d <DATABASE_NAME>
    ```
1.  Create a new database for your data. In this example, the new database is
    called `new_db`:
    ```sql
    CREATE DATABASE new_db;
    \c new_db;
    ```
1.  Create a new SQL table in your database. The columns you create for the
    table must match the columns in your `.csv` file. In this example, the table
    is storing weather condition data, and has columns for the timestamp,
    location, and temperature:
    ```sql
    CREATE TABLE conditions (
      time        TIMESTAMPTZ         NOT NULL,
      location    text                NOT NULL,
      temperature DOUBLE PRECISION    NULL
    );
    ```
1.  Load the `timescaledb` PostgreSQL extension:
    ```sql
    CREATE EXTENSION timescaledb;
    \dx
    ```
1.  Convert the SQL table into a hypertable:
    ```sql
    SELECT create_hypertable('conditions', 'time');
    ```
1.  Insert data into the hypertable using the `timescaledb-parallel-copy` tool.
    You should already have the tool installed, but you can install it manually
    from [our GitHub repository][github-parallel-copy] if you need to. In this
    example, we are inserting the data using four workers:
    ```sql
    timescaledb-parallel-copy
    --connection '<service_url>’
    --table conditions
    --file ~/Downloads/example.csv
    --workers 4
    --copy-options "CSV"
    --skip-header
    ```
    We recommend that you set the number of workers lower than the number of
    available CPU cores on your client machine or server, to prevent the workers having to compete for resources. This will help your ingest go faster.
1.  *OPTIONAL:* If you don't want to use the `timescaledb-parallel-copy` tool,
    or if you have a very small dataset, you can use the PostgreSQL `COPY`
    command instead:
    ```sql
    psql '<service_url>/new_db?sslmode=require' -c "\copy conditions FROM <example.csv> WITH (FORMAT CSV, HEADER)"
    ```


[create-service]: /create-a-service/
[github-parallel-copy]: https://github.com/timescale/timescaledb-parallel-copy
