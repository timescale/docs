# Migrate schema and data separately

Migrate larger databases by first migrating your schema. Then copy each table or
chunk separately. This allows you to restart midway if one copy operation
fails.

Follow the procedures below to migrate your database:

- [Migrate schema pre-data](#migrate-schema-pre-data)
- [Restore hypertables in Timescale Cloud](#restore-hypertables-in-timescale-cloud)
- [Copy data from Managed Service for TimescaleDB](#copy-data-from-managed-service-for-timescaledb)
- [Restore data into Timescale Cloud](#restore-data-into-timescale-cloud)
- [Migrate schema post-data](#migrate-schema-post-data)
- [Recreate continuous aggregates](#recreate-continuous-aggregates) (optional)
- [Recreate policies](#recreate-policies) (optional)
- [Recompress previously compressed data](#recompress-data) (optional)

<highlight type="warning"> 
Depending on your database size and  network speed, steps that involve copying 
data may take several hours. You can continue reading from your old database
during this time, though performance may be slower. If writes are made to your
old tables while `\COPY` is running, the new writes might not be transferred to Timescale Cloud. Plan your migration accordingly to avoid data loss. 
</highlight>

## Prerequisites

- Check that the PostgreSQL utilities [`pg_dump`][pg_dump] and
  [`pg_restore`][pg_restore] are installed on your system:

  ```bash
  pg_dump --version
  ```

  ```bash
  pg_restore --version
  ```

- Check that you have a client for connecting to PostgreSQL. These instructions
  assume that you're using [psql][psql], but any client will work.

- Create a new empty database in Timescale Cloud. For instructions on installing
  Timescale Cloud, see [Install Timescale Cloud][install-timescale-cloud].

- Check that you're running the same major version of PostgreSQL on both Managed
  Service for TimescaleDB and Timescale Cloud. To upgrade PostgreSQL on Managed
  Service for TimescaleDB, refer to the article on [upgrading
  PostgreSQL][upgrading-postgresql].

- Check that you're running the same major version of TimescaleDB on both
  Managed Service for TimescaleDB and Timescale Cloud. To upgrade your version,
  refer to the section on [upgrading TimescaleDB][upgrading-timescaledb].

## Migrate schema pre-data

Migrate your pre-data from Managed Service for TimescaleDB to Timescale Cloud.
This includes table and schema definitions, as well as information on sequences,
owners, and settings. This doesn't include Timescale-specific schemas. 

### Migrating schema pre-data

<procedure>

1. Dump schema pre-data from Managed Service for TimescaleDB into a .bak file.
   Exclude Timescale-specific schemas:

   ```bash
   # Use your Managed Service for TimescaleDB connection details in place of 
   # <mst_host> and <mst_port>.
   pg_dump -U tsdbadmin -W -h <mst_host> -p <mst_port> -Fc -v \
   --section=pre-data --exclude-schema="_timescaledb*" \
   -f <file-name-pre-data>.bak defaultdb
   ```

   The service prompts you for a password. Use your credentials for Managed
   Service in TimescaleDB.

1. Restore the dumped schema pre-data into your Cloud database. Use your Cloud
   credentials, and set the `--no-owner` flag to avoid permissions problems:

    ```bash
    # Use your Cloud credentials and connection details in place of <cloud_host> 
    # and <cloud_port>.
    pg_restore -U tsdbadmin -W -h <cloud_host> -p <cloud_port> --no-owner -Fc \
    -v -d tsdb <file-name-pre-data>.bak
    ```

</procedure>

<highlight type="note">
You may encounter the following errors while running `pg_restore`. You can
safely ignore them. The migration still occurs successfully.
</highlight>

`pg_restore` throws a permissions error when it tries to apply the TimescaleDB
extension. Because TimescaleDB is already installed by default on Timescale
Cloud, you can safely ignore this:

```bash
pg_restore: creating EXTENSION "timescaledb"
pg_restore: creating COMMENT "EXTENSION timescaledb"
pg_restore: while PROCESSING TOC:
pg_restore: from TOC entry 6239; 0 0 COMMENT EXTENSION timescaledb 
pg_restore: error: could not execute query: ERROR:  must be owner of extension timescaledb
```

If you have continuous aggregates, you may get the following error. Ignore this
as you will [restore your aggregates](#recreate-continuous-aggregates) in a
later procedure.

```bash
pg_restore: error: could not execute query: ERROR:  relation "_timescaledb_internal._materialized_hypertable_x" does not exist
```

You can also ignore:

```bash
​​pg_restore: WARNING:  no privileges were granted for "<..>"
```

## Restore hypertables in Timescale Cloud

After pre-data migration, your hypertables from Managed Service for TimescaleDB
become regular PostgreSQL tables in Cloud. Recreate your hypertables in Cloud to
restore them.

### Restoring hypertables in Timescale Cloud

<procedure>

1. Connect to your Cloud database using psql:

   ```bash
   # Use your Cloud credentials and connection details.
   psql “postgres://tsdbadmin:<cloud_password>@<cloud_host>:<cloud_port>/tsdb?sslmode=require”
   ```

1. In psql, run:

   ```bash
   SELECT create_hypertable(
       '<table_name>', '<time_column_name>', 
        chunk_time_interval => 
            INTERVAL '<chunk_time_interval>');
   ```

</procedure>

## Copy data from Managed Service for TimescaleDB

After restoring your hypertables, return to Managed Service for TimescaleDB to
copy your data, table by table.

### Copying data from Managed Service for TimescaleDB

<procedure>

1. Connect to your Managed Service for TimescaleDB database using psql:

   ```bash
   # Use your Managed Service for TimescaleDB credentials and connection 
   # details.
   psql “postgres://tsdbadmin:<mst_password>@<mst_host>:<mst_port>/tsdb?sslmode=require”
   ```

1. Dump the data from one table into a CSV file. In psql, run:

   ```bash
   \COPY (SELECT * FROM <table-name>) TO <table-name>.csv CSV
   ```

1. Repeat Step 2 for each table and hypertable you want to migrate.

</procedure>

<highlight type="note">
If your tables are very large, you may choose to migrate each table in multiple 
pieces. Split each table by time range and copy each range individually. For example:
</highlight>

   ```bash
   \COPY (SELECT * FROM <table-name> WHERE time > ‘2021-11-01’ AND time < ‘2011-11-02’) TO <table-name-date-range>.csv CSV
   ```

## Restore data into Timescale Cloud

After copying your data into CSV files, restore it into Timescale Cloud by
copying from the CSV file. There are two methods: using regular PostgreSQL
`COPY` and using the TimescaleDB function
[`timescaledb-parallel-copy`][timescaledb-parallel-copy]. In tests,
`timescaledb-parallel-copy` is 16% faster, but you have to install the function.
It doesn't come by default with TimescaleDB.

### Restoring data into Timescale Cloud with timescaledb-parallel-copy

<procedure>

1. Install `timescaledb-parallel-copy`. In your regular shell, not psql, run:

   ```bash
   go get github.com/timescale/timescaledb-parallel-copy/cmd/timescaledb-parallel-copy
   ```

2. Use `timescaledb-parallel-copy` to import data into your Cloud database. Run
   the following command for each table and hypertable. Set `<num_workers>` to
   twice the number of CPUs in your cloud database. If you have 4 CPUs,
   `<num_workers>` should be `8`.

   ```bash
   # Use your Cloud credentials and connection details.
   timescaledb-parallel-copy \
   --connection "host=<cloud_host> user=tsdbadmin password=<cloud_password> port=<cloud_port> sslmode=require" \
   --db-name tsdb --table <table_name> --file <file_name>.csv --workers <num_workers> --reporting-period 30s
   ```

</procedure>

### Restoring data into Timescale Cloud with COPY

<procedure>

1. Connect to your Cloud database using psql if you aren't already connected:

   ```bash
   # Use your Cloud credentials and connection details.
   psql “postgres://tsdbadmin:<cloud_password>@<cloud_host>:<cloud_port>/tsdb?sslmode=require”
   ```

1. In psql, run the following command for each table and hypertable:
   ```bash
   \COPY <table-name> FROM '<table-name>.csv' WITH (FORMAT CSV);
   ```

</procedure>

## Migrate schema post-data

After migrating your table and hypertable data, migrate your PostgreSQL schema
post-data. This includes information about constraints.

### Migrating schema post-data

<procedure>

1. Dump schema post-data from Managed Service for TimescaleDB into a file.
   Exclude Timescale-specific schemas. In your regular shell, not in psql, run:

   ```bash
   # Use your Managed Service for TimescaleDB connection details.
   pg_dump -U tsdbadmin -W -h <mst_host> -p <mst_port> -Fc -v \
   --section=post-data --exclude-schema="_timescaledb*" \
   -f <file-name-post-data>.bak defaultdb
   ```

   The service prompts you for a password. Use your credentials for Managed
   Service in TimescaleDB.

1. Restore the dumped schema post-data into your Cloud database. Use your Cloud
   credentials, and set the `--no-owner` flag to avoid permissions problems:

    ```bash
    # Use your Cloud credentials and connection details.
    pg_restore -U tsdbadmin -W -h <cloud_host> -p <cloud_port> --no-owner -Fc \
    -v -d tsdb <file-name-post-data>.bak
    ```

</procedure>

<highlight type="note"> 
You may encounter the following errors while running
`pg_restore`. You can safely ignore them. The migration still occurs
successfully. 
</highlight>

```bash
pg_restore: error: could not execute query: ERROR:  relation "<relation_name>" already exists
```

```bash
pg_restore: error: could not execute query: ERROR:  trigger "ts_insert_blocker" for relation "<relation_name>" already exists
```

## Recreate continuous aggregates

Continuous aggregates aren't migrated when you transfer your schema and data
separately. Restore them by recreating the continuous aggregate definitions and
recomputing the results on your Cloud database. This is faster than copying the
continuous aggregate data.

### Recreating continuous aggregates

<procedure>

1. Use psql to connect to your Managed Service for TimescaleDB database if
   you aren't already connected:

   ```bash
   # Use your Managed Service for TimescaleDB credentials and connection 
   # details.
   psql “postgres://tsdbadmin:<mst_password>@<mst_host>:<mst_port>/tsdb?sslmode=require”
   ```

1. In psql, get a list of your existing continuous aggregate definitions:

   ```bash
   SELECT view_name, view_definition FROM timescaledb_information.continuous_aggregates;
   ```

    This query returns the names and definitions for all your continuous
    aggregates. For example:

    ```bash
    view_name       |                                            view_definition
    ----------------+--------------------------------------------------------------------------------------------------------
    avg_fill_levels |  SELECT round(avg(fill_measurements.fill_level), 2) AS avg_fill_level,                                +
                    |     time_bucket('01:00:00'::interval, fill_measurements."time") AS bucket,                            +
                    |     fill_measurements.sensor_id                                                                       +
                    |     FROM fill_measurements                                                                            +
                    |     GROUP BY (time_bucket('01:00:00'::interval, fill_measurements."time")), fill_measurements.sensor_id;
    (1 row)
    ```

    Keep the results for a later step.

1. Connect to your Cloud database using psql if you aren't already connected:

   ```bash
   # Use your Cloud credentials and connection details.
   psql “postgres://tsdbadmin:<cloud_password>@<cloud_host>:<cloud_port>/tsdb?sslmode=require”
   ```

1. In psql, use the information from Step 2 to recreate each continuous
   aggregate definition:

   ```bash
   # Replace <view_name> and <view_definition> with each result from Step 2.
   CREATE MATERIALIZED VIEW <view_name>
	WITH (timescaledb.continuous) AS
		<view_definition>
   ```

</procedure>

## Recreate policies

Policies aren't migrated when you transfer your schema and data separately. 
Recreate them on your Cloud database.

### Recreating policies

<procedure>

1. Use psql to connect to your Managed Service for TimescaleDB database if 
   you aren't already connected:

   ```bash
   # Use your Managed Service for TimescaleDB credentials and connection details.
   psql “postgres://tsdbadmin:<mst_password>@<mst_host>:<mst_port>/tsdb?sslmode=require”
   ```

1. In psql, get a list of your existing policies:

   ```bash
   SELECT application_name, schedule_interval, retry_period, 
        config, hypertable_name 
        FROM timescaledb_information.jobs WHERE owner = 'tsdbadmin';
   ```

    This query returns a list of all your policies, including continuous-aggregate
    refresh policies, retention policies, compression policies, and reorder
    policies. Keep the results for a later step.

1. Connect to your Cloud database using psql if you aren't already connected:

   ```bash
   # Use your Cloud credentials and connection details.
   psql “postgres://tsdbadmin:<cloud_password>@<cloud_host>:<cloud_port>/tsdb?sslmode=require”
   ```

1. In psql, while connected to your Cloud database, recreate all your policies.
   For instructions, refer to the docs on creating [continuous-aggregate refresh
   policies][cagg-policy], [retention policies][retention-policy], [compression
   policies][compression-policy], and [reorder policies][reorder-policy]. Refer
   to your results from Step 2 to make sure you restore all policies.

</procedure>

## Recompress data

Compressed chunks in Managed Service for TimescaleDB are decompressed during the
`\COPY` operation. To recompress them, refer to the [compression section][compression].

[cagg-policy]: /how-to-guides/continuous-aggregates/refresh-policies/
[compression]: /timescaledb/:currentVersion/how-to-guides/compression/
[compression-policy]: /getting-started/compress-data/#enable-timescaledb-compression-on-the-hypertable
[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[install-timescale-cloud]: /install/:currentVersion:/installation-cloud/
[pg_dump]: https://www.postgresql.org/docs/current/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/9.2/app-pgrestore.html 
[psql]: /timescaledb/:currentVersion:/how-to-guides/connecting/psql/
[retention-policy]: /how-to-guides/data-retention/create-a-retention-policy/
[reorder-policy]: /api/:currentVersion:/hypertable/add_reorder_policy/
[timescaledb-parallel-copy]: https://github.com/timescale/timescaledb-parallel-copy
[upgrading-postgresql]: https://kb-managed.timescale.com/en/articles/5368016-perform-a-postgresql-major-version-upgrade
[upgrading-timescaledb]: /timescaledb/:currentVersion:/how-to-guides/update-timescaledb/update-timescaledb-2/