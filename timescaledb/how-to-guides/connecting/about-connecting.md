# Connecting to TimescaleDB
Regardless of the tool you use to connect to your database, you need to make
sure you have these details:
*   Hostname
*   Port
*   Username
*   Password
*   Database name

## Find connection details in Timescale Cloud
To retrieve your connection details from a running Timescale Cloud service:

<procedure>

### Finding connection details in Timescale Cloud
1.  Sign in to the [Timescale Cloud portal][tsc-portal].
1.  In the `Services` tab, find the service you want to connect to, and check
    it is marked as `Running`.
1.  Click the name of the service you want to connect to, to see the connection
    information. Take a note of the `Service URL`. The URL contains all the
    information you need to connect to your service, except for the password.
1.  If you don't know the password for the service, navigate to the `Operations`
    tab, and click `Reset password`. You can choose your own password, or allow
    Timescale Cloud to generate a secure password for you. Take a note of your
    new password.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-connection-info.png" alt="View Timescale Cloud connection info"/>

</procedure>

## Find connection details in Managed Service for TimescaleDB
To retrieve your connection details from a running Managed Service for Timescale
service:

<procedure>

### Finding connection details in Managed Service for TimescaleDB
1.  Sign in to the [Managed Service for TimescaleDB portal][mst-portal].
1.  In the `Services` tab, find the service you want to connect to, and check
    it is marked as `Running`.
1.  Click the name of the service you want to connect to, to see the connection
    information. Take a note of the `host`, `port`, and `password`.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/mst-connection-info.png" alt="View Managed Service for TimescaleDB connection info"/>

</procedure>

## Find connection details in self-hosted TimescaleDB
If you have installed your database on your local system, you can use the
`localhost` hostname to log in as the PostgreSQL root user `postgres`. When you
have connected using these details, we strongly recommend that you set up an
additional user for accessing your database, and add additional authentication
requirements.




## Connect to your PostgreSQL server
In order to connect to your PostgreSQL server, you’ll need the following
connection parameters:
- Hostname
- Port
- Username
- Password
- Database name

There are two ways to use these parameters to connect to your PostgreSQL database.

### Option 1: Supply parameters at the command line
In this method, use parameter flags on the command line to supply the required
information to connect to a PostgreSQL database:

```bash
psql -h HOSTNAME -p PORT -U USERNAME -W -d DATABASENAME
```

Once you run that command, the prompt asks you for your password. (This is the purpose
of the `-W` flag.)

### Option 2: Use a service URI
The Service URI begins with `postgres://`.

```bash
psql postgres://[USERNAME]:[PASSWORD]@[HOSTNAME]:[PORT]/[DATABASENAME]?sslmode=require
```

## Fun things to do with psql

### Common psql commands
Here is a table of common commands you'll find yourself using a lot:

| Command       |      Actions                             |
|---------------|------------------------------------------|
|`\l`	          | List available databases                 |
|`\c dbname`    | Connect to a new database                |
|`\dt`	        | List available tables                    |
|`\d tablename` | Describe the details of given table      |
|`\dn`          | List all schemas in the current database |
|`\df`          | List functions in the current database   |
|`\h`           | Get help on syntax of SQL commands       |
|`\?`           | Lists all `psql` slash commands          |
|`\set`         | System variables list                    |
|`\timing`      | Shows how long a query took to execute   |
|`\x`           | Show expanded query results              |
|`\q`           | Quit `psql`                              |

### Save results of a query to a comma-separated file
You may often find yourself running SQL queries with lengthy results. You can save these
results to a comma-separated file (CSV) using the `COPY` command:

```sql
\copy (SELECT * FROM ...) TO '/tmp/myoutput.csv' (format CSV);
```

You would then be able to open `/tmp/myoutput.csv` using any spreadsheet or similar
program that reads CSV files.

### Edit a SQL query in an editor
Sometimes you may find yourself writing a lengthy query such as this one below:

```sql
-- For each airport: num trips, avg trip duration, avg cost, avg tip, avg distance, min distance, max distance, avg number of passengers
SELECT rates.description, COUNT(vendor_id) AS num_trips,
   AVG(dropoff_datetime - pickup_datetime) AS avg_trip_duration, AVG(total_amount) AS avg_total,
   AVG(tip_amount) AS avg_tip, MIN(trip_distance) AS min_distance, AVG (trip_distance) AS avg_distance, MAX(trip_distance) AS max_distance,
   AVG(passenger_count) AS avg_passengers
 FROM rides
 JOIN rates ON rides.rate_code = rates.rate_code
 WHERE rides.rate_code IN (2,3) AND pickup_datetime < '2016-02-01'
 GROUP BY rates.description
 ORDER BY rates.description;
```

It would be pretty common to make an error the first couple of times you attempt to
write something that long in SQL. Instead of re-typing every line or character,
you can launch a `vim` editor using the `\e` command. Your previous command can
then be edited, and once you save ("Escape-Colon-W-Q") your edits, the command  
appears in the buffer. You can get back to it by pressing the up arrow
in your Terminal window.

Congrats! Now you have connected via `psql`.


[tsc-portal]: https://console.cloud.timescale.com/
[mst-portal]: https://portal.managed.timescale.com
