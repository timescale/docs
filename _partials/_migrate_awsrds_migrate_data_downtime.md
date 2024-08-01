import MigrationSetupDBConnectionPostgresql from "versionContent/_partials/_migrate_set_up_align_db_extensions_postgres_based.mdx";

## Prepare to migrate
<Procedure>

1. **Take the applications that connect to the RDS instance offline**

   The duration of the migration is proportional to the amount of data stored in your database.  
   By disconnection your app from your database you avoid and possible data loss. You should also ensure that your 
   source RDS instance is not receiving any DML queries.

1. **Connect to your intermediary EC2 instance**

   For example:
   ```sh
   ssh -i "<key-pair>.pem" ubuntu@<EC2 instance's Public IPv4>
   ```

1. **Set your connection strings**

   These variables hold the connection information for the RDS instance and target Timescale Cloud service:

   ```bash
   export SOURCE="postgres://<Master username>:<Master password>@<Endpoint>:<Port>/<DB name>"
   export TARGET=postgres://tsdbadmin:<PASSWORD>@<HOST>:<PORT>/tsdb?sslmode=require
   ```
   You find the connection information for `SOURCE` in your RDS configuration. For `TARGET` in the configuration file you
   downloaded when you created the Timescale Cloud service.

</Procedure>

## Align the extensions on the source and target
<Procedure>

<MigrationSetupDBConnectionPostgresql />

</Procedure>

## Migrate the roles and schema from RDS to your Timescale Cloud service

Roles manage database access permissions. To migrate your role-based security hierarchy to your Timescale Cloud 
service:

<Procedure>

1. **Dump the roles from your RDS instance**

   Export your role-based security hierarchy. If you only use the default `postgres` role, this 
   step is not necessary. 

   ```bash
   pg_dumpall -d "$SOURCE" \
     --quote-all-identifiers \
     --roles-only \
     --no-role-passwords \
     --file=roles.sql
   ```

   AWS RDS does not allow you to export passwords with roles. You assign passwords to these roles
   when you have uploaded them to your Timescale Cloud service. 

1. **Remove roles with superuser access**

   Timescale Cloud services do not support roles with superuser access. Run the following script
   to remove statements, permissions and clauses that require superuser permissions from `roles.sql`:

   ```bash
   sed -i -E \
   -e '/CREATE ROLE "postgres";/d' \
   -e '/ALTER ROLE "postgres"/d' \
   -e '/CREATE ROLE "rds/d' \
   -e '/ALTER ROLE "rds/d' \
   -e '/TO "rds/d' \
   -e '/GRANT "rds/d' \
   -e 's/(NO)*SUPERUSER//g' \
   -e 's/(NO)*REPLICATION//g' \
   -e 's/(NO)*BYPASSRLS//g' \
   -e 's/GRANTED BY "[^"]*"//g' \
   roles.sql
   ```
1. **Dump the database schema from your RDS instance

   ```bash
   pg_dump -d "$SOURCE" \
     --format=plain \
     --quote-all-identifiers \
     --no-tablespaces \
     --no-owner \
     --no-privileges \
     --section=pre-data \
     --file=pre-data-dump.sql \
     --snapshot=$(cat /tmp/pgcopydb/snapshot)
   ```

1. Upload the roles and schema to your Timescale Cloud service.

   ```bash
   psql -X -d "$TARGET" \
     -v ON_ERROR_STOP=1 \
     --echo-errors \
     -f roles.sql \
     -f pre-data-dump.sql
   ```

1. Manually assign passwords to the roles.
   
   AWS RDS did not allow you to export passwords with roles. For each role, use the following command to manually 
   assign a password to a role:
   
   ```bash
    psql $TARGET -c "ALTER ROLE <role name> WITH PASSWORD '<highly secure password>';"
    ```

</Procedure> 

## Migrate data from your RDS instance to your Timescale Cloud service

<Procedure>

1. Dump the data from your RDS instance to your intermediary EC2 instance.

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
   To dramatically reduce the time taken to dump the RDS instance, using multiple connections. For more information,
   see [dumping with concurrency][dumping-with-concurrency] and [restoring with concurrency][restoring-with-concurrency].

1. Dump the database indexes, constraints and other objects.

   ```bash
   pg_dump -d "$SOURCE" \
      --format=plain \
      --quote-all-identifiers \
      --no-tablespaces \
      --no-owner \
      --no-privileges \
      --section=post-data \
      --file=post-data-dump.sql \
      --snapshot=$(cat /tmp/pgcopydb/snapshot)
   ```
1. Upload your data to your Timescale Cloud service.

   ```bash
   psql -d $TARGET -v ON_ERROR_STOP=1 --echo-errors \
     -f dump.sql \
     -f post-data-dump.sql
   ```

</Procedure>

[data-retention]: /use-timescale/:currentVersion:/data-retention/about-data-retention/

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

