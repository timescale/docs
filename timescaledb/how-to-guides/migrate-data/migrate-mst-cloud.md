# Migrate from Managed Service for TimescaleDB to Timescale Cloud

Migrate your data from Managed Service for TimescaleDB to Timescale Cloud to take
advantage of Cloud's features.
These include separate scaling for compute and storage requirements, first-class 
multi-node support, and more.

There are two methods for migrating your data:

- [**Migrate your entire database at once using the PostgreSQL utilities `pg_dump` 
  and `pg_restore`.**](#migrate-your-entire-database-at-once)
  Choose this option for smaller databases.
  This method directly transfers all data and schemas, including TimescaleDB-specific 
  features.
  Your hypertables, continuous aggregates, and policies are automatically
  available in Cloud.

- [**Migrate your schema, and then migrate your data separately.**](#migrate-your-schema-and-data-separately)
  Choose this option for larger databases.
  This method allows you to individually migrate tables and chunks.
  If the migration fails mid-way, you can restart from the failure point rather
  than the beginning. With this method, TimescaleDB-specific features will not be 
  migrated.
  See the instructions below to restore your hypertables, continuous
  aggregates, and policies. 

<highlight type="tip">
The recommended migration method depends on both your database size and your network
upload and download speeds.
If you aren't sure which method to use, start with the first method and try running
`pg_dump` on one table. 
If it takes too long, switch to the second method.
</highlight>

## Migrate your entire database at once

Migrate smaller databases by using [`pg_dump`][pg_dump] and [`pg_restore`][pg_restore]
on your entire database.

<highlight type="note">
Depending on the size of your database and your network speed, migration may take 
several hours.
You can continue reading and writing(?) to your old database during this time.
</highlight>

### Prerequisites

- Have the PostgreSQL utilities `pg_dump` and `pg_restore` installed on your system.
  You can check that they're installed by running the following commands:

  ```bash
  pg_dump --version
  pg_restore --version
  ```

- Have a new Cloud database created in Timescale Cloud.
  For instructions on installing Timescale Cloud, see 
  [Install Timescale Cloud][install-timescale-cloud].

### Migrating your entire database at once

<procedure>

1. [Compress all your data][compression] for faster migration.

1. Dump all the data from your Managed Service for TimescaleDB database into a file:

   ```bash
   # Use your Managed Service for TimescaleDB connection details.
   pg_dump -U tsdbadmin -W -h <mst_host> -p <mst_port> -Fc -v -f <file-name>.bak defaultdb
   ```

   The service prompts you for a password.
   Use your credentials for Managed Service in TimescaleDB.

1. Connect to your Timescale Cloud database using psql:

   ```bash
   # Use your Cloud credentials and connection details.
   psql “postgres://tsdbadmin:<cloud_password>@<cloud_host>:<cloud_port>/tsdb?sslmode=require”
   ```

1. In psql, run:

   ```bash
   SELECT timescaledb_pre_restore();
   ```

1. Check that `pg_dump` has finished.
   In your regular shell (not in psql), run the following command to restore the 
   dumped data into your Cloud database.
   Be sure to set the `--no-owner` flag to avoid permissions problems.

    ```bash
    # Use your Cloud credentials and connection details.
   pg_restore -U tsdbadmin -W -h <cloud_host> -p <cloud_port> --no-owner -Fc -v -d tsdb <file-name>.bak
    ```

1. In psql, run:

    ```bash
    SELECT timescaledb_post_restore();
    ```

</procedure>

To learn more about the TimescaleDB-specific APIs in this procedure, see the API
references for: 

- [timescaledb_pre_restore][timescaledb_pre_restore]
- [timescaledb_post_restore][timescaledb_post_restore]

### Errors and warnings

You may encounter the following errors while running `pg_dump` and `pg_restore`.
You can safely ignore them.
The migration still occurs successfully.

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

## Migrate your schema and data separately

Migrate larger databases by using [`pg_dump`][pg_dump] and [`pg_restore`][pg_restore]
to migrate your schema.
Then copy data from each table or chunk individually.

Follow the procedures below to migrate your database:

- [Migrate your PostgreSQL schema pre-data](#migrate-your-postgresql-schema-pre-data)
- [Restore your hypertables](#restore-your-hypertables)
- [Copy your tables from Managed Service for TimescaleDB](#copy-your-tables-from-managed-service-for-timescaledb)

### Prerequisites

- Have the PostgreSQL utilities `pg_dump` and `pg_restore` installed on your system.
  You can check that they're installed by running the following commands:

  ```bash
  pg_dump --version
  pg_restore --version
  ```

- Have a new Cloud instance created in Timescale Cloud.
  For instructions on installing Timescale Cloud, see 
  [Install Timescale Cloud][install-timescale-cloud].

### Migrate your PostgreSQL schema pre-data

Migrate your PostgreSQL schema pre-data from Managed Service for TimescaleDB to
Timescale Cloud.

#### Migrating your PostgreSQL schema pre-data

<procedure>

1. Dump schema pre-data from Managed Service for TimescaleDB into a file.
   Exclude Timescale-specific schemas.

   ```bash
   # Use your Managed Service for TimescaleDB connection details.
   pg_dump -U tsdbadmin -W -h <mst_host> -p <mst_port> -Fc -v --section=pre-data --exclude-schema="_timescaledb*" -f <file-name-pre-data>.bak defaultdb
   ```

   The service prompts you for a password.
   Use your credentials for Managed Service in TimescaleDB.

1. Restore the dumped schema pre-data into your Cloud database.
   Be sure to use your Cloud credentials, and set the `--no-owner` flag to avoid 
   permissions problems:

    ```bash
    # Use your Cloud credentials and connection details.
    pg_restore -U tsdbadmin -W -h <cloud_host> -p <cloud_port> --no-owner -Fc -v -d tsdb <file-name-pre-data>.bak
    ```

</procedure>

### Restore your hypertables

After migrating your schema pre-data into Cloud, your hypertables are now regular PostgreSQL tables in Cloud.
Recreate your hypertables to restore them.

#### Restoring your hypertables

<procedure>

1. Connect to your Timescale Cloud database using psql:

   ```bash
   # Use your Cloud credentials and connection details.
   psql “postgres://tsdbadmin:<cloud_password>@<cloud_host>:<cloud_port>/tsdb?sslmode=require”
   ```

1. In psql, run:

   ```bash
   SELECT create_hypertable('table-name', 'time', chunk_time_interval => INTERVAL '<interval used in your old database>');
   ```

</procedure>

To learn more about the TimescaleDB-specific APIs in this procedure, see the API
references for:

- [create_hypertable][create_hypertable]

### Copy your tables from Managed Service for TimescaleDB

After your schema pre-data are migrated and your hypertables are restored, return to
Maanged Service for TimescaleDB to copy your tables one by one.

#### Copying your tables from Managed Service for TimescaleDB

<procedure>

1. Connect to your Managed Service for TimescaleDB database using psql:

   ```bash
   # Use your Managed Service for TimescaleDB credentials and connection details.
   psql “postgres://tsdbadmin:<mst_password>@<mst_host>:<mst_port>/tsdb?sslmode=require”
   ```

1. While connected to your Managed Service for TimescaleDB database, dump data from
   one table or hypertable into a binary file.
   In psql, run:

   ```bash
   \COPY (SELECT * FROM <table-name>) TO <table-name>.binary.copy BINARY
   ```

</procedure>

If your tables are very large, you can speed up each `\COPY` action by migrating
your table in multiple pieces.
Split your table by time range and copy each range individually:

   ```bash
   \COPY (SELECT * FROM <table-name> WHERE time > ‘2021-11-01’ AND time < ‘2011-11-02’) TO <table-name-date-range>.binary.copy BINARY
   ```

[compression]: /how-to-guides/compression/manually-compress-chunks/
[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[install-timescale-cloud]: /install/:currentVersion/installation-cloud/
[pg_dump]: https://www.postgresql.org/docs/current/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/9.2/app-pgrestore.html 
[timescaledb_pre_restore]: /api/:currentVersion:/administration/timescaledb_pre_restore/
[timescaledb_post_restore]: /api/:currentVersion:/administration/timescaledb_pre_restore/