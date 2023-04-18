---
title: Migrate data to Timescale from InfluxDB
excerpt: Mgirate data into Timescale using the Outflux tool
products: [self_hosted]
keywords: [data migration, InfluxDB]
tags: [import, Outflux]
---

# Migrate data to Timescale from InfluxDB

You can migrate data to Timescale from InfluxDB using the Outflux tool.
[Outflux][outflux] is an open source tool built by Timescale for fast, seamless
migrations. It pipes exported data directly to Timescale, and manages schema
discovery, validation, and creation.

<Highlight type="important">
Outflux works with earlier versions of InfluxDB. It does not work with InfluxDB
version 2 and later.
</Highlight>

## Prerequisites

Before you start, make sure you have:

*   A running instance of InfluxDB and a means to connect to it.
*   An [installation of Timescale][install] and a means to connect to it.
*   Data in your InfluxDB instance. If you need to import some sample data for a
    test, see the instructions for [importing sample data][import-data].

## Procedures

To import data from Outflux, follow these procedures:

1.  [Install Outflux](#install-outflux)
1.  [Import sample data](#import-sample-data-into-influxdb) to InfluxDB if you
    don't have existing data.
1.  [Discover, validate, and transfer
    schema](#discover-validate-and-transfer-schema) to Timescale (optional)
1.  [Migrate data to Timescale](#migrate-data-to-timescaledb)

## Install Outflux

Install Outflux from the GitHub repository. There are builds for Linux, Windows,
and MacOS.

<Procedure>

### Installing Outflux

1.  Go to the [releases section][outflux-releases] of the Outflux repository.
1.  Download the latest compressed tarball for your platform.
1.  Extract it to a preferred location.

<Highlight type="note">
If you prefer to build Outflux from source, see the [Outflux
README](https://github.com/timescale/outflux/blob/master/README.md) for
instructions.
</Highlight>

</Procedure>

To get help with Outflux, you can run `./outflux --help` from the directory
where you installed it.

## Import sample data into InfluxDB

If you don't have an existing InfluxDB database, or if you want to test on a
sample instance, you can try Outflux by importing sample data. We provide an
example file with data written in the Influx Line Protocol.

<Procedure>

### Importing sample data into InfluxDB

1.  Download the sample data:
    <Tag type="download">
      [Outflux taxi data](https://timescaledata.blob.core.windows.net/datasets/outflux_taxi.txt)
    </Tag>
1.  Use the [Influx CLI client][influx-cmd] to load the data into InfluxDB.

    ```bash
    influx -import -path=outflux_taxi.txt -database=outflux_tutorial
    ```

    This command imports the data into a new database named `outflux_tutorial`.

<Highlight type="note">
The sample data has no timestamp, so the time of the Influx server is used at
data insert. All data points belong to one measurement, `taxi`. The points are
tagged with `location`, `rating`, and `vendor`. Four fields are recorded:
`fare`, `mta_tax`, `tip`, and `tolls`. The Influx client assumes the server is
available at `http://localhost:8086`.
</Highlight>

</Procedure>

## Discover, validate, and transfer schema

Outflux can:

*   Discover the schema of an InfluxDB measurement
*   Validate whether a Timescale table exists that can hold the transferred
    data
*   Create a new table to satisfy the schema requirements if no valid table
    exists

<Highlight type="note">
Outflux's `migrate` command does schema transfer and data migration in one step.
For more information, see the [migrate](#migrate-data-to-timescaledb) section.
Use this section if you want to validate and transfer your schema independently
of data migration.
</Highlight>

To transfer your schema from InfluxDB to Timescale, run `outflux
schema-transfer`:

```bash
outflux schema-transfer <DATABASE_NAME> <INFLUX_MEASUREMENT_NAME> \
--input-server=http://localhost:8086 \
--output-conn="dbname=tsdb user=tsdbadmin"
```

To transfer all measurements from the database, leave out the measurement name
argument.

<Highlight type="note">
This example uses the `postgres` user and database to connect to the Timescale
database. For other connection options and configuration, see the [Outflux
Github repo](https://github.com/timescale/outflux#connection).
</Highlight>

### Schema transfer options

Outflux's `schema-transfer` can use 1 of 4 schema strategies:

*   `ValidateOnly`: checks that Timescale is installed and that the specified
    database has a properly partitioned hypertable with the correct columns, but
    doesn't perform modifications
*   `CreateIfMissing`: runs the same checks as `ValidateOnly`, and creates and
    properly partitions any missing hypertables
*   `DropAndCreate`: drops any existing table with the same name as the
    measurement, and creates a new hypertable and partitions it properly
*   `DropCascadeAndCreate`: performs the same action as `DropAndCreate`, and
    also executes a cascade table drop if there is an existing table with the
    same name as the measurement

You can specify your schema strategy by passing a value to the
`--schema-strategy` option in the `schema-transfer` command. The default
strategy is `CreateIfMissing`.

By default, each tag and field in InfluxDB is treated as a separate column in
your Timescale tables. To transfer tags and fields as a single JSONB column,
use the flag `--tags-as-json`.

## Migrate data to Timescale

Transfer your schema and migrate your data all at once with the `migrate`
command.

For example, run:

```bash
outflux migrate <DATABASE_NAME> <INFLUX_MEASUREMENT_NAME> \
--input-server=http://localhost:8086 \
--output-conn="dbname=tsdb user=tsdbadmin"
```

The schema strategy and connection options are the same as for
`schema-transfer`. For more information, see the
[`schema-transfer`](#discover-validate-and-transfer-schema) section.

In addition, `outflux migrate` also takes the following flags:

*   `--limit`: Pass a number, `N`, to `--limit` to export only the first `N`
    rows, ordered by time.
*   `--from` and `to`: Pass a timestamp to `--from` or `--to` to specify a time
    window of data to migrate.
*   `chunk-size`: Changes the size of data chunks transferred. Data is pulled
    from the InfluxDB server in chunks of default size 15 000.
*   `batch-size`: Changes the number of rows in an insertion batch. Data is
    inserted into Timescale in batches that are 8000 rows by default.

For more flags, see the [Github documentation for `outflux
migrate`][outflux-migrate]. Alternatively, see the command line help:

```bash
outflux migrate --help
```

[import-data]: #import-sample-data-into-influxdb
[influx-cmd]: https://docs.influxdata.com/influxdb/v1.7/tools/shell/
[install]: /getting-started/latest/
[outflux-migrate]: https://github.com/timescale/outflux#migrate
[outflux-releases]: https://github.com/timescale/outflux/releases
[outflux]: https://github.com/timescale/outflux
