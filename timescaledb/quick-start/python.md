# Quick Start: Python and TimescaleDB

## Goal
This quick start guide is designed to get the Python developer up
and running with TimescaleDB as their database. In this tutorial,
you’ll learn how to:

* [Connect to TimescaleDB](#new_database)
* [Create a relational table](#create_table)
* [Generate a Hypertable](/api/:currentVersion:/hypertable/create_hypertable)
* [Insert a batch of rows into your Timescale database](#insert_rows)
* [Execute a query on your Timescale database](#execute_query)

## Pre-requisites

To complete this tutorial, you will need a cursory knowledge of the Structured Query 
Language (SQL). The tutorial will walk you through each SQL command, but it will be 
helpful if you've seen SQL before.

To start, [install TimescaleDB][install-timescale]. Once your installation is complete, 
we can proceed to ingesting or creating sample data and finishing the tutorial.

You will also need:

* `psycopg2` library. See here for [installation instructions][psycopg2-docs]
* An existing Python Virtual Environment. To set one up, follow this [tutorial][virtual-env]

## Connect Python to TimescaleDB [](new_database)

### Step 1: Import needed libraries
Add the following import statements to the top of your python script:

```python
#import psycopg2
```

### Step 2: Compose a connection string

Locate your TimescaleDB credentials in order to compose a connection string for `psycopg2`
to use in order to connect to your TimescaleDB instance.

You’ll need the following credentials:

* password
* username
* host URL
* port
* database name

Next compose your connection string variable, as a [libpq connection string][pg-libpq-string],
using the following format:

```python
CONNECTION = "postgres://username:password@host:port/dbname"
```

If you’re using a hosted version of TimescaleDB, or generally require an SSL connection, 
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

### Step 3: Connect to Timescale database using the Psycopg2 connect function

We’ll use the psycopg2 [connect function][psycopg2-connect] to create a new database session

In your `main` function, add the following lines:

```python
def main():
…
	with psycopg2.connect(CONNECTION) as conn:
		#Call the function that needs the database connection
		func_1(conn)
```

Alternatively, you can create a connection object as follows and the pass that object
around as needed, like opening a cursor to perform database operations:

```python
def main():
conn = psycopg2.connect(CONNECTION)
insert_data(conn)
cur = conn.cursor()
```

Congratulations, you’ve successfully connected to TimescaleDB using Python!

## Create a relational table [](create_table)

### Step 1: Formulate your SQL statement
First, compose a string which contains the SQL state that you would use to create
a relational table. In the example below, we create a table called `sensors`, with
columns `id`, `type` and `location`:

```python
query_create_sensors_table = "CREATE TABLE sensors (id SERIAL PRIMARY KEY, type VARCHAR(50), location VARCHAR(50));"
```

### Step 2: Execute the SQL statement and commit changes
Next, we execute our `CREATE TABLE` statement by opening a cursor, executing the
query from Step 1 and committing the query we executed in order to make changes we
made to the database persistent. Afterward, we close the cursor we opened to clean
up:

```python
   cur = conn.cursor()
   #see definition in Step 1
   cur.execute(query_create_sensors_table)
   conn.commit()
   cur.close()
```

Congratulations, you’ve successfully created a relational table in TimescaleDB using Python!

## Generate hypertable [](create_hypertable)

In TimescaleDB, the primary point of interaction with your data is a [hypertable][hypertable],
the abstraction of a single continuous table across all space and time
intervals, such that one can query it via standard SQL.

Virtually all user interactions with TimescaleDB are with hypertables. Creating tables
and indexes, altering tables, inserting data, selecting data, etc. can (and should)
all be executed on the hypertable.

A hypertable is defined by a standard schema with column names and types, with at
least one column specifying a time value.


### Step 1: Formulate the CREATE TABLE SQL statement for your hypertable

First, we create a variable which houses our `CREATE TABLE` SQL statement for our
hypertable. Notice how the hypertable has the compulsory time column:

```python
  #create sensor data hypertable
   query_create_sensordata_table = """CREATE TABLE sensor_data (
                                           time TIMESTAMPTZ NOT NULL,
                                           sensor_id INTEGER,
                                           temperature DOUBLE PRECISION,
                                           cpu DOUBLE PRECISION,
                                           FOREIGN KEY (sensor_id) REFERENCES sensors (id)
                                           );"""
```

### Step 2: Formulate create hypertable SELECT statement for your hypertable
Next we formulate the `SELECT` statement to convert the table we created in Step 1
into a hypertable. Note that we must specify the table name which we wish to convert
to a hypertable and its time column name as the two arguments, as mandated by the
[`create_hypertable` docs][create-hypertable-docs]:

```python
query_create_sensordata_hypertable = "SELECT create_hypertable('sensor_data', 'time');"
```

### Step 3: Execute Statements from Step 1 and Step 2 and commit changes

Now we bring it all together by opening a cursor with our connection, executing our
statement from step 1, then executing our statement from step 2 and committing our
changes and closing the cursor:

```python
   cur = conn.cursor()
   cur.execute(query_create_sensordata_table)   
   cur.execute(query_create_sensordata_hypertable)
   #commit changes to the database to make changes persistent
   conn.commit()
   cur.close()
```

Congratulations, you’ve successfully created a hypertable in your Timescale database using Python!

## Insert rows into TimescaleDB [](insert_rows)

### How to insert rows using Psycopg2

Here’s a typical pattern you’d use to insert some data into a table. In the
example below, we insert the relational data in the array `sensors`, into the
relational table named `sensors`.

First, we open a cursor with our connection to the database, then using prepared
statements formulate our `INSERT` SQL statement and then we execute that statement,

```python
sensors = [('a','floor'),('a', 'ceiling'), ('b','floor'), ('b', 'ceiling')]
cur = conn.cursor()
for sensor in sensors:
try:
              cur.execute("INSERT INTO sensors (type, location) VALUES (%s, %s);",
           	   (sensor[0], sensor[1]))
           except (Exception, psycopg2.Error) as error:
           print(error.pgerror)
conn.commit()
```

A cleaner way to pass variables to the `cur.execute` function is below, where we
separate the formulation of our SQL statement, `SQL`, with the data being passed
with it into the prepared statement, `data`:

```python
   SQL = "INSERT INTO sensors (type, location) VALUES (%s, %s);"
   for sensor in sensors:
       try:
           data = (sensor[0], sensor[1])
           cur.execute(SQL, data)
       except (Exception, psycopg2.Error) as error:
           print(error.pgerror)
   conn.commit()
```

Congratulations, you’ve successfully inserted data into TimescaleDB using Python!

### How to insert rows fast using pgcopy

While using `psycopg2` by itself may be sufficient for you to insert rows into your
hypertable, if you need quicker performance, you can use
[pgcopy][pg-copy-docs]. To do this, install `pgcopy` using `pip3` or the like and
then add this line to your list of `import` statements:

```python
from pgcopy import CopyManager
```

Here’s some sample code which shows how to insert data into Timescale using `pgcopy`,
using the example of sensor data from four sensors:

```python
#insert using pgcopy
def fast_insert(conn):
   cur = conn.cursor()

   #for sensors with ids 1-4
   for id in range(1,4,1):
       data = (id, )
       #create random data
       simulate_query = """SELECT  generate_series(now() - interval '24 hour', now(), interval '5 minute') AS time,
       %s as sensor_id,
       random()*100 AS temperature,
       random() AS cpu
       """
       cur.execute(simulate_query, data)
       values = cur.fetchall()

       #define columns names of the table you're inserting into
       cols = ('time', 'sensor_id', 'temperature', 'cpu')

       #create copy manager with the target table and insert!
       mgr = CopyManager(conn, 'sensor_data', cols)
       mgr.copy(values)

   #commit after all sensor data is inserted
   #could also commit after each sensor insert is done
   conn.commit()

   #check if it worked
   cur.execute("SELECT * FROM sensor_data LIMIT 5;")
   print(cur.fetchall())
   cur.close()
```


### Step 1: Get data to insert into database
First we generate random sensor data - you would replace this step with funneling
in your real data from your data pipeline.

### Step 2: Define columns of table you’re inserting data into
Then we define the column names of the table we want to insert data into. In this
case, we’re using the `sensor_data` hypertable that we created in the
"Generate a Hypertable" section above. This hypertable consists of the columns
named `time`, `sensor_id`, `temperature` and `cpu`. We define these column names
in a tuple of strings called `cols`.

### Step 3: Instantiate a CopyManager with your target table and column definition
Lastly we create an instance of the `pgcopy` CopyManager, `mgr`, and pass our
connection variable, hypertable name, and tuple of column names. Then we use
the `copy` function of the CopyManager to insert the data into the database
performantly using `pgcopy` and then commit when we’re done. There is also sample
code to check if the insert worked.

Congratulations, you’ve successfully performantly inserted data into TimescaleDB
using Python and the `pgcopy` library!


## Execute a query [](execute_query)

### Step 1: Define your query in SQL
First, define the SQL query you’d like to run on the database. The example below
is a simple `SELECT` statement from our [Hello Timescale tutorial][hello-timescale-tutorial].

```python
query = "SELECT * FROM rates;"
```

### Step 2: Execute the query
Next we’ll open a cursor from our existing database connection, `conn`,
and then execute the query we defined in Step 1:

```python
cur = conn.cursor()
query = "SELECT * FROM rates;"
cur.execute(query)
```

### Step 3: Access results returned by query
To access all the resulting rows returned by your query, we’ll use
one `pyscopg2`’s [results retrieval methods][results-retrieval-methods],
such as `fetchall()` or `fetchmany()`. In the example below, we’re simply
printing the results of our query, row by row. Note the the result of `fetchall()`
is a list of tuples, so you can handle them accordingly:

```python
cur = conn.cursor()
query = "SELECT * FROM rates;"
cur.execute(query)
for i in cur.fetchall():
print(i)
cur.close()
```

### Executing queries using prepared statements
For more complex queries than a simple `SELECT *`, we can use prepared statements
to ensure our queries are executed safely against the database. We write our
query using placeholders as shown in the sample code below. For more on how to
properly use placeholders in psycopg2, see the [basic module usage document][psycopg2-docs-basics].

```python
   #query with placeholders
   cur = conn.cursor()

   query = """
   SELECT time_bucket('5 minutes', time) AS five_min, avg(cpu)
   FROM sensor_data
   JOIN sensors ON sensors.id = sensor_data.sensor_id
   WHERE sensors.location = %s AND sensors.type = %s
   GROUP BY five_min
   ORDER BY five_min DESC;
   """

   data = (location, sensor_type)
   cur.execute(query, data)
   results = cur.fetchall()
```

Congratulations, you’ve successfully executed a query on TimescaleDB using Python!
For more information on how to execute more complex queries, see the
[psycopg2 documentation][psycopg2-docs-basics]

## Next steps

Now that you’re able to connect, read, and write to a TimescaleDB instance from your
Python application, and generate the scaffolding necessary to build a new application
from an existing TimescaleDB instance, be sure to check out these advanced TimescaleDB
tutorials:

- [Time Series Forecasting using TimescaleDB, R, Apache MADlib and Python][time-series-forecasting]
- [Continuous Aggregates][continuous-aggregates]
- [Try Other Sample Datasets][other-samples]
- [Migrate your own Data][migrate]


[install-timescale]: /how-to-guides/install-timescaledb/
[setup-psql]: /getting-started/access-timescaledb/install-psql/
[install]: /how-to-guides/install-timescaledb/
[virtual-env]: https://opensource.com/article/19/6/virtual-environments-python-macos
[psycopg2-docs]: https://pypi.org/project/psycopg2/
[psycopg2-connect]: https://www.psycopg.org/docs/module.html?highlight=connect#psycopg2.connect
[pg-libpq-string]: https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING
[hello-timescale-tutorial]: https://docs.timescale.com/latest/tutorials/tutorial-hello-timescale
[results-retrieval-methods]:https://www.psycopg.org/docs/cursor.html
[create-hypertable-docs]: /api/{currentVersion/hypertables-and-chunks/create_hypertable
[psycopg2-docs-basics]: https://www.psycopg.org/docs/usage.html
[pg-copy-docs]: https://pgcopy.readthedocs.io/en/latest/
[time-series-forecasting]: /tutorials/time-series-forecast/
[continuous-aggregates]: /tutorials/continuous-aggs-tutorial
[other-samples]: /tutorials/sample-datasets/
[migrate]: /how-to-guides/migrate-data/
