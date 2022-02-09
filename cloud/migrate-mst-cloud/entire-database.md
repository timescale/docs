# Migrate the entire database at once
Migrate smaller databases by dumping and restoring the entire database at once.
This method works best on databases smaller than FIXME&nbsp;GB.

<highlight type="warning">
Depending on your database size and network speed, migration can take a very
long time. You can continue reading from your old database during this time,
though performance could be slower. If you write to your old tables during the
migration, the new writes might not be transferred to Timescale Cloud. To avoid
this problem, see
[migrating an active database](https://docs.timescale.com/cloud/latest/migrate-mst-cloud/#migrating-an-active-database).
</highlight>

## Prerequisites
Before you begin, check that you have:
*   Installed the PostgreSQL [`pg_dump`][pg_dump] and [`pg_restore`][pg_restore]
    utilities.
*   Installed a client for connecting to PostgreSQL. These instructions use
    [psql][psql], but any client works.
*   Created a new empty database in Timescale Cloud. For more information, see the    
    [Install Timescale Cloud section][install-timescale-cloud].
*   Checked that you're running the same major version of PostgreSQL on both
    Managed Service for TimescaleDB, and Timescale Cloud. For more information
    about upgrading PostgreSQL on Managed Service for TimescaleDB, see the
    [upgrading PostgreSQL section][upgrading-postgresql].
*   Checked that you're running the same major version of TimescaleDB on both
    Managed Service for TimescaleDB and Timescale Cloud. For more information,
    see the [upgrading TimescaleDB section][upgrading-timescaledb].

<highlight type="note">
To speed up migration, compress your data. You can compress any chunks where
data is not being currently inserted, updated, or deleted. When you finish the
migration, you can decompress chunks as needed for normal operation. For more
information about compression and decompression, see the
[compression section](https://docs.timescale.com/timescaledb/latest/how-to-guides/compression/).
</highlight>

<procedure>

### Migrating the entire database at once
1.  Dump all the data from your old database into a `.bak` file, using your
    Managed Service for TimescaleDB connection details. When you are prompted
    for a password, use your Managed Service for TimescaleDB credentials:
    ```bash
    pg_dump -U tsdbadmin -W \
    -h <mst_host> -p <mst_port> -Fc -v \
    -f <file-name>.bak defaultdb
    ```
1.  Connect to your Timescale Cloud database using your Timescale Cloud
    connection details. When you are prompted for a password, use your Timescale
    Cloud credentials:
    ```bash
    psql “postgres://tsdbadmin:<cloud_password>@<cloud_host>:<cloud_port>/tsdb?sslmode=require”
    ```
1.  Prepare your Timescale Cloud database for data restoration by using
    [`timescaledb_pre_restore`][timescaledb_pre_restore] to stop background
    workers:
    ```sql
    SELECT timescaledb_pre_restore();
    ```
1.  At the command prompt, restore the dumped data from the `.bak` file into
    your Timescale Cloud database, using your Timescale Cloud connection
    details. To avoid permissions errors, include the `--no-owner` flag:
    ```bash
    pg_restore -U tsdbadmin -W \
    -h <cloud_host> -p <cloud_port> --no-owner \
    -Fc -v -d tsdb <file-name>.bak
    ```
1.  At the `psql` prompt, return your Timescale Cloud database to normal
    operations by using the
    [`timescaledb_post_restore`][timescaledb_post_restore] command:
    ```sql
    SELECT timescaledb_post_restore();
    ```

</procedure>

## Troubleshooting
If you these errors during the migration process, you can safely ignore them.
The migration still occurs successfully.

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

`pg_restore` tries to apply the TimescaleDB extension when it copies your
schema. This can cause a permissions error. Because TimescaleDB is already
installed by default on Timescale Cloud, you can safely ignore this.

```bash
pg_restore: creating EXTENSION "timescaledb"
pg_restore: creating COMMENT "EXTENSION timescaledb"
pg_restore: while PROCESSING TOC:
pg_restore: from TOC entry 6239; 0 0 COMMENT EXTENSION timescaledb
pg_restore: error: could not execute query: ERROR:  must be owner of extension timescaledb
```

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
[psql]: /timescaledb/:currentVersion:/how-to-guides/connecting/psql/
[timescaledb_pre_restore]: /api/:currentVersion:/administration/timescaledb_pre_restore/
[timescaledb_post_restore]: /api/:currentVersion:/administration/timescaledb_post_restore/
[upgrading-postgresql]: https://kb-managed.timescale.com/en/articles/5368016-perform-a-postgresql-major-version-upgrade
[upgrading-timescaledb]: /timescaledb/:currentVersion:/how-to-guides/update-timescaledb/update-timescaledb-2/
