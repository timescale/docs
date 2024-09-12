
1. **Dump the roles from your source database**

   Export your role-based security hierarchy.  &lt;db_name&gt; has the same value as &lt;db_name&gt; in $SOURCE.
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
   when you have uploaded them to your Timescale Cloud service.

1. **Remove roles with superuser access**

   Timescale Cloud services do not support roles with superuser access. Run the following script
   to remove statements, permissions and clauses that require superuser permissions from `roles.sql`:

   ```bash
   sed -i -E \
   -e '/CREATE ROLE "postgres";/d' \
   -e '/ALTER ROLE "postgres"/d' \
   -e '/CREATE ROLE "tsdbadmin";/d' \
   -e '/ALTER ROLE "tsdbadmin"/d' \
   -e '/GRANT "pg_read_all_stats" TO "tsdbadmin"/d' \
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
   --exclude-table-data='_timescaledb_internal.*' \
   --file=dump.sql
   ```
   
   To dramatically reduce the time taken to dump the source database, using multiple connections. For more information,
   see [dumping with concurrency][dumping-with-concurrency] and [restoring with concurrency][restoring-with-concurrency].


[pg_dump]: https://www.postgresql.org/docs/current/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/app-pgrestore.html
[dumping-with-concurrency]: /migrate/:currentVersion:/troubleshooting/#dumping-with-concurrency
[restoring-with-concurrency]: /migrate/:currentVersion:/troubleshooting/#restoring-with-concurrency
[long-running-pgdump]: /migrate/:currentVersion:/troubleshooting/#dumping-and-locks
[Upgrade TimescaleDB]: https://docs.timescale.com/self-hosted/latest/upgrades/
