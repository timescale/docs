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

<Highlight type="warning">
A long-running `pg_dump` against a database can cause various issues due to the
types of locks that `pg_dump` takes. Consult the troubleshooting section
[Dumping and locks][dumping-and-locks] for more details.
</Highlight>

## Dump the source database

Dump the roles from the source database (only necessary if you're using roles
other than the default `postgres` role in your database):

```bash
pg_dumpall -d "$SOURCE" \
  --quote-all-identifiers \
  --roles-only \
  --file=roles.sql
```

Dump the source database schema and data:

```bash
pg_dump -d "$SOURCE" \
  --format=plain \
  --quote-all-identifiers \
  --no-tablespaces \
  --no-owner \
  --no-privileges \
  --file=dump.sql
```

<Highlight type="note">
For the sake of convenience, we refer to connection strings to the source and
target databases as `$SOURCE` and `$TARGET` throughout this guide. This can be
set in your shell, for example:

```bash
export SOURCE=postgres://<user>@<source host>:5432
export TARGET=postgres://<user>@<target host>:5432
```
</Highlight>

You might see some errors when running `pg_dump`. To learn if they can be safely
ignored, see the [troubleshooting section][troubleshooting].

## Restore your entire database from backup

### Ensure that the correct TimescaleDB version is installed

It is very important that the version of the TimescaleDB extension in the
target database is the same as it was in the source database.

You can determine the version of TimescaleDB in the source database with the
following command:

```bash
psql $SOURCE -c "SELECT extversion FROM pg_extension WHERE extname = 'timescaledb';"
```

You can alter the extension version in Timescale with the following query:

```bash
psql $TARGET -c "ALTER EXTENSION timescaledb UPDATE TO '<version here>';"
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

### Restoring the database from the dump

1. Restore the roles to the database:  

    ```bash
    psql $TARGET -f roles.sql
    ```
 
1.  Run [timescaledb_pre_restore][timescaledb_pre_restore] to put your database
    in the right state for restoring:

    ```bash
    psql $TARGET -c "SELECT timescaledb_pre_restore();"
    ```

1.  Restore the database:

    ```bash
    psql $TARGET -f dump.sql
    ```

1.  Run [`timescaledb_post_restore`][timescaledb_post_restore] to return your
    database to normal operations:

    ```bash
    psql $TARGET -c "SELECT timescaledb_post_restore();"
    ```

</Procedure>

<Highlight type="note">
`pg_dump` and `pg_restore` support parallel dump/restore when used in
`directory` mode. It is possible, in principle, to use this option with
TimescaleDB, but there are some caveats. Please read the following sections of
the troubleshooting documentation:
- [Dumping with concurrency][dumping-with-concurrency]
- [Restoring with concurrency][restoring-with-concurrency]
</Highlight>


[pg_dump]: https://www.postgresql.org/docs/current/static/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/static/app-pgrestore.html
[timescaledb_pre_restore]: /api/:currentVersion:/administration/timescaledb_pre_restore/
[timescaledb_post_restore]: /api/:currentVersion:/administration/timescaledb_post_restore/
[troubleshooting]: /self-hosted/:currentVersion:/troubleshooting/#versions-are-mismatched-when-dumping-and-restoring-a-database
[postgres-docs]: https://www.postgresql.org/docs/current/app-pg-dumpall.html
[dumping-and-locks]: /use-timescale/:currentVersion:/migration/troubleshooting#dumping-and-locks
[dumping-with-concurrency]: /use-timescale/:currentVersion:/migration/troubleshooting#dumping-with-concurrency
[restoring-with-concurrency]: /use-timescale/:currentVersion:/migration/troubleshooting#restoring-with-concurrency
