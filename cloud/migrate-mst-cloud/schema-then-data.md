# Migrate schema and data separately
Migrate larger databases by migrating your schema first, then migrating the
data. This method copies each table or chunk separately, which allows you to
restart midway if one copy operation fails.

The procedure to migrate your database requires these steps:
*   [Migrate schema pre-data](#migrate-schema-pre-data)
*   [Restore hypertables in Timescale Cloud](#restore-hypertables-in-timescale-cloud)
*   [Copy data from Managed Service for TimescaleDB](#copy-data-from-managed-service-for-timescaledb)
*   [Restore data into Timescale Cloud](#restore-data-into-timescale-cloud)
*   [Migrate schema post-data](#migrate-schema-post-data)
*   [Recreate continuous aggregates](#recreate-continuous-aggregates) (optional)
*   [Recreate policies](#recreate-policies) (optional)
*   [Recompress previously compressed data](#recompress-data) (optional)

<highlight type="warning">
Depending on your database size and network speed, steps that involve copying
data can take a very long time. You can continue reading from your old database
during this time, though performance could be slower. If you writes to your
old tables during the migration, the new writes might not be transferred to
Timescale Cloud. To avoid this problem, see
[migrating an active database](http://docs.timescale.com/cloud/latest/migrate-mst-cloud/#migrating-an-active-database).
</highlight>

## Prerequisites
Before you begin, check that you have:
*   Installed the PostgreSQL [`pg_dump`][pg_dump] and [`pg_restore`][pg_restore]
    utilities.
*   Installed a client for connecting to PostgreSQL. These instructions use
    [psql][psql], but any client works.
*   Created a new empty database in Timescale Cloud. For more information, see the    
    [Install Timescale Cloud section][install-timescale-cloud].
*   Checked that you're running the same major version of PostgreSQL on both
    Managed Service for TimescaleDB, and Timescale Cloud. For more information about upgrading PostgreSQL on Managed Service for TimescaleDB, see the
    [upgrading PostgreSQL section][upgrading-postgresql].
*   Checked that you're running the same major version of TimescaleDB on both
    Managed Service for TimescaleDB and Timescale Cloud. For more information,
    see the [upgrading TimescaleDB section][upgrading-timescaledb].

<highlight type="note">
To speed up migration, compress your data. You can compress any chunks where
data is not being currently inserted, updated, or deleted. When you finish the
migration, you can decompress chunks as needed for normal operation. For more
information about compression and decompression, see the
[compression section](https://docs.timescale.com/timescaledb/latest/how-to-guides/compression/).
</highlight>

## Migrate schema pre-data
Migrate your pre-data from Managed Service for TimescaleDB to Timescale Cloud.
This includes table and schema definitions, as well as information on sequences,
owners, and settings. This doesn't include Timescale-specific schemas.

<procedure>

### Migrating schema pre-data
1.  At the `psql` prompt, dump the schema pre-data from Managed Service for
    TimescaleDB into a `.bak` file, using your Managed Service for TimescaleDB
    connection details. Exclude Timescale-specific schemas. When you are
    prompted for a password, use your Managed Service for TimescaleDB
    credentials:
    ```sql
    pg_dump -U tsdbadmin -W \
    -h <mst_host> -p <mst_port> -Fc -v \
    --section=pre-data --exclude-schema="_timescaledb*" \
    -f <file-name-pre-data>.bak defaultdb
    ```
1.  Restore the dumped data from the `.bak` file into your Timescale Cloud
    database, using your Timescale Cloud connection details. To avoid
    permissions errors, include the `--no-owner` flag:
    ```sql
    pg_restore -U tsdbadmin -W \
    -h <cloud_host> -p <cloud_port> --no-owner -Fc \
    -v -d tsdb <file-name-pre-data>.bak
    ```

</procedure>

### Troubleshooting
If you see any of these errors during the migration process, you can safely
ignore them.  The migration still occurs successfully.

`pg_restore` tries to apply the TimescaleDB extension as it copies your schema,
and this can cause a permissions error. Because TimescaleDB is already installed
by default on Timescale Cloud, you can safely ignore this.

```sql
pg_restore: creating EXTENSION "timescaledb"
pg_restore: creating COMMENT "EXTENSION timescaledb"
pg_restore: while PROCESSING TOC:
pg_restore: from TOC entry 6239; 0 0 COMMENT EXTENSION timescaledb
pg_restore: error: could not execute query: ERROR:  must be owner of extension timescaledb
```

If you have continuous aggregates, you might get the following error. Ignore this, because you [restore your aggregates](#recreate-continuous-aggregates) later on.

```sql
pg_restore: error: could not execute query: ERROR:  relation "_timescaledb_internal._materialized_hypertable_x" does not exist
```

```bash
​​pg_restore: WARNING:  no privileges were granted for "<..>"
```

## Restore hypertables in Timescale Cloud
After pre-data migration, your hypertables from Managed Service for TimescaleDB
become regular PostgreSQL tables in Cloud. Recreate your hypertables in Cloud to
restore them.

<procedure>

### Restoring hypertables in Timescale Cloud
1.  At the `psql` prompt, connect to your Timescale Cloud database:
    ```sql
    psql "postgres://tsdbadmin:<cloud_password>@<cloud_host>:<cloud_port>/tsdb?sslmode=require"
    ```
1.  Restore the hypertable:
    ```sql
    SELECT create_hypertable(
       '<table_name>', '<time_column_name>',
        chunk_time_interval =>
            INTERVAL '<chunk_time_interval>');
    ```

</procedure>

## Copy data from Managed Service for TimescaleDB
After restoring your hypertables, return to Managed Service for TimescaleDB to
copy your data, table by table.

<procedure>

### Copying data from Managed Service for TimescaleDB
1.  At the `psql` prompt, connect to your Managed Service for TimescaleDB
    database:
    ```bash
    psql "postgres://tsdbadmin:<mst_password>@<mst_host>:<mst_port>/tsdb?sslmode=require"
    ```
1.  Dump the data from the first table into a `.csv` file:
    ```sql
    COPY (SELECT * FROM <table-name>) TO <table-name>.csv CSV
    ```
    Repeat for each table and hypertable you want to migrate.

<highlight type="note">
If your tables are very large, you can migrate each table in multiple pieces.
Split each table by time range, and copy each range individually. For example:
```sql
COPY (SELECT * FROM <table-name> WHERE time > ‘2021-11-01’ AND time < ‘2011-11-02’) TO <table-name-date-range>.csv CSV
```
</highlight>

</procedure>

## Restore data into Timescale Cloud
When you have copied your data into `.csv` files, you can restore it to Timescale
Cloud by copying from the `.csv` files. There are two methods: using regular PostgreSQL
`COPY`, or using the TimescaleDB
[`timescaledb-parallel-copy`][timescaledb-parallel-copy] function. In tests,
`timescaledb-parallel-copy` is 16% faster. The `timescale-parallel-copy` tool is not included by default, you must install the function.

<procedure>
### Restoring data into Timescale Cloud with timescaledb-parallel-copy
1.  At the command prompt, install `timescaledb-parallel-copy`:
    ```bash
    go get github.com/timescale/timescaledb-parallel-copy/cmd/timescaledb-parallel-copy
    ```
1.  At the `psql` prompt, use `timescaledb-parallel-copy` to import data into
    your Cloud database. Set `<num_workers>` to twice the number of CPUs in your
    database. For example, if you have 4 CPUs, `<num_workers>` should be `8`.
    ```sql
    timescaledb-parallel-copy \
    --connection "host=<cloud_host> \
    user=tsdbadmin password=<cloud_password> \
    port=<cloud_port> \
    sslmode="require" \
    --db-name tsdb \
    --table <table_name> \
    --file <file_name>.csv \
    --workers <num_workers> \
    --reporting-period 30s
    ```
    Repeat for each table and hypertable you want to migrate.

</procedure>

<procedure>

### Restoring data into Timescale Cloud with COPY
1.  At the `psql` prompt, connect to your Timescale Cloud database:
    ```sql
    psql "postgres://tsdbadmin:<cloud_password>@<cloud_host>:<cloud_port>/tsdb?sslmode=require"
    ```
1.  Restore the data to your Timescale Cloud database:
    ```sql
    COPY <table-name> FROM '<table-name>.csv' WITH (FORMAT CSV);
    ```
    Repeat for each table and hypertable you want to migrate.

</procedure>

## Migrate schema post-data
When you have migrated table and hypertable data, migrate your PostgreSQL schema
post-data. This includes information about constraints.

<procedure>

### Migrating schema post-data
1.  At the command prompt, dump the schema post-data from Managed Service for
    TimescaleDB into a `.bak` file, using your Managed Service for TimescaleDB
    connection details. Exclude Timescale-specific schemas. When you are
    prompted for a password, use your Managed Service for TimescaleDB
    credentials:
    ```sql
    pg_dump -U tsdbadmin -W \
    -h <mst_host> -p <mst_port> -Fc -v \
    --section=post-data --exclude-schema="_timescaledb*" \
    -f <file-name-post-data>.bak defaultdb
    ```
1.  Restore the dumped schema post-data from the `.bak` file into your Timescale
    Cloud database, using your Timescale Cloud connection details. To avoid
    permissions errors, include the `--no-owner` flag:
    ```sql
    pg_restore -U tsdbadmin -W \
    -h <cloud_host> -p <cloud_port> --no-owner -Fc \
    -v -d tsdb <file-name-post-data>.bak
    ```

</procedure>

### Troubleshooting
If you see any of these errors during the migration process, you can safely
ignore them.  The migration still occurs successfully.

```sql
pg_restore: error: could not execute query: ERROR:  relation "<relation_name>" already exists
```

```sql
pg_restore: error: could not execute query: ERROR:  trigger "ts_insert_blocker" for relation "<relation_name>" already exists
```

## Recreate continuous aggregates
By default, continuous aggregates aren't migrated when you transfer your schema
and data separately. Restore them by recreating the continuous aggregate
definitions and recomputing the results on your Cloud database. This is faster
than copying the continuous aggregate data.

<procedure>

### Recreating continuous aggregates
1.  At the `psql` prompt, connect to your Managed Service for TimescaleDB
    database:
    ```sql
    psql "postgres://tsdbadmin:<mst_password>@<mst_host>:<mst_port>/tsdb?sslmode=require"
    ```
1.  Get a list of your existing continuous aggregate definitions:
    ```sql
    SELECT view_name, view_definition FROM timescaledb_information.continuous_aggregates;
    ```

    This query returns the names and definitions for all your continuous
    aggregates. For example:

    ```sql
    view_name       |                                            view_definition
    ----------------+--------------------------------------------------------------------------------------------------------
    avg_fill_levels |  SELECT round(avg(fill_measurements.fill_level), 2) AS avg_fill_level,                                +
                    |     time_bucket('01:00:00'::interval, fill_measurements."time") AS bucket,                            +
                    |     fill_measurements.sensor_id                                                                       +
                    |     FROM fill_measurements                                                                            +
                    |     GROUP BY (time_bucket('01:00:00'::interval, fill_measurements."time")), fill_measurements.sensor_id;
    (1 row)
    ```
1.  At the `psql` prompt, connect to your Timescale Cloud database:
    ```sql
    psql "postgres://tsdbadmin:<cloud_password>@<cloud_host>:<cloud_port>/tsdb?sslmode=require"
    ```
1.  Recreate each continuous aggregate definition:
    ```sql
    CREATE MATERIALIZED VIEW <view_name>
    WITH (timescaledb.continuous) AS
    <view_definition>
    ```

</procedure>

## Recreate policies
By default, policies aren't migrated when you transfer your schema and data
separately. Recreate them on your Cloud database.

<procedure>

### Recreating policies
1.  At the `psql` prompt, connect to your Managed Service for TimescaleDB
    database:
    ```sql
    psql "postgres://tsdbadmin:<mst_password>@<mst_host>:<mst_port>/tsdb?sslmode=require"
    ```
1.  Get a list of your existing policies. This query returns a list of all your
    policies, including continuous aggregate refresh policies, retention
    policies, compression policies, and reorder policies:
    ```sql
    SELECT application_name, schedule_interval, retry_period,
        config, hypertable_name
        FROM timescaledb_information.jobs WHERE owner = 'tsdbadmin';
    ```
1.  At the `psql` prompt, connect to your Timescale Cloud database:
   ```sql
   psql "postgres://tsdbadmin:<cloud_password>@<cloud_host>:<cloud_port>/tsdb?sslmode=require"
   ```
1.  Recreate each policy. For more information about recreating policies, see the
    [continuous-aggregate refresh policies][cagg-policy],
    [retention policies][retention-policy],
    [compression policies][compression-policy], and
    [reorder policies][reorder-policy] sections.

</procedure>

## Recompress data
Compressed chunks in Managed Service for TimescaleDB are decompressed during the
`COPY` operation. For more information about recompressing data, see the
[compression section][compression].


[cagg-policy]: /how-to-guides/continuous-aggregates/refresh-policies/
[compression]: /timescaledb/:currentVersion/how-to-guides/compression/
[compression-policy]: /getting-started/compress-data/#enable-timescaledb-compression-on-the-hypertable
[install-timescale-cloud]: /install/:currentVersion:/installation-cloud/
[pg_dump]: https://www.postgresql.org/docs/current/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/9.2/app-pgrestore.html
[psql]: /timescaledb/:currentVersion:/how-to-guides/connecting/psql/
[retention-policy]: /how-to-guides/data-retention/create-a-retention-policy/
[reorder-policy]: /api/:currentVersion:/hypertable/add_reorder_policy/
[timescaledb-parallel-copy]: https://github.com/timescale/timescaledb-parallel-copy
[upgrading-postgresql]: https://kb-managed.timescale.com/en/articles/5368016-perform-a-postgresql-major-version-upgrade
[upgrading-timescaledb]: /timescaledb/:currentVersion:/how-to-guides/update-timescaledb/update-timescaledb-2/
