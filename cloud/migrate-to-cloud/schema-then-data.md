# Migrate schema and data separately
Migrate larger databases by migrating your schema first, then migrating the
data. This method copies each table or chunk separately, which allows you to
restart midway if one copy operation fails.

<highlight type="note">
For smaller databases, it may be more convenient to migrate your entire database
at once. For more information, see the section on [choosing a migration
method](https://docs.timescale.com/cloud/latest/migrate-to-cloud/).
</highlight>

<highlight type="warning">
This method does not retain continuous aggregates calculated using
already-deleted data. For example, if you delete raw data after a month but
retain downsampled data in a continuous aggregate for a year, the continuous
aggregate loses any data older than a month upon migration. If you must keep
continuous aggregates calculated using deleted data, migrate your entire
database at once. For more information, see the section on [choosing a migration
method](https://docs.timescale.com/cloud/latest/migrate-to-cloud/).
</highlight>

The procedure to migrate your database requires these steps:
*   [Migrate schema pre-data](#migrate-schema-pre-data)
*   [Restore hypertables in Timescale Cloud](#restore-hypertables-in-timescale-cloud)
*   [Copy data from the source database](#copy-data-from-the-source-database)
*   [Restore data into Timescale Cloud](#restore-data-into-timescale-cloud)
*   [Migrate schema post-data](#migrate-schema-post-data)
*   [Recreate continuous aggregates](#recreate-continuous-aggregates) (optional)
*   [Recreate policies](#recreate-policies) (optional)
*   [Update table statistics](#update-table-statistics)

<highlight type="warning">
Depending on your database size and network speed, steps that involve copying
data can take a very long time. You can continue reading from your source 
database during this time, though performance could be slower. To avoid this
problem, fork your database and migrate your data from the fork. If you write to
the tables in your source database during the migration, the new writes might
not be transferred to Timescale Cloud. To avoid this problem, see the section on
[migrating an active database](http://docs.timescale.com/cloud/latest/migrate-to-cloud/#migrate-an-active-database).
</highlight>

## Prerequisites
Before you begin, check that you have:
*   Installed the PostgreSQL [`pg_dump`][pg_dump] and [`pg_restore`][pg_restore]
    utilities.
*   Installed a client for connecting to PostgreSQL. These instructions use
    [`psql`][psql], but any client works.
*   Created a new empty database in Timescale Cloud. For more information, see
    the [Install Timescale Cloud section][install-timescale-cloud]. Provision
    your database with enough space for all your data.
*   Checked that any other PostgreSQL extensions you use are compatible with
    Timescale Cloud. For more information, see the [list of compatible
    extensions][extensions]. Install your other PostgreSQL extensions.
*   Checked that you're running the same major version of PostgreSQL on both
    Timescale Cloud and your source database. For information about upgrading
    PostgreSQL on your source database, see the [upgrade instructions for
    self-hosted TimescaleDB][upgrading-postgresql-self-hosted] and [Managed
    Service for TimescaleDB][upgrading-postgresql].
*   Checked that you're running the same major version of TimescaleDB on both
    Timescale Cloud and your source database. For more information, see the
    [upgrading TimescaleDB section][upgrading-timescaledb].

## Migrate schema pre-data
Migrate your pre-data from your source database to Timescale Cloud. This
includes table and schema definitions, as well as information on sequences,
owners, and settings. This doesn't include Timescale-specific schemas.

<procedure>

### Migrating schema pre-data
1.  Dump the schema pre-data from your source database into a `dump_pre_data.bak` file, using
    your source database connection details. Exclude Timescale-specific schemas.
    If you are prompted for a password, use your source database credentials:
    ```bash
    pg_dump -U <SOURCE_DB_USERNAME> -W \
    -h <SOURCE_DB_HOST> -p <SOURCE_DB_PORT> -Fc -v \
    --section=pre-data --exclude-schema="_timescaledb*" \
    -f dump_pre_data.bak <DATABASE_NAME>
    ```
1.  Restore the dumped data from the `dump_pre_data.bak` file into your Timescale Cloud
    database, using your Timescale Cloud connection details. To avoid
    permissions errors, include the `--no-owner` flag:
    ```bash
    pg_restore -U tsdbadmin -W \
    -h <CLOUD_HOST> -p <CLOUD_PORT> --no-owner -Fc \
    -v -d tsdb dump_pre_data.bak
    ```

</procedure>

### Troubleshooting
If you see any of these errors during the migration process, you can safely
ignore them. The migration still occurs successfully.

`pg_restore` tries to apply the TimescaleDB extension when it copies your
schema. This can cause a permissions error. Because TimescaleDB is already
installed by default on Timescale Cloud, you can safely ignore this.

```bash
pg_restore: creating EXTENSION "timescaledb"
pg_restore: creating COMMENT "EXTENSION timescaledb"
pg_restore: while PROCESSING TOC:
pg_restore: from TOC entry 6239; 0 0 COMMENT EXTENSION timescaledb
pg_restore: error: could not execute query: ERROR:  must be owner of extension timescaledb
```

If you have continuous aggregates, you might get the following error. Ignore
this, because you [restore your aggregates](#recreate-continuous-aggregates)
later on.

```bash
pg_restore: error: could not execute query: ERROR:  relation "_timescaledb_internal._materialized_hypertable_x" does not exist
```

```bash
pg_restore: WARNING:  no privileges were granted for "<..>"
```

## Restore hypertables in Timescale Cloud
After pre-data migration, your hypertables from your source database become
regular PostgreSQL tables in Cloud. Recreate your hypertables in Cloud to
restore them.

<procedure>

### Restoring hypertables in Timescale Cloud
1.  Connect to your Timescale Cloud database:
    ```sql
    psql "postgres://tsdbadmin:<CLOUD_PASSWORD>@<CLOUD_HOST>:<CLOUD_PORT>/tsdb?sslmode=require"
    ```
1.  Restore the hypertable:
    ```sql
    SELECT create_hypertable(
       '<TABLE_NAME>', '<TIME_COLUMN_NAME>',
        chunk_time_interval =>
            INTERVAL '<CHUNK_TIME_INTERVAL>');
    ```

</procedure>

## Copy data from the source database
After restoring your hypertables, return to your source database to copy your
data, table by table.

<procedure>

### Copying data from your source database
1.  Connect to your source database:
    ```bash
    psql "postgres://<SOURCE_DB_USERNAME>:<SOURCE_DB_PASSWORD>@<SOURCE_DB_HOST>:<SOURCE_DB_PORT>/<SOURCE_DB_NAME>?sslmode=require"
    ```
1.  Dump the data from the first table into a `.csv` file:
    ```sql
    \COPY (SELECT * FROM <TABLE_NAME>) TO <TABLE_NAME>.csv CSV
    ```
    Repeat for each table and hypertable you want to migrate.

</procedure>

<highlight type="note">
If your tables are very large, you can migrate each table in multiple pieces.
Split each table by time range, and copy each range individually. For example:

```sql
\COPY (SELECT * FROM <TABLE_NAME> WHERE time > '2021-11-01' AND time < '2011-11-02') TO <TABLE_NAME_DATE_RANGE>.csv CSV
```
</highlight>

## Restore data into Timescale Cloud
When you have copied your data into `.csv` files, you can restore it to
Timescale Cloud by copying from the `.csv` files. There are two methods: using
regular PostgreSQL [`COPY`][copy], or using the TimescaleDB
[`timescaledb-parallel-copy`][timescaledb-parallel-copy] function. In tests,
`timescaledb-parallel-copy` is 16% faster. The `timescaledb-parallel-copy` tool
is not included by default. You must install the function.

<highlight type="important">
Because `COPY` decompresses data, any compressed data in your source 
database is now stored uncompressed in your `.csv` files. If you
provisioned your Timescale Cloud storage for your compressed data, the
uncompressed data may take too much storage. To avoid this problem, periodically
recompress your data as you copy it in. For more information on compression, see
the [compression section](https://docs.timescale.com/timescaledb/latest/how-to-guides/compression/).
</highlight>

<procedure>

### Restoring data into Timescale Cloud with timescaledb-parallel-copy
1.  At the command prompt, install `timescaledb-parallel-copy`:
    ```bash
    go get github.com/timescale/timescaledb-parallel-copy/cmd/timescaledb-parallel-copy
    ```
1.  Use `timescaledb-parallel-copy` to import data into
    your Cloud database. Set `<NUM_WORKERS>` to twice the number of CPUs in your
    database. For example, if you have 4 CPUs, `<NUM_WORKERS>` should be `8`.
    ```bash
    timescaledb-parallel-copy \
    --connection "host=<CLOUD_HOST> \
    user=tsdbadmin password=<CLOUD_PASSWORD> \
    port=<CLOUD_PORT> \
    sslmode=require" \
    --db-name tsdb \
    --table <TABLE_NAME> \
    --file <FILE_NAME>.csv \
    --workers <NUM_WORKERS> \
    --reporting-period 30s
    ```
    Repeat for each table and hypertable you want to migrate.

</procedure>

<procedure>

### Restoring data into Timescale Cloud with COPY
1.  Connect to your Timescale Cloud database:
    ```sql
    psql "postgres://tsdbadmin:<CLOUD_PASSWORD>@<CLOUD_HOST>:<CLOUD_PORT>/tsdb?sslmode=require"
    ```
1.  Restore the data to your Timescale Cloud database:
    ```sql
    \COPY <TABLE_NAME> FROM '<TABLE_NAME>.csv' WITH (FORMAT CSV);
    ```
    Repeat for each table and hypertable you want to migrate.

</procedure>

## Migrate schema post-data
When you have migrated your table and hypertable data, migrate your PostgreSQL
schema post-data. This includes information about constraints.

<procedure>

### Migrating schema post-data
1.  At the command prompt, dump the schema post-data from your source database
    into a `dump_post_data.bak` file, using your source database connection details. Exclude
    Timescale-specific schemas. If you are prompted for a password, use your
    source database credentials:
    ```bash
    pg_dump -U <SOURCE_DB_USERNAME> -W \
    -h <SOURCE_DB_HOST> -p <SOURCE_DB_PORT> -Fc -v \
    --section=post-data --exclude-schema="_timescaledb*" \
    -f dump_post_data.bak <DATABASE_NAME>
    ```
1.  Restore the dumped schema post-data from the `dump_post_data.bak` file into your Timescale
    Cloud database, using your Timescale Cloud connection details. To avoid
    permissions errors, include the `--no-owner` flag:
    ```bash
    pg_restore -U tsdbadmin -W \
    -h <CLOUD_HOST> -p <CLOUD_PORT> --no-owner -Fc \
    -v -d tsdb dump_post_data.bak
    ```

</procedure>

### Troubleshooting
If you see these errors during the migration process, you can safely ignore
them. The migration still occurs successfully.

```bash
pg_restore: error: could not execute query: ERROR:  relation "<relation_name>" already exists
```

```bash
pg_restore: error: could not execute query: ERROR:  trigger "ts_insert_blocker" for relation "<relation_name>" already exists
```

## Recreate continuous aggregates
By default, continuous aggregates aren't migrated when you transfer your schema
and data separately. Restore them by recreating the continuous aggregate
definitions and recomputing the results on your Cloud database. The recomputed
continuous aggregates only aggregate existing data in your Cloud database. They
don't include deleted raw data.

<procedure>

### Recreating continuous aggregates
1.  Connect to your source database:
    ```bash
    psql "postgres://<SOURCE_DB_USERNAME>:<SOURCE_DB_PASSWORD>@<SOURCE_DB_HOST>:<SOURCE_DB_PORT>/<SOURCE_DB_NAME>?sslmode=require"
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
1.  Connect to your Timescale Cloud database:
    ```bash
    psql "postgres://tsdbadmin:<CLOUD_PASSWORD>@<CLOUD_HOST>:<CLOUD_PORT>/tsdb?sslmode=require"
    ```
1.  Recreate each continuous aggregate definition:
    ```sql
    CREATE MATERIALIZED VIEW <VIEW_NAME>
    WITH (timescaledb.continuous) AS
    <VIEW_DEFINITION>
    ```

</procedure>

## Recreate policies
By default, policies aren't migrated when you transfer your schema and data
separately. Recreate them on your Cloud database.

<procedure>

### Recreating policies
1.  Connect to your source database:
    ```sql
    psql "postgres://<SOURCE_DB_USERNAME>:<SOURCE_DB_PASSWORD>@<SOURCE_DB_HOST>:<SOURCE_DB_PORT>/<SOURCE_DB_NAME>?sslmode=require"
    ```
1.  Get a list of your existing policies. This query returns a list of all your
    policies, including continuous aggregate refresh policies, retention
    policies, compression policies, and reorder policies:
    ```sql
    SELECT application_name, schedule_interval, retry_period,
        config, hypertable_name
        FROM timescaledb_information.jobs WHERE owner = '<SOURCE_DB_USERNAME>';
    ```
1.  Connect to your Timescale Cloud database:
    ```sql
    psql "postgres://tsdbadmin:<CLOUD_PASSWORD>@<CLOUD_HOST>:<CLOUD_PORT>/tsdb?sslmode=require"
    ```
1.  Recreate each policy. For more information about recreating policies, see
    the sections on [continuous-aggregate refresh policies][cagg-policy],
    [retention policies][retention-policy], [compression
    policies][compression-policy], and [reorder policies][reorder-policy].

</procedure>

## Update table statistics
Update your table statistics by running [`ANALYZE`][analyze] on your entire
dataset:
```sql
ANALYZE;
```

### Troubleshooting

If you see errors of the following form when you run `ANALYZE`, you can safely
ignore them:

```
WARNING:  skipping "<TABLE OR INDEX>" --- only superuser can analyze it
```

The skipped tables and indexes correspond to system catalogs that can't be
accessed. Skipping them does not affect statistics on your data.

[analyze]: https://www.postgresql.org/docs/10/sql-analyze.html
[cagg-policy]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/refresh-policies/
[copy]: https://www.postgresql.org/docs/9.2/sql-copy.html
[compression]: /timescaledb/:currentVersion:/how-to-guides/compression/
[compression-policy]: /timescaledb/:currentVersion:/getting-started/compress-data/#enable-timescaledb-compression-on-the-hypertable
[choosing-method]: /migrate-to-cloud/
[extensions]: /customize-configuration/#postgresql-extensions
[install-timescale-cloud]: /install/:currentVersion:/installation-cloud/
[pg_dump]: https://www.postgresql.org/docs/current/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/app-pgrestore.html
[psql]: /timescaledb/:currentVersion:/how-to-guides/connecting/psql/
[retention-policy]: /timescaledb/:currentVersion:/how-to-guides/data-retention/create-a-retention-policy/
[reorder-policy]: /api/:currentVersion:/hypertable/add_reorder_policy/
[timescaledb-parallel-copy]: https://github.com/timescale/timescaledb-parallel-copy
[upgrading-postgresql]: https://kb-managed.timescale.com/en/articles/5368016-perform-a-postgresql-major-version-upgrade
[upgrading-postgresql-self-hosted]: /timescaledb/:currentVersion:/how-to-guides/update-timescaledb/upgrade-postgresql/
[upgrading-timescaledb]: /timescaledb/:currentVersion:/how-to-guides/update-timescaledb/update-timescaledb-2/
