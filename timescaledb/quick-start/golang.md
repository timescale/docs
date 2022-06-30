# Quick Start: Go and TimescaleDB

## Goal
This quick start guide is designed to get the Golang developer up
and running with TimescaleDB as their database. In this tutorial,
you'll learn how to:

* [Connect to TimescaleDB](#connect-to-database)
* [Create a relational table](#create-a-table)
* [Generate a Hypertable](/api/:currentVersion:/hypertable/create_hypertable)
* [Insert a batch of rows into your Timescale database](#insert-a-batch-of-rows-into-your-timescale-database)
* [Execute a query on your Timescale database](#execute-a-query-on-your-timescale=database)

## Prerequisites
To complete this tutorial, you need a cursory knowledge of the Structured Query
Language (SQL). The tutorial walks you through each SQL command, but it is
helpful if you've seen SQL before.

To start, [install TimescaleDB][timescaledb-install]. Once your installation is complete,
we can proceed to ingesting or creating sample data and finishing the tutorial.

You also need:
* Go installed on your machine. ([Install instructions][golang-install])
* The [PGX driver][pgx-driver-github] for Go

## Connect to database

Locate your TimescaleDB credentials in order to compose a connection string for
PGX to use in order to connect to your TimescaleDB instance.

You'll need the following credentials:
* password
* username
* host URL
* port number
* database name

Next, compose your connection string variable, as a [libpq connection string][libpq-docs],
using the following format:

```go
connStr := "postgres://username:password@host:port/dbname"
```

If you're using a hosted version of TimescaleDB, or generally require an SSL
connection, use this version instead:

```go
connStr := "postgres://username:password@host:port/dbname?sslmode=require"
```

### Creating a single connection to your database

Here's a hello world program that you can run to ensure you're connected
to your database

```go
package main

import (
   "context"
   "fmt"
   "os"

   "github.com/jackc/pgx/v4"
)

//connect to database using a single connection
func main() {
    /***********************************************/
   /* Single Connection to TimescaleDB/ PostresQL */
   /***********************************************/
   ctx := context.Background()
   connStr := "yourConnectionStringHere"
   conn, err := pgx.Connect(ctx, connStr)
   if err != nil {
       fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
       os.Exit(1)
   }
   defer conn.Close(ctx)

//run a simple query to check our connection
   var greeting string
   err = conn.QueryRow(ctx, "select 'Hello, Timescale!'").Scan(&greeting)
   if err != nil {
       fmt.Fprintf(os.Stderr, "QueryRow failed: %v\n", err)
       os.Exit(1)
   }

   fmt.Println(greeting)
}
```

If you'd like to specify your connection string as an environment variable,
you can use the following syntax to access it in place of the variable
`connStr` above:

```os.Getenv("DATABASE_CONNECTION_STRING")```


### Using a connection pool (for multiple connections)

Connection pooling is useful to ensure you don't waste resources and can
lead to faster queries on your database.

To create a connection pool that can be used for concurrent connections to
your database, use the `pgxpool.Connect()` function instead of `pgx.Connect()`
as used in the example program below. Also note the import
of `github.com/jackc/pgx/v4/pgxpool`, rather than `pgx/v4` which was
used to create a single connection.

```go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v4/pgxpool"
)

func main() {

   ctx := context.Background()
   connStr := "yourConnectionStringHere"
   dbpool, err := pgxpool.Connect(ctx, connStr)
   if err != nil {
       fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
       os.Exit(1)
   }
   defer dbpool.Close()

   //run a simple query to check our connection
   var greeting string
   err = dbpool.QueryRow(ctx, "select 'Hello, Timescale (but concurrently)'").Scan(&greeting)
   if err != nil {
       fmt.Fprintf(os.Stderr, "QueryRow failed: %v\n", err)
       os.Exit(1)
   }

   fmt.Println(greeting)
}
```

Congratulations, you've successfully connected to TimescaleDB using Go.

## Create a table

Note: For the rest of this tutorial, you use a connection pool, since
having concurrent connections is the most common use case.

### Step 1: Formulate your SQL statement

First, compose a string which contains the SQL state that you would use
to create a relational table. In the example below, we create a table
called sensors, with columns id, type and location:

```go
queryCreateTable := `CREATE TABLE sensors (id SERIAL PRIMARY KEY, type VARCHAR(50), location VARCHAR(50));`

```

### Step 2: Execute the SQL statement and commit changes

Next, we execute our CREATE TABLE statement by calling the `Exec()` function on
the dbpool object, using the arguments of the current context and our statement
string, `queryCreateTable` formulated in step 1.

```go
package main

import (
   "context"
   "fmt"
   "os"

   "github.com/jackc/pgx/v4"
   "github.com/jackc/pgx/v4/pgxpool"
)

func main() {

   ctx := context.Background()
   connStr := "yourConnectionStringHere"
   dbpool, err := pgxpool.Connect(ctx, connStr)
   if err != nil {
       fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
       os.Exit(1)
   }
   defer dbpool.Close()

   /********************************************/
   /* Create relational table                      */
   /********************************************/

   //Create relational table called sensors
   queryCreateTable := `CREATE TABLE sensors (id SERIAL PRIMARY KEY, type VARCHAR(50), location VARCHAR(50));`
   _, err = dbpool.Exec(ctx, queryCreateTable)
   if err != nil {
       fmt.Fprintf(os.Stderr, "Unable to create SENSORS table: %v\n", err)
       os.Exit(1)
   }
   fmt.Println("Successfully created relational table SENSORS")

}
```

## Generate a hypertable

In TimescaleDB, the primary point of interaction with your data is
a hypertable, the abstraction of a single continuous table across all
space and time intervals, such that one can query it via standard SQL.

Virtually all user interactions with TimescaleDB are with hypertables.
Creating tables and indexes, altering tables, inserting data, selecting
data, etc. can (and should) all be executed on the hypertable.

A hypertable is defined by a standard schema with column names and
types, with at least one column specifying a time value.

### Step 1: Formulate CREATE TABLE SQL Statements for hypertable

First, we create a variable which houses our `CREATE TABLE SQL` statement
for our hypertable. Notice how the hypertable has the compulsory time column:

Second, we formulate the SELECT statement to convert the table created
into a hypertable. Note that we must specify the table name which we
wish to convert to a hypertable and its time column name as the two
arguments, as mandated by the [create_hypertable docs][hypertable-docs]:

```go
queryCreateHypertable := `CREATE TABLE sensor_data (
       time TIMESTAMPTZ NOT NULL,
       sensor_id INTEGER,
       temperature DOUBLE PRECISION,
       cpu DOUBLE PRECISION,
       FOREIGN KEY (sensor_id) REFERENCES sensors (id)
       );
       SELECT create_hypertable('sensor_data', 'time');       
       `
```

### Step 2: Execute SQL statement using .Exec()

Next, we execute our `CREATE TABLE` statement and `SELECT` statement which
converts the table created into a hypertable. We do this by calling
the `Exec()` function on the dbpool object, using the arguments of the
current context and our statement string `queryCreateHypertable` formulated
in step 1 above.

```go
package main

import (
   "context"
   "fmt"
   "os"

   "github.com/jackc/pgx/v4"
   "github.com/jackc/pgx/v4/pgxpool"
)

func main() {

   ctx := context.Background()
   connStr := "yourConnectionStringHere"
   dbpool, err := pgxpool.Connect(ctx, connStr)
   if err != nil {
       fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
       os.Exit(1)
   }
   defer dbpool.Close()

   /********************************************/
   /* Create Hypertable                        */
   /********************************************/
   // Create hypertable of time-series data called sensor_data

   //formulate statement
   queryCreateHypertable := `CREATE TABLE sensor_data (
           time TIMESTAMPTZ NOT NULL,
           sensor_id INTEGER,
           temperature DOUBLE PRECISION,
           cpu DOUBLE PRECISION,
           FOREIGN KEY (sensor_id) REFERENCES sensors (id)
           );
           SELECT create_hypertable('sensor_data', 'time');
           `

   //execute statement
   _, err = dbpool.Exec(ctx, queryCreateHypertable)
   if err != nil {
       fmt.Fprintf(os.Stderr, "Unable to create SENSOR_DATA hypertable: %v\n", err)
       os.Exit(1)
   }

   fmt.Println("Successfully created hypertable SENSOR_DATA")

}
```

Congratulations, you've successfully created a hypertable in your Timescale database using Go.

## Insert a row into your Timescale database

Here's a typical pattern you'd use to insert some data into a table. In the
example below, we insert the relational data from the two arrays, `sensorTypes`
and `sensorLocations`, into the relational table named `sensors`.

First, we open a connection pool to the database, then using prepared statements
formulate our `INSERT` SQL statement and then we execute that statement:

```go
package main

import (
   "context"
   "fmt"
   "os"

   "github.com/jackc/pgx/v4"
   "github.com/jackc/pgx/v4/pgxpool"
)

func main() {
   ctx := context.Background()
   connStr := "yourConnectionStringHere"
   dbpool, err := pgxpool.Connect(ctx, connStr)
   if err != nil {
       fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
       os.Exit(1)
   }
   defer dbpool.Close()

   /********************************************/
   /* INSERT into  relational table            */
   /********************************************/
   //Insert data into relational table

   // Slices of sample data to insert
   // observation i has type sensorTypes[i] and location sensorLocations[i]
   sensorTypes := []string{"a", "a", "b", "b"}
   sensorLocations := []string{"floor", "ceiling", "floor", "ceiling"}

   for i := range sensorTypes {
       //INSERT statement in SQL
       queryInsertMetadata := `INSERT INTO sensors (type, location) VALUES ($1, $2);`

       //Execute INSERT command
       _, err := dbpool.Exec(ctx, queryInsertMetadata, sensorTypes[i], sensorLocations[i])
       if err != nil {
           fmt.Fprintf(os.Stderr, "Unable to insert data into database: %v\n", err)
           os.Exit(1)
       }
       fmt.Printf("Inserted sensor (%s, %s) into database \n", sensorTypes[i], sensorLocations[i])

   }
   fmt.Println("Successfully inserted all sensors into database")

}
```

## Insert a batch of rows into your Timescale database

We can insert a batch of rows into TimescaleDB in a couple of different
ways. First, let's see what it looks like to insert a number of rows,
but one at a time.

### Step 0: Generate sample time-series data to insert

For simplicity's sake, we'll use PostgreSQL to generate some sample time-series
data in order to insert into the `sensor_data` hypertable. To do this, we define
the SQL statement to generate the data, called `queryDataGeneration`. Then we
use the `.Query()` function to execute the statement and return our sample data.

Then we store the data returned by our query in `results`, a slice of structs,
which is then used as a source to insert data into our hypertable.

```go
   // Generate data to insert

   //SQL query to generate sample data
   queryDataGeneration := `
       SELECT generate_series(now() - interval '24 hour', now(), interval '5 minute') AS time,
       floor(random() * (3) + 1)::int as sensor_id,
       random()*100 AS temperature,
       random() AS cpu
       `
   //Execute query to generate samples for sensor_data hypertable
   rows, err := dbpool.Query(ctx, queryDataGeneration)
   if err != nil {
       fmt.Fprintf(os.Stderr, "Unable to generate sensor data: %v\n", err)
       os.Exit(1)
   }
   defer rows.Close()
   fmt.Println("Successfully generated sensor data")

   //Store data generated in slice results
   type result struct {
       Time        time.Time
       SensorId    int
       Temperature float64
       CPU         float64
   }
   var results []result
   for rows.Next() {
       var r result
       err = rows.Scan(&r.Time, &r.SensorId, &r.Temperature, &r.CPU)
       if err != nil {
           fmt.Fprintf(os.Stderr, "Unable to scan %v\n", err)
           os.Exit(1)
       }
       results = append(results, r)
   }
   // Any errors encountered by rows.Next or rows.Scan are returned here
   if rows.Err() != nil {
       fmt.Fprintf(os.Stderr, "rows Error: %v\n", rows.Err())
       os.Exit(1)
   }

   // Check contents of results slice
   fmt.Println("Contents of RESULTS slice")
   for i := range results {
       var r result
       r = results[i]
       fmt.Printf("Time: %s | ID: %d | Temperature: %f | CPU: %f |\n", &r.Time, r.SensorId, r.Temperature, r.CPU)
   }
```

### Step 1: Formulate INSERT SQL statement

First we formulate a SQL insert statement for the sensor_data hypertable.

```go
//SQL query to generate sample data
   queryInsertTimeseriesData := `
   INSERT INTO sensor_data (time, sensor_id, temperature, cpu) VALUES ($1, $2, $3, $4);
   `
```

### Step 2: Iterate over data and INSERT

We then execute that SQL statement for each sample we have in our results slice:

```go
//Insert contents of results slice into TimescaleDB
   for i := range results {
       var r result
       r = results[i]
       _, err := dbpool.Exec(ctx, queryInsertTimeseriesData, r.Time, r.SensorId, r.Temperature, r.CPU)
       if err != nil {
           fmt.Fprintf(os.Stderr, "Unable to insert sample into Timescale %v\n", err)
           os.Exit(1)
       }
       defer rows.Close()
   }
   fmt.Println("Successfully inserted samples into sensor_data hypertable")
```

Here's a sample `main.go` which generates sample data and inserts it into the
`sensor_data` hypertable:

```go
package main

import (
   "context"
   "fmt"
   "os"
   "time"

    "github.com/jackc/pgx/v4"
   "github.com/jackc/pgx/v4/pgxpool"
)

func main() {
   /********************************************/
   /* Connect using Connection Pool            */
   /********************************************/
   ctx := context.Background()
   connStr := "yourConnectionStringHere"
   dbpool, err := pgxpool.Connect(ctx, connStr)
   if err != nil {
       fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
       os.Exit(1)
   }
   defer dbpool.Close()

   /********************************************/
   /* Insert data into hypertable              */
   /********************************************/
   // Generate data to insert

   //SQL query to generate sample data
   queryDataGeneration := `
       SELECT generate_series(now() - interval '24 hour', now(), interval '5 minute') AS time,
       floor(random() * (3) + 1)::int as sensor_id,
       random()*100 AS temperature,
       random() AS cpu
       `
   //Execute query to generate samples for sensor_data hypertable
   rows, err := dbpool.Query(ctx, queryDataGeneration)
   if err != nil {
       fmt.Fprintf(os.Stderr, "Unable to generate sensor data: %v\n", err)
       os.Exit(1)
   }
   defer rows.Close()
   fmt.Println("Successfully generated sensor data")

   //Store data generated in slice results
   type result struct {
       Time        time.Time
       SensorId    int
       Temperature float64
       CPU         float64
   }
   var results []result
   for rows.Next() {
       var r result
       err = rows.Scan(&r.Time, &r.SensorId, &r.Temperature, &r.CPU)
       if err != nil {
           fmt.Fprintf(os.Stderr, "Unable to scan %v\n", err)
           os.Exit(1)
       }
       results = append(results, r)
   }
   // Any errors encountered by rows.Next or rows.Scan are returned here
   if rows.Err() != nil {
       fmt.Fprintf(os.Stderr, "rows Error: %v\n", rows.Err())
       os.Exit(1)
   }

   // Check contents of results slice
   fmt.Println("Contents of RESULTS slice")
   for i := range results {
       var r result
       r = results[i]
       fmt.Printf("Time: %s | ID: %d | Temperature: %f | CPU: %f |\n", &r.Time, r.SensorId, r.Temperature, r.CPU)
   }

   //Insert contents of results slice into TimescaleDB
   //SQL query to generate sample data
   queryInsertTimeseriesData := `
   INSERT INTO sensor_data (time, sensor_id, temperature, cpu) VALUES ($1, $2, $3, $4);
   `

   //Insert contents of results slice into TimescaleDB
   for i := range results {
       var r result
       r = results[i]
       _, err := dbpool.Exec(ctx, queryInsertTimeseriesData, r.Time, r.SensorId, r.Temperature, r.CPU)
       if err != nil {
           fmt.Fprintf(os.Stderr, "Unable to insert sample into Timescale %v\n", err)
           os.Exit(1)
       }
       defer rows.Close()
   }
   fmt.Println("Successfully inserted samples into sensor_data hypertable")
}
```

## Batch insert data into TimescaleDB

You'll notice that the method above executes as many insert statements as there are samples
to be inserted. This can make ingestion of data slow. To speed up ingestion, we recommend
batch inserting data.

Here's a sample pattern for how to do so, using the sample data generated in Step 0
above, it uses the pgx `Batch` object:

```go
package main

import (
   "context"
   "fmt"
   "os"
   "time"

   "github.com/jackc/pgx/v4"
   "github.com/jackc/pgx/v4/pgxpool"
)

func main() {
   /********************************************/
   /* Connect using Connection Pool            */
   /********************************************/
   ctx := context.Background()
   connStr := "yourConnectionStringHere"
   dbpool, err := pgxpool.Connect(ctx, connStr)
   if err != nil {
       fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
       os.Exit(1)
   }
   defer dbpool.Close()

   // Generate data to insert

   //SQL query to generate sample data
   queryDataGeneration := `
       SELECT generate_series(now() - interval '24 hour', now(), interval '5 minute') AS time,
       floor(random() * (3) + 1)::int as sensor_id,
       random()*100 AS temperature,
       random() AS cpu
       `
   //Execute query to generate samples for sensor_data hypertable
   rows, err := dbpool.Query(ctx, queryDataGeneration)
   if err != nil {
       fmt.Fprintf(os.Stderr, "Unable to generate sensor data: %v\n", err)
       os.Exit(1)
   }
   defer rows.Close()
   fmt.Println("Successfully generated sensor data")

   //Store data generated in slice results
   type result struct {
       Time        time.Time
       SensorId    int
       Temperature float64
       CPU         float64
   }
   var results []result
   for rows.Next() {
       var r result
       err = rows.Scan(&r.Time, &r.SensorId, &r.Temperature, &r.CPU)
       if err != nil {
           fmt.Fprintf(os.Stderr, "Unable to scan %v\n", err)
           os.Exit(1)
       }
       results = append(results, r)
   }
   // Any errors encountered by rows.Next or rows.Scan are returned here
   if rows.Err() != nil {
       fmt.Fprintf(os.Stderr, "rows Error: %v\n", rows.Err())
       os.Exit(1)
   }

   // Check contents of results slice
   /*fmt.Println("Contents of RESULTS slice")
   for i := range results {
       var r result
       r = results[i]
       fmt.Printf("Time: %s | ID: %d | Temperature: %f | CPU: %f |\n", &r.Time, r.SensorId, r.Temperature, r.CPU)
   }*/

   //Insert contents of results slice into TimescaleDB
   //SQL query to generate sample data
   queryInsertTimeseriesData := `
   INSERT INTO sensor_data (time, sensor_id, temperature, cpu) VALUES ($1, $2, $3, $4);
   `

   /********************************************/
   /* Batch Insert into TimescaleDB            */
   /********************************************/
   //create batch
   batch := &pgx.Batch{}
   numInserts := len(results)
   //load insert statements into batch queue
   for i := range results {
       var r result
       r = results[i]
       batch.Queue(queryInsertTimeseriesData, r.Time, r.SensorId, r.Temperature, r.CPU)
   }
   batch.Queue("select count(*) from sensor_data")

   //send batch to connection pool
   br := dbpool.SendBatch(ctx, batch)
   //execute statements in batch queue
   _, err := br.Exec()
   if err != nil {
       fmt.Fprintf(os.Stderr, "Unable to execute statement in batch queue %v\n", err)
       os.Exit(1)
   }
   fmt.Println("Successfully batch inserted data")

   //Compare length of results slice to size of table
   fmt.Printf("size of results: %d\n", len(results))
   //check size of table for number of rows inserted
   // result of last SELECT statement
   var rowsInserted int
   err = br.QueryRow().Scan(&rowsInserted)
   fmt.Printf("size of table: %d\n", rowsInserted)

   err = br.Close()
   if err != nil {
       fmt.Fprintf(os.Stderr, "Unable to closer batch %v\n", err)
       os.Exit(1)
   }

}
```

<highlight type="tip">
If you are inserting data from a CSV file, we recommend the [timescale-parallel-copy tool](https://github.com/timescale/timescaledb-parallel-copy),
which is a command line program for parallelizing PostgreSQL's built-in `COPY`
functionality for bulk inserting data into TimescaleDB.
</highlight>

## Execute a query on your Timescale database

### Step 1: Define the SQL query

First, define the SQL query you'd like to run on the database. The example
below contains a query which combines time-series and relational data. It
returns the average cpu values for every 5 minute interval for sensors
located on location `ceiling` and of type `a`.

```go
   // Formulate query in SQL
   // Note the use of prepared statement placeholders $1 and $2
   queryTimebucketFiveMin := `
       SELECT time_bucket('5 minutes', time) AS five_min, avg(cpu)
       FROM sensor_data
       JOIN sensors ON sensors.id = sensor_data.sensor_id
       WHERE sensors.location = $1 AND sensors.type = $2
       GROUP BY five_min
       ORDER BY five_min DESC;
       `
```

Notice the use of placeholders for sensor location and type.


### Step 2: Execute the query

Secondly, use the `.Query()` function to query your TimescaleDB database.
Here we execute the query string from step 1, ensuring to specify the
relevant placeholders.

```go
   //Execute query on TimescaleDB
   rows, err := dbpool.Query(ctx, queryTimebucketFiveMin, "ceiling", "a")
   if err != nil {
       fmt.Fprintf(os.Stderr, "Unable to execute query %v\n", err)
       os.Exit(1)
   }
   defer rows.Close()
   fmt.Println("Successfully executed query")
```

### Step 3: Access results returned by the query

We can access the rows returned by `.Query()` by using the following pattern.
First we create a struct with fields representing the columns we expect to
be returned.

Then we use the `rows.Next()` function to iterate through the rows returned and
fill up `results` our array of structs. To do this we use the rows.Scan() function,
passing in pointers to the fields to which we want to scan the results.

In the example below, we print out the results returned from our query,
but you might want to use those results for some other purpose. Once you've
acanned through all the rows returned you can then use the results array
for your desired purpose.

```go
   //Do something with the results of query
   // Struct for results
   type result2 struct {
       Bucket time.Time
       Avg    float64
   }

   // Print rows returned and fill up results slice for later use
   var results []result2
   for rows.Next() {
       var r result2
       err = rows.Scan(&r.Bucket, &r.Avg)
       if err != nil {
           fmt.Fprintf(os.Stderr, "Unable to scan %v\n", err)
           os.Exit(1)
       }
       results = append(results, r)
       fmt.Printf("Time bucket: %s | Avg: %f\n", &r.Bucket, r.Avg)
   }
   // Any errors encountered by rows.Next or rows.Scan are returned here
   if rows.Err() != nil {
       fmt.Fprintf(os.Stderr, "rows Error: %v\n", rows.Err())
       os.Exit(1)
   }

// use results here…
```

### Sample main.go for querying data in TimescaleDB

Here's a sample program which combines steps 1, 2 and 3 above, to run a query on
a TimescaleDB database and access the results of that query.

```go
package main

import (
   "context"
   "fmt"
   "os"
   "time"

   "github.com/jackc/pgx/v4/pgxpool"
)

func main() {
   ctx := context.Background()
   connStr := "yourConnectionStringHere"
   dbpool, err := pgxpool.Connect(ctx, connStr)
   if err != nil {
       fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
       os.Exit(1)
   }
   defer dbpool.Close()

/********************************************/
   /* Execute a query                          */
   /********************************************/

   // Formulate query in SQL
   // Note the use of prepared statement placeholders $1 and $2
   queryTimebucketFiveMin := `
       SELECT time_bucket('5 minutes', time) AS five_min, avg(cpu)
       FROM sensor_data
       JOIN sensors ON sensors.id = sensor_data.sensor_id
       WHERE sensors.location = $1 AND sensors.type = $2
       GROUP BY five_min
       ORDER BY five_min DESC;
       `

   //Execute query on TimescaleDB
   rows, err := dbpool.Query(ctx, queryTimebucketFiveMin, "ceiling", "a")
   if err != nil {
       fmt.Fprintf(os.Stderr, "Unable to execute query %v\n", err)
       os.Exit(1)
   }
   defer rows.Close()
   fmt.Println("Successfully executed query")

   //Do something with the results of query
   // Struct for results
   type result2 struct {
       Bucket time.Time
       Avg    float64
   }

   // Print rows returned and fill up results slice for later use
   var results []result2
   for rows.Next() {
       var r result2
       err = rows.Scan(&r.Bucket, &r.Avg)
       if err != nil {
           fmt.Fprintf(os.Stderr, "Unable to scan %v\n", err)
           os.Exit(1)
       }
       results = append(results, r)
       fmt.Printf("Time bucket: %s | Avg: %f\n", &r.Bucket, r.Avg)
   }
   // Any errors encountered by rows.Next or rows.Scan are returned here
   if rows.Err() != nil {
       fmt.Fprintf(os.Stderr, "rows Error: %v\n", rows.Err())
       os.Exit(1)
   }


}
```

Congratulations, you've successfully executed a query on TimescaleDB using Go and pgx.

## Next steps
Now that you're able to connect, read, and write to a TimescaleDB instance from your
Golang application, be sure to check out these advanced TimescaleDB tutorials:

* Refer to the [pgx documentation][pgx-docs] for more information about pgx.
* Get up and running with TimescaleDB with our [Getting Started][getting-started] tutorial.
* Want fast inserts on CSV data? Check out [TimescaleDB parallel copy][parallel-copy-tool], our tool for fast inserts, written in Golang.

[timescaledb-install]: /install/latest/
[golang-install]: https://golang.org/doc/install
[pgx-driver-github]: https://github.com/jackc/pgx
[libpq-docs]: https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING
[hypertable-docs]: /api/:currentVersion:/hypertable/create_hypertable
[parallel-copy-tool]: https://github.com/timescale/timescaledb-parallel-copy
[pgx-docs]: https://pkg.go.dev/github.com/jackc/pgx
[getting-started]: /getting-started/:currentVersion:/
