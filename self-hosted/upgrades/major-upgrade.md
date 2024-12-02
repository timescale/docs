---
title: Major TimescaleDB upgrades
excerpt: Upgrade self-hosted TimescaleDB to a new major version
products: [self_hosted]
keywords: [upgrades]
---

import PlanUpgrade from "versionContent/_partials/_plan_upgrade.mdx";
import ConsiderCloud from "versionContent/_partials/_consider-cloud.mdx";
import CheckVersions from "versionContent/_partials/_migrate_self_postgres_check_versions.mdx";
import SupportMatrix from "versionContent/_partials/_migrate_self_postgres_timescaledb_compatibility.mdx";
import ImplementMigrationPath from "versionContent/_partials/_migrate_self_postgres_implement_migration_path.mdx";

# Upgrade TimescaleDB to a major version

A major upgrade is when you update from TimescaleDB `X.<minor version>` to `Y.<minor version>`.
A minor upgrade is when you update from TimescaleDB `<major version>.x`, to TimescaleDB `<major version>.y`.
You can run different versions of TimescaleDB on different databases within the same PostgreSQL instance.
This process uses the PostgreSQL `ALTER EXTENSION` function to upgrade TimescaleDB independently on different
databases.

When you perform a major upgrade, new policies are automatically configured based on your current 
configuration. In order to verify your policies post upgrade, in this upgrade process you export 
your policy settings before upgrading.

<ConsiderCloud />

This page shows you how to perform a major upgrade. For minor upgrades, see
[Upgrade TimescaleDB to a minor version][upgrade-minor].

## Prerequisites

<PlanUpgrade />

## Check the TimescaleDB and PostgreSQL versions

<CheckVersions />

## Plan your upgrade path

Best practice is to always use the latest version of TimescaleDB. Subscribe to our releases on GitHub or use Timescale
Cloud and always get latest update without any hassle.

Check the following support matrix against the versions of TimescaleDB and PostgreSQL that you are
running currently and the versions you want to update to, then choose your upgrade path.

For example, to upgrade from TimescaleDB 1.7 on PostgreSQL 12 to TimescaleDB 2.17.2 on PostgreSQL 15 you 
need to:
1. Upgrade TimescaleDB to 2.10
1. Upgrade PostgreSQL to 15
1. Upgrade TimescaleDB to 2.17.2.

You may need to [upgrade to the latest PostgreSQL version][upgrade-pg] before you upgrade TimescaleDB.

<SupportMatrix />

## Check for failed retention policies

When you upgrade from TimescaleDB 1 to TimescaleDB 2, scripts
automatically configure updated features to work as expected with the new
version. However, not everything works in exactly the same way as previously.

Before you begin this major upgrade, check the database log for errors related
to failed retention policies that could have occurred in TimescaleDB 1. You
can either remove the failing policies entirely, or update them to be compatible
with your existing continuous aggregates.

If incompatible retention policies are present when you perform the upgrade, the
`ignore_invalidation_older_than` setting is automatically turned off, and a
notice is shown.

## Export your policy settings 

<Procedure>

1. **Set your connection string**

   This variable holds the connection information for the database to upgrade:

   ```bash
   export SOURCE="postgres://<user>:<password>@<source host>:<source port>/<db_name>"
   ```

1. **Connect to your PostgreSQL deployment**
   ```bash
   psql -d $SOURCE
   ```

1. **Save your policy statistics settings to a `.csv` file**

    ```sql
    COPY (SELECT * FROM timescaledb_information.policy_stats)
    TO policy_stats.csv csv header
    ```

1. **Save your continuous aggregates settings to a `.csv` file**

    ```sql
    COPY (SELECT * FROM timescaledb_information.continuous_aggregate_stats)
    TO continuous_aggregate_stats.csv csv header
    ```

1. **Save your drop chunk policies to a `.csv` file**

    ```sql
    COPY (SELECT * FROM timescaledb_information.drop_chunks_policies)
    TO drop_chunk_policies.csv csv header
    ```

1. **Save your reorder policies to a `.csv` file**

    ```sql
    COPY (SELECT * FROM timescaledb_information.reorder_policies)
    TO reorder_policies.csv csv header
    ```

1. **Exit your psql session**
    ```sql
    \q;
    ```

</Procedure>



## Implement your upgrade path

<ImplementMigrationPath />


<Highlight type="note">
To upgrade TimescaleDB in a Docker container, see the 
[Docker container upgrades](/self-hosted/latest/upgrades/upgrade-docker) 
section.
</Highlight>

## Verify the updated policy settings and jobs

<Procedure>

1.  **Verify the continuous aggregate policy jobs**

    ```sql
    SELECT * FROM timescaledb_information.jobs
      WHERE application_name LIKE 'Refresh Continuous%';
    ```
    Postgres returns something like:
    ```shell
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

1. **Verify the information for each policy type that you exported before you upgraded.**
   
   For continuous aggregates, take note of the `config` information to
   verify that all settings were converted correctly. 

1. **Verify that all jobs are scheduled and running as expected**

    ```sql
    SELECT * FROM timescaledb_information.job_stats
      WHERE job_id = 1001;
    ```
    Postgres returns something like:
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

</Procedure>

You are running a shiny new version of TimescaleDB.

[upgrade-minor]: /self-hosted/:currentVersion:/upgrades/minor-upgrade/
[relnotes]: https://github.com/timescale/timescaledb/releases
[upgrade-pg]: /self-hosted/:currentVersion:/upgrades/upgrade-pg/#upgrade-postgresql
[backup]: /self-hosted/:currentVersion:/backup-and-restore/
[export-policy-settings]: /self-hosted/:currentVersion:/upgrades/major-upgrade/#export-your-policy-settings
