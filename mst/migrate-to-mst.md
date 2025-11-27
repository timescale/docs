---
title: Migrate from self-hosted TimescaleDB to Managed Service for TimescaleDB
excerpt: Migrate a self-hosted TimescaleDB database to Managed Service for TimescaleDB
products: [mst, self_hosted]
keywords: [data migration, database]
tags: [ingest, backup, restore]
---

# Migrate data from $SELF_LONG to an $MST_SERVICE_SHORT

You can migrate your data from $SELF_LONG to $MST_LONG and automate most of the common operational tasks.

Each $MST_SERVICE_SHORT has a database named `defaultdb`, and a default user account named `tsdbadmin`. You use 
$MST_CONSOLE_SHORT to create additional users and databases using the `Users` and `Databases` tabs.

You can switch between different plan sizes in $MST_LONG.
However, during the migration process, choose a plan size that has the same
storage size or slightly larger than the currently allocated plan. This allows
you to limit the downtime during the migration process and have sufficient compute and storage resources.

<Highlight type="information">

Depending on your database size and network speed, migration can take a very
long time. During this time, any new writes that happen during the migration
process are not included. To prevent data loss, turn off all the
writes to the source $SELF_LONG database before you start migration. 

Before migrating for production, do a cold run without turning off writes to the source $SELF_LONG database. 
This gives you an estimate of the time the migration process takes, and helps you to practice migrating without causing 
downtime to your customers.

</Highlight>

If you prefer the features of $CLOUD_LONG, you can easily [migrate your data][migrate-live] from an $MST_SERVICE_SHORT 
to a $SERVICE_LONG.

## Prerequisites

Before you migrate your data, do the following:

* Set up the migration machine:

   You run the migration commands on the migration machine. It must have enough disk space to hold the dump file.
   * Install the $PG [`pg_dump`][pg_dump] and [`pg_restore`][pg_restore] utilities on a migration machine.

   * Install a client to connect to $SELF_LONG and $MST_LONG. 

      These instructions use [`psql`][psql], but any client works.

*  Create a target $MST_SERVICE_SHORT:

    For more information, see the [Install $MST_LONG][install-mst]. Provision your target $MST_SERVICE_SHORT with enough 
    space for all your data.

*  On the source $SELF_LONG and the target $MST_SERVICE_SHORT, ensure that you are running:
   *  The same major version of $PG. 

      For information, see [upgrade $PG][upgrading-postgresql-self-hosted].

   *  The same major version of $TIMESCALE_DB

      For more information, see [Upgrade $TIMESCALE_DB to a major version][upgrading-timescaledb].

## Migrate your data to a $MST_SERVICE_SHORT

To move your data from $SELF_LONG instance to a $MST_SERVICE_SHORT, run the following commands from your migration 
machine:

<Procedure>

1. **Take offline the applications that connect to the source $SELF_LONG instance**

   The duration of migration is proportional to the amount of data stored in your database. By
   disconnecting your app from your database, you avoid possible data loss.

1. **Set your connection strings**

   These variables hold the connection information for the source $SELF_LONG instance and the target $MST_SERVICE_SHORT:

   ```bash
   export SOURCE="postgres://<user>:<password>@<source host>:<source port>/<db_name>"
   export TARGET="postgres://tsdbadmin:<password>@<host>:<port>/defaultdb?sslmode=require"
   ```

1. **Dump the data from your source $SERVICE_LONG**

    ```bash
    pg_dump -d "$SOURCE" --no-owner -Fc -v -f dump.bak 
    ```

1. **Put your target $MST_SERVICE_SHORT in the right state for restoring**

   ```bash 
   psql -d "$TARGET" -c "SELECT timescaledb_pre_restore();"
   ```
   
1. **Upload your data to the target $MST_SERVICE_SHORT** 

    ```bash
    pg_restore -d "$TARGET" --jobs 4 -Fc dump.bak
    ```
   The `--jobs`  option specifies the number of CPUs to use to dump and restore the database concurrently.

1. **Return your target $MST_SERVICE_SHORT to normal operations**

   ```bash 
   psql -d "$TARGET" -c "SELECT timescaledb_post_restore();"
   ```

1.  Connect to your new database and update your table statistics by running
    [`ANALYZE`]   [analyze] on your entire dataset:

    ```sql
    psql -d "$TARGET" defaultdb=> ANALYZE;
    ```

</Procedure>

To migrate from multiple databases, you repeat this migration procedure one database after another. 

## Troubleshooting

If you see the following errors during migration, you can safely ignore them. The migration still runs 
successfully.

-  For `pg_dump`:

    ```bash
    pg_dump: warning: there are circular foreign-key constraints on this table:
    pg_dump: hypertable
    pg_dump: You might not be able to restore the dump without using --disable-triggers or temporarily dropping the constraints.
    pg_dump: Consider using a full dump instead of a --data-only dump to avoid this problem.
    pg_dump: NOTICE:  hypertable data are in the chunks, no data will be copied
    DETAIL:  Data for hypertables are stored in the chunks of a hypertable so COPY TO of a hypertable will not copy any data.
    HINT:  Use "COPY (SELECT * FROM <hypertable>) TO ..." to copy all data in hypertable, or copy each chunk individually.
    ```

- For `pg_restore`:

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
[upgrading-postgresql]: https://www.tigerdata.com/docs/latest/
[upgrading-postgresql-self-hosted]: /self-hosted/:currentVersion:/upgrades/upgrade-pg/
[upgrading-timescaledb]: /self-hosted/:currentVersion:/upgrades/major-upgrade/
[timescaledb_pre_restore]: /api/:currentVersion:/administration/#timescaledb_pre_restore
[timescaledb_post_restore]: /api/:currentVersion:/administration/#timescaledb_post_restore
[migration]: /migrate/:currentVersion:/
[migrate-live]: /migrate/:currentVersion:/live-migration/
