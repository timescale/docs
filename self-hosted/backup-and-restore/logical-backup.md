---
title: Logical backup with pg_dump and pg_restore
excerpt: Back up and restore a hypertable or an entire database using native Postgres commands
keywords: [backups, restore]
products: [self_hosted]
tags: [recovery, logical backup, pg_dump, pg_restore]
---

# Logical backup with `pg_dump` and `pg_restore`

You back up and restore each self-hosted $PG database with $TIMESCALE_DB enabled using the native
$PG [`pg_dump`][pg_dump] and [`pg_restore`][pg_restore] commands. This also works for compressed hypertables, 
you don't have to decompress the chunks before you begin.

If you are using `pg_dump` to backup regularly, make sure you keep
track of the versions of $PG and $TIMESCALE_DB you are running. For more
information, see [Versions are mismatched when dumping and restoring a database][troubleshooting-version-mismatch].

This page shows you how to:

- [Back up and restore an entire database][backup-entire-database]
- [Back up and restore individual hypertables][backup-individual-tables]

You can also [upgrade between different versions of $TIMESCALE_DB][update-db]. 

## Prerequisites

- A source database to backup from, and a target database to restore to.
- Install the `psql` and `pg_dump` $PG client tools on your migration machine.

## Back up and restore an entire database

You backup and restore an entire database using `pg_dump` and `psql`.  

<Procedure>

In terminal:

1. **Set your connection strings**

   These variables hold the connection information for the source database to backup from and
   the target database to restore to:

   ```bash
   export SOURCE=postgres://<user>:<password>@<source host>:<source port>/<db_name>
   export TARGET=postgres://<user>:<password>@<source host>:<source port>
   ```

1. **Backup your database**

   ```bash
   pg_dump -d "$SOURCE" \
     -Fc -f <db_name>.bak  
   ```
    You may see some errors while `pg_dump` is running. See [Troubleshooting $SELF_LONG][troubleshooting]
    to check if they can be safely ignored.

1. **Restore your database from the backup**

   1. Connect to your target database:
      ```bash
      psql -d "$TARGET"
      ```

   1. Create a new database and enable $TIMESCALE_DB:

      ```sql
      CREATE DATABASE <restoration database>;
      \c <restoration database>
      CREATE EXTENSION IF NOT EXISTS timescaledb;
      ```
   
   1. Put your database in the right state for restoring:

       ```sql
       SELECT timescaledb_pre_restore();
       ```

   1. Restore the database:

      ```sql
       pg_restore -Fc -d <restoration database> <db_name>.bak
       ```
      
   1. Return your database to normal operations: 

      ```sql
      SELECT timescaledb_post_restore();
      ```
      Do not use `pg_restore` with the `-j` option. This option does not correctly restore the 
      $TIMESCALE_DB catalogs.

</Procedure>


## Back up and restore individual hypertables

`pg_dump` provides flags that allow you to specify tables or schemas
to back up. However, using these flags means that the dump lacks necessary
information that $TIMESCALE_DB requires to understand the relationship between
them. Even if you explicitly specify both the hypertable and all of its
constituent chunks, the dump would still not contain all the information it
needs to recreate the hypertable on restore.

To backup individual hypertables, backup the database schema, then backup only the tables 
you need. You also use this method to backup individual plain tables.

<procedure>
In Terminal:

1. **Set your connection strings**

   These variables hold the connection information for the source database to backup from and
   the target database to restore to:

   ```bash
   export SOURCE=postgres://<user>:<password>@<source host>:<source port>/<db_name>
   export TARGET=postgres://<user>:<password>@<source host>:<source port>/<db_name>
   ```

1. **Backup the database schema and individual tables**

   1. Back up the hypertable schema:

      ```bash
      pg_dump -s -d $SOURCE --table <table-name>  > schema.sql
      ```

   1.  Backup hypertable data to a CSV file:
   
      For each hypertable to backup:
      ```bash
      psql -d $SOURCE \
      -c "\COPY (SELECT * FROM <table-name>) TO <table-name>.csv DELIMITER ',' CSV"
      ```

1. **Restore the schema to the target database**

    ```bash
    psql -d $TARGET < schema.sql
    ```

1. **Restore hypertables from the backup**

   For each hypertable to backup:
   1.  Recreate the hypertable:

       ```bash
       psql -d $TARGET -c "SELECT create_hypertable(<table-name>, <partition>)"
       ```
       When you [create the new hypertable][create_hypertable], you do not need to use the 
       same parameters as existed in the source database. This
       can provide a good opportunity for you to re-organize your hypertables if
       you need to. For example, you can change the partitioning key, the number of
       partitions, or the chunk interval sizes.

   1.  Restore the data:

       ```bash
       psql -d $TARGET -c "\COPY <table-name> FROM <table-name>.csv CSV"
       ```

       The standard `COPY` command in $PG is single threaded. If you have a
       lot of data, you can speed up the copy using the [timescaledb-parallel-copy][parallel importer].

</procedure>

Best practice is to backup and restore a database at a time. However, if you have superuser access to
$PG instance with $TIMESCALE_DB installed, you can use `pg_dumpall` to back up all $PG databases in a 
cluster, including global objects that are common to all databases, namely database roles, tablespaces,
and privilege grants. You restore the $PG instance using `psql`. For more information, see the
[$PG documentation][postgres-docs].


[parallel importer]: https://github.com/timescale/timescaledb-parallel-copy

[pg_dump]: https://www.postgresql.org/docs/current/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/app-pgrestore.html
[update-db]: /self-hosted/:currentVersion:/upgrades/
[troubleshooting]: /self-hosted/:currentVersion:/troubleshooting/
[troubleshooting-version-mismatch]: /self-hosted/:currentVersion:/troubleshooting/#versions-are-mismatched-when-dumping-and-restoring-a-database
[postgres-docs]: https://www.postgresql.org/docs/17/backup-dump.html#BACKUP-DUMP-ALL
[backup-entire-database]: /self-hosted/:currentVersion:/backup-and-restore/logical-backup/#back-up-and-restore-an-entire-database
[backup-individual-tables]: /self-hosted/:currentVersion:/backup-and-restore/logical-backup/#back-up-and-restore-individual-hypertables
[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
