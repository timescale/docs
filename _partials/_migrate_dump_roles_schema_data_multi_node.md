
1. **Dump the roles from your source database**

   Export your role-based security hierarchy. If you only use the default `postgres` role, this step is not
   necessary.

   ```bash
   pg_dumpall -d "$SOURCE" \
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
   -e 's/(NO)*SUPERUSER//g' \
   -e 's/(NO)*REPLICATION//g' \
   -e 's/(NO)*BYPASSRLS//g' \
   -e 's/GRANTED BY "[^"]*"//g' \
   roles.sql
   ```




[pg_dump]: https://www.postgresql.org/docs/current/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/app-pgrestore.html
[dumping-with-concurrency]: /migrate/:currentVersion:/troubleshooting/#dumping-with-concurrency
[restoring-with-concurrency]: /migrate/:currentVersion:/troubleshooting/#restoring-with-concurrency
[long-running-pgdump]: /migrate/:currentVersion:/troubleshooting/#dumping-and-locks
[Upgrade TimescaleDB]: https://docs.timescale.com/self-hosted/latest/upgrades/
