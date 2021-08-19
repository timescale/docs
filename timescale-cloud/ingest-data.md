# Ingest data
There are several different ways of ingesting your data into Timescale Cloud. This section contains instructions to:
*   Bulk upload [from a `.csv` file](#bulk-upload-from-csv-files)
*   Migrate data [from an existing database][migrate-data]
*   Migrate data [from InfluxDB][migrate-influxdb]
*   Insert data
    [directly using a client driver](#insert-data-directly-using-client-driver),
    such as JDBC, ODBC, or Node.js
*   Insert data
    [directly using a message queue](#insert-data-directly-using-message-queue),
    such as Kafka

<highlight type="note">
Before you begin, make sure you have [created your Timescale Cloud
service](/create-a-service/), and can connect to it using `psql`.
</highlight>

## Procedure: Preparing your new database
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
1.  Load the `timescaledb` PostgreSQL extension:
    ```sql
    CREATE EXTENSION timescaledb;
    \dx
    ```
1.  Convert the SQL table into a hypertable:
    ```sql
    SELECT create_hypertable('conditions', 'time');
    ```

When you have successfully set up your new database, you can ingest data using
one of these methods.

## Bulk upload from CSV files
If you have a dataset stored in a `.csv` file, you can import it into an empty
TimescaleDB hypertable. You need to begin by creating the new table, before you
import the data.

<highlight type="important">
Before you begin, make sure you have
[prepared your new database](#procedure-preparing-your-new-database).
</highlight>

### Procedure: Bulk uploading from a CSV file
1.  Insert data into the new hypertable using the `timescaledb-parallel-copy`
    tool. You should already have the tool installed, but you can install it
    manually from [our GitHub repository][github-parallel-copy] if you need to.
    In this example, we are inserting the data using four workers:
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
    available CPU cores on your client machine or server, to prevent the workers
    having to compete for resources. This will help your ingest go faster.
1.  *OPTIONAL:* If you don't want to use the `timescaledb-parallel-copy` tool,
    or if you have a very small dataset, you can use the PostgreSQL `COPY`
    command instead:
    ```sql
    psql '<service_url>/new_db?sslmode=require' -c "\copy conditions FROM <example.csv> WITH (FORMAT CSV, HEADER)"
    ```

## Insert data directly using a client driver
You can use a client driver such as JDBC, Python, or Node.js, to insert data
directly into your new database. You need to have the `psycopg2` library
installed to use a client driver. You can install it from the command prompt:
```bash
pip install psycopg2
```
You can use `psycopg2` to connect to your database like this:
```bash
from psycopg2.extras
import RealDictCursor
import psycopg2
url = <service_url>
db_conn = psycopg2.connect(uri)
c = db_conn.cursor(cursor_factory=RealDictCursor)
c.execute("SELECT 1 = 1")
result = c.fetchone()
```

<highlight type="important">
Before you begin, make sure you have
[prepared your new database](#procedure-preparing-your-new-database).
</highlight>

### Procedure: Inserting data with the JDBC driver
1.  Use your package manager to install the latest PostgreSQL JDBC driver, and
    any dependencies.
1.  Log in to your MST dashboard, click the name of your service, locate
    the `CA Certificate` information, and copy it to use later.
    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/mst-cacert.png" alt="MST service details, locating the CA Certificate"/>
1.  Import the data:
    ```sql
    package pg;

    import java.sql.Connection;
    import java.sql.DriverManager;
    import java.util.Properties;

    public final class Connect {
      public static void main(String[] args) {
        Properties props = new Properties();
        props.put("jdbc.url", "jdbc:postgresql://pg-3b8d4ed6-myfirstcloudhub.aivencloud.com:20985/defaultdb");
        props.put("user", "avnadmin");
        props.put("password", "nr0dfnswz36xs9pi");
        props.put("ssl", "true");
        props.put("sslmode", "verify-ca");
        props.put("sslrootcert", "/path/to/ca.pem");

        try {
          Connection c = DriverManager.getConnection(props.getProperty("jdbc.url"), props);
          System.out.println("Success");
          c.close();
        } catch (Exception e) {
          e.printStackTrace();
        }
      }
    }
    ```

See the [PostgreSQL instructions][postgres-odbc] for using the ODBC driver.

See the [Node Code Quick Start][node-code-qs] for using Node.js.

## Insert data directly using a message queue
If you have data stored in a message queue, you can import it into your
TimescaleDB database. This section provides instructions on using the Kafka
Connect PostreSQL connector.

This connector deploys PostgreSQL change events from Kafka Connect to a runtime
service. It monitors one or more schemas in a TimescaleDB server, and writes all
change events to Kafka topics, which can then be independently consumed by one
or more clients. Kafka Connect can be distributed to provide fault tolerance,
which ensures the connectors are running and continually keeping up with changes
in the database.

You can also use the PostgreSQL connector as a library without Kafka or Kafka
Connect. This allows applications and services to directly connect to
TimescaleDB and obtain the ordered change events. In this environment, the
application must record the progress of the connector so that when it is
restarted, the connect can continue where it left off. This approach can be
useful for less critical use cases. However, for production use cases, we
recommend that you use the connector with Kafka and Kafka Connect.

See [these instructions][gh-kafkaconnector] for using the Kafka connector.


[github-parallel-copy]: https://github.com/timescale/timescaledb-parallel-copy
[migrate-data]: /timescaledb/latest/how-to-guides/migrate-data/
[migrate-influxdb]: /timescaledb/latest/how-to-guides/migrate-data/migrate-influxdb/
[postgres-odbc]: https://odbc.postgresql.org/
[node-code-qs]: /timescaledb/latest/quick-start/node/
[gh-kafkaconnector]: https://github.com/debezium/debezium/tree/master/debezium-connector-postgres
