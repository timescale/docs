import PlanUpgrade from '../../../../_partials/_plan_upgrade.mdx';

# Minor TimescaleDB upgrades
A minor upgrade is when you upgrade within your current major version of
TimescaleDB. For example, when you upgrade from TimescaleDB&nbsp;2.5, to
TimescaleDB&nbsp;2.6.

For upgrading to a new major version, for example upgrading from
TimescaleDB&nbsp;1 to TimescaleDB&nbsp;2, see the
[major upgrades section][upgrade-major].

## Plan your upgrade
<PlanUpgrade />

## Upgrade TimescaleDB to the next minor verson
This upgrade uses the PostgreSQL `ALTER EXTENSION` function to upgrade to the
latest version of the TimescaleDB extension. TimescaleDB supports having
different extension versions on different databases within the same PostgreSQL
instance. This allows you to update extensions independently on different
databases. Run the `ALTER EXTENSION` function on each database to upgrade them
individually.

<procedure>

### Upgrading the TimescaleDB extension

1. Connect to psql using the `-X` flag. This prevents any `.psqlrc` commands
   from accidentally triggering the load of a previous TimescaleDB version on
   session startup.
1. At the psql prompt, upgrade the TimescaleDB extension. This must be the first
   command you execute in the current session:

```sql
ALTER EXTENSION timescaledb UPDATE;
```

1. Check that you have upgraded to the latest version of the extension with the `\dx` command. The output should show the upgraded version number.

```sql
\dx timescaledb
```

</procedure>

[backup]: /how-to-guides/backup-and-restore/
[changes-in-2.0]: /overview/release-notes/changes-in-timescaledb-2/
[cloud-update-pg]: cloud/:currentVersion:/maintenance/#upgrade-to-a-new-postgresql-version
[downgrade]: /how-to-guides/update-timescaledb/downgrade-timescaledb/
[install]: /install/:currentVersion:/
[mst-update-pg]: https://kb-managed.timescale.com/en/articles/5368016-perform-a-postgresql-major-version-upgrade
[pg_dump]: https://www.postgresql.org/docs/current/app-pgdump.html
[pg_upgrade]: https://www.postgresql.org/docs/current/static/pgupgrade.html
[self-hosted-update-pg]: /timescaledb/:currentVersion:/how-to-guides/update-timescaledb/upgrade-postgresql/
[telemetry]: /administration/telemetry/
[update-docker]: /how-to-guides/update-timescaledb/updating-docker/
[update-timescaledb]: /how-to-guides/update-timescaledb/update-timescaledb/
[update-tsdb-2]: /how-to-guides/update-timescaledb/update-timescaledb-2/
[upgrade-pg]: /how-to-guides/update-timescaledb/upgrade-postgresql/
[upgrade-major]: timescaledb/:currentVersion:/how-to-guides/update-timescaledb/major-upgrade/
