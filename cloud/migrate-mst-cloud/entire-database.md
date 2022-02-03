## Migrate the entire database at once

Migrate smaller databases by using `pg_dump` and `pg_restore` on your entire
database.

<highlight type="note">
Depending on the size of your database and your network speed, migration may
take several hours. You can continue reading and writing(?) to your old database
during this time.
</highlight>

### Prerequisites

- Check that the PostgreSQL utilities [`pg_dump`][pg_dump] and
  [`pg_restore`][pg_restore] are installed on your system:

  ```bash
  pg_dump --version
  pg_restore --version
  ```

- Create a new empty database in Timescale Cloud. For instructions on installing
  Timescale Cloud, see [Install Timescale Cloud][install-timescale-cloud].

### Migrating the entire database at once

<procedure>

1. [Compress all your data][compression] for faster migration.

1. Dump all the data from your Managed Service for TimescaleDB database into a
   file:

   ```bash
   # Use your Managed Service for TimescaleDB connection details in place of 
   # <mst_host> and <mst_port>.
   pg_dump -U tsdbadmin -W -h <mst_host> -p <mst_port> -Fc -v \
   -f <file-name>.bak defaultdb
   ```

   The service prompts you for a password. Use your credentials for Managed
   Service in TimescaleDB.

1. Connect to your Timescale Cloud database using psql:

   ```bash
   # Use your Cloud credentials and connection details in place of 
   # <cloud_password>, <cloud_host>, and <cloud_port>.
   psql “postgres://tsdbadmin:<cloud_password>@<cloud_host>:<cloud_port>/tsdb?sslmode=require”
   ```

1. In psql, run:

   ```bash
   SELECT timescaledb_pre_restore();
   ```

1. Check that `pg_dump` has finished. In your regular shell (not in psql), run
   the following command to restore the dumped data into your Cloud database. Be
   sure to set the `--no-owner` flag to avoid permissions problems.

    ```bash
    # Use your Cloud credentials and connection details.
   pg_restore -U tsdbadmin -W -h <cloud_host> -p <cloud_port> --no-owner -Fc \
   -v -d tsdb <file-name>.bak
    ```

1. In psql, run:

    ```bash
    SELECT timescaledb_post_restore();
    ```

</procedure>

<highlight type="note">
You may encounter the following errors while running `pg_dump` and `pg_restore`.
You can safely ignore them. The migration still occurs successfully.
</highlight>

#### pg_dump errors

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

#### pg_restore errors

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

To learn more about the TimescaleDB APIs in this procedure, see the API
references for: 

- [timescaledb_pre_restore][timescaledb_pre_restore]
- [timescaledb_post_restore][timescaledb_post_restore]

[cagg-policy]: /how-to-guides/continuous-aggregates/refresh-policies/
[compression-policy]: /getting-started/compress-data/#enable-timescaledb-compression-on-the-hypertable
[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[install-timescale-cloud]: /install/:currentVersion:/installation-cloud/
[pg_dump]: https://www.postgresql.org/docs/current/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/9.2/app-pgrestore.html 
[retention-policy]: /how-to-guides/data-retention/create-a-retention-policy/
[reorder-policy]: /api/:currentVersion:/hypertable/add_reorder_policy/
