# Migrate entire database at once

Migrate smaller databases by dumping and restoring the entire database at once.

<highlight type="warning"> 
Depending on your database size and  network speed,
migration may take several hours. You can continue reading from your old
database during this time, though performance may be slower. Writes made to your
old database during migration might not be copied to Timescale Cloud. Plan your migration accordingly to avoid data loss. 
</highlight>

## Prerequisites

- Check that the PostgreSQL utilities [`pg_dump`][pg_dump] and
  [`pg_restore`][pg_restore] are installed:

  ```bash
  pg_dump --version
  pg_restore --version
  ```

- Create a new empty database in Timescale Cloud. For instructions on installing
  Timescale Cloud, see [Install Timescale Cloud][install-timescale-cloud].

- Check that you're running the same major version of PostgreSQL on both Managed
  Service for TimescaleDB and Timescale Cloud. To upgrade your version, refer to
  the section on [upgrading PostgreSQL][upgrading-postgresql].

- Check that you're running the same major version of TimescaleDB on both
  Managed Service for TimescaleDB and Timescale Cloud. To upgrade your version,
  refer to the section on [upgrading TimescaleDB][upgrading-timescaledb].

<highlight type="note">
To speed up migration, compress your data. You can
compress any chunks where data is not being currently inserted, updated, or
deleted. After you finish migrating, decompress chunks as necessary for
normal operation. For more information about compression and decompression, see
the
[compression](https://docs.timescale.com/timescaledb/latest/how-to-guides/compression/)
section. 
</highlight>

## Migrating the entire database at once

<procedure>

1. Dump all the data from your old database into a .bak file:

   ```bash
   # Use your Managed Service for TimescaleDB connection details in place 
   # of <mst_host> and <mst_port>.
   pg_dump -U tsdbadmin -W -h <mst_host> -p <mst_port> -Fc -v \
   -f <file-name>.bak defaultdb
   ```

   The service prompts you for a password. Use your credentials for Managed
   Service in TimescaleDB. Wait for `pg_dump` to finish before going to the next
   step.

1. Connect to your Timescale Cloud database using psql:

   ```bash
   # Use your Cloud credentials and connection details in place of 
   # <cloud_password>, <cloud_host>, and <cloud_port>.
   psql “postgres://tsdbadmin:<cloud_password>@<cloud_host>:<cloud_port>/tsdb?sslmode=require”
   ```

1. Prepare your Timescale Cloud database for data restoration with
   [`timescaledb_pre_restore`][timescaledb_pre_restore]. This stops background
   workers. In psql, run:

   ```bash
   SELECT timescaledb_pre_restore();
   ```

1. From your regular shell prompt, not psql, run the following command. This
   restores the dumped data from the .bak file into your Cloud database. Set the
   `--no-owner` flag to avoid permissions errors.

    ```bash
    # Use your Cloud credentials and connection details.
   pg_restore -U tsdbadmin -W -h <cloud_host> -p <cloud_port> --no-owner \
   -Fc -v -d tsdb <file-name>.bak
    ```

1. Return your Timescale Cloud database to normal operations with
   [`timescaledb_post_restore`][timescaledb_post_restore]. In psql, run:

    ```bash
    SELECT timescaledb_post_restore();
    ```

</procedure>

## Errors

You may encounter the following errors while running `pg_dump` and `pg_restore`.
You can safely ignore them. The migration still occurs successfully.

### pg_dump errors

```bash
pg_dump: warning: there are circular foreign-key constraints on this table:
pg_dump: hypertable
pg_dump: You might not be able to restore the dump without using --disable-triggers or temporarily dropping the constraints.
pg_dump: Consider using a full dump instead of a --data-only dump to avoid this problem.
```

```bash
pg_dump: NOTICE:  hypertable data are in the chunks, no data will be copied
DETAIL:  Data for hypertables are stored in the chunks of a hypertable so COPY TO of a hypertable will not copy any data.
HINT:  Use "COPY (SELECT * FROM <hypertable>) TO ..." to copy all data in hypertable, or copy each chunk individually.
```

### pg_restore errors

`pg_restore` tries to apply the TimescaleDB extension as it copies your schema,
and it throws a permissions error. Since TimescaleDB is already installed by
default on Timescale Cloud, you can safely ignore this:

```bash
pg_restore: creating EXTENSION "timescaledb"
pg_restore: creating COMMENT "EXTENSION timescaledb"
pg_restore: while PROCESSING TOC:
pg_restore: from TOC entry 6239; 0 0 COMMENT EXTENSION timescaledb 
pg_restore: error: could not execute query: ERROR:  must be owner of extension timescaledb
```

You can also ignore:

```bash
​​pg_restore: WARNING:  no privileges were granted for "<..>"
```

```bash
pg_restore: warning: errors ignored on restore: 1
```

[compression]: /timescaledb/:currentVersion:/how-to-guides/compression/
[install-timescale-cloud]: /install/:currentVersion:/installation-cloud/
[pg_dump]: https://www.postgresql.org/docs/current/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/9.2/app-pgrestore.html 
[timescaledb_pre_restore]: /api/:currentVersion:/administration/timescaledb_pre_restore/
[timescaledb_post_restore]:/api/:currentVersion:/administration/timescaledb_post_restore/
[upgrading-postgresql]: /timescaledb/:currentVersion:/how-to-guides/update-timescaledb/upgrade-postgresql/
[upgrading-timescaledb]: /timescaledb/:currentVersion:/how-to-guides/update-timescaledb/update-timescaledb-2/
