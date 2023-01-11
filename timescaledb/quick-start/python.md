---
title: "Quick Start: Python and TimescaleDB"
excerpt: Get started with TimescaleDB for a Python application
keywords: [Python]
---

import Intro from "versionContent/_partials/_quickstart-intro.md";

# Python Quick Start

<Intro />

This Quick Start Guide covers:

*   [Connect to TimescaleDB](#connect-to-timescaledb)
*   [Create a relational table](#create-a-relational-table)
*   [Create a hypertable](#create-hypertable)
*   [Insert a batch of rows into TimescaleDB](#insert-rows-into-timescaledb)
*   [Execute a query on TimescaleDB](#execute-a-query)

## Prerequisites

Before you start, make sure you have:

*   Installed TimescaleDB. For more information, see the
    [installation documentation][install].
*   Installed the `psycopg2` library. For more information, see the
    [psycopg2 documentation][psycopg2-docs].
*   <Optional />A [Python virtual environment][virtual-env].

<highlight type="cloud" header="Run all tutorials free" button="Try for free">
Your Timescale Cloud trial is completely free for you to use for the first
thirty days. This gives you enough time to complete all the tutorials and run
a few test projects of your own.
</highlight>

## Connect to TimescaleDB

FIXME

<procedure>

### Connecting to TimescaleDB

1.  Import the psycogpg2 library:

```python
import psycopg2
```

1.  Locate your TimescaleDB credentials and use them to compose a connection
   string for `psycopg2`.

    You'll need:

      *   password
      *   username
      *   host URL
      *   port
      *   database name

    Compose your connection string variable as a
    [libpq connection string][pg-libpq-string], using this format:

    ```python
    CONNECTION = "postgres://username:password@host:port/dbname"
    ```

    If you're using a hosted version of TimescaleDB, or generally require an SSL connection,
    use this version instead:

    ```python
    CONNECTION = "postgres://username:password@host:port/dbname?sslmode=require"
    ```

    Alternatively you can specify each parameter in the connection string as follows

    ```python
    CONNECTION = "dbname =tsdb user=tsdbadmin password=secret host=host.com port=5432 sslmode=require"
    ```

    <highlight type="warning">
    This method of composing a connection string is for test or development purposes only, for production purposes be sure to make sensitive details like your password, hostname, and port number environment variables.
    </highlight>

1.  Use the psycopg2 [connect function][psycopg2-connect] to create a new
   database session and create a new [cursor object][psycopg2-cursor] to
   interact with the database.

    In your `main` function, add the following lines:

    ```python
    CONNECTION = "postgres://username:password@host:port/dbname"
    def main():
        with psycopg2.connect(CONNECTION) as conn:
      cursor = conn.cursor()
            # use the cursor to interact with your database
            # cursor.execute("SELECT * FROM table")
    ```

    Alternatively, you can create a connection object and pass the object
    around as needed, like opening a cursor to perform database operations:

    ```python
    CONNECTION = "postgres://username:password@host:port/dbname"
    def main():
        conn = psycopg2.connect(CONNECTION)
        cursor = conn.cursor()
        # use the cursor to interact with your database
        cursor.execute("SELECT 'hello world'")
        print(cursor.fetchone())
    ```

</procedure>

## Create a relational table

FIXME

<procedure>

### Creating a relational table

1.  Compose a string which contains the SQL statement to create a relational
   table. This example creates a table called `sensors`, with columns `id`,
   `type` and `location`:

    ```python
    query_create_sensors_table = "CREATE TABLE sensors (id SERIAL PRIMARY KEY, type VARCHAR(50), location VARCHAR(50));"
    ```

1.  Open a cursor, execute the query you created in the previous step, and commit
   the query to make the changes persistent. Afterward, close the cursor to
   clean up:

    ```python
    cursor = conn.cursor()
    # see definition in Step 1
    cursor.execute(query_create_sensors_table)
    conn.commit()
    cursor.close()
    ```

</procedure>

## Create a hypertable

In TimescaleDB, the primary point of interaction with your data is a
[hypertable][hypertable].
It provides an abstraction of a single continuous table across all space and
time intervals. You can query it via standard SQL.

Virtually all user interactions with TimescaleDB are with hypertables. Creating
tables and indexes, altering tables, inserting data, selecting data, and most
other tasks can and should all be executed on the hypertable.

A hypertable is defined by a standard schema with column names and types, with
at least one column specifying a time value. Learn more about using hypertables
in the [API documentation][hypertable-api].

<procedure>

### Creating a hypertable

1.  Create a string variable that contains the `CREATE TABLE` SQL statement for
   your hypertable. Notice how the hypertable has the compulsory time column:

    ```python
    # create sensor data hypertable
    query_create_sensordata_table = """CREATE TABLE sensor_data (
                                               time TIMESTAMPTZ NOT NULL,
                                               sensor_id INTEGER,
                                               temperature DOUBLE PRECISION,
                                               cpu DOUBLE PRECISION,
                                               FOREIGN KEY (sensor_id) REFERENCES sensors (id)
                                               );"""
    ```

1.  Formulate a `SELECT` statement that converts the `sensor_data` table to a
   hypertable. You must specify the table name to convert to a hypertable, and
   the name of the time column as the two arguments. For more information, see
   the [`create_hypertable` docs][create-hypertable-docs]:

    ```python
    query_create_sensordata_hypertable = "SELECT create_hypertable('sensor_data', 'time');"
    ```

1.  Open a cursor with the connection, execute the statements from the previous
   steps, commit your changes, and close the cursor:

    ```python
    cursor = conn.cursor()
    cursor.execute(query_create_sensordata_table)
    cursor.execute(query_create_sensordata_hypertable)
    # commit changes to the database to make changes persistent
    conn.commit()
    cursor.close()
    ```

</procedure>

## Insert rows into TimescaleDB

FIXME

While using `psycopg2` by itself may be sufficient for you to insert rows into your
hypertable, if you need quicker performance, you can use
[pgcopy][pg-copy-docs]. To do this, install `pgcopy` [using pip][pgcopy-install] and
then add this line to your list of `import` statements:

```python
from pgcopy import CopyManager
```

<procedure>

### Inserting rows into TimescaleDB with psycopg2

1.  This example inserts a list of tuples (relational data) called `sensors`,
   into the relational table named `sensors`. Open a cursor with a connection to
   the database, use prepared statements to formulate the `INSERT` SQL
   statement, and then execute that statement:

    ```python
    sensors = [('a', 'floor'), ('a', 'ceiling'), ('b', 'floor'), ('b', 'ceiling')]
    cursor = conn.cursor()
    for sensor in sensors:
      try:
        cursor.execute("INSERT INTO sensors (type, location) VALUES (%s, %s);",
                    (sensor[0], sensor[1]))
      except (Exception, psycopg2.Error) as error:
        print(error.pgerror)
    conn.commit()
    ```

1.  <Optional />Alternatively, you can pass variables to the `cursor.execute`
   function and separate the formulation of the SQL statement, `SQL`, from the
   data being passed with it into the prepared statement, `data`:

    ```python
    SQL = "INSERT INTO sensors (type, location) VALUES (%s, %s);"
    sensors = [('a', 'floor'), ('a', 'ceiling'), ('b', 'floor'), ('b', 'ceiling')]
    cursor = conn.cursor()
    for sensor in sensors:
      try:
        data = (sensor[0], sensor[1])
        cursor.execute(SQL, data)
      except (Exception, psycopg2.Error) as error:
        print(error.pgerror)
    conn.commit()
    ```

</procedure>

<procedure>

### Inserting rows into TimescaleDB with pgcopy

1.  Generate some random sensor data using the `generate_series` function
   provided by PostgreSQL. This example inserts a total of 480 rows of data (4
   readings, every 5 minutes, for 24 hours). In your application, this would be
   the query that saves your time-series data into the hypertable:

    ```python
    # for sensors with ids 1-4
    for id in range(1, 4, 1):
        data = (id,)
        # create random data
        simulate_query = """SELECT generate_series(now() - interval '24 hour', now(), interval '5 minute') AS time,
                                   %s as sensor_id,
                                   random()*100 AS temperature,
                                   random() AS cpu
                                """
        cursor.execute(simulate_query, data)
        values = cursor.fetchall()
    ```

1.  Define the column names of the table you want to insert data into. This
   example uses the `sensor_data` hypertable created earlier. This hypertable
   consists of columns named `time`, `sensor_id`, `temperature` and `cpu`. The
   column names are defined in a list of strings called `cols`:

    ```python
    cols = ['time', 'sensor_id', 'temperature', 'cpu']
    ```

1.  Create an instance of the `pgcopy` CopyManager, `mgr`, and pass the
   connection variable, hypertable name, and list of column names. Then use the
   `copy` function of the CopyManager to insert the data into the database
   quickly using `pgcopy`.

    ```python
    mgr = CopyManager(conn, 'sensor_data', cols)
    mgr.copy(values)
    ```

1.  Commit to persist changes:

    ```python
    conn.commit()
    ```

1.  <Optional/>The full sample code to insert data into TimescaleDB using
   `pgcopy`, using the example of sensor data from four sensors:

    ```python
    # insert using pgcopy
    def fast_insert(conn):
        cursor = conn.cursor()

        # for sensors with ids 1-4
        for id in range(1, 4, 1):
            data = (id,)
            # create random data
            simulate_query = """SELECT generate_series(now() - interval '24 hour', now(), interval '5 minute') AS time,
                               %s as sensor_id,
                               random()*100 AS temperature,
                               random() AS cpu
                            """
            cursor.execute(simulate_query, data)
            values = cursor.fetchall()

            # column names of the table you're inserting into
            cols = ['time', 'sensor_id', 'temperature', 'cpu']

            # create copy manager with the target table and insert
            mgr = CopyManager(conn, 'sensor_data', cols)
            mgr.copy(values)

        # commit after all sensor data is inserted
        # could also commit after each sensor insert is done
        conn.commit()
    ```

1.  <Optional />You can also check if the insertion worked:

    ```python
    cursor.execute("SELECT * FROM sensor_data LIMIT 5;")
    print(cursor.fetchall())
    ```

</procedure>

## Execute a query

FIXME

For more complex queries than a simple `SELECT *`, you can use prepared
statements to ensure queries are executed safely against the database. For more
information about properly using placeholders in psycopg2, see the [basic module usage document][psycopg2-docs-basics].
For more information on how to execute more complex queries, see the [psycopg2 documentation][psycopg2-docs-basics]

<procedure>

### Executing a simple query

1.  Define the SQL query you'd like to run on the database. This example is a
   simple `SELECT` statement querying each row from the previously created
   `sensor_data` table.

    ```python
    query = "SELECT * FROM sensor_data;"
    ```

1.  Open a cursor from the existing database connection, `conn`, and then execute
   the query you defined:

    ```python
    cursor = conn.cursor()
    query = "SELECT * FROM sensor_data;"
    cursor.execute(query)
    ```

1.  To access all resulting rows returned by your query, use one of `pyscopg2`'s [results retrieval methods][results-retrieval-methods],
   such as `fetchall()` or `fetchmany()`. This example prints the results of the
   query, row by row. Note that the result of `fetchall()` is a list of tuples,
   so you can handle them accordingly:

    ```python
    cursor = conn.cursor()
    query = "SELECT * FROM sensor_data;"
    cursor.execute(query)
    for row in cursor.fetchall():
        print(row)
    cursor.close()
    ```

1.  <Optional />If you want a list of dictionaries instead, you can define the
   cursor using [`DictCursor`][dictcursor-docs]:

    ```python
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    ```

    Using this cursor, `cursor.fetchall()` returns a list of dictionary-like objects.

### Executing queries using prepared statements

1.  Write the query using prepared statements:

    ```python
    # query with placeholders
    cursor = conn.cursor()
    query = """
               SELECT time_bucket('5 minutes', time) AS five_min, avg(cpu)
               FROM sensor_data
               JOIN sensors ON sensors.id = sensor_data.sensor_id
               WHERE sensors.location = %s AND sensors.type = %s
               GROUP BY five_min
               ORDER BY five_min DESC;
               """
    location = "floor"
    sensor_type = "a"
    data = (location, sensor_type)
    cursor.execute(query, data)
    results = cursor.fetchall()
    ```

</procedure>

## Next steps

Now that you're able to connect, read, and write to a TimescaleDB instance from
your Python application, and generate the scaffolding necessary to build a new
application from an existing TimescaleDB instance, be sure to check out these
advanced TimescaleDB tutorials:

*   [Time Series Forecasting using TimescaleDB, R, Apache MADlib and Python][time-series-forecasting]
*   [Continuous Aggregates][continuous-aggregates]
*   [Try Other Sample Datasets][other-samples]
*   [Migrate your own Data][migrate]

[install]: /install/:currentVersion:/
[cloud-install]: <https://www.timescale.com/timescale-signup>
[continuous-aggregates]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/
[create-hypertable-docs]: /api/:currentVersion:/hypertable/create_hypertable
[dictcursor-docs]: <https://www.psycopg.org/docs/extras.html#dictionary-like-cursor>
[hypertable-api]: /api/:currentVersion:/hypertable/
[hypertable]: /timescaledb/:currentVersion:/overview/core-concepts/hypertables-and-chunks/
[migrate]: /timescaledb/:currentVersion:/how-to-guides/migrate-data/
[other-samples]: /timescaledb/:currentVersion:/tutorials/sample-datasets/
[pg-copy-docs]: <https://pgcopy.readthedocs.io/en/latest/>
[pg-libpq-string]: <https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING>
[pgcopy-install]: <https://pypi.org/project/pgcopy/>
[psycopg2-connect]: <https://www.psycopg.org/docs/module.html?highlight=connect#psycopg2.connect>
[psycopg2-cursor]: <https://www.psycopg.org/docs/connection.html?highlight=cursor#connection.cursor>
[psycopg2-docs-basics]: <https://www.psycopg.org/docs/usage.html>
[psycopg2-docs]: <https://pypi.org/project/psycopg2/>
[results-retrieval-methods]:<https://www.psycopg.org/docs/cursor.html>
[self-hosted-install]: /install/latest/self-hosted/
[time-series-forecasting]: /timescaledb/:currentVersion:/tutorials/time-series-forecast/
[virtual-env]: <https://docs.python.org/3/library/venv.html>
