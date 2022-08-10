---
title: "Quick Start: .NET and TimescaleDB"
excerpt: Get started with TimescaleDB for a .NET application
keywords: [.NET]
---

# Quick Start: .NET and TimescaleDB

This quick start guide is designed to get the .NET developer up and running with
TimescaleDB as their database.

In this Quick Start, you need to:

1.  [Connect .NET to Timescale][connect-to-timescaledb]
1.  [Create a relational table][create-relational-table]
1.  [Create a hypertable][create-hypertable]
1.  [Insert time-series data into TimescaleDB][insert-data]
1.  [Query TimescaleDB][query-timescaledb]

You build the application one step at a time, adding new methods to the
`TimescaleHelper` class which are called from the `Main` method of the
application. When you have finished, the application code provides a brief
template for further experimentation as you learn more about TimescaleDB and
.NET with `Npgsql`.

## Prerequisites

Before you begin this Quick Start, make sure you have:

*   At least some knowledge of SQL (structured query language). The tutorial
    walks you through each SQL command, but it is helpful if you've seen SQL
    before.
*   The latest compatible [.NET runtime installed][dotnet-runtime] and
    accessible
*   TimescaleDB installed, either in a [self-hosted environment][self-hosted] or
    in the [cloud][install-cloud].
*   A PostgreSQL query tool like [psql][psql] or any other PostgreSQL client
    (for example, DBeaver). You need this to explore the final TimescaleDB
    database.

## Connect .NET to TimescaleDB

To connect a .NET application to TimescaleDB, you need to initiate the project
using the `dotnet` CLI and install the `Npgsql` SDK for connecting to
TimescaleDB. `Npgsql` is the officially supported PostgreSQL client library for
.NET.

To complete this procedure, you need to have your database connection
information available, including:

*   username
*   password
*   host URL
*   port
*   database name

<highlight type="important">
Npgsql does not support the shorter URI-based form of a PostgreSQL connection
string. Instead, the connection string must be in a supported key/value format
as [described in their documentation](https://www.npgsql.org/doc/connection-string-parameters.html).
Please see the documentation for additional parameters to enable features such
as SSL.
</highlight>

<procedure>

### Connecting .NET to TimescaleDB

1.  Create a working directory for the tutorial application and initiate a new
    application project using the "console" template included with the .NET
    tooling:

    ```bash
    mkdir dotnet-tutorial
    cd dotnet-tutorial
    dotnet new console
    ```

1.  Add the `Npgsql` package to your project which is used to connect to
    TimescaleDB:

    ```bash
    dotnet add package Npgsql
    ```

3.  Open the `Program.cs` file in your new project and replace the contents with
    this C# code:

    ```cs
    using System;
    using Npgsql;
    using System.Collections.Generic;

    namespace com.timescale.docs
    {
        class Program
        {
            //
            // This is the main method that is called
            // by default when .NET builds this small application
            static void Main(string[] args)
            {
                // Create a new instance of our helper class. This class
                // contains all of the methods for interacting with
                // TimescaleDB for this tutorial
                TimescaleHelper ts = new TimescaleHelper();

                // Procedure - Connecting .NET to TimescaleDB:
                // Verify that the program can connect
                // to the database and that TimescaleDB is installed!
                ts.CheckDatabaseConnection();

            }
        }

        // This class contains all of the methods needed to complete the
        // quick-start, providing a sample of each database operation in total
        // to refer to later.
        public class TimescaleHelper
        {
            private static string Host = "";
            private static string User = "";
            private static string DBname = "";
            private static string Password = "";
            private static string Port = "";
            private static string conn_str = "";

            //
            // This is the constructor for our TimescaleHelper class
            //
            public TimescaleHelper(string host="<HOSTNAME>", string user="<USERNAME>",
                string dbname="<DATABASE_NAME>", string password="<PASSWORD>",string port="<PORT>")
            {
                Host=host;
                User=user;
                DBname=dbname;
                Password=password;
                Port=port;
                // Build connection string using the parameters above
                conn_str = String.Format("Server={0};Username={1};Database={2};Port={3};Password={4};SSLMode=Prefer",
                                    Host,
                                    User,
                                    DBname,
                                    Port,
                                    Password);
            }

            // Helper method to get a connection for the execute function
            NpgsqlConnection getConnection()
            {
                var Connection = new NpgsqlConnection(conn_str);
                Connection.Open();
                return Connection;
            }

            //
            // Procedure - Connecting .NET to TimescaleDB:
            // Check the connection TimescaleDB and verify that the extension
            // is installed in this database
            //
            public void CheckDatabaseConnection() {
                // get one connection for all SQL commands below
                using (var conn = getConnection()){

                    var sql = "SELECT default_version, comment FROM pg_available_extensions WHERE name = 'timescaledb';";

                    using(var cmd = new NpgsqlCommand(sql, conn)) {
                        using NpgsqlDataReader rdr = cmd.ExecuteReader();

                        if (!rdr.HasRows) {
                            Console.WriteLine("Missing TimescaleDB extension!");
                            conn.Close();
                            return;
                        }

                        while (rdr.Read())
                        {
                            Console.WriteLine("TimescaleDB Default Version: {0}\n{1}", rdr.GetString(0), rdr.GetString(1));
                        }
                        conn.Close();
                    }
                }

            }
    }
    }
    ```

<highlight type="warning"> This method of composing a connection string is for
test or development purposes only. For production applications be sure to make
sensitive details like your password, hostname, and port number accessible in a
secure way as supported by .NET. </highlight>

4.  Run `Program.cs` to verify that .NET can connect to your database and that
    the TimescaleDB extension is installed:

    ```bash
    dotnet run Program.cs
    TimescaleDB Default Version: 2.3.0
    Enables scalable inserts and complex queries for time-series data
    ```

If you don't see the extension, check our troubleshooting section.

</procedure>

## Create a relational table

When the application can successfully connect to TimescaleDB, you can create
some relational data that your time-series data can reference when creating data
and executing queries.

The new functionality to create the table and insert data is added as a method
to the `TimescaleHelper` class and called from the `Main` method of the program.

<procedure>

### Creating a relational table

1.  Add this method at the bottom of the `TimescaleHelper` class, below the
    `CheckDatabaseConnection()` method:

    ```csharp
            //
            // Procedure - Creating a relational table:
            // Create a table for basic relational data and
            // populate it with a few fake sensors
            //
            public void CreateRelationalData() {
                //use one connection to use for all three commands below.
                using (var conn = getConnection())
                {
                    using (var command = new NpgsqlCommand("DROP TABLE IF EXISTS sensors cascade", conn))
                    {
                        command.ExecuteNonQuery();
                        Console.Out.WriteLine("Finished dropping table (if existed)");
                    }

                    using (var command = new NpgsqlCommand("CREATE TABLE sensors (id SERIAL PRIMARY KEY, type TEXT, location TEXT);", conn))
                    {
                        command.ExecuteNonQuery();
                        Console.Out.WriteLine("Finished creating the sensors table");
                    }

                    // Create the list of sensors as key/value pairs to insert next
                    var sensors = new List<KeyValuePair<string, string>>()
                    {
                        new KeyValuePair<string, string>("a","floor"),
                        new KeyValuePair<string, string>("a","ceiling"),
                        new KeyValuePair<string, string>("b","floor"),
                        new KeyValuePair<string, string>("b","ceiling")
                    };

                    // Iterate over the list to insert it into the newly
                    // created relational table using parameter substitution
                    foreach(KeyValuePair<string,string> kvp in sensors)
                    {
                        using (var command = new NpgsqlCommand("INSERT INTO sensors (type, location) VALUES (@type, @location)", conn))
                        {
                            command.Parameters.AddWithValue("type", kvp.Key);
                            command.Parameters.AddWithValue("location", kvp.Value);

                            int nRows = command.ExecuteNonQuery();
                            Console.Out.WriteLine(String.Format("Number of rows inserted={0}", nRows));
                        }
                    }
                }
            }
    ```

2.  Call this new method from the `Main` program **after**
    `ts.CheckDatabaseConnection();`:

    ```csharp
                // Procedure - Creating a relational table
                ts.CreateRelationalData();

    ```

3.  Save and run the application. You should see output like this:

    ```bash
    $ dotnet run

    TimescaleDB Default Version: 2.3.0
    Enables scalable inserts and complex queries for time-series data
    Finished dropping table (if existed)
    Finished creating the sensors table
    Number of rows inserted=1
    Number of rows inserted=1
    Number of rows inserted=1
    Number of rows inserted=1
    ```

</procedure>

## Create the hypertable

When the relational table is created and populated, you can create a hypertable,
the core features of TimescaleDB that most functionality relies on. A hypertable
is first created as a regular PostgreSQL table with a date or timestamp column,
and then converted into a hypertable with the `create_hypertable()` API.

A hypertable is the core architecture that many other TimescaleDB features is
built upon, such as [Compression][compression], [Continuous
Aggregates][caggs], and [Data
Retention][data-retention]. Learn more about hypertables and
other key features of TimescaleDB in our [Core
Concepts][core-concepts] documentation.

<procedure>

### Creating a hypertable

1.  Add a new method to the bottom of the `TimescaleHelper` class that creates a
    new table and convert it to a hypertable:

    ```csharp
            //
            // Procedure - Creating a hypertable:
            // Create a new table to store time-series data and create
            // a new TimescaleDB hypertable using the new table. It is
            // partitioned on the 'time' column
            public void CreateHypertable(){
                //use one connection to use for all three commands below.
                using (var conn = getConnection())
                {
                    using (var command = new NpgsqlCommand("DROP TABLE IF EXISTS sensor_data CASCADE;", conn))
                    {
                        command.ExecuteNonQuery();
                        Console.Out.WriteLine("Dropped sensor_data table if it existed");
                    }

                    using (var command = new NpgsqlCommand(@"CREATE TABLE sensor_data (
                                               time TIMESTAMPTZ NOT NULL,
                                               sensor_id INTEGER,
                                               temperature DOUBLE PRECISION,
                                               cpu DOUBLE PRECISION,
                                               FOREIGN KEY (sensor_id) REFERENCES sensors (id)
                                               );", conn))
                    {
                        command.ExecuteNonQuery();
                        Console.Out.WriteLine("Created sensor_data table to store time-series data");
                    }

                    using (var command = new NpgsqlCommand("SELECT create_hypertable('sensor_data', 'time');", conn))
                    {
                        command.ExecuteNonQuery();
                        Console.Out.WriteLine("Converted the sensor_data table into a TimescaleDB hypertable!");
                    }
                }
            }
    ```

2.  Call this new method from the `Main` program **after**
    `ts.CreateRelationalData()`:

    ```csharp
                // Procedure - Creating a hypertable
                // Create a new table and make it a hypertable to store
                // the generated time-series data
                ts.CreateHypertable();

    ```

3.  Run the application again. It drops and recreates the `sensors` table, and
    then creates a new hypertable called `sensor_data`:

    ```bash
    $ dotnet run


    TimescaleDB Default Version: 2.3.0
    Enables scalable inserts and complex queries for time-series data
    Finished dropping table (if existed)
    Finished creating the sensors table
    Number of rows inserted=1
    Number of rows inserted=1
    Number of rows inserted=1
    Number of rows inserted=1
    Dropped sensor_data table if it existed
    Created sensor_data table to store time-series data
    Converted the sensor_data table into a TimescaleDB hypertable!
    ```

Your application is now ready to insert time-series data into the newly created
TimescaleDB hypertable!

</procedure>

## Insert time-series data into TimescaleDB

Your Timescale database has all of the components necessary to start creating
and inserting time-series data. In this Quick Start, we use a built-in
PostgreSQL function, `generate_series()`, to create a small set of row data with
generated timestamps that mimics time-series data. For more information on how
`generate_series()` works and ideas for creating more complex and diverse sample
datasets, watch this [YouTube
playlist][generate-series-yt-playlist]
and our [corresponding Blog
series][generate-series-blog].

<procedure>

### Inserting time-series data into TimescaleDB

1.  Add this new method to the bottom of the `TimescaleHelper` class. This code
    executes a SQL statement that uses `generate_series()` to insert 1 day of
    sample data into the `sensor_data` hypertable:

    ```csharp
            //
            // Procedure - Insert time-series data:
            // With the hypertable in place, insert data using the PostgreSQL
            // supplied 'generate_series()' function, iterating over our small list
            // of sensors from Step 2.
            public void InsertData()
            {
                using (var conn = getConnection())
                {
                    // This query creates one row of data every minute for each
                    // sensor_id, for the last 24 hours ~= 1440 readings per sensor
                    var sql = @"INSERT INTO sensor_data
                                SELECT generate_series(now() - interval '24 hour',
                                                        now(),
                                                        interval '1 minute') AS time,
                                @sid as sensor_id,
                                random()*100 AS temperature,
                                random() AS cpu";

                    // We created four sensors in Step 2 and so we iterate over their
                    // auto generated IDs to insert data. This could be modified
                    // using a larger list or updating the SQL to JOIN on the 'sensors'
                    // table to get the IDs for data creation.
                    for(int i=1; i<=4; i++)
                    {
                        using (var command = new NpgsqlCommand(sql, conn))
                            {
                                command.Parameters.AddWithValue("sid", i);

                                int nRows = command.ExecuteNonQuery();
                                Console.Out.WriteLine(String.Format("Number of rows inserted={0}", nRows));
                            }
                    }
                }
            }
    ```

2.  Call this method from the `Main` program **after** the
    `ts.CreateHypertable();` reference:

    ```csharp
                // Procedure - Insert time-series data
                // Insert time-series data using the built-in
                // PostgreSQL function generate_series()
                ts.InsertData();
    ```

3.  Save and run the program. If you have not commented out any method calls in
    the `Main` program, the application drops all tables, recreates them, and
    inserts the new sample time-series data. Your output should look similar to
    this:

    ```bash
    $ dotnet run

    TimescaleDB Default Version: 2.3.0
    Enables scalable inserts and complex queries for time-series data
    Finished dropping table (if existed)
    Finished creating the sensors table
    Number of rows inserted=1
    Number of rows inserted=1
    Number of rows inserted=1
    Number of rows inserted=1
    Dropped sensor_data table if it existed
    Created sensor_data table to store time-series data
    Converted the sensor_data table into a TimescaleDB hypertable!
    Number of rows inserted=1441
    Number of rows inserted=1441
    Number of rows inserted=1441
    Number of rows inserted=1441
    ```

Congratulations! You have successfully created and inserted time-series data
into your hypertable. The last step to is to execute your first `time_bucket()`
query against the hypertable data.

</procedure>

## Query TimescaleDB

The final step of this Quick Start is to use the `time_bucket` function to
analyze the average CPU reading in five minute buckets. As written, this query
returns all data for all sensors. However, you could adjust the query to receive
inputs that further filter data using a WHERE clause.

After executing the query, iterate the results using the `NpgsqlDataReader` and
print the results to the console.

<procedure>

### Querying TimescaleDB

1.  Create the final method at the bottom of the `TimescaleHelper` class for
    querying time-series data using the `time_bucket()` function provided by
    TimescaleDB:

    ```csharp
            //
            // Procedure - Query TimescaleDB
            // With time-series data inserted, run a 'time_bucket()' query
            // on the data in order to aggregate our 1-minute cpu data into buckets
            // of 5-minute averages.
            public void RunQueryExample(){
                string sql = @"
                    SELECT sensor_id, time_bucket('5 minutes', time) AS five_min, avg(cpu)
                    FROM sensor_data
                        INNER JOIN sensors ON sensors.id = sensor_data.sensor_id
                    GROUP BY sensor_id, five_min
                    ORDER BY sensor_id, five_min DESC;";

                var conn = getConnection();
                using(var cmd = new NpgsqlCommand(sql, conn))
                {
                    using(NpgsqlDataReader rdr = cmd.ExecuteReader()) {
                        while (rdr.Read()) Console.WriteLine($"{rdr.GetDouble(0)} - {rdr.GetTimeStamp(1)} - {rdr.GetDouble(2)}");
                    }
                }

                conn.Close();
            }
    ```

2.  Call this method in the `Main` program directly after the `ts.InsertData();`
    reference:

    ```csharp
                // Procedure - Query TimescaleDB
                // Query the data using the Timescale time_bucket() function
                ts.RunQueryExample();
    ```

3.  Save and run the application again. As before, if you execute all of the
    methods in the `Main` program, your output should look similar to this. The
    values of the output are different because we used the `random()` function
    to generate them:

    ```bash
    $ dotnet run

    TimescaleDB Default Version: 2.3.0
    Enables scalable inserts and complex queries for time-series data
    Finished dropping table (if existed)
    Finished creating the sensors table
    Number of rows inserted=1
    Number of rows inserted=1
    Number of rows inserted=1
    Number of rows inserted=1
    Dropped sensor_data table if it existed
    Created sensor_data table to store time-series data
    Converted the sensor_data table into a TimescaleDB hypertable!
    Number of rows inserted=1441
    Number of rows inserted=1441
    Number of rows inserted=1441
    Number of rows inserted=1441
    1 - 2021-09-16 02:40:00 - 0.4404128644957318
    1 - 2021-09-16 02:35:00 - 0.4102604181563983
    1 - 2021-09-16 02:30:00 - 0.6163615623169129
    1 - 2021-09-16 02:25:00 - 0.6738216869256242
    1 - 2021-09-16 02:20:00 - 0.5920387434668661
    1 - 2021-09-16 02:15:00 - 0.3357799954217377
    1 - 2021-09-16 02:10:00 - 0.523394970335945
    …
    4 - 2021-09-15 14:40:00 - 0.43986085123294955
    4 - 2021-09-15 14:35:00 - 0.4829260601553081
    4 - 2021-09-15 14:30:00 - 0.257577961505887
    4 - 2021-09-15 14:25:00 - 0.3431355979977731
    4 - 2021-09-15 14:20:00 - 0.2339278514661025
    ```

Congratulations! You have successfully queried data from TimescaleDB usig the
`Npgsql` SDK. For information on how to execute more complex queries or utilize
advanced query functionality, please see the [Npgsql
documentation][npgsql].

</procedure>

## Next Steps

Now that you're able to connect, read, and write to a TimescaleDB instance from
your .NET application be sure to check out these advanced TimescaleDB tutorials:

*   [Continuous Aggregates][caggs]
*   [Try Other Sample Datasets][sample-datasets]
*   [Migrate your own Data][migrate-data]

[caggs]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/
[compression]: /timescaledb/:currentVersion:/how-to-guides/compression/
[connect-to-timescaledb]: #connect-net-to-timescaledb
[core-concepts]: /timescaledb/:currentVersion:/overview/core-concepts/
[create-hypertable]: #create-the-hypertable
[create-relational-table]: #create-a-relational-table
[data-retention]: /timescaledb/:currentVersion:/how-to-guides/data-retention/
[dotnet-runtime]: https://dotnet.microsoft.com/download/dotnet-framework
[generate-series-blog]: https://blog.timescale.com/blog/how-to-create-lots-of-sample-time-series-data-with-postgresql-generate_series/
[generate-series-yt-playlist]: https://youtube.com/playlist?list=PLsceB9ac9MHQxwkSyi5LeqonMnMW8KiBZ
[insert-data]: #insert-time-series-data-into-timescaledb
[install-cloud]: https://www.timescale.com/timescale-signup
[migrate-data]: /timescaledb/:currentVersion:/how-to-guides/migrate-data/
[npgsql]: https://www.npgsql.org/doc/index.html
[psql]: /timescaledb/:currentVersion:/how-to-guides/connecting/psql/
[query-timescaledb]: #query-timescaledb
[sample-datasets]: /timescaledb/:currentVersion:/tutorials/sample-datasets/
[self-hosted]: /install/:currentVersion:/self-hosted/
