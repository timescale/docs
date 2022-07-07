# Updating major versions of TimescaleDB [](update)

Use these instructions to update TimescaleDB within the same major release
version (for example, from TimescaleDB 2.1 to 2.2, or from 1.7 to 1.7.4). If you need to upgrade between
TimescaleDB 1.x and 2.x, see our [separate upgrade document][update-tsdb-2]
for detailed instructions.

### TimescaleDB release compatibility

TimescaleDB currently supports the following PostgreSQL releases. If you are not currently running
a compatible release, please upgrade before updating TimescaleDB.

 TimescaleDB Release |   Supported PostgreSQL Release
 --------------------|-------------------------------
 1.7                 | 9.6, 10, 11, 12
 2.0                 | 11, 12
 2.1-2.3             | 11, 12, 13
 2.4                 | 12, 13
 2.5+                | 12, 13, 14

If you need to upgrade PostgreSQL first, see [our documentation][upgrade-pg].

### Update TimescaleDB

Software upgrades use PostgreSQL's `ALTER EXTENSION` support to update to the
latest version. TimescaleDB supports having different extension
versions on different databases within the same PostgreSQL instance. This
allows you to update extensions independently on different databases. The
upgrade process involves three steps:

1. Perform a [backup][] of your database via `pg_dump`.
1. [Install][] the latest version of the TimescaleDB extension.
1. Execute the following `psql` command inside any database that you want to
   update:

```sql
ALTER EXTENSION timescaledb UPDATE;
```

<highlight type="warning">
When executing `ALTER EXTENSION`, you should connect using `psql`
with the `-X` flag to prevent any `.psqlrc` commands from accidentally
triggering the load of a previous TimescaleDB version on session startup.
It must also be the first command you execute in the session.
</highlight>


This upgrades TimescaleDB to the latest installed version, even if you
are several versions behind.

After executing the command, the psql `\dx` command should show the latest version:

```sql
\dx timescaledb

    Name     | Version |   Schema   |                             Description
-------------+---------+------------+---------------------------------------------------------------------
 timescaledb | x.y.z   | public     | Enables scalable inserts and complex queries for time-series data
(1 row)
```


[changes-in-2.0]: /overview/release-notes/changes-in-timescaledb-2/
[upgrade-pg]: /how-to-guides/update-timescaledb/upgrade-postgresql/
[update-tsdb-1]: https://legacy-docs.timescale.com/v1.7/update-timescaledb/update-tsdb-1
[update-tsdb-2]: /how-to-guides/update-timescaledb/update-timescaledb-2/
[pg_upgrade]: https://www.postgresql.org/docs/current/static/pgupgrade.html
[backup]: /how-to-guides/backup-and-restore/
[Install]: /install/latest/
[telemetry]: /administration/telemetry/
