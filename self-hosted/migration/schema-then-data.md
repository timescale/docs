---
title: Migrate schema and data separately
excerpt: Migrate your Timescale data and schema to self-hosted TimescaleDB
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
[choosing a migration method](/self-hosted/latest/migration/).
</Highlight>

<Highlight type="warning">
This method does not retain continuous aggregates calculated using
already-deleted data. For example, if you delete raw data after a month but
retain downsampled data in a continuous aggregate for a year, the continuous
aggregate loses any data older than a month upon migration. If you must keep
continuous aggregates calculated using deleted data, migrate your entire
database at once. For more information, see the section on
[choosing a migration method](/use-timescale/latest/migration/).
</Highlight>

The procedure to migrate your database requires these steps:

*   [Migrate schema pre-data](#migrate-schema-pre-data)
*   [Restore hypertables in Timescale](#restore-hypertables-in-timescale)
*   [Copy data from the source database](#copy-data-from-the-source-database)
*   [Restore data into Timescale](#restore-data-into-timescale)
*   [Migrate schema post-data](#migrate-schema-post-data)
*   [Recreate continuous aggregates](#recreate-continuous-aggregates) (optional)
*   [Recreate policies](#recreate-policies) (optional)
*   [Update table statistics](#update-table-statistics)

<Highlight type="warning">
Depending on your database size and network speed, steps that involve copying
data can take a very long time. You can continue reading from your source
database during this time, though performance could be slower. To avoid this
problem, fork your database and migrate your data from the fork. If you write to
the tables in your source database during the migration, the new writes might
not be transferred to Timescale. To avoid this problem, see the section on
[migrating an active database](/migrate/).
</Highlight>

## Prerequisites

Before you begin, check that you have:

*   Installed the PostgreSQL [`pg_dump`][pg_dump] and [`pg_restore`][pg_restore]
    utilities.
*   Installed a client for connecting to PostgreSQL. These instructions use
    [`psql`][psql], but any client works.
*   Created a new empty database in Timescale. For more information, see
    the [Install Timescale section][install-selfhosted]. Provision
    your database with enough space for all your data.
*   Checked that any other PostgreSQL extensions you use are compatible with
    Timescale. For more information, see the [list of compatible
    extensions][extensions]. Install your other PostgreSQL extensions.
*   Checked that you're running the same major version of PostgreSQL on both
    Timescale and your source database. For information about upgrading
    PostgreSQL on your source database, see the [upgrade instructions for
    self-hosted TimescaleDB][upgrading-postgresql-self-hosted] and [Managed
    Service for TimescaleDB][upgrading-postgresql].
*   Checked that you're running the same major version of Timescale on both
    your target and source database. For more information, see the
    [upgrading Timescale section][upgrading-timescaledb].

## Migrate schema pre-data

Migrate your pre-data from your source database to self-hosted TimescaleDB. This
includes table and schema definitions, as well as information on sequences,
owners, and settings. This doesn't include Timescale-specific schemas.

<Procedure>

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

1.  Restore the dumped data from the `dump_pre_data.bak` file into your Timescale
    database, using your Timescale connection details. To avoid
    permissions errors, include the `--no-owner` flag:

    ```bash
    pg_restore -U tsdbadmin -W \
    -h <HOST> -p <PORT> --no-owner -Fc \
    -v -d tsdb dump_pre_data.bak
    ```

</Procedure>

## Restore hypertables in Timescale

After pre-data migration, your hypertables from your source database become
regular PostgreSQL tables in Timescale. Recreate your hypertables in Timescale to
restore them.

<Procedure>

### Restoring hypertables in Timescale

1.  Connect to your Timescale database:

    ```sql
    psql "postgres://tsdbadmin:<PASSWORD>@<HOST>:<PORT>/tsdb?sslmode=require"
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

## Restore data into Timescale

When you have copied your data into `.csv` files, you can restore it to
Timescale by copying from the `.csv` files. There are two methods: using
regular PostgreSQL [`COPY`][copy], or using the TimescaleDB
[`timescaledb-parallel-copy`][timescaledb-parallel-copy] function. In tests,
`timescaledb-parallel-copy` is 16% faster. The `timescaledb-parallel-copy` tool
is not included by default. You must install the function.

<Highlight type="important">
Because `COPY` decompresses data, any compressed data in your source
database is now stored uncompressed in your `.csv` files. If you
provisioned your Timescale storage for your compressed data, the
uncompressed data may take too much storage. To avoid this problem, periodically
recompress your data as you copy it in. For more information on compression, see
the [compression section](https://docs.timescale.com/use-timescale/latest/compression/).
</Highlight>

<UsingParallelCopy />

<UsingPostgresCopy />

<PostSchemaEtal />

[copy]: https://www.postgresql.org/docs/9.2/sql-copy.html
[extensions]: /use-timescale/:currentVersion:/extensions/
[install-selfhosted]: /self-hosted/:currentVersion:/install/
[pg_dump]: https://www.postgresql.org/docs/current/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/app-pgrestore.html
[psql]: /use-timescale/:currentVersion:/integrations/query-admin/about-psql/
[timescaledb-parallel-copy]: https://github.com/timescale/timescaledb-parallel-copy
[upgrading-postgresql]: https://kb-managed.timescale.com/en/articles/5368016-perform-a-postgresql-major-version-upgrade
[upgrading-postgresql-self-hosted]: /self-hosted/:currentVersion:/upgrades/upgrade-pg/
[upgrading-timescaledb]: /self-hosted/:currentVersion:/upgrades/major-upgrade/
