---
title: Migrate the entire database at once
excerpt: Migrate an entire TimescaleDB database to Timescale Cloud in one go
products: [cloud]
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
Timescale Cloud. To avoid this problem, see the section on [migrating an active
database](/use-timescale/latest/migrate-db/).
</Highlight>

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

<Highlight type="note">
To speed up migration, compress your data. You can compress any chunks where
data is not being currently inserted, updated, or deleted. When you finish the
migration, you can decompress chunks as needed for normal operation. For more
information about compression and decompression, see the
[compression section](https://docs.timescale.com/use-timescale/latest/compression/).
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

1.  Connect to your Timescale Cloud database using your Timescale Cloud
    connection details. When you are prompted for a password, use your Timescale
    Cloud credentials:

    ```bash
    psql “postgres://tsdbadmin:<CLOUD_PASSWORD>@<CLOUD_HOST>:<CLOUD_PORT>/tsdb?sslmode=require”
    ```

1.  Prepare your Timescale Cloud database for data restoration by using
    [`timescaledb_pre_restore`][timescaledb_pre_restore] to stop background
    workers:

    ```sql
    SELECT timescaledb_pre_restore();
    ```

1.  At the command prompt, restore the dumped data from the `dump.bak` file into
    your Timescale Cloud database, using your Timescale Cloud connection
    details. To avoid permissions errors, include the `--no-owner` flag:

    ```bash
    pg_restore -U tsdbadmin -W \
    -h <CLOUD_HOST> -p <CLOUD_PORT> --no-owner \
    -Fc -v -d tsdb dump.bak
    ```

1.  At the `psql` prompt, return your Timescale Cloud database to normal
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

## Troubleshooting

If you see these errors during the migration process, you can safely ignore
them. The migration still occurs successfully.

1.  ```bash
    pg_dump: warning: there are circular foreign-key constraints on this table:
    pg_dump: hypertable
    pg_dump: You might not be able to restore the dump without using --disable-triggers or temporarily dropping the constraints.
    pg_dump: Consider using a full dump instead of a --data-only dump to avoid this problem.
    ```

1.  ```bash
    pg_dump: NOTICE:  hypertable data are in the chunks, no data will be copied
    DETAIL:  Data for hypertables are stored in the chunks of a hypertable so COPY TO of a hypertable will not copy any data.
    HINT:  Use "COPY (SELECT * FROM <hypertable>) TO ..." to copy all data in hypertable, or copy each chunk individually.
    ```

1.  `pg_restore` tries to apply the TimescaleDB extension when it copies your
    schema. This can cause a permissions error. Because TimescaleDB is already
    installed by default on Timescale Cloud, you can safely ignore this.

    ```bash
    pg_restore: creating EXTENSION "timescaledb"
    pg_restore: creating COMMENT "EXTENSION timescaledb"
    pg_restore: while PROCESSING TOC:
    pg_restore: from TOC entry 6239; 0 0 COMMENT EXTENSION timescaledb
    pg_restore: error: could not execute query: ERROR:  must be owner of extension timescaledb
    ```

1.  ```bash
    pg_restore: WARNING:  no privileges were granted for "<..>"
    ```

1.  ```bash
    pg_restore: warning: errors ignored on restore: 1
    ```

If you see errors of the following form when you run `ANALYZE`, you can safely
ignore them:

```
WARNING:  skipping "<TABLE OR INDEX>" --- only superuser can analyze it
```

The skipped tables and indexes correspond to system catalogs that can't be
accessed. Skipping them does not affect statistics on your data.

[analyze]: https://www.postgresql.org/docs/10/sql-analyze.html
[compression]: /use-timescale/:currentVersion:/compression/
[extensions]: /use-timescale/:currentVersion:/services/postgresql-extensions/
[install-timescale-cloud]: /getting-started/latest/
[migrate-separately]: /use-timescale/:currentVersion:/migrate-data/schema-then-data/
[pg_dump]: https://www.postgresql.org/docs/current/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/app-pgrestore.html
[psql]: /use-timescale/:currentVersion:/connecting/psql/
[timescaledb_pre_restore]: /api/:currentVersion:/administration/timescaledb_pre_restore/
[timescaledb_post_restore]: /api/:currentVersion:/administration/timescaledb_post_restore/
[upgrading-postgresql]: https://kb-managed.timescale.com/en/articles/5368016-perform-a-postgresql-major-version-upgrade
[upgrading-postgresql-self-hosted]: /self-hosted/:currentVersion:/upgrades/upgrade-pg/
[upgrading-timescaledb]: /self-hosted/:currentVersion:/upgrades/major-upgrade/
