## Migrate schema post-data

When you have migrated your table and hypertable data, migrate your PostgreSQL
schema post-data. This includes information about constraints.

<Procedure>

### Migrating schema post-data

1.  At the command prompt, dump the schema post-data from your source database
    into a `dump_post_data.dump` file, using your source database connection details. Exclude
    Timescale-specific schemas. If you are prompted for a password, use your
    source database credentials:

    ```bash
    pg_dump -U <SOURCE_DB_USERNAME> -W \
    -h <SOURCE_DB_HOST> -p <SOURCE_DB_PORT> -Fc -v \
    --section=post-data --exclude-schema="_timescaledb*" \
    -f dump_post_data.dump <DATABASE_NAME>
    ```

1.  Restore the dumped schema post-data from the `dump_post_data.dump` file into
    your Timescale database, using your connection details. To avoid permissions
    errors, include the `--no-owner` flag:

    ```bash
    pg_restore -U tsdbadmin -W \
    -h <HOST> -p <PORT> --no-owner -Fc \
    -v -d tsdb dump_post_data.dump
    ```

</Procedure>

### Troubleshooting

If you see these errors during the migration process, you can safely ignore
them. The migration still occurs successfully.

```
pg_restore: error: could not execute query: ERROR:  relation "<relation_name>" already exists
```

```
pg_restore: error: could not execute query: ERROR:  trigger "ts_insert_blocker" for relation "<relation_name>" already exists
```

## Recreate continuous aggregates

Continuous aggregates aren't migrated by default when you transfer your schema
and data separately. You can restore them by recreating the continuous aggregate
definitions and recomputing the results on your Timescale database. The recomputed
continuous aggregates only aggregate existing data in your Timescale database. They
don't include deleted raw data.

<Procedure>

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

1.  Connect to your Timescale database:

    ```bash
    psql "postgres://tsdbadmin:<PASSWORD>@<HOST>:<PORT>/tsdb?sslmode=require"
    ```

1.  Recreate each continuous aggregate definition:

    ```sql
    CREATE MATERIALIZED VIEW <VIEW_NAME>
    WITH (timescaledb.continuous) AS
    <VIEW_DEFINITION>
    ```

</Procedure>

## Recreate policies

By default, policies aren't migrated when you transfer your schema and data
separately. Recreate them on your Timescale database.

<Procedure>

### Recreating policies

1.  Connect to your source database:

    ```bash
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

1.  Connect to your Timescale database:

    ```sql
    psql "postgres://tsdbadmin:<PASSWORD>@<HOST>:<PORT>/tsdb?sslmode=require"
    ```

1.  Recreate each policy. For more information about recreating policies, see
    the sections on [continuous-aggregate refresh policies][cagg-policy],
    [retention policies][retention-policy], [compression
    policies][compression-policy], and [reorder policies][reorder-policy].

</Procedure>

## Update table statistics

Update your table statistics by running [`ANALYZE`][analyze] on your entire
dataset. Note that this might take some time depending on the size of your
database:

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
[cagg-policy]: /use-timescale/:currentVersion:/continuous-aggregates/refresh-policies/
[compression-policy]: /use-timescale/:currentVersion:/compression/
[retention-policy]: /use-timescale/:currentVersion:/data-retention/create-a-retention-policy/
[reorder-policy]: /api/:currentVersion:/hypertable/add_reorder_policy/
[timescaledb-parallel-copy]: https://github.com/timescale/timescaledb-parallel-copy
