
1. **Take the applications that connect to the source database offline**

   The duration of the migration is proportional to the amount of data stored in your database. By
   disconnection your app from your database you avoid and possible data loss.

1. **Set your connection strings**

   These variables that hold the connection information for the source database and target Timescale Cloud service:

   ```bash
   export SOURCE=postgres://<user>:<password>@<source host>:<source port>/<db_name>
   export TARGET=postgres://tsdbadmin:<PASSWORD>@<HOST>:<PORT>/tsdb?sslmode=require
   ```
   You find the connection information for your Timescale Cloud Service in the configuration file you
   downloaded when you created the service.

1. **Ensure that the source and target databases are running the same version of TimescaleDB**

    1. Check the version of TimescaleDB running on your Timescale Cloud service:

       ```bash
       psql $TARGET -c "SELECT extversion FROM pg_extension WHERE extname = 'timescaledb';"
       ```

    1. Update the TimescaleDB extension in your source database to match the target source:

       If the timescaleDB extension is the same version on the source database and target service,
       you do not need to do this.

       ```bash
       psql $SOURCE -c "ALTER EXTENSION timescaledb UPDATE TO '<version here>';"
       ```

       For more information and guidance, see [Upgrade TimescaleDB].

1. **Ensure that the target databases is running the PostgreSQL extensions used in your source database**

    1. Check the extensions on the source database:
       ```bash
       psql $SOURCE  -c "SELECT * FROM pg_extension;"
       ```
    1. For each extension, enable it on your target Timescale Cloud service:
       ```bash
       psql $TARGET  -c "CREATE EXTENSION IF NOT EXISTS <extension name> CASCADE;"
       ```
1. **Dump the roles from your source database**

   Export your role-based security hierarchy from `<db_name>`. If you only use the default `postgres` role, this step is not
   necessary.

   ```bash
   pg_dumpall -d "$SOURCE" \
     -l <db_name> \
     --quote-all-identifiers \
     --roles-only \
     --file=roles.sql
   ```

1. **Remove roles with superuser access**

   Timescale Cloud services do not support roles with superuser access. Run the following script
   to remove statements, permissions and clauses that require superuser permissions from `roles.sql`:

   ```bash
   sed -i -E \
   -e '/CREATE ROLE "postgres";/d' \
   -e '/ALTER ROLE "postgres"/d' \
   -e 's/(NO)*SUPERUSER//g' \
   -e 's/(NO)*REPLICATION//g' \
   -e 's/(NO)*BYPASSRLS//g' \
   -e 's/GRANTED BY "[^"]*"//g' \
   roles.sql
   ```

1. **Dump the source database schema and data**

   The `pg_dump` flags remove superuser access and tablespaces from your data. When you run
   `pgdump`, check the run time, [a long-running `pg_dump` can cause issues][long-running-pgdump].

   ```bash
   pg_dump -d "$SOURCE" \
   --format=plain \
   --quote-all-identifiers \
   --no-tablespaces \
   --no-owner \
   --no-privileges \
   --file=dump.sql
   ```
   To dramatically reduce the time taken to dump the source database, using multiple connections. For more information,
   see [dumping with concurrency][dumping-with-concurrency] and [restoring with concurrency][restoring-with-concurrency].

[pg_dump]: https://www.postgresql.org/docs/current/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/app-pgrestore.html
[migrate-from-timescaledb]: /migrate/:currentVersion:/pg-dump-and-restore/#migrate-from-timescaledb-using-pg_dumprestore
[migrate-from-postgresql]: /migrate/:currentVersion:/pg-dump-and-restore/#migrate-from-postgresql-using-pg_dumprestore
[dumping-with-concurrency]: /migrate/:currentVersion:/troubleshooting/#dumping-with-concurrency
[restoring-with-concurrency]: /migrate/:currentVersion:/troubleshooting/#restoring-with-concurrency
[long-running-pgdump]: /migrate/:currentVersion:/troubleshooting/#dumping-and-locks
[Upgrade TimescaleDB]: https://docs.timescale.com/self-hosted/latest/upgrades/
[timescaledb_pre_restore]: /api/:currentVersion:/administration/#timescaledb_post_restore
[timescaledb_post_restore]: /api/:currentVersion:/administration/#timescaledb_post_restore
