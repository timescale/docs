---
title: Migrations using pg_dump and pg_restore
excerpt: Migrate a hypertable or entire database with native PostgreSQL commands
products: [cloud, self_hosted]
keywords: [backups, restore]
tags: [recovery, logical backup, pg_dump, pg_restore]
---

import ConsiderCloud from "versionContent/_partials/_consider-cloud.mdx";

# Migrations using `pg_dump` and `pg_restore`

You can backup and restore an entire database or individual hypertables using
the native PostgreSQL [`pg_dump`][pg_dump] and [`pg_restore`][pg_restore]
commands. This works even for compressed hypertables, without having to
decompress the chunks before you begin. You can also use this method to migrate
data from one database to another.

<Highlight type="note">
Timescale handles backups automatically by default. You do not need to manually
back up your content. For more information about backups in Timescale, see the
[backup and restore section](https://docs.timescale.com/use-timescale/latest/backup-restore-cloud/).
</Highlight>

Upgrades between different versions of TimescaleDB can be done in place; you
don't need to backup and restore your data. See
the [upgrading instructions][timescaledb-upgrade].

<Highlight type="warning">
If you are using this `pg_dump` backup method regularly, make sure you keep
track of which versions of PostgreSQL and TimescaleDB you are running. For more
information, see the
[Troubleshooting section](https://docs.timescale.com/self-hosted/latest/self-hosted/backup-and-restore/troubleshooting/).
</Highlight>

## Back up your entire database

You can perform a backup using the `pg_dump` command at the command prompt. For
example, to backup a database named `tsdb`:

```bash
pg_dump -Fc -f tsdb.bak tsdb
```

To backup a database named `tsdb` hosted on a remote server:

```bash
pg_dump -h <REMOTE_HOST> -p 55555 -U tsdbadmin -Fc -f tsdb.bak tsdb
```

You might see some errors when running `pg_dump`. To learn if they can be safely
ignored, see the [troubleshooting section][troubleshooting].

<Highlight type="warning">
Do not use the `pg_dump` command to backup individual hypertables. Dumps created
using this method lack the necessary information to correctly restore the
hypertable from backup.
</Highlight>

## Restore your entire database from backup

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

## Back up individual hypertables

The `pg_dump` command provides flags that allow you to specify tables or schemas
to back up. However, using these flags means that the dump lacks necessary
information that TimescaleDB requires to understand the relationship between
them. Even if you explicitly specify both the hypertable and all of its
constituent chunks, the dump would still not contain all the information it
needs to recreate the hypertable on restore.

<Highlight type="warning">
Do not use the `pg_dump` command to backup individual hypertables. Dumps created
using this method lack the necessary information to correctly restore the
hypertable from backup.
</Highlight>

You can backup individual hypertables by backing up the entire database, and
then excluding the tables you do not want to backup. You can also use this
method to backup individual plain tables that are not hypertables.

<Procedure>

### Backing up individual hypertables

1.  At the command prompt, back up the hypertable schema:

    ```bash
    pg_dump -s -d old_db --table conditions -N _timescaledb_internal | \
    grep -v _timescaledb_internal > schema.sql
    ```

1.  Backup the hypertable data to a CSV file:

    ```bash
    psql -d old_db \
    -c "\COPY (SELECT * FROM conditions) TO data.csv DELIMITER ',' CSV"
    ```

</Procedure>

<Procedure>

### Restoring individual hypertables from backup

1.  At the command prompt, restore the schema:

    ```bash
    psql -d new_db < schema.sql
    ```

1.  Recreate the hypertables:

    ```bash
    psql -d new_db -c "SELECT create_hypertable('conditions', 'time')"
    ```

1.  Restore the data:

    ```bash
    psql -d new_db -c "\COPY conditions FROM data.csv CSV"
    ```

    The standard `COPY` command in PostgreSQL is single threaded. If you have a
    lot of data, you can speed up the copy using the [parallel importer][]
    instead.

When you create the new hypertable with the `create_hypertable` command, you
do not need to use the same parameters as existed in the old database. This
can provide a good opportunity for you to re-organize your hypertables if
you need to. For example, you can change the partitioning key, the number of
partitions, or the chunk interval sizes.

</Procedure>

On a self hosted TimescaleDB instance with `postgres` superuser access you can
take a complete dump of all PostgreSQL databases in a cluster including global
objects that are common to all databases, namely database roles, tablespaces,
and privilege grants using `pg_dumpall`. For more
information about how to use the `pg_dumpall` utility, see
[PostgreSQL documentation][postgres-docs].

[parallel importer]: https://github.com/timescale/timescaledb-parallel-copy
[pg_dump]: https://www.postgresql.org/docs/current/static/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/static/app-pgrestore.html
[timescaledb_pre_restore]: /api/:currentVersion:/administration/timescaledb_pre_restore/
[timescaledb_post_restore]: /api/:currentVersion:/administration/timescaledb_post_restore/
[timescaledb-upgrade]: /self-hosted/:currentVersion:/upgrades/
[troubleshooting]: /self-hosted/:currentVersion:/troubleshooting/#versions-are-mismatched-when-dumping-and-restoring-a-database
[postgres-docs]: https://www.postgresql.org/docs/current/app-pg-dumpall.html
