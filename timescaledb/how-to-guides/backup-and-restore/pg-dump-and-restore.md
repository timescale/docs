# Using `pg_dump`  and  `pg_restore` [](pg_dump-pg_restore)

In this section, we cover how to backup and restore an entire
database or individual hypertables using the native PostgreSQL
[`pg_dump`][pg_dump] and [`pg_restore`][pg_restore] commands.

<highlight type="tip">
Upgrades between different versions of TimescaleDB can be done in place;
 you don't need to backup/restore your data.
 Follow these [updating instructions][].
</highlight>


## Entire database

To backup a database named _tutorial_, run from the command line:

```bash
pg_dump -Fc -f tutorial.bak tutorial
```

Restoring data from a backup currently requires some additional procedures,
which need to be run from `psql`:
```sql
CREATE DATABASE tutorial;
\c tutorial --connect to the db where we'll perform the restore
CREATE EXTENSION IF NOT EXISTS timescaledb;
SELECT timescaledb_pre_restore();

-- execute the restore (or from a shell)
\! pg_restore -Fc -d tutorial tutorial.bak


SELECT timescaledb_post_restore();
```

<highlight type="warning"> PostgreSQL's `pg_dump` does not currently specify the *version* of
 the extension in its backup, which leads to problems if you are
 restoring into a database instance with a more recent extension
 version installed.  (In particular, the backup could be for some
 version 1.6, but then the `CREATE EXTENSION timescaledb` command just
 installs the latest (say, 1.7), and thus does not have the
 opportunity to run our upgrade scripts.)  

The workaround is that when restoring from a backup, you need to
 restore to a PostgreSQL instance with the same extension version
 installed, and *then* upgrade the version.
 </highlight>

<highlight type="warning">
 These instructions do not work if you use flags to selectively
 choose tables (`-t`) or schemas (`--schema`), and so cannot be used
 to backup only an individual hypertable.  In particular, even if you
 explicitly specify both the hypertable and all of its constituent
 chunks, this dump would still lack necessary information that
 TimescaleDB stores in the database catalog about the relation between
 these tables.

You can, however, explicitly *exclude* tables from this whole
 database backup (`-T`), as well as continue to selectively backup
 plain tables (i.e., non-hypertable) as well.
</highlight>


## Individual hypertables

Below is the procedure for performing a backup and restore of hypertable `conditions`.

### Backup

Backup the hypertable schema:
```bash
pg_dump -s -d old_db --table conditions -N _timescaledb_internal | \
  grep -v _timescaledb_internal > schema.sql
```

Backup the hypertable data to a CSV file.
```bash
psql -d old_db \
-c "\COPY (SELECT * FROM conditions) TO data.csv DELIMITER ',' CSV"
```

### Restore
Restore the schema:
```bash
psql -d new_db < schema.sql
```

Recreate the hypertables:
```bash
psql -d new_db -c "SELECT create_hypertable('conditions', 'time')"
```

<highlight type="tip">
The parameters to `create_hypertable` do not need to be
the same as in the old db, so this is a good way to re-organize
your hypertables (e.g., change partitioning key, number of
partitions, chunk interval sizes, etc.).
</highlight>

Restore the data:
```bash
psql -d new_db -c "\COPY conditions FROM data.csv CSV"
```

<highlight type="tip">
The standard `COPY` command in PostgreSQL is single threaded.
 So to speed up importing larger amounts of data, we recommend using
 our [parallel importer][] instead.
</highlight>


[pg_dump]: https://www.postgresql.org/docs/current/static/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/static/app-pgrestore.html
[parallel importer]: https://github.com/timescale/timescaledb-parallel-copy