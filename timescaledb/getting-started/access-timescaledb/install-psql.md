# Tutorial: How to install psql on Mac, Ubuntu, Debian, Windows

### Introduction
`psql` is the standard command line interface for interacting with a PostgreSQL 
or TimescaleDB instance. Here we explain how to install `psql` on various platforms.

### Before you start
Before you start, you should confirm that you don’t already have `psql` installed. 
In fact, if you’ve ever installed Postgres or TimescaleDB before, you likely already 
have `psql` installed.

```bash
psql --version
```

### Install on macOS using Homebrew
First, install the [Brew Package Manager][brew-package-manager]. Homebrew simplifies
the installation of software on macOS.

Second, update `brew`. From your command line, run the following commands:

```bash
brew doctor
brew update
brew install libpq
```

Finally, create a symbolic link to `psql` (and other `libpq` tools) into `/usr/local/bin`
so that you can reach it from any command on the macOS Terminal.

```bash
brew link --force libpq ail
```

### Install on Ubuntu 16.04,18.04 and Debian 9,10
Install on Ubuntu and Debian using the `apt` package manager:

```bash
sudo apt-get update
sudo apt-get install postgresql-client
```

>:TIP: This only installs the `psql` client and not the PostgreSQL database.

### Install on Windows 10
We recommend using the installer from [PostgreSQL.org][windows-installer].

### Last step: Connect to your PostgreSQL server
Let’s confirm that `psql` is installed:

```bash
psql --version
```

Now, in order to connect to your PostgreSQL server, you’ll need the following 
connection parameters:
- Hostname
- Port
- Username
- Password
- Database name

There are two ways to use these parameters to connect to your PostgreSQL database.

#### Option 1: Supply parameters at the command line
In this method, use parameter flags on the command line to supply the required
information to connect to a PostgreSQL database: 

```bash
psql -h HOSTNAME -p PORT -U USERNAME -W -d DATABASENAME
```

Once you run that command, the prompt will ask you for your password. (This is the purpose 
of the `-W` flag.)

#### Option 2: Use a service URI
The Service URI begins with `postgres://`.

```bash
psql postgres://[USERNAME]:[PASSWORD]@[HOSTNAME]:[PORT]/[DATABASENAME]?sslmode=require
```

### Fun things to do with psql

#### Common psql commands
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

#### Save results of a query to a comma-separated file
You may often find yourself running SQL queries with lengthy results. You can save these
results to a comma-separated file (CSV) using the `COPY` command:

```sql
\copy (SELECT * FROM ...) TO '/tmp/myoutput.csv' (format CSV);
```

You would then be able to open `/tmp/myoutput.csv` using any spreadsheet or similar
program that reads CSV files.

#### Edit a SQL query in an editor
Sometimes you may find yourself writing a lengthy query such as this one from our
[Hello Timescale!][hello-timescale] tutorial:

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
then be edited, and once you save ("Escape-Colon-W-Q") your edits, the command will 
appear in the buffer. You will be able to get back to it by pressing the up arrow
in your Terminal window.

Congrats! Now you have connected via `psql`.

[brew-package-manager]: https://brew.sh/
[windows-installer]: https://www.postgresql.org/download/windows/
[hello-timescale]: /tutorials/tutorial-hello-timescale