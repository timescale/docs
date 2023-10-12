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

## TimescaleDB&nbsp;2.12.1 on 2023-10-12

These release notes are for the release of TimescaleDB&nbsp;2.12.1 on
2023-10-12.

<Highlight type="note">
This release contains bug fixes since the 2.12.0 release.
It is recommended that you upgrade at the next available opportunity.
</Highlight>

### Complete list of bug fixes

* #6113 Fix planner distributed table count
* #6117 Avoid decompressing batches using an empty slot
* #6123 Fix concurrency errors in OSM API
* #6142 do not throw an error when deprecation GUC cannot be read

### Acknowledgments

Timescale thanks:

* @symbx for reporting a crash when selecting from empty hypertables

## TimescaleDB&nbsp;2.12.0 on 2023-09-27

These release notes are for the release of TimescaleDB&nbsp;2.12.0 on
2023-09-27.

<Highlight type="note">
This release contains performance improvements for compressed hypertables
and continuous aggregates and bug fixes since the 2.11.2 release.
It is recommended that you upgrade at the next available opportunity.
</Highlight>

This release moves all internal functions from the `_timescaledb_internal`
schema into the `_timescaledb_functions` schema. This separates code from
internal data objects and improves security by allowing more restrictive
permissions for the code schema. If you are calling any of those internal
functions you should adjust your code as soon as possible. This version
also includes a compatibility layer that allows calling them in the old
location but that layer will be removed in 2.14.0.

Following the deprecation announcement for PostgreSQL 12 in TimescaleDB&nbsp;2.10,
PostgreSQL 12 is not supported starting with TimescaleDB&nbsp;2.12.
Currently supported PostgreSQL major versions are 13, 14 and 15.
PostgreSQL 16 support will be added with a following TimescaleDB release.

### Complete list of features

* #5137 Insert into index during chunk compression
* #5150 MERGE support on hypertables
* #5515 Make hypertables support replica identity
* #5586 Index scan support during UPDATE/DELETE on compressed hypertables
* #5596 Support for partial aggregations at chunk level
* #5599 Enable ChunkAppend for partially compressed chunks
* #5655 Improve the number of parallel workers for decompression
* #5758 Enable altering job schedule type through `alter_job`
* #5805 Make logrepl markers for (partial) decompressions
* #5809 Relax invalidation threshold table-level lock to row-level when refreshing a Continuous Aggregate
* #5839 Support CAgg names in chunk_detailed_size
* #5852 Make set_chunk_time_interval CAggs aware
* #5868 Allow ALTER TABLE ... REPLICA IDENTITY (FULL|INDEX) on materialized hypertables (continuous aggregates)
* #5875 Add job exit status and runtime to log
* #5909 CREATE INDEX ONLY ON hypertable creates index on chunks

### Complete list of bug fixes

* #5860 Fix interval calculation for hierarchical CAggs
* #5894 Check unique indexes when enabling compression
* #5951 _timescaledb_internal.create_compressed_chunk doesn't account for existing uncompressed rows
* #5988 Move functions to _timescaledb_functions schema
* #5788 Chunk_create must add an existing table or fail
* #5872 Fix duplicates on partially compressed chunk reads
* #5918 Fix crash in COPY from program returning error
* #5990 Place data in first/last function in correct mctx 
* #5991 Call eq_func correctly in time_bucket_gapfill
* #6015 Correct row count in EXPLAIN ANALYZE INSERT .. ON CONFLICT output
* #6035 Fix server crash on UPDATE of compressed chunk
* #6044 Fix server crash when using duplicate segmentby column
* #6045 Fix segfault in set_integer_now_func
* #6053 Fix approximate_row_count for CAggs
* #6081 Improve compressed DML datatype handling
* #6084 Propagate parameter changes to decompress child nodes
* #6102 Schedule compression policy more often

### Acknowledgments

Timescale thanks:

* @ajcanterbury for reporting a problem with lateral joins on compressed chunks 
* @alexanderlaw for reporting multiple server crashes 
* @lukaskirner for reporting a bug with monthly continuous aggregates
* @mrksngl for reporting a bug with unusual user names
* @willsbit for reporting a crash in time_bucket_gapfill

## TimescaleDB&nbsp;2.11.2 on 2023-08-17

These release notes are for the release of TimescaleDB&nbsp;2.11.2 on
2023-08-17.

<Highlight type="note">
This release contains bug fixes since the 2.11.1 release.
It is recommended that you upgrade at the next available opportunity.
</Highlight>

### Complete list of features

* #5923 Feature flags for TimescaleDB features

### Complete list of bug fixes

* #5680 Fix DISTINCT query with `JOIN` on multiple `segmentby` columns
* #5774 Fixed two bugs in decompression sorted merge code
* #5786 Ensure pg_config --cppflags are passed
* #5906 Fix quoting owners in SQL scripts.
* #5912 Fix crash in 1-step integer policy creation

### Acknowledgments

Timescale thanks:

* @mrksngl for submitting a PR to fix extension upgrade scripts
* @ericdevries for reporting an issue with DISTINCT queries using
`segmentby` columns of compressed hypertable

## TimescaleDB&nbsp;2.11.1 on 2023-06-29

These release notes are for the release of TimescaleDB&nbsp;2.11.1 on
2023-06-29.

<Highlight type="note">
This release contains bug fixes since the last release. It is considered low
priority for upgrading. Upgrade your TimescaleDB installation at your next
opportunity.
</Highlight>

### Complete list of bug fixes

*   #5705 Scheduler accidentally getting killed when calling delete_job
*   #5742 Fix Result node handling with ConstraintAwareAppend on compressed chunks
*   #5750 Ensure tlist is present in decompress chunk plan
*   #5754 Fixed handling of NULL values in bookend_sfunc
*   #5798 Fixed batch look ahead in compressed sorted merge
*   #5804 Mark cagg_watermark function as PARALLEL RESTRICTED
*   #5807 Copy job config JSONB structure into current MemoryContext
*   #5824 Improve continuous aggregate query chunk exclusion

### Acknowledgments

Timescale thanks:

*   @JamieD9 for reporting an issue with a wrong result ordering
*   @xvaara for reporting an issue with Result node handling in
    ConstraintAwareAppend


## TimescaleDB&nbsp;2.11.0 on 2023-05-22

These release notes are for the release of TimescaleDB&nbsp;2.11.0 on
2023-05-22.

<Highlight type="note">
This release contains new features and bug fixes since the 2.10.3 release.
We deem it moderate priority for upgrading.
</Highlight>

### Highlighted features in this release

This release includes these new features:

* Support for DML operations on compressed chunks:
  * UPDATE/DELETE support
  * Support for unique constraints on compressed chunks
  * Support for `ON CONFLICT DO UPDATE`
  * Support for `ON CONFLICT DO NOTHING`
* `JOIN` support for hierarchical continuous aggregates
* Performance improvements for real-time hierarchical continuous aggregates

### Complete list of features

* #5212 Allow pushdown of reference table joins
* #5261 Improve Realtime Continuous Aggregate performance
* #5252 Improve unique constraint support on compressed hypertables
* #5339 Support UPDATE/DELETE on compressed hypertables
* #5344 Enable JOINS for Hierarchical Continuous Aggregates
* #5361 Add parallel support for partialize_agg()
* #5417 Refactor and optimize distributed COPY
* #5454 Add support for ON CONFLICT DO UPDATE for compressed hypertables
* #5547 Skip Ordered Append when only 1 child node is present
* #5510 Propagate vacuum/analyze to compressed chunks
* #5584 Reduce decompression during constraint checking
* #5530 Optimize compressed chunk resorting
* #5639 Support sending telemetry event reports

### Complete list of bug fixes

* #5396 Fix SEGMENTBY columns predicates to be pushed down
* #5427 Handle user-defined FDW options properly
* #5442 Decompression may have lost DEFAULT values
* #5459 Fix issue creating dimensional constraints
* #5570 Improve interpolate error message on datatype mismatch
* #5573 Fix unique constraint on compressed tables
* #5615 Add permission checks to run_job()
* #5614 Enable run_job() for telemetry job
* #5578 Fix on-insert decompression after schema changes
* #5613 Quote username identifier appropriately
* #5525 Fix tablespace for compressed hypertable and corresponding toast
* #5642 Fix ALTER TABLE SET with normal tables
* #5666 Reduce memory usage for distributed analyze
* #5668 Fix subtransaction resource owner
* #5680 Fix DISTINCT query with JOIN on multiple segmentby columns


### Acknowledgments

Timescale thanks:

* @kovetskiy and @DZDomi for reporting peformance regression in Realtime Continuous Aggregates
* @ollz272 for reporting an issue with interpolate error messages
* @ericdevries for reporting an issue with DISTINCT queries using segmentby columns of compressed hypertable


## TimescaleDB&nbsp;2.10.3 on 2023-04-26


### Complete list of bug fixes

* #5583 Fix parameterization in DecompressChunk path generation
* #5602 Fix broken CAgg with JOIN repair function


## TimescaleDB&nbsp;2.10.2 on 2023-04-20

These release notes are for the release of TimescaleDB&nbsp;2.10.2 on
2023-04-20.

<Highlight type="note">
This release contains bug fixes since the last release. It is considered low
priority for upgrading. Upgrade your TimescaleDB installation at your next
opportunity.
</Highlight>

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
<!-- Vale complains about the username -->
<!-- vale Google.Slang = NO -->
*   @S-imo-n for reporting the issue on Background Worker Scheduler crash
<!-- vale Google.Slang = YES -->
*   @geezhu for reporting issue on segfault in historgram()
*   @mwahlhuetter for reporting the issue with joins in CAggs
*   @mwahlhuetter for reporting issue with duplicated entries on
    timescaledb_experimental.policies view
*   @H25E for reporting error refreshing from beginning of a Continuous
    Aggregate with variable time bucket

## TimescaleDB&nbsp;2.10.1 on 2023-03-07

These release notes are for the release of Timescale&nbsp;2.10.1 on
2023-03-07.

<Highlight type="note">
This release contains bug fixes since the last release. It is considered low
priority for upgrading. Upgrade your TimescaleDB installation at your next
opportunity.
</Highlight>

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

<Highlight type="important">
This release contains new features and bug fixes since the last release. It is
considered moderate priority for upgrading. Upgrade your TimescaleDB installation
as soon as possible.
</Highlight>

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

<Highlight type="warning">
This release contains important security updates, along with new features and
bug fixes since the last release. It is considered high priority for upgrading.
Upgrade your TimescaleDB installation immediately.
</Highlight>

<Highlight type="important">
This release contains new features and bug fixes since the last release. It is
considered moderate priority for upgrading. Upgrade your TimescaleDB installation
as soon as possible.
</Highlight>

<Highlight type="note">
This release contains bug fixes since the last release. It is considered low
priority for upgrading. Upgrade your TimescaleDB installation at your next
opportunity.
</Highlight>

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
