# Updating TimescaleDB versions [](update)

The instructions below all you to update TimescaleDB within the same major release
version (for example, from TimescaleDB 2.1 to 2.2, or from 1.7 to 1.7.4). If you need
to upgrade between TimescaleDB 1.x and 2.x, see our [separate upgrade document][update-tsdb-2]
for detailed instructions.

TimescaleDB supports **in-place updates only**: you don't need to dump and
restore your data, and versions are published with automated migration scripts
that convert any internal state if necessary.

<highlight type="warning">
There is currently no automated way to downgrade to an earlier release of TimescaleDB without setting up
a new instance of PostgreSQL with a previous release of TimescaleDB and then using `pg_restore`
from a backup.
</highlight>

### TimescaleDB release compatibility [](compatibility)

TimescaleDB currently supports the following PostgreSQL releases. If you are not
currently running a compatible release, please upgrade before updating TimescaleDB.

 TimescaleDB Release |   Supported PostgreSQL Release
 --------------------|-------------------------------
 1.7                 | 9.6, 10, 11, 12
 2.0                 | 11, 12
 2.1-2.3             | 11, 12, 13
 2.4+                | 12, 13

If you need to upgrade PostgreSQL first,
see [our documentation][upgrade-pg].

<highlight type="tip">
We always recommend that you update PostgreSQL and TimescaleDB as
separate actions to make sure that each process completes properly.
For example, if you are currently running PostgreSQL 10 and
TimescaleDB 1.7.5, and you want to upgrade to PostgreSQL 13 and
TimescaleDB 2.2, upgrade in this order:

1. Upgrade PostgreSQL 10 to PostgreSQL 12
1. Update TimescaleDB 1.7.5 to TimescaleDB 2.2 on PostgreSQL 12
1. Upgrade PostgreSQL 12 to PostgreSQL 13 with TimescaleDB 2.2 installed

</highlight>

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


This will upgrade TimescaleDB to the latest installed version, even if you
are several versions behind.

After executing the command, the psql `\dx` command should show the latest version:

```sql
\dx timescaledb

    Name     | Version |   Schema   |                             Description
-------------+---------+------------+---------------------------------------------------------------------
 timescaledb | x.y.z   | public     | Enables scalable inserts and complex queries for time-series data
(1 row)
```


[upgrade-pg]: /how-to-guides/update-timescaledb/upgrade-postgresql/
[update-timescaledb]: /how-to-guides/update-timescaledb/update-timescaledb/
[update-tsdb-2]: /how-to-guides/update-timescaledb/update-timescaledb-2/
[update-docker]: /how-to-guides/update-timescaledb/updating-docker/
[changes-in-2.0]: /overview/release-notes/changes-in-timescaledb-2/
[pg_upgrade]: https://www.postgresql.org/docs/current/static/pgupgrade.html
[backup]: /how-to-guides/backup-and-restore/
[Install]: /how-to-guides/install-timescaledb/
[telemetry]: /administration/telemetry/
