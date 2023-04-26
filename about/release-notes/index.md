---
title: TimescaleDB release notes and future plans
excerpt: New features and fixes are released regularly
keywords: [upgrades, updates, releases]
---

# TimescaleDB release notes

This page contains release notes for TimescaleDB&nbsp;2.10.0 and newer. For
release notes for older versions, see the
[past releases section][past-relnotes].

<Highlight type="note">
Want to stay up-to-date with new releases? You can subscribe to new releases on
GitHub and be notified by email whenever a new release is available. On the
[Github page](https://github.com/timescale/timescaledb),
click `Watch`, select `Custom` and then check `Releases`.
</Highlight>

## TimescaleDB&nbsp;2.10.2 on 2023-04-20

These release notes are for the release of TimescaleDB&nbsp;2.10.2 on
2023-04-20.

<highlight type="note">
This release contains bug fixes since the last release. It is considered low
priority for upgrading. Upgrade your TimescaleDB installation at your next
opportunity.
</highlight>

### Complete list of bug fixes

*   #5410 Fix file trailer handling in the COPY fetcher
*   #5446 Add checks for malloc failure in libpq calls
*   #5233 Out of on_proc_exit slots on guc license change
*   #5428 Use consistent snapshots when scanning metadata
*   #5499 Do not segfault on large histogram() parameters
*   #5470 Ensure superuser perms during copy/move chunk
*   #5500 Fix when no FROM clause in continuous aggregate definition
*   #5433 Fix join rte in CAggs with joins
*   #5556 Fix duplicated entries on timescaledb_experimental.policies view
*   #5462 Fix segfault after column drop on compressed table
*   #5543 Copy scheduled_jobs list before sorting it
*   #5497 Allow named time_bucket arguments in Cagg definition
*   #5544 Fix refresh from beginning of Continuous Aggregate with variable time bucket
*   #5558 Use regrole for job owner
*   #5542 Enable indexscan on uncompressed part of partially compressed chunks

### Acknowledgments

Timescale thanks:

*   @nikolaps for reporting an issue with the COPY fetcher
*   @S-imo-n for reporting the issue on Background Worker Scheduler crash
*   @geezhu for reporting issue on segfault in historgram()
*   @mwahlhuetter for reporting the issue with joins in CAggs
*   @mwahlhuetter for reporting issue with duplicated entries on
    timescaledb_experimental.policies view
*   @H25E for reporting error refreshing from beginning of a Continuous
    Aggregate with variable time bucket

## TimescaleDB&nbsp;2.10.1 on 2023-03-07

These release notes are for the release of Timescale&nbsp;2.10.1 on
2023-03-07.

<highlight type="note">
This release contains bug fixes since the last release. It is considered low
priority for upgrading. Upgrade your TimescaleDB installation at your next
opportunity.
</highlight>

### Complete list of bug fixes

*   #5159 Support Continuous Aggregates names in hypertable_(detailed_)size
*   #5226 Fix concurrent locking with chunk_data_node table
*   #5317 Fix some incorrect memory handling
*   #5336 Use NameData and namestrcpy for names
*   #5343 Set PortalContext when starting job
*   #5360 Fix uninitialized bucket_info variable
*   #5362 Make copy fetcher more async
*   #5364 Fix num_chunks inconsistency in hypertables view
*   #5367 Fix column name handling in old-style continuous aggregates
*   #5378 Fix multinode DML HA performance regression
*   #5384 Fix Hierarchical Continuous Aggregates chunk_interval_size

### Acknowledgments

Timescale thanks:

*   @justinozavala for reporting an issue with PL/Python procedures in the
    background worker
*   @Medvecrab for discovering an issue with copying NameData when forming heap tuples.
*   @pushpeepkmonroe for discovering an issue in upgrading old-style continuous
    aggregates with renamed columns

## TimescaleDB&nbsp;2.10.0 on 2023-02-21

These release notes are for the release of TimescaleDB&nbsp;2.10.1 on
2023-03-07.

<highlight type="important">
This release contains new features and bug fixes since the last release. It is
considered moderate priority for upgrading. Upgrade your TimescaleDB installation
as soon as possible.
</highlight>

### Highlighted features in this release

This release includes these new features:

*   JOINs in continuous aggregates that are defined over hypertables. Support
    for joins in
    [hierarchical continuous aggregates](/use-timescale/latest/continuous-aggregates/hierarchical-continuous-aggregates/)
    will be introduced on a follow-up release.
*   Re-architecture of how compression works: ~2x improvement on INSERT rate
    into compressed chunks.
*   Full PostgreSQL 15 support for all existing features. Support for the newly
    introduced MERGE command on hypertables will be introduced on a follow-up
    release.

### Deprecations

This release deprecates these features:

*   PostgreSQL&nbsp;12 is now deprecated in TimescaleDB, and remains supported
    until July 2023. For more information about upgrading PostgreSQL, see the
    [Upgrading PostgreSQL section][pg-upgrade].
*   The older format of continuous aggregates is now deprecated, and remains
    supported until July 2023. For more information about the new continuous
    aggregate format, see the [continuous aggregates section][migrate-caggs].

### Complete list of features

*   #4874 Allow joins in continuous aggregates
*   #4926 Refactor INSERT into compressed chunks
*   #5241 Allow RETURNING clause when inserting into compressed chunks
*   #5245 Manage life-cycle of connections via memory contexts
*   #5246 Make connection establishment interruptible
*   #5253 Make data node command execution interruptible
*   #5262 Extend enabling compression on a continuous aggregrate with
    'compress_segmentby' and 'compress_orderby' parameters

### Complete list of bug fixes

*   #5214 Fix use of prepared statement in async module
*   #5218 Add role-level security to job error log
*   #5239 Fix next_start calculation for fixed schedules
*   #5290 Fix enabling compression on continuous aggregates with columns
    requiring quotation

### Acknowledgments

Timescale thanks:

*   @henriquegelio for reporting the issue on fixed schedules

<!---

Use this template when writing new release notes. Make sure you include only the
most recent release notes on this page, and cut and paste the older release
notes to the `past-releases` page.

## TimescaleDB&nbsp;<RELEASE_NUMBER> on <DATE>

These release notes are for the release of TimescaleDB&nbsp;<RELEASE_NUMBER> on
<DATE>. (For example: "TimescaleDB&nbsp;2.10.0 on 2021-02-21")

Pick the most appropriate:

<highlight type="warning">
This release contains important security updates, along with new features and
bug fixes since the last release. It is considered high priority for upgrading.
Upgrade your TimescaleDB installation immediately.
</highlight>

<highlight type="important">
This release contains new features and bug fixes since the last release. It is
considered moderate priority for upgrading. Upgrade your TimescaleDB installation
as soon as possible.
</highlight>

<highlight type="note">
This release contains bug fixes since the last release. It is considered low
priority for upgrading. Upgrade your TimescaleDB installation at your next
opportunity.
</highlight>

### Highlighted features in this release

This release includes these new features:

-   You can now use a `JOIN` in continuous aggregates defined over hypertables.
    For more information, see the [continuous aggregates section][join-caggs].
-   Compression has been improved, and is now recording around a two times
    improvement on the `INSERT` rate into compressed chunks.

### Deprecations

This release deprecates these features:

-   PostgreSQL&nbsp;12 is now deprecated in Timescale, and remains supported
    until July 2023. For more information about upgrading PostgreSQL, see the
    [Upgrading PostgreSQL section][pg-upgrade].
-   The older format of continuous aggregates is now deprecated, and remains
    supported until July 2023. For more information about the new continuous
    aggregate format, see the [continuous aggregates section][migrate-caggs].

### Complete list of features

-   <ISSUE_NUMBER> <ISSUE_TITLE>
-   <ISSUE_NUMBER> <ISSUE_TITLE>

### Complete list of bug fixes

-   <ISSUE_NUMBER> <ISSUE_TITLE>
-   <ISSUE_NUMBER> <ISSUE_TITLE>

### Acknowledgments

Timescale thanks:

-  <NAME> for <THING>
-  <NAME> for <THING>

--->

For release notes for older TimescaleDB versions, see the
[past releases section][past-relnotes].

[past-relnotes]: /about/:currentVersion:/release-notes/past-releases/
[pg-upgrade]: /self-hosted/:currentVersion:/upgrades/upgrade-pg/
[migrate-caggs]: /use-timescale/:currentVersion:/continuous-aggregates/migrate/
[join-caggs]: /use-timescale/:currentVersion:/continuous-aggregates/create-a-continuous-aggregate/#create-a-continuous-aggregate-with-a-join
