---
title: "Quick Start: Java and TimescaleDB"
excerpt: Get started with TimescaleDB for a Java application
keywords: [Java]
---

import Intro from "versionContent/_partials/_quickstart-intro.mdx";

# Java quick start

<Intro />

This quick start guide walks you through:

*   [Connecting to TimescaleDB][connect]
*   [Creating a relational table][create-table]
*   [Creating a hypertable][create-a-hypertable]
*   [Inserting data][insert]
*   [Executing a query][query]

## Prerequisites

Before you start, make sure you have:

*   Installed TimescaleDB. For more information, see the
    [installation documentation][install].
*   Installed the [Java Development Kit (JDK)][jdk].
*   Installed the [PostgreSQL JDBC driver][pg-jdbc-driver].

All code in this quick start is for Java&nbsp;16 and later. If you are working
with older JDK versions, use legacy coding techniques.

## Connect to TimescaleDB

In this section, you create a connection to TimescaleDB using an application in
a single file. You can use any of your favorite build tools, including `gradle`
or `maven`.

<procedure>

<Collapsible heading="Connecting to TimescaleDB" headingLevel={3}>

1.  Create a directory containing a text file called `Main.java`, with this content:

    ```java
    package com.timescale.java;

    public class Main {

        public static void main(String... args) {
            System.out.println("Hello, World!");
        }
    }
    ```

1.  From the command line in the current directory, run the application:

    ```bash
    java Main.java
    ```

    If the command is successful, `Hello, World!` line output is printed
    to your console.

1.  Import the PostgreSQL JDBC driver. If you are using a dependency manager,
   include the [PostgreSQL JDBC Driver][pg-jdbc-driver-dependency] as a
   dependency.

1.  Download the [JAR artifact of the JDBC Driver][pg-jdbc-driver-artifact] and
   save it with the `Main.java` file.

1.  Import the `JDBC Driver` into the Java application and display a list of
   available drivers for the check:

    ```java
    package com.timescale.java;

    import java.sql.DriverManager;

    public class Main {

        public static void main(String... args) {
            DriverManager.drivers().forEach(System.out::println);
        }
    }
    ```

1.  Run all the examples:

    ```bash
    java -cp *.jar Main.java
    ```

If the command is successful, a string similar to
`org.postgresql.Driver@7f77e91b` is printed to your console. This means that you
are ready to connect to TimescaleDB from Java.

1.  Locate your TimescaleDB credentials and use them to compose a connection
   string for JDBC.

    You'll need:

      *   password
      *   username
      *   host URL
      *   port
      *   database name

1.  Compose your connection string variable, using this format:

    ```java
    var connUrl = "jdbc:postgresql://<HOSTNAME>:<PORT>/<DATABASE_NAME>?user=<USERNAME>&password=<PASSWORD>";
    ```

    For more information about creating connection strings, see the [JDBC documentation][pg-jdbc-driver-conn-docs].

    <highlight type="warning">
    This method of composing a connection string is for test or development
    purposes only. For production, use environment variables for sensitive
    details like your password, hostname, and port number.
    </highlight>

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

1.  Run the code:

    ```bash
    java -cp *.jar Main.java
    ```

    If the command is successful, a string similar to
    `{ApplicationName=PostgreSQL JDBC Driver}` is printed to your console.

</Collapsible>

</procedure>

## Create a relational table

In this section, you create a table called `sensors` which holds the ID, type,
and location of your fictional sensors. Additionally, you create a hypertable
called `sensor_data` which holds the measurements of those sensors. The
measurements contain the time, sensor_id, temperature reading, and CPU
percentage of the sensors.

<procedure>

<Collapsible heading="Creating a relational table" headingLevel={3}>

1.  Compose a string which contains the SQL statement to create a relational
    table. This example creates a table called `sensors`, with columns `id`,
    `type` and `location`:

    ```sql
    CREATE TABLE sensors (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL,
        location TEXT NOT NULL
    );
    ```

1.  Create a statement, execute the query you created in the previous step, and
    check that the table was created successfully:

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

</Collapsible>

</procedure>

## Create a hypertable

When you have created the relational table, you can create a hypertable.
Creating tables and indexes, altering tables, inserting data, selecting data,
and most other tasks are executed on the hypertable.

<procedure>

<Collapsible heading="Creating a hypertable" headingLevel={3}>

1.  Create a `CREATE TABLE` SQL statement for
    your hypertable. Notice how the hypertable has the compulsory time column:

    ```sql
    CREATE TABLE sensor_data (
        time TIMESTAMPTZ NOT NULL,
        sensor_id INTEGER REFERENCES sensors (id),
        value DOUBLE PRECISION
    );
    ```

1.  Create a statement, execute the query you created in the previous step:

```sql
SELECT create_hypertable('sensor_data', by_range('time'));
```

1.  Execute the two statements you created, and commit your changes to the
    database:

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
                stmt.execute("SELECT create_hypertable('sensor_data', by_range('time'))");
            }
        }
    }
    ```

</Collapsible>

</procedure>

## Insert data

You can insert data into your hypertables in several different ways. In this
section, you can insert single rows, or insert by batches of rows.

<procedure>

<Collapsible heading="Inserting single rows into TimescaleDB" headingLevel={3}>

1.  Open a connection to the database, use prepared statements to formulate the
    `INSERT` SQL statement, then execute the statement:

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

</Collapsible>

</procedure>

If you want to insert a batch of rows by using a batching mechanism. In this
example, you generate some sample time-series data to insert into the
`sensor_data` hypertable:

<procedure>

<Collapsible
heading="Inserting batches of rows into TimescaleDB"
headingLevel={3}
defaultExpanded={false}>

1.  Insert batches of rows:

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

</Collapsible>

</procedure>

## Execute a query

This section covers how to execute queries against your database.

<procedure>

<Collapsible heading="Executing a simple query" headingLevel={3}>

## Execute queries on TimescaleDB

1.  Define the SQL query you'd like to run on the database. This example
    combines time-series and relational data. It returns the average values for
    every 15 minute interval for sensors with specific type and location.

    ```sql
    SELECT time_bucket('15 minutes', time) AS bucket, avg(value)
    FROM sensor_data
    JOIN sensors ON sensors.id = sensor_data.sensor_id
    WHERE sensors.type = ? AND sensors.location = ?
    GROUP BY bucket
    ORDER BY bucket DESC;
    ```

1.  Execute the query with the prepared statement and read out the result set for
   all `a`-type sensors located on the `floor`:

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

    If the command is successful, you'll see output like this:

    ```bash
    2021-05-12 23:30:00.0: 0,508649
    2021-05-12 23:15:00.0: 0,477852
    2021-05-12 23:00:00.0: 0,462298
    2021-05-12 22:45:00.0: 0,457006
    2021-05-12 22:30:00.0: 0,568744
    ...
    ```

</Collapsible>

</procedure>

## Next steps

Now that you're able to connect, read, and write to a TimescaleDB instance from
your Java application, and generate the scaffolding necessary to build a new
application from an existing TimescaleDB instance, be sure to check out these
advanced TimescaleDB tutorials:

*   [Continuous Aggregates][continuous-aggregates]
*   [Migrate Your own Data][migrate]

## Complete code samples

This section contains complete code samples.

<Collapsible heading="Complete code sample" headingLevel={3} defaultExpanded={false}>

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
            stmt.execute("SELECT create_hypertable('sensor_data', by_range('time'))");
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

</Collapsible>

<Collapsible heading="Executing more complex queries" headingLevel={3} defaultExpanded={false}>

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
            stmt.execute("SELECT create_hypertable('sensor_data', by_range('time'))");
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

</Collapsible>

[jdk]: https://openjdk.java.net
[pg-jdbc-driver-artifact]: https://jdbc.postgresql.org/download/
[pg-jdbc-driver-conn-docs]: https://jdbc.postgresql.org/documentation/datasource/
[pg-jdbc-driver-dependency]: https://mvnrepository.com/artifact/org.postgresql/postgresql
[pg-jdbc-driver]: https://jdbc.postgresql.org
[connect]: #connect-java-to-timescaledb
[create-table]: #create-a-relational-table
[create-a-hypertable]: #create-a-hypertable
[insert]: #insert-a-batch-of-rows-into-timescaledb
[query]: #execute-queries-on-timescaledb
[install]: /getting-started/latest/
[continuous-aggregates]: /use-timescale/:currentVersion:/continuous-aggregates/
[migrate]: /migrate/:currentVersion:/
