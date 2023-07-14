---
title: "Quick Start: Go and TimescaleDB"
excerpt: Get started with TimescaleDB for a Go application
keywords: [Golang, Go]
---

import Intro from "versionContent/_partials/_quickstart-intro.mdx";

# Go quick start

<Intro />

This quick start guide walks you through:

*   [Connecting to TimescaleDB][connect]
*   [Creating a relational table][create-table]
*   [Creating a hypertable][create-hypertable]
*   [Inserting data][insert]
*   [Executing a query][query]

## Prerequisites

Before you start, make sure you have:

*   Installed [TimescaleDB][install].
*   Installed [Go][golang-install].
*   Installed the [PGX driver for Go][pgx-driver-github].

## Connect to TimescaleDB

In this section, you create a connection to TimescaleDB using the PGX driver.
PGX is a toolkit designed to help Go developers work directly with PostgreSQL.
You can use it to help your Go application interact directly with TimescaleDB.

<Procedure>

<Collapsible heading="Connecting to TimescaleDB with a connection string" headingLevel={3}>

1.  Locate your TimescaleDB credentials and use them to compose a connection
    string for PGX.

    You'll need:

    *   password
    *   username
    *   host URL
    *   port number
    *   database name

1.  Compose your connection string variable as a
    [libpq connection string][libpq-docs], using this format:

    ```go
    connStr := "postgres://username:password@host:port/dbname"
    ```

    If you're using a hosted version of TimescaleDB, or if you need an SSL
    connection, use this format instead:

    ```go
    connStr := "postgres://username:password@host:port/dbname?sslmode=require"
    ```

1.  [](#)<Optional />You can check that you're connected to your database with this
    hello world program:

    ```go
    package main

    import (
        "context"
        "fmt"
        "os"

        "github.com/jackc/pgx/v5"
    )

    //connect to database using a single connection
    func main() {
        /***********************************************/
        /* Single Connection to TimescaleDB/ PostgreSQL */
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
    you can use this syntax to access it in place of the `connStr` variable:

    ```go
    os.Getenv("DATABASE_CONNECTION_STRING")
    ```

</Collapsible>

</Procedure>

Alternatively, you can connect to TimescaleDB using a connection pool.
Connection pooling is useful to conserve computing resources, and can also
result in faster database queries:

<Procedure>

<Collapsible heading="Connecting to TimescaleDB with a connection pool" headingLevel={3} defaultExpanded={false}>

1.  To create a connection pool that can be used for concurrent connections to
   your database, use the `pgxpool.New()` function instead of
   `pgx.Connect()`. Also note that this script imports
   `github.com/jackc/pgx/v5/pgxpool`, instead of `pgx/v5` which was used to
   create a single connection:

    ```go
    package main

    import (
        "context"
        "fmt"
        "os"

        "github.com/jackc/pgx/v5/pgxpool"
    )

    func main() {

        ctx := context.Background()
        connStr := "yourConnectionStringHere"
        dbpool, err := pgxpool.New(ctx, connStr)
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

1.  Compose a string that contains the SQL statement to create a relational
    table. This example creates a table called `sensors`, with columns for ID,
    type, and location:

    ```go
    queryCreateTable := `CREATE TABLE sensors (id SERIAL PRIMARY KEY, type VARCHAR(50), location VARCHAR(50));`
    ```

1.  Execute the `CREATE TABLE` statement with the `Exec()` function on the
    `dbpool` object, using the arguments of the current context and the
    statement string you created:

    ```go
    package main

    import (
        "context"
        "fmt"
        "os"

        "github.com/jackc/pgx/v5/pgxpool"
    )

    func main() {
        ctx := context.Background()
        connStr := "yourConnectionStringHere"
        dbpool, err := pgxpool.New(ctx, connStr)
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

</Collapsible>

</Procedure>

## Generate a hypertable

When you have created the relational table, you can create a hypertable.
Creating tables and indexes, altering tables, inserting data, selecting data,
and most other tasks are executed on the hypertable.

<Procedure>

<Collapsible heading="Generating a hypertable" headingLevel={3}>

1.  Create a variable for the `CREATE TABLE SQL` statement for your hypertable.
    Notice how the hypertable has the compulsory time column:

    ```go
    queryCreateTable := `CREATE TABLE sensor_data (
            time TIMESTAMPTZ NOT NULL,
            sensor_id INTEGER,
            temperature DOUBLE PRECISION,
            cpu DOUBLE PRECISION,
            FOREIGN KEY (sensor_id) REFERENCES sensors (id));
            `
    ```

1.  Formulate the `SELECT` statement to convert the table into a hypertable. You
    must specify the table name to convert to a hypertable, and its time column
    name as the second argument. For more information, see the
    [`create_hypertable` docs][create-hypertable-docs]:

    ```go
    queryCreateHypertable := `SELECT create_hypertable('sensor_data', 'time');`
    ```

1.  Execute the `CREATE TABLE` statement and `SELECT` statement which converts
    the table into a hypertable. You can do this by calling the `Exec()`
    function on the `dbpool` object, using the arguments of the current context,
    and the `queryCreateTable` and `queryCreateHypertable` statement strings:

    ```go
    package main

    import (
        "context"
        "fmt"
        "os"

        "github.com/jackc/pgx/v5/pgxpool"
    )

    func main() {
        ctx := context.Background()
        connStr := "yourConnectionStringHere"
        dbpool, err := pgxpool.New(ctx, connStr)
        if err != nil {
            fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
            os.Exit(1)
        }
        defer dbpool.Close()

        /********************************************/
        /* Create Hypertable                        */
        /********************************************/
        // Create hypertable of time-series data called sensor_data
        queryCreateTable := `CREATE TABLE sensor_data (
            time TIMESTAMPTZ NOT NULL,
            sensor_id INTEGER,
            temperature DOUBLE PRECISION,
            cpu DOUBLE PRECISION,
            FOREIGN KEY (sensor_id) REFERENCES sensors (id));
            `

        queryCreateHypertable := `SELECT create_hypertable('sensor_data', 'time');`

        //execute statement
        _, err = dbpool.Exec(ctx, queryCreateTable+queryCreateHypertable)
        if err != nil {
            fmt.Fprintf(os.Stderr, "Unable to create the `sensor_data` hypertable: %v\n", err)
            os.Exit(1)
        }
        fmt.Println("Successfully created hypertable `sensor_data`")
    }
    ```

</Collapsible>

</Procedure>

## Insert rows of data

You can insert rows into your database in a couple of different
ways. Each of these example inserts the data from the two arrays, `sensorTypes` and
`sensorLocations`, into the relational table named `sensors`.

The first example inserts a single row of data at a time. The second example
inserts multiple rows of data. The third example uses batch inserts to speed up
the process.

<Procedure>

<Collapsible heading="Inserting a single row of data" headingLevel={3}>

1.  Open a connection pool to the database, then use the prepared statements to
    formulate an `INSERT` SQL statement, and execute it:

    ```go
    package main

    import (
        "context"
        "fmt"
        "os"

        "github.com/jackc/pgx/v5/pgxpool"
    )

    func main() {
        ctx := context.Background()
        connStr := "yourConnectionStringHere"
        dbpool, err := pgxpool.New(ctx, connStr)
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

</Collapsible>

</Procedure>

Instead of inserting a single row of data at a time, you can use this procedure
to insert multiple rows of data, instead:

<Procedure>

<Collapsible heading="Inserting multiple rows of data" headingLevel={3} defaultExpanded={false}>

1.  This example uses PostgreSQL to generate some sample time-series to insert
    into the `sensor_data` hypertable. Define the SQL statement to generate the
    data, called `queryDataGeneration`. Then use the `.Query()` function to
    execute the statement and return the sample data. The data returned by the
    query is stored in `results`, a slice of structs, which is then used as a
    source to insert data into the hypertable:

    ```go
    package main

    import (
        "context"
        "fmt"
        "os"
        "time"

        "github.com/jackc/pgx/v5/pgxpool"
    )

    func main() {
        ctx := context.Background()
        connStr := "yourConnectionStringHere"
        dbpool, err := pgxpool.New(ctx, connStr)
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
        fmt.Println("Contents of RESULTS slice")
        for i := range results {
            var r result
            r = results[i]
            fmt.Printf("Time: %s | ID: %d | Temperature: %f | CPU: %f |\n", &r.Time, r.SensorId, r.Temperature, r.CPU)
        }
    }
    ```

1.  Formulate an SQL insert statement for the `sensor_data` hypertable:

    ```go
    //SQL query to generate sample data
    queryInsertTimeseriesData := `
        INSERT INTO sensor_data (time, sensor_id, temperature, cpu) VALUES ($1, $2, $3, $4);
        `
    ```

1.  Execute the SQL statement for each sample in the results slice:

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

1.  [](#)<Optional />This example `main.go` generates sample data and inserts it into
    the `sensor_data` hypertable:

    ```go
    package main

    import (
        "context"
        "fmt"
        "os"
        "time"

        "github.com/jackc/pgx/v5/pgxpool"
    )

    func main() {
        /********************************************/
        /* Connect using Connection Pool            */
        /********************************************/
        ctx := context.Background()
        connStr := "yourConnectionStringHere"
        dbpool, err := pgxpool.New(ctx, connStr)
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

</Collapsible>

</Procedure>

Inserting multiple rows of data using this method executes as many `insert`
statements as there are samples to be inserted. This can make ingestion of data
slow. To speed up ingestion, you can batch insert data instead.

Here's a sample pattern for how to do so, using the sample data you generated in
the previous procedure. It uses the pgx `Batch` object:

<Procedure>

<Collapsible heading="Inserting rows of data in batches" headingLevel={3} defaultExpanded={false}>

1.  This example batch inserts data into the database:

    ```go
    package main

    import (
        "context"
        "fmt"
        "os"
        "time"

        "github.com/jackc/pgx/v5"
        "github.com/jackc/pgx/v5/pgxpool"
    )

    func main() {
        /********************************************/
        /* Connect using Connection Pool            */
        /********************************************/
        ctx := context.Background()
        connStr := "yourConnectionStringHere"
        dbpool, err := pgxpool.New(ctx, connStr)
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
        _, err = br.Exec()
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

</Collapsible>

</Procedure>

## Execute a query

This section covers how to execute queries against your database.

<Procedure>

<Collapsible heading="Executing a query" headingLevel={3}>

1.  Define the SQL query you'd like to run on the database. This example uses a
    SQL query that combines time-series and relational data. It returns the
    average CPU values for every 5 minute interval, for sensors located on
    location `ceiling` and of type `a`:

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

1.  Use the `.Query()` function to execute the query string. Make sure you
    specify the relevant placeholders:

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

1.  Access the rows returned by `.Query()`. Create a struct with fields
    representing the columns that you expect to be returned, then use the
    `rows.Next()` function to iterate through the rows returned and fill
    `results` with the array of structs. This uses the `rows.Scan()` function,
    passing in pointers to the fields that you want to scan for results.

    This example prints out the results returned from the query, but you might
    want to use those results for some other purpose. Once you've scanned
    through all the rows returned you can then use the results array however you
    like.

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

1.  [](#)<Optional/>This example program runs a query, and accesses the results of
    that query:

    ```go
    package main

    import (
        "context"
        "fmt"
        "os"
        "time"

        "github.com/jackc/pgx/v5/pgxpool"
    )

    func main() {
        ctx := context.Background()
        connStr := "yourConnectionStringHere"
        dbpool, err := pgxpool.New(ctx, connStr)
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

</Collapsible>

</Procedure>

## Next steps

Now that you're able to connect, read, and write to a TimescaleDB instance from
your Go application, be sure to check out these advanced TimescaleDB tutorials:

*   Refer to the [pgx documentation][pgx-docs] for more information about pgx.
*   Get up and running with TimescaleDB with the [Getting Started][getting-started]
    tutorial.
*   Want fast inserts on CSV data? Check out
    [TimescaleDB parallel copy][parallel-copy-tool], a tool for fast inserts,
    written in Go.

[getting-started]: /getting-started/:currentVersion:/
[golang-install]: https://golang.org/doc/install
[libpq-docs]: https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING
[parallel-copy-tool]: https://github.com/timescale/timescaledb-parallel-copy
[pgx-docs]: https://pkg.go.dev/github.com/jackc/pgx
[pgx-driver-github]: https://github.com/jackc/pgx
[install]: /getting-started/latest/
[connect]: #connect-to-timescaledb
[create-table]: #create-a-relational-table
[create-hypertable]: #generate-a-hypertable
[insert]: #insert-rows-of-data
[query]: #execute-a-query
[create-hypertable-docs]: /use-timescale/:currentVersion:/hypertables/create/
[insert]: /quick-start/:currentVersion:/golang/#insert-a-row-into-your-timescale-database
[query]: /quick-start/:currentVersion:/golang/#execute-a-query-on-your-timescale-database
[create-hypertable]: /quick-start/:currentVersion:/python/#create-hypertable
