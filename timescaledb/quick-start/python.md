---
title: "Quick Start: Python and TimescaleDB"
excerpt: Get started with TimescaleDB for a Python application
keywords: [Python]
---

# Quick Start: Python and TimescaleDB

## Goal

This quick start guide is designed to get the Python developer up
and running with TimescaleDB as their database. In this tutorial,
you'll learn how to:

*   [Connect to TimescaleDB](#connect-python-to-timescaledb)
*   [Create a relational table](#create-a-relational-table)
*   [Create a hypertable](#create-hypertable)
*   [Insert a batch of rows into TimescaleDB](#insert-rows-into-timescaledb)
*   [Execute a query on TimescaleDB](#execute-a-query)

## Prerequisites

Before you start, make sure you have:

*   At least some knowledge of SQL (structured query language). The tutorial walks you through each SQL command,
  but it is helpful if you've seen SQL before.
*   TimescaleDB installed, either in a [self-hosted environment][self-hosted-install] or [in the cloud][cloud-install]
*   The `psycopg2` library installed, [which you can install with pip][psycopg2-docs].
*   Optionally, a [Python virtual environment][virtual-env].

## Connect Python to TimescaleDB

### Step 1: Import psycopg2 library

```python
import psycopg2
```

### Step 2: Compose a connection string

Locate your TimescaleDB credentials. You need them to compose a connection string for `psycopg2`.

You'll need the following credentials:

*   password
*   username
*   host URL
*   port
*   database name

Compose your connection string variable as a [libpq connection string][pg-libpq-string],
using the following format:

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
The above method of composing a connection string is for test or development purposes only, for production purposes be sure to make sensitive details like your password, hostname, and port number environment variables.
</highlight>

### Step 3: Connect to TimescaleDB using the psycopg2 connect function

Use the psycopg2 [connect function][psycopg2-connect] to create a new database session and create
a new [cursor object][psycopg2-cursor] to interact with the database.

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

Congratulations, you've successfully connected to TimescaleDB using Python.

## Create a relational table

### Step 1: Formulate your SQL statement

First, compose a string which contains the SQL statement that you would use to create
a relational table. In the example below, we create a table called `sensors`, with
columns `id`, `type` and `location`:

```python
query_create_sensors_table = "CREATE TABLE sensors (id SERIAL PRIMARY KEY, type VARCHAR(50), location VARCHAR(50));"
```

### Step 2: Execute the SQL statement and commit changes

Next, we execute the `CREATE TABLE` statement by opening a cursor, executing the
query from Step 1 and committing the query we executed in order to make the changes persistent.
Afterward, we close the cursor to clean up:

```python
cursor = conn.cursor()
# see definition in Step 1
cursor.execute(query_create_sensors_table)
conn.commit()
cursor.close()
```

Congratulations, you've successfully created a relational table in TimescaleDB using Python.

## Create hypertable

In TimescaleDB, the primary point of interaction with your data is a [hypertable][hypertable].
It provides an abstraction of a single continuous table across all space and time
intervals. You can query it via standard SQL.

Virtually all user interactions with TimescaleDB are with hypertables. Creating tables
and indexes, altering tables, inserting data, selecting data, and most other tasks  can and should
all be executed on the hypertable.

A hypertable is defined by a standard schema with column names and types, with at
least one column specifying a time value. Learn more about using hypertables in the [API documentation][hypertable-api].

### Step 1: Formulate the CREATE TABLE SQL statement for your hypertable

First, create a string variable which houses the `CREATE TABLE` SQL statement for your
hypertable. Notice how the hypertable has the compulsory time column:

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

### Step 2: Formulate the SELECT statement to create your hypertable

Next, formulate a `SELECT` statement that converts the `sensor_data` table to a hypertable. Note that you must specify
the table name which you wish to convert to a hypertable and its time column name as the two arguments, as mandated by
the [`create_hypertable` docs][create-hypertable-docs]:

```python
query_create_sensordata_hypertable = "SELECT create_hypertable('sensor_data', 'time');"
```

### Step 3: Execute statements from Step 1 and Step 2 and commit changes

Now bring it all together by opening a cursor with our connection, executing the
statements from step 1 and step 2 and committing your changes and closing the cursor:

```python
cursor = conn.cursor()
cursor.execute(query_create_sensordata_table)
cursor.execute(query_create_sensordata_hypertable)
# commit changes to the database to make changes persistent
conn.commit()
cursor.close()
```

Congratulations, you've successfully created a hypertable in your Timescale database using Python!

## Insert rows into TimescaleDB

### How to insert rows using Psycopg2

Here's a typical pattern you'd use to insert data into a table. In the
example below, insert a list of tuples (relational data) called `sensors`, into the
relational table named `sensors`.

First, we open a cursor with our connection to the database, then using prepared
statements formulate our `INSERT` SQL statement and then execute that statement.

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

A cleaner way to pass variables to the `cursor.execute` function is to separate the formulation of our SQL
statement, `SQL`, from the data being passed with it into the prepared statement, `data`:

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

Congratulations, you've successfully inserted data into TimescaleDB using Python.

### How to insert rows fast using pgcopy

While using `psycopg2` by itself may be sufficient for you to insert rows into your
hypertable, if you need quicker performance, you can use
[pgcopy][pg-copy-docs]. To do this, install `pgcopy` [using pip][pgcopy-install] and
then add this line to your list of `import` statements:

```python
from pgcopy import CopyManager
```

<highlight type="note">
This section provides step-by-step instructions to insert rows using `pgcopy`.
The full sample code to insert data into TimescaleDB using `pgcopy`, with the
example of sensor data from four sensors, is provided in Step 3.
</highlight>

### Step 1: Get data to insert into database

First we generate random sensor data using the `generate_series` function provided by PostgreSQL.
This example inserts a total of 480 rows of data (4 readings, every 5 minutes, for 24 hours).
In your application, this would be the query that saves your time-series data into the hypertable.

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

### Step 2: Define columns of table you're inserting data into

Then we define the column names of the table we want to insert data into. In this
case, we're using the `sensor_data` hypertable that we created in the
"Generate a Hypertable" section above. This hypertable consists of the columns
named `time`, `sensor_id`, `temperature` and `cpu`. We define these column names
in a list of strings called `cols`.

```python
cols = ['time', 'sensor_id', 'temperature', 'cpu']
```

### Step 3: Instantiate a CopyManager with your target table and column definition

Lastly we create an instance of the `pgcopy` CopyManager, `mgr`, and pass our
connection variable, hypertable name, and list of column names. Then we use
the `copy` function of the CopyManager to insert the data into the database
quickly using `pgcopy`.

```python
mgr = CopyManager(conn, 'sensor_data', cols)
mgr.copy(values)
```

Finally, commit to persist changes:

```python
conn.commit()
```

Full sample code to insert data into TimescaleDB using `pgcopy`, using the example of sensor data from four sensors:

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

You can also check if the insertion worked:

```python
cursor.execute("SELECT * FROM sensor_data LIMIT 5;")
print(cursor.fetchall())
```

Congratulations, you've successfully inserted time-series data into TimescaleDB
using Python and the `pgcopy` library.

## Execute a query

### Step 1: Define your query in SQL

First, define the SQL query you'd like to run on the database. The example below
is a simple `SELECT` statement querying each row from the previously created `sensor_data` table.

```python
query = "SELECT * FROM sensor_data;"
```

### Step 2: Execute the query

Next, open a cursor from our existing database connection, `conn`,
and then execute the query you defined in Step 1:

```python
cursor = conn.cursor()
query = "SELECT * FROM sensor_data;"
cursor.execute(query)
```

### Step 3: Access results returned by the query

To access all resulting rows returned by your query, use
one of `pyscopg2`'s [results retrieval methods][results-retrieval-methods],
such as `fetchall()` or `fetchmany()`. In the example below, we're simply
printing the results of our query, row by row. Note that the result of `fetchall()`
is a list of tuples, so you can handle them accordingly:

```python
cursor = conn.cursor()
query = "SELECT * FROM sensor_data;"
cursor.execute(query)
for row in cursor.fetchall():
    print(row)
cursor.close()
```

If you want a list of dictionaries instead, you can define the cursor using [`DictCursor`][dictcursor-docs]:

```python
cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
```

Using this cursor, `cursor.fetchall()` returns a list of dictionary-like objects.

### Executing queries using prepared statements

For more complex queries than a simple `SELECT *`, we can use prepared statements
to ensure our queries are executed safely against the database. We write our
query using placeholders as shown in the sample code below. For more information about properly using placeholders
in psycopg2, see the [basic module usage document][psycopg2-docs-basics].

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

Congratulations, you've successfully executed a query on TimescaleDB using Python!
For more information on how to execute more complex queries, see the
[psycopg2 documentation][psycopg2-docs-basics]

## Next steps

Now that you're able to connect, read, and write to a TimescaleDB instance from your
Python application, and generate the scaffolding necessary to build a new application
from an existing TimescaleDB instance, be sure to check out these advanced TimescaleDB
tutorials:

*   [Time Series Forecasting using TimescaleDB, R, Apache MADlib and Python][time-series-forecasting]
*   [Continuous Aggregates][continuous-aggregates]
*   [Try Other Sample Datasets][other-samples]
*   [Migrate your own Data][migrate]

[cloud-install]: https://www.timescale.com/timescale-signup
[continuous-aggregates]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/
[create-hypertable-docs]: /api/:currentVersion:/hypertable/create_hypertable
[dictcursor-docs]: https://www.psycopg.org/docs/extras.html#dictionary-like-cursor
[hypertable-api]: /api/:currentVersion:/hypertable/
[hypertable]: /timescaledb/:currentVersion:/overview/core-concepts/hypertables-and-chunks/
[migrate]: /timescaledb/:currentVersion:/how-to-guides/migrate-data/
[other-samples]: /timescaledb/:currentVersion:/tutorials/sample-datasets/
[pg-copy-docs]: https://pgcopy.readthedocs.io/en/latest/
[pg-libpq-string]: https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING
[pgcopy-install]: https://pypi.org/project/pgcopy/
[psycopg2-connect]: https://www.psycopg.org/docs/module.html?highlight=connect#psycopg2.connect
[psycopg2-cursor]: https://www.psycopg.org/docs/connection.html?highlight=cursor#connection.cursor
[psycopg2-docs-basics]: https://www.psycopg.org/docs/usage.html
[psycopg2-docs]: https://pypi.org/project/psycopg2/
[results-retrieval-methods]:https://www.psycopg.org/docs/cursor.html
[self-hosted-install]: /install/latest/self-hosted/
[time-series-forecasting]: /timescaledb/:currentVersion:/tutorials/time-series-forecast/
[virtual-env]: https://docs.python.org/3/library/venv.html
