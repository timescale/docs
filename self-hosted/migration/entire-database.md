---
title: Migrate the entire database at once
excerpt: Migrate an entire Timescale database to self-hosted TimescaleDB in one go
products: [self_hosted]
keywords: [data migration]
tags: [ingest]
---

# Migrate the entire database at once

Migrate smaller databases by dumping and restoring the entire database at once.
This method works best on databases smaller than 100&nbsp;GB. For larger
databases, consider [migrating your schema and data
separately][migrate-separately].

<Highlight type="warning">
Depending on your database size and network speed, migration can take a very
long time. You can continue reading from your source database during this time,
though performance could be slower. To avoid this problem, fork your database
and migrate your data from the fork. If you write to tables in your source
database during the migration, the new writes might not be transferred to
Timescale. To avoid this problem, see the section on [migrating an active
database](/use-timescale/latest/migrate-db/).
</Highlight>

## Prerequisites

Before you begin, check that you have:

*   Installed the PostgreSQL [`pg_dump`][pg_dump] and [`pg_restore`][pg_restore]
    utilities.
*   Installed a client for connecting to PostgreSQL. These instructions use
    [`psql`][psql], but any client works.
*   Created a new empty database in Timescale. For more information, see
    the [Install Timescale section][install-selfhosted-timescale]. Provision
    your database with enough space for all your data.
*   Checked that any other PostgreSQL extensions you use are compatible with
    Timescale. For more information, see the [list of compatible
    extensions][extensions]. Install your other PostgreSQL extensions.
*   Checked that you're running the same major version of PostgreSQL on both
    your target and source databases. For information about upgrading
    PostgreSQL on your source database, see the
    [upgrade instructions for self-hosted TimescaleDB][upgrading-postgresql-self-hosted].
*   Checked that you're running the same major version of Timescale on both
    your target and source databases. For more information, see the
    [upgrading Timescale section][upgrading-timescaledb].

<Highlight type="note">
To speed up migration, compress your data. You can compress any chunks where
data is not being currently inserted, updated, or deleted. When you finish the
migration, you can decompress chunks as needed for normal operation. For more
information about compression and decompression, see the
[compression section](https://docs.timescale.com/self-hosted/latest/compression/).
</Highlight>

<Procedure>

### Migrating the entire database at once

1.  Dump all the data from your source database into a `dump.bak` file, using your
    source database connection details. If you are prompted for a password, use
    your source database credentials:

    ```bash
    pg_dump -U <SOURCE_DB_USERNAME> -W \
    -h <SOURCE_DB_HOST> -p <SOURCE_DB_PORT> -Fc -v \
    -f dump.bak <SOURCE_DB_NAME>
    ```

1.  Connect to your Timescale database using your Timescale
    connection details. When you are prompted for a password, use your Timescale
    credentials:

    ```bash
    psql “postgres://tsdbadmin:<PASSWORD>@<HOST>:<PORT>/tsdb?sslmode=require”
    ```

1.  Prepare your Timescale database for data restoration by using
    [`timescaledb_pre_restore`][timescaledb_pre_restore] to stop background
    workers:

    ```sql
    SELECT timescaledb_pre_restore();
    ```

1.  At the command prompt, restore the dumped data from the `dump.bak` file into
    your Timescale database, using your Timescale connection
    details. To avoid permissions errors, include the `--no-owner` flag:

    ```bash
    pg_restore -U tsdbadmin -W \
    -h <CLOUD_HOST> -p <CLOUD_PORT> --no-owner \
    -Fc -v -d tsdb dump.bak
    ```

1.  At the `psql` prompt, return your Timescale database to normal
    operations by using the
    [`timescaledb_post_restore`][timescaledb_post_restore] command:

    ```sql
    SELECT timescaledb_post_restore();
    ```

1.  Update your table statistics by running [`ANALYZE`][analyze] on your entire
    dataset:

    ```sql
    ANALYZE;
    ```

</Procedure>

[analyze]: https://www.postgresql.org/docs/10/sql-analyze.html
[extensions]: /use-timescale/:currentVersion:/services/postgresql-extensions/
[install-selfhosted-timescale]: /self-hosted/:currentVersion:/install/
[migrate-separately]: /self-hosted/:currentVersion:/migration/schema-then-data/
[pg_dump]: https://www.postgresql.org/docs/current/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/app-pgrestore.html
[psql]: /use-timescale/:currentVersion:/connecting/psql/
[timescaledb_pre_restore]: /api/:currentVersion:/administration/timescaledb_pre_restore/
[timescaledb_post_restore]: /api/:currentVersion:/administration/timescaledb_post_restore/
[upgrading-postgresql-self-hosted]: /self-hosted/:currentVersion:/upgrades/upgrade-pg/
[upgrading-timescaledb]: /self-hosted/:currentVersion:/upgrades/major-upgrade/
