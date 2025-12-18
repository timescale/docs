---
title: Migrate schema and data separately
excerpt: Migrate your data and schema to self-hosted TimescaleDB. This method copies each table or chunk separately, which means you can restart midway if one copy operation fails
products: [self_hosted]
keywords: [data migration]
tags: [ingest]
---

import UsingParallelCopy from "versionContent/_partials/_migrate_using_parallel_copy.mdx";
import UsingPostgresCopy from "versionContent/_partials/_migrate_using_postgres_copy.mdx";
import PostSchemaEtal from "versionContent/_partials/_migrate_post_schema_caggs_etal.mdx";

# Migrate schema and data separately

Migrate larger databases by migrating your schema first, then migrating the
data. This method copies each table or chunk separately, which allows you to
restart midway if one copy operation fails.

<Highlight type="note">

For smaller databases, it may be more convenient to migrate your entire database
at once. For more information, see the section on
[choosing a migration method][migrate].

</Highlight>

<Highlight type="warning">

This method does not retain continuous aggregates calculated using
already-deleted data. For example, if you delete raw data after a month but
retain downsampled data in a continuous aggregate for a year, the continuous
aggregate loses any data older than a month upon migration. If you must keep
continuous aggregates calculated using deleted data, migrate your entire
database at once. For more information, see the section on
[choosing a migration method][migrate].

</Highlight>

The procedure to migrate your database requires these steps:

*   [Migrate schema pre-data][migrate-schema-pre-data-link]
*   [Restore hypertables in $TIMESCALE_DB][restore-hypertables-in-timescale-link]
*   [Copy data from the source database][copy-data-from-the-source-database-link]
*   [Restore data into $TIMESCALE_DB][restore-data-into-timescale-link]
*   [Migrate schema post-data][migrate-schema-post-data-link]
*   [Recreate continuous aggregates][recreate-continuous-aggregates-link] (optional)
*   [Recreate policies][recreate-policies-link] (optional)
*   [Update table statistics][update-table-statistics-link]

<Highlight type="warning">

Depending on your database size and network speed, steps that involve copying
data can take a very long time. You can continue reading from your source
database during this time, though performance could be slower. To avoid this
problem, fork your database and migrate your data from the fork. If you write to
the tables in your source database during the migration, the new writes might
not be transferred to TimescaleDB. To avoid this problem, see the section on
[migrating an active database][migrate].

</Highlight>

## Prerequisites

Before you begin, check that you have:

*   Installed the $PG [`pg_dump`][pg_dump] and [`pg_restore`][pg_restore]
    utilities.
*   Installed a client for connecting to $PG. These instructions use
    [`psql`][psql], but any client works.
*   Created a new empty database in a $SELF_LONG instance. For more information, see
    the [Install $TIMESCALE_DB][enable-timescaledb]. Provision
    your database with enough space for all your data.
*   Checked that any other $PG extensions you use are compatible with
    $TIMESCALE_DB. For more information, see the [list of compatible
    extensions][all-available-extensions]. Install your other $PG extensions.
*   Checked that you're running the same major version of $PG on both your
    $SELF_LONG instance and your source database. For information about upgrading
    $PG on your source database, see the [upgrade instructions for
    $SELF_LONG][upgrading-postgresql-self-hosted] and [Managed
    Service for TimescaleDB][upgrading-postgresql].
*   Checked that you're running the same major version of $TIMESCALE_DB on both
    your target and source database. For more information, see 
    [upgrading $TIMESCALE_DB][upgrading-timescaledb].

## Migrate schema pre-data

Migrate your pre-data from your source database to $SELF_LONG. This
includes table and schema definitions, as well as information on sequences,
owners, and settings. This doesn't include $TIMESCALE_DB-specific schemas.

<Procedure>

### Migrating schema pre-data

1.  Dump the schema pre-data from your source database into a `dump_pre_data.bak` file, using
    your source database connection details. Exclude $TIMESCALE_DB-specific schemas.
    If you are prompted for a password, use your source database credentials:

    ```bash
    pg_dump -U <SOURCE_DB_USERNAME> -W \
    -h <SOURCE_DB_HOST> -p <SOURCE_DB_PORT> -Fc -v \
    --section=pre-data --exclude-schema="_timescaledb*" \
    -f dump_pre_data.bak <DATABASE_NAME>
    ```

1.  Restore the dumped data from the `dump_pre_data.bak` file into your $SELF_LONG instance, using your $SELF_LONG connection details. To avoid permissions errors, include the `--no-owner` flag:

    ```bash
    pg_restore -U tsdbadmin -W \
    -h <HOST> -p <PORT> --no-owner -Fc \
    -v -d tsdb dump_pre_data.bak
    ```

</Procedure>

## Restore hypertables in your $SELF_LONG instance

After pre-data migration, your hypertables from your source database become
regular $PG tables in $TIMESCALE_DB. Recreate your hypertables in your $SELF_LONG instance to
restore them.

<Procedure>

### Restoring hypertables in your $SELF_LONG instance

1.  Connect to your $SELF_LONG instance:

    ```sql
    psql "postgres://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DATABSE>?sslmode=require"
    ```

1.  Restore the hypertable:

    ```sql
    SELECT create_hypertable(
       '<TABLE_NAME>',
	   by_range('<COLUMN_NAME>', INTERVAL '<CHUNK_INTERVAL>')
    );
    ```

</Procedure>

<Highlight type="note">

The `by_range` dimension builder is an addition to TimescaleDB 2.13.

</Highlight>

## Copy data from the source database

After restoring your hypertables, return to your source database to copy your
data, table by table.

<Procedure>

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

</Procedure>

<Highlight type="note">

If your tables are very large, you can migrate each table in multiple pieces.
Split each table by time range, and copy each range individually. For example:

```sql
\COPY (SELECT * FROM <TABLE_NAME> WHERE time > '2021-11-01' AND time < '2011-11-02') TO <TABLE_NAME_DATE_RANGE>.csv CSV
```

</Highlight>

## Restore data into $TIMESCALE_DB

When you have copied your data into `.csv` files, you can restore it to
$SELF_LONG by copying from the `.csv` files. There are two methods: using
regular $PG [`COPY`][copy], or using the $TIMESCALE_DB
[`timescaledb-parallel-copy`][timescaledb-parallel-copy] function. In tests,
`timescaledb-parallel-copy` is 16% faster. The `timescaledb-parallel-copy` tool
is not included by default. You must install the function.

<Highlight type="important">

Because `COPY` decompresses data, any compressed data in your source
database is now stored uncompressed in your `.csv` files. If you
provisioned your $SELF_LONG storage for your compressed data, the
uncompressed data may take too much storage. To avoid this problem, periodically
recompress your data as you copy it in. For more information on compression, see
the [compression section][compression].

</Highlight>

<UsingParallelCopy />

<UsingPostgresCopy />

<PostSchemaEtal />

[all-available-extensions]: /use-timescale/:currentVersion:/extensions/
[compression]: /use-timescale/:currentVersion:/compression/
[copy-data-from-the-source-database-link]: /self-hosted/:currentVersion:/migration/schema-then-data/#copy-data-from-the-source-database
[copy]: https://www.postgresql.org/docs/9.2/sql-copy.html
[enable-timescaledb]: /self-hosted/:currentVersion:/install/
[migrate-schema-post-data-link]: /self-hosted/:currentVersion:/migration/schema-then-data/#migrate-schema-post-data
[migrate-schema-pre-data-link]: /self-hosted/:currentVersion:/migration/schema-then-data/#migrate-schema-pre-data
[migrate]: /migrate/:currentVersion:/
[pg_dump]: https://www.postgresql.org/docs/current/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/app-pgrestore.html
[psql]: /integrations/:currentVersion:/psql/
[recreate-continuous-aggregates-link]: /self-hosted/:currentVersion:/migration/schema-then-data/#recreate-continuous-aggregates
[recreate-policies-link]: /self-hosted/:currentVersion:/migration/schema-then-data/#recreate-policies
[restore-data-into-timescale-link]: /self-hosted/:currentVersion:/migration/schema-then-data/#restore-data-into-timescale
[restore-hypertables-in-timescale-link]: /self-hosted/:currentVersion:/migration/schema-then-data/#restore-hypertables-in-your-self_long-instance
[timescaledb-parallel-copy]: https://github.com/timescale/timescaledb-parallel-copy
[update-table-statistics-link]: /self-hosted/:currentVersion:/migration/schema-then-data/#update-table-statistics
[upgrading-postgresql-self-hosted]: /self-hosted/:currentVersion:/upgrades/upgrade-pg/
[upgrading-postgresql]: https://kb-managed.timescale.com/en/articles/5368016-perform-a-postgresql-major-version-upgrade
[upgrading-timescaledb]: /self-hosted/:currentVersion:/upgrades/major-upgrade/
