---
title: Ingest data
excerpt: Ingest data into your services running in Managed Service for TimescaleDB
products: [mst]
keywords: [ingest, data migration]
tags: [JDB, ODBC, client driver, Kafka, csv]
---

# Ingest data

There are several different ways of ingesting your data into $MST_LONG. This section contains instructions to:

*   Bulk upload [from a `.csv` file][bulk-upload-from-csv-files-link]
*   Insert data
    [directly using a client driver][insert-data-directly-using-a-client-driver-link],
    such as JDBC, ODBC, or Node.js
*   Insert data
    [directly using a message queue][insert-data-directly-using-a-message-queue-link],
    such as Kafka

Before you begin, make sure you have
[created your $MST_SERVICE_LONG][create-managed-service],
and can connect to it using `psql`.

<Procedure>

## Preparing your new database

1.  Use `psql` to connect to your $MST_SERVICE_SHORT. 

    ```sql
    psql -h <HOSTNAME> -p <PORT> -U <USERNAME> -W -d <DATABASE_NAME>
    ```

    You retrieve the $MST_SERVICE_SHORT URL,
    port, and login credentials from the $MST_SERVICE_SHORT overview in the [$MST_SHORT dashboard][mst-login].

1.  Create a new database for your data. In this example, the new database is
    called `new_db`:

    ```sql
    CREATE DATABASE new_db;
    \c new_db;
    ```

1.  Create a new SQL table in your database. The columns you create for the
    table must match the columns in your source data. In this example, the table
    is storing weather condition data, and has columns for the timestamp,
    location, and temperature:

    ```sql
    CREATE TABLE conditions (
      time        TIMESTAMPTZ         NOT NULL,
      location    text                NOT NULL,
      temperature DOUBLE PRECISION    NULL
    );
    ```

1.  Load the `timescaledb` $PG extension:

    ```sql
    CREATE EXTENSION timescaledb;
    \dx
    ```

1.  Convert the SQL table into a hypertable:

    ```sql
    SELECT create_hypertable('conditions', by_range('time'));
    ```

	<Highlight type="note">
	The `by_range` dimension builder is an addition to $TIMESCALE_DB 2.13.
	</Highlight>

</Procedure>

When you have successfully set up your new database, you can ingest data using
one of these methods.

## Bulk upload from CSV files

If you have a dataset stored in a `.csv` file, you can import it into an empty
hypertable. You need to begin by creating the new table, before you
import the data.

<Highlight type="important">
Before you begin, make sure you have
[prepared your new database][procedure-preparing-your-new-database-link].
</Highlight>

<Procedure>

### Bulk uploading from a CSV file

1.  Insert data into the new hypertable using the `timescaledb-parallel-copy`
    tool. You should already have the tool installed, but you can install it
    manually from [our GitHub repository][github-parallel-copy] if you need to.
    In this example, we are inserting the data using four workers:

    ```sql
    timescaledb-parallel-copy \
    --connection '<service_url>' \
    --table conditions \
    --file ~/Downloads/example.csv \
    --workers 4 \
    --copy-options "CSV" \
    --skip-header
    ```

    We recommend that you set the number of workers lower than the number of
    available CPU cores on your client machine or server, to prevent the workers
    having to compete for resources. This helps your ingest go faster.
1.  *OPTIONAL:* If you don't want to use the `timescaledb-parallel-copy` tool,
    or if you have a very small dataset, you can use the $PG `COPY`
    command instead:

    ```sql
    psql '<service_url>/new_db?sslmode=require' -c "\copy conditions FROM <example.csv> WITH (FORMAT CSV, HEADER)"
    ```

</Procedure>

## Insert data directly using a client driver

You can use a client driver such as JDBC, Python, or Node.js, to insert data
directly into your new database.

See the [$PG instructions][postgres-odbc] for using the ODBC driver.

See the [Code Quick Starts][code-qs] for using various languages, including Python and node.js.

## Insert data directly using a message queue

If you have data stored in a message queue, you can import it into your
$MST_SERVICE_SHORT. This section provides instructions on using the Kafka
Connect $PG connector.

This connector deploys $PG change events from Kafka Connect to a runtime
service. It monitors one or more schemas in a $MST_SERVICE_LONG, and writes all
change events to Kafka topics, which can then be independently consumed by one
or more clients. Kafka Connect can be distributed to provide fault tolerance,
which ensures the connectors are running and continually keeping up with changes
in the database.

You can also use the $PG connector as a library without Kafka or Kafka
Connect. This allows applications and services to directly connect to
$MST_SHORT and obtain the ordered change events. In this environment, the
application must record the progress of the connector so that when it is
restarted, the connect can continue where it left off. This approach can be
useful for less critical use cases. However, for production use cases, we
recommend that you use the connector with Kafka and Kafka Connect.

See [these instructions][gh-kafkaconnector] for using the Kafka connector.

[code-qs]: /getting-started/:currentVersion:/start-coding-with-timescale/
[gh-kafkaconnector]: https://github.com/debezium/debezium/tree/master/debezium-connector-postgres
[github-parallel-copy]: https://github.com/timescale/timescaledb-parallel-copy
[postgres-odbc]: https://odbc.postgresql.org/
[create-managed-service]: /mst/:currentVersion:/installation-mst/
[mst-login]:https://portal.managed.timescale.com/login

[bulk-upload-from-csv-files-link]: /mst/:currentVersion:/ingest-data/#bulk-upload-from-csv-files
[insert-data-directly-using-a-client-driver-link]: /mst/:currentVersion:/ingest-data/#insert-data-directly-using-a-client-driver
[insert-data-directly-using-a-message-queue-link]: /mst/:currentVersion:/ingest-data/#insert-data-directly-using-a-message-queue
[procedure-preparing-your-new-database-link]: /mst/:currentVersion:/ingest-data/#preparing-your-new-database
