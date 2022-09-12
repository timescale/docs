---
title: "Quick Start: Java and TimescaleDB"
excerpt: Get started with TimescaleDB for a Java application
keywords: [Java]
---

# Quick Start: Java and TimescaleDB

## Goal

This quick start guide is designed to get Java developers up and running with TimescaleDB as their database.
In this tutorial, you'll learn how to:

*   [Connect Java to TimescaleDB](#connect-java-to-timescaledb)
*   [Create a relational table](#create-a-relational-table)
*   [Generate a hypertable](#generate-a-hypertable)
*   [Insert a batch of rows into TimescaleDB](#insert-a-batch-of-rows-into-timescaledb)
*   [Execute queries on TimescaleDB](#execute-queries-on-timescaledb)

## Pre-requisites

To complete this tutorial, you need a cursory knowledge of the Structured Query Language (SQL).
The tutorial walks you through each SQL command, but it is helpful if you've seen SQL before.

To start, [install TimescaleDB][timescaledb-install]. Once your installation is complete,
you can proceed to ingesting or creating sample data and finishing the tutorial.

You also need to install [Java Development Kit (JDK)][jdk]
and [PostgreSQL Java Database Connectivity (JDBC) Driver][pg-jdbc-driver] as well.
All code is presented for Java 16 and above.
If you are working with older JDK versions, use legacy coding techniques.

## Connect Java to TimescaleDB

### Step 1: Create a new Java application

For simplicity, this tutorial uses the application in a single file as an example.
You can use any of your favorite build tools, including `gradle` and `maven`.

Create a separate directory and navigate to it.
In it, create a text file with name and extension `Main.java` and the following content:

```java
package com.timescale.java;

public class Main {

    public static void main(String... args) {
        System.out.println("Hello, World!");
    }
}
```

From the command line in the current directory, try running the application with this command:

```bash
java Main.java
```

You should see the `Hello, World!` line output to your console.
In case of an error, refer to the documentation and check if the JDK was installed correctly.
You don't have to create directory structure `./com/timescale/java` similar to package path in source file.
You should just create a single java file in empty folder and run `java Main.java` from it.

### Step 2: Import Postgres JDBC driver

To work with the `PostgreSQL`, you need to import the appropriate `JDBC Driver`.
If you are using a dependency manager, include [PostgreSQL JDBC Driver as dependency][pg-jdbc-driver-dependency].
In this case, download [jar artifact of JDBC Driver][pg-jdbc-driver-artifact] and place it next to the `Main.java` file.

Now you can import the `JDBC Driver` into the Java application and display a list of available drivers for the check:

```java
package com.timescale.java;

import java.sql.DriverManager;

public class Main {

    public static void main(String... args) {
        DriverManager.drivers().forEach(System.out::println);
    }
}
```

Use this command to run all the following examples:

```bash
java -cp *.jar Main.java
```

You should end up with something like `org.postgresql.Driver@7f77e91b`.
This means that you are ready to connect to TimescaleDB from Java.

### Step 3: Compose a database connection string

Locate your TimescaleDB credentials. You need these to compose a connection string for JDBC
to use to connect to your TimescaleDB instance.

You'll need these credentials:

*   host
*   port
*   database name
*   username
*   password

Next, compose your connection string variable using this format:

```java
var connUrl = "jdbc:postgresql://<HOSTNAME>:<PORT>/<DATABASE_NAME>?user=<USERNAME>&password=<PASSWORD>";
```

Full documentation on [the formation of the connection string][pg-jdbc-driver-conn-docs]
can be found in the official documentation of the PostgreSQL JDBC Driver.

<highlight type="warning">
The above method of composing a connection string is for test or development purposes only,
for production purposes be sure to make sensitive details like your password, hostname, and port number environment variables.
</highlight>

### Step 4: Connect to TimescaleDB instance using the PostgreSQL JDBC driver

Change the code to connect to the database server and verify that all settings are correct:

```java
package com.timescale.java;

import java.sql.DriverManager;
import java.sql.SQLException;

public class Main {

    public static void main(String... args) throws SQLException {
        var connUrl = "jdbc:postgresql://<HOSTNAME>:<PORT>/<DATABASE_NAME>?user=<USERNAME>&password=<PASSWORD>";
        var conn = DriverManager.getConnection(connUrl);
        System.out.println(conn.getClientInfo());
    }
}
```

Run with the `java -cp *.jar Main.java` command
and you should see this output: `{ApplicationName=PostgreSQL JDBC Driver}`.

Congratulations, you've successfully connected to TimescaleDB using Java.

## Create a relational table

### Step 1: Formulate your SQL statement

First, compose a string which contains the SQL state that you would use to create a relational table.
In this example, we create a table called `sensors`, with columns `id`, `type` and `location`:

```sql
CREATE TABLE sensors (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    location TEXT NOT NULL
);
```

### Step 2: Execute the SQL statement and commit changes

Next, execute the `CREATE TABLE` query by creating a statement,
executing the query from `Step 1` and check that table was created with `SELECT` statement:

```java
package com.timescale.java;

import java.sql.DriverManager;
import java.sql.SQLException;

public class Main {

    public static void main(String... args) throws SQLException {
        var connUrl = "jdbc:postgresql://<HOSTNAME>:<PORT>/<DATABASE_NAME>?user=<USERNAME>&password=<PASSWORD>";
        var conn = DriverManager.getConnection(connUrl);

        var createSensorTableQuery = """
                CREATE TABLE sensors (
                    id SERIAL PRIMARY KEY,
                    type TEXT NOT NULL,
                    location TEXT NOT NULL
                )
                """;
        try (var stmt = conn.createStatement()) {
            stmt.execute(createSensorTableQuery);
        }

        var showAllTablesQuery = "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'";
        try (var stmt = conn.createStatement();
             var rs = stmt.executeQuery(showAllTablesQuery)) {
            System.out.println("Tables in the current database: ");
            while (rs.next()) {
                System.out.println(rs.getString("tablename"));
            }
        }
    }
}
```

Congratulations, you've successfully created a relational table in TimescaleDB using Java.

## Generate a hypertable

In TimescaleDB, the primary point of interaction with your data is a [hypertable][timescaledb-hypertable],
the abstraction of a single continuous table across all space and time intervals,
such that one can query it via standard SQL.

Virtually all user interactions with TimescaleDB are with hypertables.
Creating tables and indexes, altering tables, inserting data, and selecting data,
can (and should) all be executed on the hypertable.

A hypertable is defined by a standard schema with column names and types,
with at least one column specifying a time value.

### Step 1: Create sensors data table

First, we create `CREATE TABLE` SQL statement for our hypertable.
Notice how the hypertable has the compulsory time column:

```sql
CREATE TABLE sensor_data (
    time TIMESTAMPTZ NOT NULL,
    sensor_id INTEGER REFERENCES sensors (id),
    value DOUBLE PRECISION
);
```

### Step 2: Create hypertable for sensors data

Next, you can formulate the `SELECT` statement to convert the table we created in Step 1 into a hypertable.
Note that you must specify the table name to convert to a hypertable
and its time column name as the two arguments,
as mandated by the [`create_hypertable` docs][timescaledb-hypertable-create-docs]:

```sql
SELECT create_hypertable('sensor_data', 'time');
```

### Step 3: Execute previous steps from your Java code

Now you can bring it all together by executing the statement from step 1,
then executing the statement from step 2
and committing your changes to the database:

```java
package com.timescale.java;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;

public class Main {

    public static void main(String... args) {
        final var connUrl = "jdbc:postgresql://<HOSTNAME>:<PORT>/<DATABASE_NAME>?user=<USERNAME>&password=<PASSWORD>";
        try (var conn = DriverManager.getConnection(connUrl)) {
            createSchema(conn);
            insertData(conn);
        } catch (SQLException ex) {
            System.err.println(ex.getMessage());
        }
    }

    private static void createSchema(final Connection conn) throws SQLException {
        try (var stmt = conn.createStatement()) {
            stmt.execute("""
                    CREATE TABLE sensors (
                        id SERIAL PRIMARY KEY,
                        type TEXT NOT NULL,
                        location TEXT NOT NULL
                    )
                    """);
        }

        try (var stmt = conn.createStatement()) {
            stmt.execute("""
                    CREATE TABLE sensor_data (
                        time TIMESTAMPTZ NOT NULL,
                        sensor_id INTEGER REFERENCES sensors (id),
                        value DOUBLE PRECISION
                    )
                    """);
        }

        try (var stmt = conn.createStatement()) {
            stmt.execute("SELECT create_hypertable('sensor_data', 'time')");
        }
    }
}
```

Congratulations, you've successfully created a hypertable in your TimescaleDB database using Java.

## Insert a batch of rows into TimescaleDB

Here's a typical pattern you could use to insert some data into a table.
In the example below, insert the relational data from list of sensors,
into the relational table named `sensors`.

First, open a connection to the database,
then using prepared statements formulate the `INSERT` SQL statement
and then execute that statement:

```java
final List<Sensor> sensors = List.of(
        new Sensor("temperature", "bedroom"),
        new Sensor("temperature", "living room"),
        new Sensor("temperature", "outside"),
        new Sensor("humidity", "kitchen"),
        new Sensor("humidity", "outside"));
for (final var sensor : sensors) {
    try (var stmt = conn.prepareStatement("INSERT INTO sensors (type, location) VALUES (?, ?)")) {
        stmt.setString(1, sensor.type());
        stmt.setString(2, sensor.location());
        stmt.executeUpdate();
    }
}
```

You can insert a batch of rows into TimescaleDB in a couple of different ways.
Let's see what it looks like to insert a number of rows with batching mechanism.
For simplicity's sake, we'll use PostgreSQL to generate some sample time-series data in order
to insert into the `sensor_data` hypertable:

```java
final var sensorDataCount = 100;
final var insertBatchSize = 10;
try (var stmt = conn.prepareStatement("""
        INSERT INTO sensor_data (time, sensor_id, value)
        VALUES (
            generate_series(now() - INTERVAL '24 hours', now(), INTERVAL '5 minutes'),
            floor(random() * 4 + 1)::INTEGER,
            random()
        )
        """)) {
    for (int i = 0; i < sensorDataCount; i++) {
        stmt.addBatch();

        if ((i > 0 && i % insertBatchSize == 0) || i == sensorDataCount - 1) {
            stmt.executeBatch();
        }
    }
}
```

Below is a complete listing of the application, from creating tables to filling in the data:

```java
package com.timescale.java;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;

public class Main {

    public static void main(String... args) {
        final var connUrl = "jdbc:postgresql://<HOSTNAME>:<PORT>/<DATABASE_NAME>?user=<USERNAME>&password=<PASSWORD>";
        try (var conn = DriverManager.getConnection(connUrl)) {
            createSchema(conn);
            insertData(conn);
        } catch (SQLException ex) {
            System.err.println(ex.getMessage());
        }
    }

    private static void createSchema(final Connection conn) throws SQLException {
        try (var stmt = conn.createStatement()) {
            stmt.execute("""
                    CREATE TABLE sensors (
                        id SERIAL PRIMARY KEY,
                        type TEXT NOT NULL,
                        location TEXT NOT NULL
                    )
                    """);
        }

        try (var stmt = conn.createStatement()) {
            stmt.execute("""
                    CREATE TABLE sensor_data (
                        time TIMESTAMPTZ NOT NULL,
                        sensor_id INTEGER REFERENCES sensors (id),
                        value DOUBLE PRECISION
                    )
                    """);
        }

        try (var stmt = conn.createStatement()) {
            stmt.execute("SELECT create_hypertable('sensor_data', 'time')");
        }
    }

    private static void insertData(final Connection conn) throws SQLException {
        final List<Sensor> sensors = List.of(
                new Sensor("temperature", "bedroom"),
                new Sensor("temperature", "living room"),
                new Sensor("temperature", "outside"),
                new Sensor("humidity", "kitchen"),
                new Sensor("humidity", "outside"));
        for (final var sensor : sensors) {
            try (var stmt = conn.prepareStatement("INSERT INTO sensors (type, location) VALUES (?, ?)")) {
                stmt.setString(1, sensor.type());
                stmt.setString(2, sensor.location());
                stmt.executeUpdate();
            }
        }

        final var sensorDataCount = 100;
        final var insertBatchSize = 10;
        try (var stmt = conn.prepareStatement("""
                INSERT INTO sensor_data (time, sensor_id, value)
                VALUES (
                    generate_series(now() - INTERVAL '24 hours', now(), INTERVAL '5 minutes'),
                    floor(random() * 4 + 1)::INTEGER,
                    random()
                )
                """)) {
            for (int i = 0; i < sensorDataCount; i++) {
                stmt.addBatch();

                if ((i > 0 && i % insertBatchSize == 0) || i == sensorDataCount - 1) {
                    stmt.executeBatch();
                }
            }
        }
    }

    private record Sensor(String type, String location) {
    }
}
```

<highlight type="tip">
If you are inserting data from a CSV file, we recommend the [timescale-parallel-copy tool](https://github.com/timescale/timescaledb-parallel-copy),
which is a command line program for parallelizing PostgreSQL's built-in `COPY` functionality for bulk inserting data into TimescaleDB.
</highlight>

Congratulations, you've successfully inserted data into TimescaleDB using Java.

## Execute queries on TimescaleDB

### Step 1: Define the SQL query

First, define the SQL query you'd like to run on the database.
The example below contains a query which combines time-series and relational data.
It returns the average values for every 15 minute interval for sensors with specific type and location.

```sql
SELECT time_bucket('15 minutes', time) AS bucket, avg(value)
FROM sensor_data
JOIN sensors ON sensors.id = sensor_data.sensor_id
WHERE sensors.type = ? AND sensors.location = ?
GROUP BY bucket
ORDER BY bucket DESC;
```

Notice the use of placeholders for sensor type and location.

### Step 2: Execute the query

Now you can execute the query with the prepared statement and read out the result set
for all `a`-type sensors located on the `floor`:

```java
try (var stmt = conn.prepareStatement("""
        SELECT time_bucket('15 minutes', time) AS bucket, avg(value)
        FROM sensor_data
        JOIN sensors ON sensors.id = sensor_data.sensor_id
        WHERE sensors.type = ? AND sensors.location = ?
        GROUP BY bucket
        ORDER BY bucket DESC
        """)) {
    stmt.setString(1, "temperature");
    stmt.setString(2, "living room");

    try (var rs = stmt.executeQuery()) {
        while (rs.next()) {
            System.out.printf("%s: %f%n", rs.getTimestamp(1), rs.getDouble(2));
        }
    }
}
```

After executing the statement, you should see something like this in the console:

```text
2021-05-12 23:30:00.0: 0,508649
2021-05-12 23:15:00.0: 0,477852
2021-05-12 23:00:00.0: 0,462298
2021-05-12 22:45:00.0: 0,457006
2021-05-12 22:30:00.0: 0,568744
...
```

### Complete Java snippet for working with TimescaleDB

```java
package com.timescale.java;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;

public class Main {

    public static void main(String... args) {
        final var connUrl = "jdbc:postgresql://<HOSTNAME>:<PORT>/<DATABASE_NAME>?user=<USERNAME>&password=<PASSWORD>";
        try (var conn = DriverManager.getConnection(connUrl)) {
            createSchema(conn);
            insertData(conn);
            executeQueries(conn);
        } catch (SQLException ex) {
            System.err.println(ex.getMessage());
        }
    }

    private static void createSchema(final Connection conn) throws SQLException {
        try (var stmt = conn.createStatement()) {
            stmt.execute("""
                    CREATE TABLE sensors (
                        id SERIAL PRIMARY KEY,
                        type TEXT NOT NULL,
                        location TEXT NOT NULL
                    )
                    """);
        }

        try (var stmt = conn.createStatement()) {
            stmt.execute("""
                    CREATE TABLE sensor_data (
                        time TIMESTAMPTZ NOT NULL,
                        sensor_id INTEGER REFERENCES sensors (id),
                        value DOUBLE PRECISION
                    )
                    """);
        }

        try (var stmt = conn.createStatement()) {
            stmt.execute("SELECT create_hypertable('sensor_data', 'time')");
        }
    }

    private static void insertData(final Connection conn) throws SQLException {
        final List<Sensor> sensors = List.of(
                new Sensor("temperature", "bedroom"),
                new Sensor("temperature", "living room"),
                new Sensor("temperature", "outside"),
                new Sensor("humidity", "kitchen"),
                new Sensor("humidity", "outside"));
        for (final var sensor : sensors) {
            try (var stmt = conn.prepareStatement("INSERT INTO sensors (type, location) VALUES (?, ?)")) {
                stmt.setString(1, sensor.type());
                stmt.setString(2, sensor.location());
                stmt.executeUpdate();
            }
        }

        final var sensorDataCount = 100;
        final var insertBatchSize = 10;
        try (var stmt = conn.prepareStatement("""
                INSERT INTO sensor_data (time, sensor_id, value)
                VALUES (
                    generate_series(now() - INTERVAL '24 hours', now(), INTERVAL '5 minutes'),
                    floor(random() * 4 + 1)::INTEGER,
                    random()
                )
                """)) {
            for (int i = 0; i < sensorDataCount; i++) {
                stmt.addBatch();

                if ((i > 0 && i % insertBatchSize == 0) || i == sensorDataCount - 1) {
                    stmt.executeBatch();
                }
            }
        }
    }

    private static void executeQueries(final Connection conn) throws SQLException {
        try (var stmt = conn.prepareStatement("""
                SELECT time_bucket('15 minutes', time) AS bucket, avg(value)
                FROM sensor_data
                JOIN sensors ON sensors.id = sensor_data.sensor_id
                WHERE sensors.type = ? AND sensors.location = ?
                GROUP BY bucket
                ORDER BY bucket DESC
                """)) {
            stmt.setString(1, "temperature");
            stmt.setString(2, "living room");

            try (var rs = stmt.executeQuery()) {
                while (rs.next()) {
                    System.out.printf("%s: %f%n", rs.getTimestamp(1), rs.getDouble(2));
                }
            }
        }
    }

    private record Sensor(String type, String location) {
    }
}
```

Congratulations 🎉, you've successfully executed a query on TimescaleDB using Java and PostgreSQL JDBC!

## Next steps

Now that you're able to connect, read, and write to a TimescaleDB instance from your Java application,
be sure to check out these advanced tutorials:

*   Get up and running with TimescaleDB with our [Getting Started][timescaledb-getting-started] tutorial.
*   Refer to the [PostgreSQL JDBC Driver documentation][pg-jdbc-driver-docs] for more information.

[jdk]: https://openjdk.java.net
[pg-jdbc-driver-artifact]: https://jdbc.postgresql.org/download/
[pg-jdbc-driver-conn-docs]: https://jdbc.postgresql.org/documentation/datasource/
[pg-jdbc-driver-dependency]: https://mvnrepository.com/artifact/org.postgresql/postgresql
[pg-jdbc-driver-docs]: https://jdbc.postgresql.org/documentation/
[pg-jdbc-driver]: https://jdbc.postgresql.org
[timescaledb-getting-started]: /getting-started/:currentVersion:/
[timescaledb-hypertable-create-docs]: /api/:currentVersion:/hypertable/create_hypertable
[timescaledb-hypertable]: /timescaledb/:currentVersion:/overview/core-concepts/hypertables-and-chunks/
[timescaledb-install]: /install/latest/
