# Logical backups with pg_dump and pg_restore
You can backup and restore an entire database or individual hypertables using
the native PostgreSQL [`pg_dump`][pg_dump] and [`pg_restore`][pg_restore]
commands.

Upgrades between different versions of TimescaleDB can be done in place; you
don't need to backup and restore your data. See
the [upgrading instructions][timescaledb-upgrade].

<highlight type="warning">
If you are using this `pg_dump` backup method regularly, make sure you keep
track of which versions of PostgreSQL and TimescaleDB you are running. For more
information, see "Troubleshooting version mismatches" in this section.
</highlight>

## Back up your entire database [](backup-entiredb)
You can perform a backup using the `pg_dump` command at the command prompt. For
example, to backup a database named `exampledb`:
```bash
pg_dump -Fc -f exampledb.bak exampledb
```

<highlight type="warning">
Do not use the `pg_dump` command to backup individual hypertables. Dumps created
using this method lack the necessary information to correctly restore the
hypertable from backup.
</highlight>

## Restore your entire database from backup
When you need to restore data from a backup, you can use `psql` to create a new database and restore the data.

### Procedure: Restoring an entire database from backup
1.  In `pgsql`, create a new database to restore to, and connect to it:
    ```sql
    CREATE DATABASE exampledb;
    \c exampledb
    CREATE EXTENSION IF NOT EXISTS timescaledb;
    SELECT timescaledb_pre_restore();
    ```
1.  Restore the database:
    ```sql
    \! pg_restore -Fc -d exampledb exampledb.bak
    SELECT timescaledb_post_restore();
    ```

## Back up individual hypertables[](backup-hypertable)
The `pg_dump` command provides flags that allow you to specify tables or schemas
to back up. However, using these flags means that the dump lacks necessary
information that TimescaleDB requires to understand the relationship between
them. Even if you explicitly specify both the hypertable and all of its
constituent chunks, the dump would still not contain all the information it
needs to recreate the hypertable on restore.

<highlight type="warning">
Do not use the `pg_dump` command to backup individual hypertables. Dumps created
using this method lack the necessary information to correctly restore the
hypertable from backup.
</highlight>

You can backup individual hypertables by backing up the entire database, and
then excluding the tables you do not want to backup. You can also use this
method to backup individual plain tables that are not hypertables.

### Procedure: Backing up individual hypertables
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

### Procedure: Restoring individual hypertables from backup
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

### Troubleshoot version mismatches [](tshoot-version-mismatch)
The PostgreSQL `pg_dump` command does not allow you to specify which version of
the extension to use when backing up. This can create problems if you have a
more recent version installed. For example, if you create the backup using an
older version of TimescaleDB, and when you restore it uses the current version,
without giving you an opportunity to upgrade first.

You can work around this problem when you are restoring from backup by making
sure the new PostgreSQL instance has the same extension version as the original
database before you perform the restore. After the data is restored, you can
upgrade the version of TimescaleDB.

[pg_dump]: https://www.postgresql.org/docs/current/static/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/static/app-pgrestore.html
[timescaledb-upgrade]: /how-to-guides/update-timescaledb/
[parallel importer]: https://github.com/timescale/timescaledb-parallel-copy
