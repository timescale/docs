---
title: Migrations using pg_dump and pg_restore
excerpt: Migrate a hypertable or entire database with native PostgreSQL commands
products: [cloud, self_hosted]
keywords: [backups, restore]
tags: [recovery, logical backup, pg_dump, pg_restore]
---

import ConsiderCloud from "versionContent/_partials/_consider-cloud.mdx";

# Migrate using `pg_dump` and `pg_restore`

It is possible to migrate from self-hosted TimescaleDB to Timescale using the
native PostgreSQL [`pg_dump`][pg_dump] and [`pg_restore`][pg_restore] programs.
This works for compressed hypertables, without having to decompress the chunks
before you begin.

<Highlight type="note">
When dumping and restoring with `pg_dump` and `pg_restore`, the version of the
TimescaleDB extension must be the same in the source and target databases. If
this is not the case, subtle data corruption issues may arise.
</Highlight>

<Highlight type="warning">
Timescale does not allow having multiple databases per instance.
</Highlight>

## Dump the source database

You can dump the source database using the `pg_dump` command. For example, to
backup a database named `tsdb`, where `$SOURCE` has been configured to be the
url connection string to your database (for example `postgres://postgres@localhost:5432`):

```bash
pg_dump -d "$SOURCE" \
  --format=plain \
  --quote-all-identifiers \
  --no-tablespaces \
  --no-owner \
  --no-privileges \
  --file=dump.sql
```

You might see some errors when running `pg_dump`. To learn if they can be safely
ignored, see the [troubleshooting section][troubleshooting].

You can determine the version of TimescaleDB in the source database with the
following command:

```SQL
SELECT extversion FROM pg_extension WHERE extname = 'timescaledb';
```

## Restore your entire database from backup

### Ensure that the correct TimescaleDB version is installed

It is very important that the version of the TimescaleDB extension in the
target database is the same as it was in the source database.

You can alter the extension version in Timescale with the following query:

```SQL
ALTER EXTENSION timescaledb UPDATE TO '<version here>';
```

The extension version must be present on Timescale in order for this to be
successful. The following table gives an overview of the postgres version and
lowest available extension version:

| pg12  | pg13  | pg14  | pg15  |
|-------|-------|-------|-------|
| 1.7.5 | 2.1.0 | 2.5.0 | 2.9.0 |

By default, Timescale instances run on PostgreSQL version 15. If you require a
lower version for a migration, our support can assist you. TODO link? CTA?

When you need to restore data from a backup, you can use `psql` to create a new
database and restore the data.

<Procedure>

### Restoring an entire database from backup

1.  In `psql`, create a new database to restore to, and connect to it:

    ```sql
    CREATE DATABASE tsdb;
    \c tsdb
    CREATE EXTENSION IF NOT EXISTS timescaledb;

1.  Run [timescaledb_pre_restore][timescaledb_pre_restore] to put your database
    in the right state for restoring:

    ```sql
    SELECT timescaledb_pre_restore();
    ```

1.  Restore the database:

    ```sql
    \! pg_restore -Fc -d tsdb tsdb.bak

1.  Run [`timescaledb_post_restore`][timescaledb_post_restore] to return your
    database to normal operations:

    ```sql
    SELECT timescaledb_post_restore();
    ```

</Procedure>

<Highlight type="warning">
Do not use the `pg_restore` command with -j option. This option does not
correctly restore the TimescaleDB catalogs.
</Highlight>


[parallel importer]: https://github.com/timescale/timescaledb-parallel-copy
[pg_dump]: https://www.postgresql.org/docs/current/static/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/static/app-pgrestore.html
[timescaledb_pre_restore]: /api/:currentVersion:/administration/timescaledb_pre_restore/
[timescaledb_post_restore]: /api/:currentVersion:/administration/timescaledb_post_restore/
[timescaledb-upgrade]: /self-hosted/:currentVersion:/upgrades/
[troubleshooting]: /self-hosted/:currentVersion:/troubleshooting/#versions-are-mismatched-when-dumping-and-restoring-a-database
[postgres-docs]: https://www.postgresql.org/docs/current/app-pg-dumpall.html
