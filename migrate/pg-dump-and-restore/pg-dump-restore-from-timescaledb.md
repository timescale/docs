---
title: Migrate from TimescaleDB using pg_dump/restore
excerpt: Migrate from a TimescaleDB database with downtime using pg_dump/restore
products: [cloud]
keywords: [migration, low-downtime]
tags: [migration, logical backup, pg_dump, pg_restore, timescaledb]
---

# Migrate from TimescaleDB using pg_dump/restore

If you are already using TimescaleDB hosted in your own cloud, and would like
to move your data to the Timescale cloud service, follow these instructions.

<Highlight type="note">
When dumping and restoring with `pg_dump` and `pg_restore`, the version of the
TimescaleDB extension must be the same in the source and target databases. If
this is not the case, subtle data corruption issues may arise.
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

import SetupSourceTarget from "versionContent/_partials/_migrate_set_up_source_and_target.mdx";

<SetupSourceTarget />

## Restore the database

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

<Procedure>

## Restoring the database from the dump

1. Restore the roles to the database:

    ```bash
    psql $TARGET -v ON_ERROR_STOP=1 --echo-errors -f roles.sql
    ```

1.  Run [timescaledb_pre_restore][timescaledb_pre_restore] to put your database
    in the right state for restoring:

    ```bash
    psql $TARGET -c "SELECT timescaledb_pre_restore();"
    ```

1.  Restore the database:

    ```bash
    psql $TARGET -v ON_ERROR_STOP=1 --echo-errors -f dump.sql
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
TimescaleDB, but there are some caveats. Please read the troubleshooting pages
[Dumping with concurrency](/migrate/:currentVersion:/troubleshooting#dumping-with-concurrency),
and [Restoring with concurrency](/migrate/:currentVersion:/troubleshooting#restoring-with-concurrency).
</Highlight>

[timescaledb_pre_restore]: /api/:currentVersion:/administration/timescaledb_pre_restore/
[timescaledb_post_restore]: /api/:currentVersion:/administration/timescaledb_post_restore/
[troubleshooting]: /self-hosted/:currentVersion:/troubleshooting/#versions-are-mismatched-when-dumping-and-restoring-a-database
[postgres-docs]: https://www.postgresql.org/docs/current/app-pg-dumpall.html
[dumping-and-locks]: /migrate/:currentVersion:/troubleshooting#dumping-and-locks
