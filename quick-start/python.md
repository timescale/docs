---
title: "Quick Start: Python and TimescaleDB"
excerpt: Get started with TimescaleDB for a Python application
keywords: [Python]
---

import Intro from "versionContent/_partials/_quickstart-intro.mdx";

# Python quick start

<Intro />

This quick start guide walks you through:

*   [Connecting to TimescaleDB][connect]
*   [Creating a relational table][create-table]
*   [Creating a hypertable][create-hypertable]
*   [Inserting data][insert]
*   [Executing a query][query]

## Prerequisites

Before you start, make sure you have:

*   Installed TimescaleDB. For more information, see the
    [installation documentation][install].
*   Installed the `psycopg2` library. For more information, see the
    [psycopg2 documentation][psycopg2-docs].
*   [](#)<Optional />A [Python virtual environment][virtual-env].

## Connect to TimescaleDB

In this section, you create a connection to TimescaleDB using the `psycopg2`
library. This library is one of the most popular PostgreSQL libraries for
Python. It allows you to execute raw SQL queries efficiently and safely, and
prevents common attacks such as SQL injection.

<Procedure>

<Collapsible heading="Connecting to TimescaleDB" headingLevel={3}>

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

1.  Compose your connection string variable as a
    [libpq connection string][pg-libpq-string], using this format:

    ```python
    CONNECTION = "postgres://username:password@host:port/dbname"
    ```

    If you're using a hosted version of TimescaleDB, or generally require an SSL
    connection, use this version instead:

    ```python
    CONNECTION = "postgres://username:password@host:port/dbname?sslmode=require"
    ```

    Alternatively you can specify each parameter in the connection string as follows

    ```python
    CONNECTION = "dbname=tsdb user=tsdbadmin password=secret host=host.com port=5432 sslmode=require"
    ```

    <Highlight type="warning">
    This method of composing a connection string is for test or development
    purposes only. For production, use environment variables for sensitive
    details like your password, hostname, and port number.
    </Highlight>

1.  Use the `psycopg2` [connect function][psycopg2-connect] to create a new
    database session and create a new [cursor object][psycopg2-cursor] to
    interact with the database.

    In your `main` function, add these lines:

    ```python
    CONNECTION = "postgres://username:password@host:port/dbname"
    with psycopg2.connect(CONNECTION) as conn:
        cursor = conn.cursor()
        # use the cursor to interact with your database
        # cursor.execute("SELECT * FROM table")
    ```

    Alternatively, you can create a connection object and pass the object
    around as needed, like opening a cursor to perform database operations:

    ```python
    CONNECTION = "postgres://username:password@host:port/dbname"
    conn = psycopg2.connect(CONNECTION)
    cursor = conn.cursor()
    # use the cursor to interact with your database
    cursor.execute("SELECT 'hello world'")
    print(cursor.fetchone())
    ```

</Collapsible>

</Procedure>

## Create a relational table

In this section, you create a table called `sensors` which holds the ID, type,
and location of your fictional sensors. Additionally, you create a hypertable
called `sensor_data` which holds the measurements of those sensors. The
measurements contain the time, sensor_id, temperature reading, and CPU
percentage of the sensors.

<Procedure>

<Collapsible heading="Creating a relational table" headingLevel={3}>

1.  Compose a string which contains the SQL statement to create a relational
    table. This example creates a table called `sensors`, with columns `id`,
    `type` and `location`:

    ```python
    query_create_sensors_table = """CREATE TABLE sensors (
                                        id SERIAL PRIMARY KEY,
                                        type VARCHAR(50),
                                        location VARCHAR(50)
                                    );
                                    """
    ```

1.  Open a cursor, execute the query you created in the previous step, and
    commit the query to make the changes persistent. Afterward, close the cursor
    to clean up:

    ```python
    cursor = conn.cursor()
    # see definition in Step 1
    cursor.execute(query_create_sensors_table)
    conn.commit()
    cursor.close()
    ```

</Collapsible>

</Procedure>

## Create a hypertable

When you have created the relational table, you can create a hypertable.
Creating tables and indexes, altering tables, inserting data, selecting data,
and most other tasks are executed on the hypertable.

<Procedure>

<Collapsible heading="Creating a hypertable" headingLevel={3}>

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
                                        );
                                        """
    ```

2.  Formulate a `SELECT` statement that converts the `sensor_data` table to a
    hypertable. You must specify the table name to convert to a hypertable, and
    the name of the time column as the two arguments. For more information, see
    the [`create_hypertable` docs][create-hypertable-docs]:

    ```python
    query_create_sensordata_hypertable = "SELECT create_hypertable('sensor_data', 'time');"
    ```

3.  Open a cursor with the connection, execute the statements from the previous
    steps, commit your changes, and close the cursor:

    ```python
    cursor = conn.cursor()
    cursor.execute(query_create_sensordata_table)
    cursor.execute(query_create_sensordata_hypertable)
    # commit changes to the database to make changes persistent
    conn.commit()
    cursor.close()
    ```

</Collapsible>

</Procedure>

## Insert rows of data

You can insert data into your hypertables in several different ways. In this
section, you can use `psycopg2` with prepared statements, or you can use
`pgcopy` for a faster insert.

<Procedure>

<Collapsible heading="Inserting rows into TimescaleDB with psycopg2" headingLevel={3}>

1.  This example inserts a list of tuples, or relational data, called `sensors`,
    into the relational table named `sensors`. Open a cursor with a connection
    to the database, use prepared statements to formulate the `INSERT` SQL
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

1.  [](#)<Optional />Alternatively, you can pass variables to the `cursor.execute`
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

</Collapsible>

</Procedure>

If you choose to use `pgcopy` instead, install the `pgcopy` package
[using pip][pgcopy-install], and then add this line to your list of
`import` statements:

```python
from pgcopy import CopyManager
```

<Procedure>

<Collapsible heading="Inserting rows into TimescaleDB with pgcopy" headingLevel={3} defaultExpanded={false}>

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
                                random() AS cpu;
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

1.  [](#)<Optional/>The full sample code to insert data into TimescaleDB using
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
                                    random() AS cpu;
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

1.  [](#)<Optional />You can also check if the insertion worked:

    ```python
    cursor.execute("SELECT * FROM sensor_data LIMIT 5;")
    print(cursor.fetchall())
    ```

</Collapsible>

</Procedure>

## Execute a query

This section covers how to execute queries against your database.

The first procedure shows a simple `SELECT *` query. For more complex queries,
you can use prepared statements to ensure queries are executed safely against
the database.

For more information about properly using placeholders in `psycopg2`, see the
[basic module usage document][psycopg2-docs-basics].
For more information about how to execute more complex queries in `psycopg2`,
see the [psycopg2 documentation][psycopg2-docs-basics].

<Procedure>

<Collapsible heading="Executing a simple query" headingLevel={3}>

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

1.  To access all resulting rows returned by your query, use one of `pyscopg2`'s
    [results retrieval methods][results-retrieval-methods],
    such as `fetchall()` or `fetchmany()`. This example prints the results of
    the query, row by row. Note that the result of `fetchall()` is a list of
    tuples, so you can handle them accordingly:

    ```python
    cursor = conn.cursor()
    query = "SELECT * FROM sensor_data;"
    cursor.execute(query)
    for row in cursor.fetchall():
        print(row)
    cursor.close()
    ```

1.  [](#)<Optional />If you want a list of dictionaries instead, you can define the
    cursor using [`DictCursor`][dictcursor-docs]:

    ```python
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    ```

    Using this cursor, `cursor.fetchall()` returns a list of dictionary-like objects.

</Collapsible>

</Procedure>

For more complex queries, you can use prepared statements to ensure queries are
executed safely against the database.

<Procedure>

<Collapsible heading="Executing queries using prepared statements" headingLevel={3} defaultExpanded={false}>

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

</Collapsible>

</Procedure>

[install]: /getting-started/latest/
[create-hypertable-docs]: /api/:currentVersion:/hypertable/create_hypertable
[dictcursor-docs]: https://www.psycopg.org/docs/extras.html#dictionary-like-cursor
[pg-libpq-string]: https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING
[pgcopy-install]: https://pypi.org/project/pgcopy/
[psycopg2-connect]: https://www.psycopg.org/docs/module.html?highlight=connect#psycopg2.connect
[psycopg2-cursor]: https://www.psycopg.org/docs/connection.html?highlight=cursor#connection.cursor
[psycopg2-docs-basics]: https://www.psycopg.org/docs/usage.html
[psycopg2-docs]: https://pypi.org/project/psycopg2/
[results-retrieval-methods]:https://www.psycopg.org/docs/cursor.html
[virtual-env]: https://docs.python.org/3/library/venv.html
[connect]: #connect-to-timescaledb
[create-table]: #create-a-relational-table
[create-hypertable]: #create-hypertable
[insert]: #insert-rows-of-data
[query]: #execute-a-query
