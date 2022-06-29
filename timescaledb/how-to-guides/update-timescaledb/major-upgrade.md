import PlanUpgrade from '../../../../_partials/_plan_upgrade.mdx';

# Major TimescaleDB upgrades
A major upgrade is when you upgrade from one major version of TimescaleDB, to
the next major version. For example, when you upgrade from TimescaleDB&nbsp;1,
to TimescaleDB&nbsp;2.

For upgrading within your current major version, for example upgrading from
TimescaleDB&nbsp;2.5 to TimescaleDB&nbsp;2.6, see the
[minor upgrades section][upgrade-minor].

## Plan your upgrade
<PlanUpgrade />

Additionally, before you begin this major upgrade, read the
[changes in TimescaleDB&nbsp;2 section][changes-in-ts2].
This section provides a more detailed look at the major changes in
TimescaleDB&nbsp;2. It also includes infomration about how these major changes
impact the way your applications and scripts interact with the TimescaleDB API.

## Breaking changes
When you upgrade from TimescaleDB&nbsp;1, to TimescaleDB&nbsp;2, scripts
automatically configure updated features to work as expected with the new
version. However, not everything works in exactly the same way as previously.

Before you begin this major upgrade, check the database log for errors related
to failed retention policies that could have ocurred in TimescaleDB&nbsp;1. You
can either remove the failing policies entirely, or update them to be compatible
with your existing continuous aggregates.

If incompatible retention policies are present when you perform the upgrade, the
`ignore_invalidation_older_than` setting is automatically disabled, and a notice
is shown.

For more information about changes to continuous aggregates and data retention
policies, see the [release notes][relnotes-20].

## Upgrade TimescaleDB to the next major version
To perform this major upgrade:

1. Export your TimescaleDB&nbsp;1 policy settings
1. Upgrade the TimescaleDB extension
1. Verify updated policy settings and jobs

When you perform the upgrade, new policies are automatically configured based on
your current configuration. This upgrade process allows you to export your
policy settings before performing the upgrade, so that you can verify them after
the upgrade is complete.

This upgrade uses the PostgreSQL `ALTER EXTENSION` function to upgrade to the
latest version of the TimescaelDB extension. TimescaleDB supports having
different extension versions on different databases within the same PostgreSQL
instance. This allows you to update extensions independently on different
databases. Run the `ALTER EXTENSION` function on each database to upgrade them
individually.

<procedure>

### Exporting TimescaleDB&nbsp;1 policy settings

1. At the psql prompt, use this command to save the current settings for your
   policy statistics to a `.csv` file:

```sql
COPY (SELECT * FROM timescaledb_information.policy_stats)
TO policy_stats.csv csv header
```

1. Use this command to save the current settings for your continuous aggregates
   to a `.csv` file:

```sql
COPY (SELECT * FROM timescaledb_information.continuous_aggregate_stats)
TO continuous_aggregate_stats.csv csv header
```

1. Use this command to save the current settings for your drop chunk policies to
   a `.csv` file:

```sql
COPY (SELECT * FROM timescaledb_information.drop_chunks_policies)
TO drop_chunk_policies.csv csv header
```

1. Use this command to save the current settings for your reorder policies
   to a `.csv` file:

```sql
COPY (SELECT * FROM timescaledb_information.reorder_policies)
TO reorder_policies.csv csv header
```

</procedure>

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

<procedure>

### Verifying updated policy settings and jobs

1. Use this query to verify the continuous aggregate policy jobs:

```sql
SELECT * FROM timescaledb_information.jobs
  WHERE application_name LIKE 'Refresh Continuous%';

-[ RECORD 1 ]-----+--------------------------------------------------
job_id            | 1001
application_name  | Refresh Continuous Aggregate Policy [1001]
schedule_interval | 01:00:00
max_runtime       | 00:00:00
max_retries       | -1
retry_period      | 01:00:00
proc_schema       | _timescaledb_internal
proc_name         | policy_refresh_continuous_aggregate
owner             | postgres
scheduled         | t
config            | {"start_offset": "20 days", "end_offset": "10
days", "mat_hypertable_id": 2}
next_start        | 2020-10-02 12:38:07.014042-04
hypertable_schema | _timescaledb_internal
hypertable_name   | _materialized_hypertable_2
```

1. Verify the information for each policy type that you exported before you
   upgraded. For continuous aggregates, take note of the `config` information to
   verify that all settings were converted correctly.
1. Verify that all jobs are scheduled and running as expected using the new
   `timescaledb_information.job_stats` view:

```sql
SELECT * FROM timescaledb_information.job_stats
  WHERE job_id = 1001;
```

The output looks like this:

```sql
-[ RECORD 1 ]----------+------------------------------
hypertable_schema      | _timescaledb_internal
hypertable_name        | _materialized_hypertable_2
job_id                 | 1001
last_run_started_at    | 2020-10-02 09:38:06.871953-04
last_successful_finish | 2020-10-02 09:38:06.932675-04
last_run_status        | Success
job_status             | Scheduled
last_run_duration      | 00:00:00.060722
next_scheduled_run     | 2020-10-02 10:38:06.932675-04
total_runs             | 1
total_successes        | 1
total_failures         | 0
```

</procedure>


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
[upgrade-minor]: timescaledb/:currentVersion:/how-to-guides/update-timescaledb/minor-upgrade/
[relnotes-20]: /timescaledb/:currentVersion:/overview/release-notes/changes-in-timescaledb-2#retention-and-caggs
