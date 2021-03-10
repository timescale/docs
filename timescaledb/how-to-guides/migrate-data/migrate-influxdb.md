# Getting Started with Outflux

Designed to help users seamlessly migrate from InfluxDB to TimescaleDB, Outflux enables users to pipe exported data directly into TimescaleDB.
Outflux manages the schema discovery, validation, and creation for you.
It’s easy to use, configurable, and most importantly, it’s fast.

## Installation [](outflux-installation)

### Before we start

Before we start, you will need the following setup:
* A running instance of InfluxDB at a known location and a means to connect to it
* [TimescaleDB installed][getting-started] and a means to connect to it
* And if you need to import some sample data, the [InfluxDB Command Line Interface][influx-cmd]

### Setting up Outflux

If all the pre-requirements are met, you can start installing Outflux. Outflux is an open-source tool and the code is available on [GitHub as a public repository][github-outflux]. We publish builds for Linux, Windows and MacOS.
1. Visit the [releases section][outflux-releases] of the repository
2. Download the latest compressed tarball for your platform
3. Extract it to a preferred location

If you navigate to where you extracted the archive and execute:

```
$ ./outflux --help
Outflux offers the capabilities to migrate an InfluxDB database, or specific measurements to TimescaleDB.
It can also allow a user to transfer only the schema of a database or measurement to TimescaleDB

Usage:
  outflux [command]

Available Commands:
  help            Help about any command
  migrate         Migrate the schema and data from InfluxDB measurements into TimescaleDB hypertables
  schema-transfer Discover the schema of measurements and validate or prepare a TimescaleDB hyper-table
                  with the discovered schema
```

You will see the help output for Outflux, a brief explanation of what it can do, the usage, and available commands.

For instructions on how to set up Outflux from source you can visit the [README][outflux-readme].

## Importing Sample Data [](import)

If you don’t already have an existing InfluxDB database, you can try Outflux by importing this example file with data written in the Influx Line Protocol found at https://timescaledata.blob.core.windows.net/datasets/outflux_taxi.txt

You can use the Influx CLI client to load the data. The file will first create the “outflux_tutorial” database and then do 2741 inserts.

```
$ influx -import -path=outflux_taxit.txt -database=outflux_tutorial
2019/03/27 11:39:11 Processed 1 commands
2019/03/27 11:39:11 Processed 2741 inserts
2019/03/27 11:39:11 Failed 0 inserts
```

The data in the file is without a timestamp so the current time of the Influx server will be used at the time of insert.
All the data points belong to one measurement `taxi`. The points are tagged with location, rating, and vendor. Four fields are recorded: fare, mta_tax, tip, and tolls.
The `influx` client assumes the server is available at `http://localhost:8086` by default.

## Schema Discovery, Validation and Transfer [](schema)

One of Outflux’s features is the ability to discover the schema of an InfluxDB measurement and either validate that a TimescaleDB table exists that can hold the transferred data, or create a new table that can satisfy the schema requirements.

We can now create a TimescaleDB hypertable ready to receive the demo data we inserted into the InfluxDB instance. If you followed the tutorial and inserted the data from the example, there should be a `taxi` measurement in the `outflux_tutorial` database in the InfluxDB instance.

The `schema-transfer` command of Outflux can work with 4 schema strategies:
* `ValidateOnly`: checks if the TimescaleDB extension is installed, a specified database has a hypertable with the proper columns, and if it’s partitioned properly, but will not perform modifications
* `CreateIfMissing`: runs all checks that `ValidateOnly` does and creates and properly partitions any missing hypertables
* `DropAndCreate`: drops any existing table with the same name as the measurement, and creates a new hypertable and partitions it properly
* `DropCascadeAndCreate`: performs the same action as DropAndCreate with the additional strength of executing a cascade table drop if there is an existing table with the same name as the measurement

The `schema-transfer` command can be called with parameters that specify the schema strategy, and if the user wants the tags or fields of a measure to be transferred as a single JSONB column. By default each tag and each field is created as a separate column.

We can run `schema-transfer` with Outflux on our example data with:

```
$ outflux schema-transfer outflux_tutorial taxi \
 --input-server=http://localhost:8086 \
 --output-conn="dbname=postgres user=postgres"
```

The `schema-transfer` command is executed by specifying the database (`outflux_tutorial`) and then the measurements (`taxi`).
If no measurements are specified, all measurements in a database will be transferred.
The location of the InfluxDB server is specified with the `--input-server` flag.
The target database and other connection options are specified with the `--output-conn` flag.
Here we’re using the `postgres` user and database to connect to our server.
How to specify usernames, passwords and many more configuration options about the input and output connections (including which environment variables are recognized) can be discovered on the [GitHub repo for Outflux][outflux-connection].
By default, `schema-transfer` executes with the `CreateIfMissing` strategy.

Here’s an example output of running Outflux `schema-transfer` with the `DropAndCreate` strategy and having all tags in a single JSONB column:

```
$ outflux schema-transfer outflux_tutorial taxi \
 --input-server=http://localhost:8086 \
 --output-conn="dbname=postgres user=postgres" \
 --schema-strategy=DropAndCreate \
 --tags-as-json     
2019/03/27 12:10:30 Selected input database: outflux_tutorial
2019/03/27 12:10:30 Overriding PG environment variables for connection with: dbname=postgres
user=postgres
2019/03/27 12:10:30 Tags for measure 'taxi' will be combined into a single JSONB column
2019/03/27 12:10:30 pipe_taxi starting execution
2019/03/27 12:10:30 Discovering influx schema for measurement: taxi
2019/03/27 12:10:30 Discovered: DataSet { Name: taxi, Columns: [Column... 2019/03/27 12:10:30
Selected Schema Strategy: DropAndCreate
2019/03/27 12:10:30 Table taxi exists, dropping it
2019/03/27 12:10:30 Executing: DROP TABLE taxi
2019/03/27 12:10:30 Table taxi ready to be created
2019/03/27 12:10:30 Creating table with:
 CREATE TABLE "taxi"("time" TIMESTAMP, "tags" JSONB, "fare" FLOAT, "mta_tax" FLOAT, "tip" FLOAT, "tolls" FLOAT)
2019/03/27 12:10:30 Preparing TimescaleDB extension:
CREATE EXTENSION IF NOT EXISTS timescaledb
2019/03/27 12:10:30 Creating hypertable with: SELECT create_hypertable('"taxi"', 'time');
2019/03/27 12:10:30 No data transfer will occur
2019/03/27 12:10:30 Schema Transfer complete in: 0.056 seconds
```

## Data Migration [](migration)

Schema transfer is useful, but it’s not what we built Outflux for.
You can do schema-transfer *and* data migration in one with the `migrate` command.
The connection options available are the same (and you can check them out on the [public repo][outflux-connection]).
You can transfer a complete InfluxDB database with each measurement being exported as a separate table, or you can select which measurements to export.

You can transfer all of the example data from the `taxi` measurement in the `outflux_tutorial` database with the command:

```
$ outflux migrate outflux_tutorial taxi \
 --input-server=http://localhost:8086 \
 --output-conn="dbname=postgres user=postgres" \
 --schema-strategy=DropAndCreate
```

Here we’re using the DropAndCreate strategy that will drop any previous table named `cpu` and create it before piping the data.
The migrate command supports several flags that offer the user flexibility in the selection of data to be migrated.
One of them is the `--limit` flag that will only export the first N rows from the InfluxDB database ordered by time.
The output of the migrate command with a N=10 limit should look like this:

```
$ outflux migrate outflux_tutorial taxi \
 --input-server=http://localhost:8086 \
 --output-conn="dbname=postgres user=postgres" \
 --schema-strategy=ValidateOnly --limit=10
2019/03/27 12:15:01 All pipelines scheduled
2019/03/27 12:15:01 Overriding PG environment variables for connection with: dbname=postgres
user=postgres
2019/03/27 12:15:01 pipe_taxi starting execution
2019/03/27 12:15:01 Discovering influx schema for measurement: taxi
2019/03/27 12:15:01 Discovered: DataSet { Name: taxi, Columns: [Column {... 2019/03/27 12:15:01
Selected Schema Strategy: ValidateOnly
2019/03/27 12:15:01 Table taxi exists. Proceeding only with validation
2019/03/27 12:15:01 existing hypertable 'taxi' is partitioned properly
2019/03/27 12:15:01 Starting extractor 'pipe_taxi_ext' for measure: taxi
2019/03/27 12:15:01 Starting data ingestor 'pipe_taxi_ing'
2019/03/27 12:15:01 pipe_taxi_ext: Extracting data from database 'outflux_tutorial'
2019/03/27 12:15:01 pipe_taxi_ext: SELECT "time", "location_id", "rating", "vendor", "fare",
"mta_tax", "tip", "tolls"
FROM "taxi"
LIMIT 10
2019/03/27 12:15:01 pipe_taxi_ext:Pulling chunks with size 15000
2019/03/27 12:15:01 Will batch insert 8000 rows at once. With commit strategy: CommitOnEachBatch
2019/03/27 12:15:01 pipe_taxi_ext: Extracted 10 rows from Influx
2019/03/27 12:15:01 pipe_taxi_ing: Complete. Inserted 10 rows.
2019/03/27 12:15:01 All pipelines finished
2019/03/27 12:15:01 Migration execution time: 0.055 seconds
```

Another way to select the exported data are the `--from` and `--to` flags to specify a narrower time-window to export.
To export data only after January 1, 2020 execute the command:

```
$ outflux migrate outflux_tutorial cpu \
 --input-server=http://localhost:8086 \
 --output-conn="dbname=postgres user=postgres" \
 --schema-strategy=ValidateOnly --from=2020-01-01T00:00:00Z
```

If you follow the output closely, you can see that the data is pulled from the InfluxDB server in chunks, by default sized 15000, but can be changed by specifying the `--chunk-size` flag.
The data is inserted in batches of 8000 rows (by default), which can also be modified by the flag `--batch-size`. All the possible flags for the migrate command are listed in the GitHub documentation (https://github.com/timescale/outflux#migrate) or you can see them by executing:

```
$ outflux migrate --help
```

## Next Steps

Once you have migrated to TimescaleDB, you can begin to familiarize yourself with our [architecture][] and [API reference][].

Additionally, we have several other [tutorials][] available for you to explore as you become accustomed to working with TimescaleDB.

[getting-started]: /getting-started
[influx-cmd]: https://docs.influxdata.com/influxdb/v1.7/tools/shell/
[github-outflux]: https://github.com/timescale/outflux
[outflux-releases]: https://github.com/timescale/outflux/releases
[outflux-readme]: https://github.com/timescale/outflux/blob/master/README.md
[outflux-connection]: https://github.com/timescale/outflux#connection
[architecture]: /introduction/architecture
[API reference]: /api
[tutorials]: /tutorials
