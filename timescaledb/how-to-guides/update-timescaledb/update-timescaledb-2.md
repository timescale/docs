# Updating TimescaleDB to 2.0 [](update)

Use these instructions to update TimescaleDB 1.x to TimescaleDB 2.0

<highlight type="warning">
These instructions are only for upgrading TimescaleDB 1.x to TimescaleDB 2.0
 To upgrade your existing TimescaleDB within the same major version
 (for example, from 1.7.2 to 1.7.4, from 2.1 to 2.2), see [Update TimescaleDB](/timescaledb/latest/how-to-guides/update-timescaledb/)
  for general update instructions.
</highlight>

### TimescaleDB release compatibility [](compatibility)

TimescaleDB currently supports the following PostgreSQL releases. If you are not
currently running a compatible release, please upgrade before updating TimescaleDB.

 TimescaleDB Release |   Supported PostgreSQL Release
 --------------------|-------------------------------
 1.7                 | 9.6, 10, 11, 12
 2.0                 | 11, 12
 2.1-2.3             | 11, 12, 13
 2.4                 | 12, 13
 2.5+                | 12, 13, 14

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

### Notice of breaking changes from TimescaleDB 1.3+
TimescaleDB 2.0 supports **in-place updates** just like previous releases. During
the update, scripts automatically configure updated features to work as expected
with TimescaleDB 2.0.

Because this is our first major version release in two years, however, we're providing additional guidance
to help you ensure the update completes successfully and everything is configured as expected (and optimized
for your workload). In particular, settings related to [Continuous Aggregates][caggs], [compression][compression],
and [data retention][retention] have been modified to provide greater configuration transparency and flexibility,
therefore we highly recommend verifying that these settings were migrated correctly.

**Before completing the upgrade**, we encourage you to read [Changes in TimescaleDB 2.0][changes-in-ts2] for a more
detailed look at the major changes in TimescaleDB 2.0 and how they impact the way your applications and scripts
interact with the API.

### Prerequisites [](prerequisites)
#### PostgreSQL compatibility
**TimescaleDB 2.0 is not compatible with PostgreSQL 9.6 or 10**. If your current PostgreSQL installation is not
at least version 11, please upgrade PostgreSQL first. Depending on your current PostgreSQL version and installed
TimescaleDB release, you may have to perform multiple upgrades because of compatibility restrictions.

For example, if you are currently running PostgreSQL 10 and TimescaleDB 1.5, the recommended upgrade path to
PostgreSQL 12 and TimescaleDB 2.0 would be:

1. Update TimescaleDB 1.5 to TimescaleDB 1.7 on PostgreSQL 10
1. Upgrade PostgreSQL 10 to PostgreSQL 12 with TimescaleDB 1.7 installed
1. Update TimescaleDB 1.7 to TimescaleDB 2.0 on PostgreSQL with the instructions below

<highlight type="tip">
Whenever possible, prefer the most recent supported version, PostgreSQL 12. Please see our [Upgrading PostgreSQL](/timescaledb/latest/how-to-guides/update-timescaledb/upgrade-postgresql/) guide for help.
</highlight>

#### Fix continuous aggregate errors before upgrading
Before starting the upgrade to TimescaleDB 2.0, **we highly recommend checking the database log for errors
related to failed retention policies that were occurring in TimescaleDB 1.x** and then either remove them or
update them to be compatible with existing continuous aggregates. Any remaining retention policies that are
still incompatible with the `ignore_invalidation_older_than` setting is automatically  disabled during
the upgrade and a notice provided.

<highlight type="tip">
Read more about changes to continuous aggregates and data retension policies [here](/timescaledb/latest/overview/release-notes/changes-in-timescaledb-2#retention-and-caggs).
</highlight>


### Update TimescaleDB [](start-update)

#### Step 1: Verify TimescaleDB 1.x policy settings (Optional)

As discussed in the [Changes to TimescaleDB 2.0][changes-in-ts2] document, the APIs and setting names
that configure various policies are changing. The update process below automatically configures
new policies using your current configurations in TimescaleDB 1.x. If you would like to verify
the policy settings after the update is complete, we suggest querying the informational views below
and saving the output so that you can refer to it once the update is complete.

Execute the following SQL to save current settings for Continuous Aggregates and other policies to CSV using `psql`. If you use an IDE like **pgAdmin** or **DBeaver**, save the output to CSV or another appropriate format to inspect later.

**Policy Stats**
```SQL
\COPY (SELECT * FROM timescaledb_information.policy_stats) TO policy_stats.csv csv header
```

**Continuous Aggregate Stats**
```SQL
\COPY (SELECT * FROM timescaledb_information.continuous_aggregate_stats) TO continuous_aggregate_stats.csv csv header
```

**Drop Chunk Policies**
```SQL
\COPY (SELECT * FROM timescaledb_information.drop_chunks_policies) TO drop_chunk_policies.csv csv header
```
**Reorder Policy Stats**
```SQL
\COPY (SELECT * FROM timescaledb_information.reorder_policies) TO reorder_policies.csv csv header
```

#### Step 2: Install and update TimescaleDB extension

Software upgrades use PostgreSQL's `ALTER EXTENSION` support to update to the
latest version. TimescaleDB supports having different extension
versions on different databases within the same PostgreSQL instance. This
allows you to update extensions independently on different databases. The
upgrade process involves three-steps:

1. We recommend that you perform a [backup][] of your database via `pg_dump`.
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

#### Step 3: Verify updated policy settings and jobs

All settings and information previously accessed through separate `stats` informational views have now
been centralized to a common `jobs` view for all types of policies. If you wish to verify that the settings
were moved correctly, query the `timescaledb_information.jobs` view to verify that each policy was correctly
moved and enabled based on your TimescaleDB 1.x setup.

In the example below, we query for all continuous aggregate policy `jobs`. Compare the names and settings
to the values of the data exported from `timescaledb_information.continuous_aggregates`:

```SQL
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

Verify the information for each policy type that was exported from TimescaleDB 1.x using the specific
listing of `jobs` in this view. For continuous aggregates, take special note of the `config` information
to verify that all settings were converted correctly given the notes in the
[Updating existing continuous aggregates][changes-in-ts2-caggs] section of our migration document.

Likewise, you can now verify that all jobs scheduled and running as expected with the new `timescaledb_information.job_stats`
view. Given the continuous aggregate `job` above, querying the new `job_stats` view might return information similar
to the following.

```SQL
SELECT * FROM timescaledb_information.job_stats
  WHERE job_id = 1001;

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
