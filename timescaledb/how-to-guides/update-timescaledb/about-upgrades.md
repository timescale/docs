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
version. Updates take place automatically during a maintenance window picked by
you.
[Learn more](https://docs.timescale.com/cloud/latest/service-operations/maintenance/)
about automatic version updates in Timescale Cloud.
</highlight>

## Plan your upgrade
You can upgrade your on-premise TimescaleDB installation in-place. This means
that you do not need to dump and restore your data. However, it is still
important that you plan for your upgrade ahead of time.

Before you upgrade:

* Read [the release notes][relnotes] for the TimescaleDB version you are
  upgrading to.
* Check which PostgreSQL version you are currently running. You might need to [upgrade to the latest PostgreSQL version][upgrade-pg]
  before you begin your TimescaleDB upgrade.
* [Perform a backup][backup-restore] of your database. While TimescaleDB
  upgrades are performed in-place, upgrading is an intrusive operation. Always
  make sure you have a backup on hand, and that the backup is readable in the
  case of disaster.

## Check your version
You can check which version of TimescaleDB you are running, at the psql command prompt. Use this to check which version you are running before you begin your upgrade, and again after your upgrade is complete:

```sql
\dx timescaledb

    Name     | Version |   Schema   |                             Description
-------------+---------+------------+---------------------------------------------------------------------
 timescaledb | x.y.z   | public     | Enables scalable inserts and complex queries for time-series data
(1 row)
```

[upgrade-pg]: /how-to-guides/update-timescaledb/upgrade-postgresql/
[update-tsdb-1]: https://legacy-docs.timescale.com/latest/update-timescaledb/update-tsdb-1
[update-timescaledb]: /how-to-guides/update-timescaledb/update-timescaledb/
[pg_upgrade]: https://www.postgresql.org/docs/current/static/pgupgrade.html
[backup]: /how-to-guides/backup-and-restore/
[Install]: /install/latest/
[telemetry]: /administration/telemetry/
[volumes]: https://docs.docker.com/engine/admin/volumes/volumes/
[bind-mounts]: https://docs.docker.com/engine/admin/volumes/bind-mounts/
[caggs]: /how-to-guides/continuous-aggregates
[compression]: /how-to-guides/compression
[retention]: /how-to-guides/data-retention
[retention-cagg-changes]: /overview/release-notes/changes-in-timescaledb-2#retention-and-caggs
[changes-in-ts2]: /overview/release-notes/changes-in-timescaledb-2
[changes-in-ts2-caggs]: /overview/release-notes/changes-in-timescaledb-2#updating-continuous-aggregates
[upgrade-docker]: timescaledb/:currentVersion:/how-to-guides/update-timescaledb/upgrade-docker/
[relnotes]: /timescaledb/:currentVersion:/overview/release-notes/
[backup-restore]: /timescaledb/:currentVersion:/how-to-guides/backup-and-restore/
[upgrade-pg]: timescaledb/:currentVersion:/how-to-guides/update-timescaledb/upgrade-pg/
