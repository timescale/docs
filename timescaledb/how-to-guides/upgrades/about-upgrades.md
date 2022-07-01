import PlanUpgrade from '../../../../_partials/_plan_upgrade.mdx';

# About upgrades
A major upgrade is when you upgrade from one major version of TimescaleDB, to
the next major version. For example, when you upgrade from TimescaleDB&nbsp;1,
to TimescaleDB&nbsp;2.

A minor upgrade is when you upgrade within your current major version of
TimescaleDB. For example, when you upgrade from TimescaleDB&nbsp;2.5, to
TimescaleDB&nbsp;2.6.

If you originally installed TimescaleDB using Docker, you can upgrade from
within the Docker container. For more information, and instructions, see the
[Upgrading with Docker section][upgrade-docker].

<highlight type="cloud" header="Upgrade automatically" button="Try Timescale Cloud for free">
Timescale Cloud avoids the manual work involved in updating your TimescaleDB
version. Upgrades take place automatically during a maintenance window picked by
you.
[Learn more](https://docs.timescale.com/cloud/latest/service-operations/maintenance/)
about automatic version upgrades in Timescale Cloud.
</highlight>

## Plan your upgrade
<PlanUpgrade />

## Check your version
You can check which version of TimescaleDB you are running, at the psql command
prompt. Use this to check which version you are running before you begin your
upgrade, and again after your upgrade is complete:

```sql
\dx timescaledb

    Name     | Version |   Schema   |                             Description
-------------+---------+------------+---------------------------------------------------------------------
 timescaledb | x.y.z   | public     | Enables scalable inserts and complex queries for time-series data
(1 row)
```

[upgrade-pg]: timescaledb/:currentVersion:/how-to-guides/update-timescaledb/upgrade-postgresql/
[update-tsdb-1]: https://legacy-docs.timescale.com/latest/update-timescaledb/update-tsdb-1
[update-timescaledb]: timescaledb/:currentVersion:/how-to-guides/upgrades/
[pg_upgrade]: https://www.postgresql.org/docs/current/static/pgupgrade.html
[backup]: timescaledb/:currentVersion:/how-to-guides/backup-and-restore/
[Install]: timescaledb/:currentVersion:/install/latest/
[telemetry]: timescaledb/:currentVersion:/administration/telemetry/
[volumes]: https://docs.docker.com/engine/admin/volumes/volumes/
[bind-mounts]: https://docs.docker.com/engine/admin/volumes/bind-mounts/
[caggs]: timescaledb/:currentVersion:/how-to-guides/continuous-aggregates
[compression]: timescaledb/:currentVersion:/how-to-guides/compression
[retention]: timescaledb/:currentVersion:/how-to-guides/data-retention
[retention-cagg-changes]: timescaledb/:currentVersion:/overview/release-notes/changes-in-timescaledb-2#retention-and-caggs
[changes-in-ts2]: timescaledb/:currentVersion:/overview/release-notes/changes-in-timescaledb-2
[changes-in-ts2-caggs]: timescaledb/:currentVersion:/overview/release-notes/changes-in-timescaledb-2#updating-continuous-aggregates
[upgrade-docker]: timescaledb/:currentVersion:/how-to-guides/update-timescaledb/upgrade-docker/
[relnotes]: /timescaledb/:currentVersion:/overview/release-notes/
[backup-restore]: /timescaledb/:currentVersion:/how-to-guides/backup-and-restore/
[upgrade-pg]: timescaledb/:currentVersion:/how-to-guides/update-timescaledb/upgrade-pg/
