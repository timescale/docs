# Migrate from Managed Service for TimescaleDB to Timescale Cloud

Migrate your data from Managed Service for TimescaleDB to Timescale Cloud to
take advantage of Cloud's features. These include separate scaling for compute
and storage requirements, first-class multi-node support, and more.

There are two methods for migrating your data:

- [**Migrate the entire database at once using the PostgreSQL utilities 
  `pg_dump` and `pg_restore`.**](#migrate-the-entire-database-at-once) Choose
  this option for smaller databases. This method directly transfers all data and
  schemas, including TimescaleDB-specific features. Your hypertables, continuous
  aggregates, and policies are automatically available in Cloud.

- [**Migrate the schema, and then migrate the data
  separately.**](#migrate-the-schema-and-data-separately) Choose this option for
  larger databases. This method allows you to individually migrate tables and
  chunks. If the migration fails mid-way, you can restart from the failure point
  rather than the beginning. With this method, TimescaleDB-specific features
  won't be migrated. See the instructions below to restore your hypertables,
  continuous aggregates, and policies. 

<highlight type="tip"> 
The recommended migration method depends on both your
database size and your network upload and download speeds. If you aren't sure
which method to use, start with the first method and try running `pg_dump` on
one table. If it takes too long, switch to the second method. 
</highlight>

## Migrate the entire database at once

Migrate smaller databases by using `pg_dump` and `pg_restore` on your entire
database.

<highlight type="note">
Depending on the size of your database and your network speed, migration may
take several hours. You can continue reading and writing(?) to your old database
during this time.
</highlight>

### Prerequisites

- Check that the PostgreSQL utilities [`pg_dump`][pg_dump] and
  [`pg_restore`][pg_restore] are installed on your system:

  ```bash
  pg_dump --version
  pg_restore --version
  ```

- Create a new empty database in Timescale Cloud. For instructions on installing
  Timescale Cloud, see [Install Timescale Cloud][install-timescale-cloud].

### Migrating the entire database at once

<procedure>

1. [Compress all your data][compression] for faster migration.

1. Dump all the data from your Managed Service for TimescaleDB database into a
   file:

   ```bash
   # Use your Managed Service for TimescaleDB connection details in place of 
   # <mst_host> and <mst_port>.
   pg_dump -U tsdbadmin -W -h <mst_host> -p <mst_port> -Fc -v \
   -f <file-name>.bak defaultdb
   ```

   The service prompts you for a password. Use your credentials for Managed
   Service in TimescaleDB.

1. Connect to your Timescale Cloud database using psql:

   ```bash
   # Use your Cloud credentials and connection details in place of 
   # <cloud_password>, <cloud_host>, and <cloud_port>.
   psql “postgres://tsdbadmin:<cloud_password>@<cloud_host>:<cloud_port>/tsdb?sslmode=require”
   ```

1. In psql, run:

   ```bash
   SELECT timescaledb_pre_restore();
   ```

1. Check that `pg_dump` has finished. In your regular shell (not in psql), run
   the following command to restore the dumped data into your Cloud database. Be
   sure to set the `--no-owner` flag to avoid permissions problems.

    ```bash
    # Use your Cloud credentials and connection details.
   pg_restore -U tsdbadmin -W -h <cloud_host> -p <cloud_port> --no-owner -Fc \
   -v -d tsdb <file-name>.bak
    ```

1. In psql, run:

    ```bash
    SELECT timescaledb_post_restore();
    ```

</procedure>

<highlight type="note">
You may encounter the following errors while running `pg_dump` and `pg_restore`.
You can safely ignore them. The migration still occurs successfully.
</highlight>

#### pg_dump errors

```bash
pg_dump: warning: there are circular foreign-key constraints on this table:
pg_dump: hypertable
pg_dump: You might not be able to restore the dump without using --disable-triggers or temporarily dropping the constraints.
pg_dump: Consider using a full dump instead of a --data-only dump to avoid this problem.
```

```bash
pg_dump: NOTICE:  hypertable data are in the chunks, no data will be copied
DETAIL:  Data for hypertables are stored in the chunks of a hypertable so COPY TO of a hypertable will not copy any data.
HINT:  Use "COPY (SELECT * FROM <hypertable>) TO ..." to copy all data in hypertable, or copy each chunk individually.
```

#### pg_restore errors

```bash
pg_restore: creating EXTENSION "timescaledb"
pg_restore: creating COMMENT "EXTENSION timescaledb"
pg_restore: while PROCESSING TOC:
pg_restore: from TOC entry 6239; 0 0 COMMENT EXTENSION timescaledb 
pg_restore: error: could not execute query: ERROR:  must be owner of extension timescaledb
```

```bash
​​pg_restore: WARNING:  no privileges were granted for "<..>"
```

```bash
pg_restore: warning: errors ignored on restore: 1
```

To learn more about the TimescaleDB APIs in this procedure, see the API
references for: 

- [timescaledb_pre_restore][timescaledb_pre_restore]
- [timescaledb_post_restore][timescaledb_post_restore]


## Migrate the schema and data separately

Migrate larger databases by first migrating your schema with `pg_dump` and
`pg_restore`. Then copy data separately from each table or chunk.

Follow the procedures below to migrate your database:

- [Migrate schema pre-data](#migrate-schema-pre-data)
- [Restore hypertables in Timescale Cloud](#restore-hypertables-in-timescale-cloud)
- [Copy data from Managed Service for TimescaleDB](#copy-data-from-managed-service-for-timescaledb)
- [Restore data into Timescale Cloud](#restore-data-into-timescale-cloud)
- [Migrate schema post-data](#migrate-schema-post-data)
- [Recreate continuous aggregates](#recreate-continuous-aggregates) (optional)
- [Recreate policies](#recreate-policies) (optional)

### Prerequisites

- Check that the PostgreSQL utilities [`pg_dump`][pg_dump] and
  [`pg_restore`][pg_restore] are installed on your system:

  ```bash
  pg_dump --version
  pg_restore --version
  ```

- Create a new empty database in Timescale Cloud. For instructions on installing
  Timescale Cloud, see [Install Timescale Cloud][install-timescale-cloud].

### Migrate schema pre-data

Migrate your PostgreSQL schema pre-data from Managed Service for TimescaleDB to
Timescale Cloud.

#### Migrating schema pre-data

<procedure>

1. Dump schema pre-data from Managed Service for TimescaleDB into a file.
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

1. Restore the dumped schema pre-data into your Cloud database. Be sure to use
   your Cloud credentials, and set the `--no-owner` flag to avoid permissions
   problems:

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

```bash
pg_restore: creating EXTENSION "timescaledb"
pg_restore: creating COMMENT "EXTENSION timescaledb"
pg_restore: while PROCESSING TOC:
pg_restore: from TOC entry 6239; 0 0 COMMENT EXTENSION timescaledb 
pg_restore: error: could not execute query: ERROR:  must be owner of extension timescaledb
```

```bash
pg_restore: error: could not execute query: ERROR:  relation "_timescaledb_internal._materialized_hypertable_x" does not exist
```

```bash
​​pg_restore: WARNING:  no privileges were granted for "<..>"
```

### Restore hypertables in Timescale Cloud

After migrating your schema pre-data into Cloud, your hypertables are now
regular PostgreSQL tables in Cloud. Recreate your hypertables to restore them.

#### Restoring hypertables in Timescale Cloud

<procedure>

1. Connect to your Cloud database using psql:

   ```bash
   # Use your Cloud credentials and connection details.
   psql “postgres://tsdbadmin:<cloud_password>@<cloud_host>:<cloud_port>/tsdb?sslmode=require”
   ```

1. In psql, run:

   ```bash
   SELECT create_hypertable(
       'table-name', 'time', 
        chunk_time_interval => 
            INTERVAL '<chunk interval used in your old database>');
   ```

</procedure>

### Copy data from Managed Service for TimescaleDB

After your schema pre-data are migrated and your hypertables are restored,
return to Managed Service for TimescaleDB to copy your tables one by one.

#### Copying data from Managed Service for TimescaleDB

<procedure>

1. Connect to your Managed Service for TimescaleDB database using psql:

   ```bash
   # Use your Managed Service for TimescaleDB credentials and connection 
   # details.
   psql “postgres://tsdbadmin:<mst_password>@<mst_host>:<mst_port>/tsdb?sslmode=require”
   ```

1. Dump the data from one table into a binary file. In psql, run:

   ```bash
   \COPY (SELECT * FROM <table-name>) TO <table-name>.binary.copy BINARY
   ```

1. Repeat Step 2 for every table and hypertable you want to migrate.

</procedure>

<highlight type="tip">
If your tables are very large, you may choose to migrate each table in multiple 
pieces. Split each table by time range and copy each range individually:
</highlight>

   ```bash
   \COPY (SELECT * FROM <table-name> WHERE time > ‘2021-11-01’ AND time < ‘2011-11-02’) TO <table-name-date-range>.binary.copy BINARY
   ```

### Restore data into Timescale Cloud

After copying your data into binary files, restore it into Timescale Cloud by
copying from the binary file.

#### Restoring data into Timescale Cloud

<procedure>

1. Connect to your Cloud database using psql if you're not already connected:

   ```bash
   # Use your Cloud credentials and connection details.
   psql “postgres://tsdbadmin:<cloud_password>@<cloud_host>:<cloud_port>/tsdb?sslmode=require”
   ```

1. In psql, run the following command for each table:
   ```bash
   \COPY <table-name> FROM '<table-name>.binary.copy' WITH (FORMAT binary);
   ```

</procedure>

### Migrate schema post-data

After migrating your table and hypertable data, migrate your PostgreSQL schema
post-data.

#### Migrating schema post-data

<procedure>

1. Dump schema post-data from Managed Service for TimescaleDB into a file.
   Exclude Timescale-specific schemas. In your regular shell (not in psql), run:

   ```bash
   # Use your Managed Service for TimescaleDB connection details.
   pg_dump -U tsdbadmin -W -h <mst_host> -p <mst_port> -Fc -v \
   --section=post-data --exclude-schema="_timescaledb*" \
   -f <file-name-post-data>.bak defaultdb
   ```

   The service prompts you for a password. Use your credentials for Managed
   Service in TimescaleDB.

1. Restore the dumped schema post-data into your Cloud database. Be sure to use
   your Cloud credentials, and set the `--no-owner` flag to avoid permissions
   problems:

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

### Recreate continuous aggregates

Continuous aggregates aren't migrated when you transfer your schema and data
separately. Restore them by recreating the continuous aggregate definitions and
recomputing the results on your Cloud database. This is faster than copying the
continuous aggregate data.

#### Recreating continuous aggregates

<procedure>

1. Use psql to connect to your Managed Service for TimescaleDB database if
   you're not already connected:

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

1. Connect to your Cloud database using psql if you're not already connected:

   ```bash
   # Use your Cloud credentials and connection details.
   psql “postgres://tsdbadmin:<cloud_password>@<cloud_host>:<cloud_port>/tsdb?sslmode=require”
   ```

1. In psql, while connected to your Cloud database, recreate each continuous
   aggregate definition.

   ```bash
   # Replace <view_name> and <view_definition> with each result from Step 2.
   CREATE MATERIALIZED VIEW <view_name>
	WITH (timescaledb.continuous) AS
		<view_definition>
   ```

</procedure>

### Recreate policies

Policies aren't migrated when you transfer your schema and data separately. 
Recreate them on your Cloud database.

#### Recreating policies

<procedure>

1. Use psql to connect to your Managed Service for TimescaleDB database if 
   you're not already connected:

   ```bash
   # Use your Managed Service for TimescaleDB credentials and connection details.
   psql “postgres://tsdbadmin:<mst_password>@<mst_host>:<mst_port>/tsdb?sslmode=require”
   ```

1. In psql, get a list of your existing continuous aggregate definitions:

   ```bash
   SELECT application_name, schedule_interval, retry_period, 
        config, hypertable_name 
        FROM timescaledb_information.jobs WHERE owner = 'tsdbadmin';
   ```

    This query returns a list of all your policies, including continuous-aggregate
    refresh policies, retention policies, compression policies, and reorder policies.
    Keep the results for a later step.

1. Connect to your Cloud database using psql if you're not already connected:

   ```bash
   # Use your Cloud credentials and connection details.
   psql “postgres://tsdbadmin:<cloud_password>@<cloud_host>:<cloud_port>/tsdb?sslmode=require”
   ```

1. In psql, while connected to your Cloud database, recreate all your policies.
   See instructions for creating [continuous-aggregate refresh
   policies][cagg-policy], [retention policies][retention-policy], [compression
   policies][compression-policy], and [reorder policies][reorder-policy].

</procedure>

[cagg-policy]: /how-to-guides/continuous-aggregates/refresh-policies/
[compression]: /how-to-guides/compression/manually-compress-chunks/
[compression-policy]: /getting-started/compress-data/#enable-timescaledb-compression-on-the-hypertable
[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[install-timescale-cloud]: /install/:currentVersion:/installation-cloud/
[pg_dump]: https://www.postgresql.org/docs/current/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/9.2/app-pgrestore.html 
[retention-policy]: /how-to-guides/data-retention/create-a-retention-policy/
[reorder-policy]: /api/:currentVersion:/hypertable/add_reorder_policy/
[timescaledb_pre_restore]: /api/:currentVersion:/administration/timescaledb_pre_restore/
[timescaledb_post_restore]: /api/:currentVersion:/administration/timescaledb_post_restore/