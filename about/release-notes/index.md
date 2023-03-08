---
title: TimescaleDB release notes and future plans
excerpt: New features and fixes are released regularly
keywords: [upgrades, updates, releases]
---

# Timescale release notes

This page contains release notes for Timescale&nbsp;2.10.0 and newer. For
release notes for older versions, see the
[past releases section][past-relnotes].

<Highlight type="note">
Want to stay up-to-date with new releases? You can subscribe to new releases on
GitHub and be notified by email whenever a new release is available. On the
[Github page](https://github.com/timescale/timescaledb),
click `Watch`, select `Custom` and then check `Releases`.
</Highlight>

## 2.10.0 (2023-02-21)

This release contains new features and bug fixes since the 2.9.3 release.
We deem it moderate priority for upgrading.

This release includes these noteworthy features:

*   Joins in continuous aggregates that are defined over hypertables. Support for joins in [hierarchical continuous aggregates](https://docs.timescale.com/timescaledb/latest/how-to-guides/continuous-aggregates/hierarchical-continuous-aggregates/) will be introduced on a follow-up release.
*   Re-architecture of how compression works: ~2x improvement on INSERT rate into compressed chunks.
*   Full PostgreSQL 15 support for all existing features. Support for the newly introduced MERGE command on hypertables will be introduced on a follow-up release.

**PostgreSQL 12 deprecation announcement**
We will continue supporting PostgreSQL 12 until July 2023. Before that time, we will announce the specific version of TimescaleDB in which PostgreSQL 12 support will be removed.

**Old format of continuous aggregates deprecation announcement**
TimescaleDB 2.7 introduced a new format for continuous aggregates that improves performance.
All instances with continuous aggregates using the old format should [migrate to the new format](https://docs.timescale.com/api/latest/continuous-aggregates/cagg_migrate/) by July 2023,
when support for the old format will be removed.
Before that time, we will announce the specific version of TimescaleDB in which support for this feature will be removed.

**Features**

*   #4874 Allow joins in continuous aggregates
*   #4926 Refactor INSERT into compressed chunks
*   #5241 Allow RETURNING clause when inserting into compressed chunks
*   #5245 Manage life-cycle of connections via memory contexts
*   #5246 Make connection establishment interruptible
*   #5253 Make data node command execution interruptible
*   #5262 Extend enabling compression on a continuous aggregrate with 'compress_segmentby' and 'compress_orderby' parameters

**Bug fixes**

*   #5214 Fix use of prepared statement in async module
*   #5218 Add role-level security to job error log
*   #5239 Fix next_start calculation for fixed schedules
*   #5290 Fix enabling compression on continuous aggregates with columns requiring quotation

**Thanks**

*   @henriquegelio for reporting the issue on fixed schedules

<!---

Use this template when writing new release notes. Make sure you include only the
most recent release notes on this page, and cut and paste the older release
notes to the `past-releases` page.

## Timescale&nbsp;<RELEASE_NUMBER> on <DATE>

These release notes are for the release of Timescale&nbsp;<RELEASE_NUMBER> on
<DATE>. (For example: "Timescale&nbsp;2.10.0 on 2021-02-21")

Pick the most appropriate:

<highlight type="warning">
This release contains important security updates, along with new features and
bug fixes since the last release. It is considered high priority for upgrading.
Upgrade your Timescale installation immediately.
</highlight>

<highlight type="important">
This release contains new features and bug fixes since the last release. It is
considered moderate priority for upgrading. Upgrade your Timescale installation
as soon as possible.
</highlight>

<highlight type="note">
This release contains bug fixes since the last release. It is considered low
priority for upgrading. Upgrade your Timescale installation at your next
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
    until July 2023. For more information about upgrading PostgreSQL, see the [Uprgading PostgreSQL section][pg-upgrade].
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

For release notes for older Timescale versions, see the
[past releases section][past-relnotes].

[past-relnotes]: about/:currentVersion:/release-notes/past-releases/
[pg-upgrade]: /timescaledb/:currentVersion:/how-to-guides/upgrades/upgrade-pg/
[migrate-caggs]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/migrate/
[join-caggs]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/create-a-continuous-aggregate/#create-a-continuous-aggregate-with-a-join
