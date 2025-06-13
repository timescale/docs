---
title: Migrating from self-hosted TimescaleDB to Managed Service for TimescaleDB
excerpt: Migrate a self-hosted TimescaleDB database to Managed Service for TimescaleDB
products: [mst, self_hosted]
keywords: [data migration, database]
tags: [ingest, backup, restore]
---

# Migrate the entire database to $MST_LONG

You can migrate your data from $SELF_LONG to $MST_LONG and automate most of your most common operational tasks.

$MST_LONG creates a database named `defaultdb` and a
default user account named `tsdbadmin`. You can use the $MST_CONSOLE_LONG to create
additional users and databases using the `Users` and `Databases` tabs.

You can switch between different plan sizes in $MST_LONG.
However, during the dumping process choose a plan size that has the same
storage size or slightly larger than the currently allocated plan. This allows
you to limit the downtime during the migration process and have a sufficiently
powerful plan.

<Highlight type="warning">
Depending on your database size and network speed, migration can take a very
long time. During this time, any new writes that happen during the dumping
process are not included. To prevent data loss, turn off all the
writes to the old database server before you start the dumping process. Try to
migrate as a cold run without turning off writes on your previous server and
running the dump concurrently. This gives you an estimate of the time the dump
process takes. It also helps you in practicing the actual operation when it's
not causing downtime to your customers.
</Highlight>

## Before you begin

Ensure that you have:

*   Installed the PostgreSQL [`pg_dump`][pg_dump] and [`pg_restore`][pg_restore]
    utilities.
*   Installed a client for connecting to PostgreSQL. These instructions use
    [`psql`][psql], but any client works.
*   Created a new empty database in $MST_LONG. For more
    information, see the [Install $MST_LONG][install-mst].
    Provision your database with enough space for all your data.
*   Checked that you're running the same major version of PostgreSQL on both
    $MST_LONG and your source database. For information
    about upgrading PostgreSQL, see the [upgrade
    instructions for $SELF_LONG][upgrading-postgresql-self-hosted]
    and [$MST_LONG][upgrading-postgresql].
*   Checked that you're running the same major version of $TIMESCALE_DB on both
    $MST_LONG and your source database. For more
    information, see the [upgrading section][upgrading-timescaledb].

<Procedure>

### Migrating the database

1.  Dump all the data from your source database into a `dump.bak` file, using
    your source database connection details. If you are prompted for a password,
    use your source database credentials, and to avoid permissions errors,
    include the `--no-owner` flag:

    ```bash
    pg_dump -U <SOURCE_DB_USERNAME> -W \
    -h <SOURCE_DB_HOST> -p <SOURCE_DB_PORT> --no-owner -Fc -v \
    -f dump.bak <SOURCE_DB_NAME>
    ```

1.  At the command prompt, restore the dumped data from the `dump.bak` file into
    your $MST_LONG database, using your $MST_SHORT connection details. To migrate from multiple databases you
    repeat the process of dumping or loading one database after another. The
    `--jobs`  option specifies the number of CPUs to use to dump and restore the
    database concurrently.

    ```bash
    pg_restore -d 'postgres://CLICK_TO:REVEAL_PASSWORD@demo.demoproject.timescaledb.io:19335/defaultdb?sslmode=require' --jobs 4 dump.bak
    ```

1.  Connect to your new database and update your table statistics by running
    [`ANALYZE`]   [analyze] on your entire dataset:

    ```sql
    psql 'postgres://CLICK_TO:REVEAL_PASSWORD@demo.demoproject.timescaledb.io:19335/defaultdb?sslmode=require'
    defaultdb=> ANALYZE;
    ```

</Procedure>

## Troubleshooting

If you see these errors during the migration process, you can safely ignore
them. The migration still occurs successfully.

1.  Error when using `pg_dump`:

    ```bash
    pg_dump: warning: there are circular foreign-key constraints on this table:
    pg_dump: hypertable
    pg_dump: You might not be able to restore the dump without using --disable-triggers or temporarily dropping the constraints.
    pg_dump: Consider using a full dump instead of a --data-only dump to avoid this problem.
    pg_dump: NOTICE:  hypertable data are in the chunks, no data will be copied
    DETAIL:  Data for hypertables are stored in the chunks of a hypertable so COPY TO of a hypertable will not copy any data.
    HINT:  Use "COPY (SELECT * FROM <hypertable>) TO ..." to copy all data in hypertable, or copy each chunk individually.
    ```

1.  Error when using `pg_restore`:

   ```bash
   pg_restore: while PROCESSING TOC:
   pg_restore: from TOC entry 4142; 0 0 COMMENT EXTENSION timescaledb
   pg_restore: error: could not execute query: ERROR:  must be owner of extension timescaledb
   Command was: COMMENT ON EXTENSION timescaledb IS 'Enables scalable inserts and complex queries for time-series data';

 ```

[analyze]: https://www.postgresql.org/docs/10/sql-analyze.html
[compression]: /use-timescale/:currentVersion:/hypercore/
[install-mst]: /mst/:currentVersion:/installation-mst/#create-your-first-service
[pg_dump]: https://www.postgresql.org/docs/current/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/app-pgrestore.html
[psql]: /integrations/:currentVersion:/psql/
[upgrading-postgresql]: https://kb-managed.timescale.com/en/articles/5368016-perform-a-postgresql-major-version-upgrade
[upgrading-postgresql-self-hosted]: /self-hosted/:currentVersion:/upgrades/upgrade-pg/
[upgrading-timescaledb]: /self-hosted/:currentVersion:/upgrades/major-upgrade/
