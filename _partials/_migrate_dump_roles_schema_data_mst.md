
1. **Dump the roles from your source database**

   Export your role-based security hierarchy. `<db_name>` has the same value as `<db_name>` in `$SOURCE`.
   I know, it confuses me as well.

   ```bash
   pg_dumpall -d "$SOURCE" \
     -l <db_name>  \
     --quote-all-identifiers \
     --roles-only \
     --no-role-passwords \
     --file=roles.sql
   ```

   MST does not allow you to export passwords with roles. You assign passwords to these roles
   when you have uploaded them to your $SERVICE_LONG.

1. **Remove roles with superuser access**

   $SERVICE_LONGs do not support roles with superuser access. Run the following script
   to remove statements, permissions and clauses that require superuser permissions from `roles.sql`:

   ```bash
   sed -i -E \
  -e '/DROP ROLE IF EXISTS "postgres";/d' \
  -e '/DROP ROLE IF EXISTS "tsdbadmin";/d' \
  -e '/CREATE ROLE "postgres";/d' \
  -e '/ALTER ROLE "postgres"/d' \
  -e '/CREATE ROLE "rds/d' \
  -e '/ALTER ROLE "rds/d' \
  -e '/TO "rds/d' \
  -e '/GRANT "rds/d' \
  -e '/GRANT "pg_read_all_stats" TO "tsdbadmin"/d' \
  -e 's/(NO)*SUPERUSER//g' \
  -e 's/(NO)*REPLICATION//g' \
  -e 's/(NO)*BYPASSRLS//g' \
  -e 's/GRANTED BY "[^"]*"//g' \
  -e '/CREATE ROLE "tsdbadmin";/d' \
  -e '/ALTER ROLE "tsdbadmin"/d' \
  -e 's/WITH ADMIN OPTION,/WITH /g' \
  -e 's/WITH ADMIN OPTION//g' \
  -e 's/GRANTED BY ".*"//g' \
  -e '/GRANT "pg_.*" TO/d' \
  -e '/CREATE ROLE "_aiven";/d' \
  -e '/ALTER ROLE "_aiven"/d' \
  -e '/GRANT SET ON PARAMETER "pgaudit\.[^"]+" TO "_tsdbadmin_auditing"/d' \
  -e '/GRANT SET ON PARAMETER "anon\.[^"]+" TO "tsdbadmin_group"/d' \
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


[Upgrade TimescaleDB]: /self-hosted/:currentVersion:/upgrades/

[dumping-with-concurrency]: /migrate/:currentVersion:/troubleshooting/#dumping-with-concurrency
[long-running-pgdump]: /migrate/:currentVersion:/troubleshooting/#dumping-and-locks
[restoring-with-concurrency]: /migrate/:currentVersion:/troubleshooting/#restoring-with-concurrency
