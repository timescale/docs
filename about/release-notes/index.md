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

## TimescaleDB&nbsp;2.15.0 on 2024-05-08

<Highlight type="note">
This release contains the performance improvements and bug fixes introduced since
TimescaleDB v2.14.2. Best practice is to upgrade at the next available opportunity.
</Highlight>

#### Highlighted features in this release

* [Continuous Aggregate](/api/:currentVersion:/continuous-aggregates/create_materialized_view/#sample-usage) now supports `time_bucket` with `origin` and/or `offset`.
* The following improvements have been introduced for [hypertable compression](/api/:currentVersion:/compression/):
  - Added planner support to check more kinds of WHERE conditions before decompression. 
    This reduces the number of rows that have to be decompressed.
  - You can now use `minmax` sparse indexes when you compress columns with `btree` indexes.
  - Make compression uses the defaults functions.
  - Vectorize filters in the WHERE clause contain text equality operators and LIKE expressions.

#### Deprecation warning

* You can no longer create continuous aggregates using `time_bucket_ng`.
  This feature will be completely removed the next release. Best practice is to 
  [migrate your current continuous aggregates to the new form](/use-timescale/:currentVersion:/continuous-aggregates/migrate/), 
* This is the last release supporting PostgreSQL 13.

#### For self-hosted TimescaleDB v2.15.0 deployments only

After you run `ALTER EXTENSION`, you must run [this SQL script](https://github.com/timescale/timescaledb-extras/blob/master/utils/2.15.X-fix_hypertable_foreign_keys.sql). For more details, see the 
following pull requests [#6786](#6797).

### Complete list of features
* #6382 Support for `time_bucket` with origin and offset in CAggs.
* #6696 Improve the defaults for compression `segment_by` and `order_by`.
* #6705 Add sparse minmax indexes for compressed columns that have uncompressed btree indexes.
* #6754 Allow `DROP CONSTRAINT` on compressed hypertables.
* #6767 Add metadata table `_timestaledb_internal.bgw_job_stat_history` for tracking job execution history.
* #6798 Prevent usage of the deprecated `time_bucket_ng` in the CAgg definition.
* #6810 Add telemetry for access methods.
* #6811 Remove the no longer relevant `timescaledb.allow_install_without_preload` GUC.
* #6837 Add migration path for CAggs using `time_bucket_ng`.
* #6865 Update the watermark when truncating a CAgg.

### Complete list of bugfixes
* #6617 Fix error in show_chunks.
* #6621 Remove metadata when dropping chunks.
* #6677 Fix snapshot usage in CAgg invalidation scanner.
* #6698 Define meaning of 0 retries for jobs as no retries.
* #6717 Fix handling of compressed tables with primary or unique index in COPY path.
* #6726 Fix constify cagg_watermark using window function when querying a CAgg.
* #6729 Fix NULL start value handling in CAgg refresh.
* #6732 Fix CAgg migration with custom timezone / date format settings.
* #6752 Remove custom autovacuum setting from compressed chunks.
* #6770 Fix plantime chunk exclusion for OSM chunk.
* #6789 Fix deletes with subqueries and compression.
* #6796 Fix a crash involving a view on a hypertable.
* #6797 Fix foreign key constraint handling on compressed hypertables.
* #6816 Fix handling of chunks with no constraints.
* #6820 Fix a crash when the ts_hypertable_insert_blocker was called directly.
* #6849 Use non-orderby compressed metadata in compressed DML.
* #6867 Clean up compression settings when deleting compressed CAgg.
* #6869 Fix compressed DML with constraints of form value OP column.
* #6870 Fix bool expression pushdown for queries on compressed chunks.

### Acknowledgments
* @brasic for reporting a crash when `ts_hypertable_insert_blocker` was called directly.
* @bvanelli for reporting an issue with the jobs retry count.
* @djzurawsk for reporting an error about dropping chunks.
* @Dzuzepppe for reporting the issue that DELETEs using a subquery on compressed chunks was working incorrectly.
* @hongquan for reporting a 'timestamp out of range' error during CAgg migrations.
* @kevcenteno for reporting that the `show_chunks` API returned an incorrect output when 'created_before/created_after' 
  was used with time-partitioned columns.
* @mahipv for starting working on the job history PR.
* @rovo89 for reporting that constify `cagg_watermark` was not working using the window function when querying a CAgg.

## TimescaleDB&nbsp;2.14.2 on 2024-02-20

<Highlight type="note">
This release contains bug fixes since the 2.14.1 release.
We recommend that you upgrade at the next available opportunity.
</Highlight>

### Complete list of bugfixes
* #6655 Fix segfault in cagg_validate_query
* #6660 Fix refresh on empty CAgg with variable bucket
* #6670 Don't try to compress osm chunks

### Acknowledgments
* @kav23alex for reporting a segfault in cagg_validate_query

## TimescaleDB&nbsp;2.14.1 on 2024-02-14

<Highlight type="note">
This release contains bug fixes since the 2.14.0 release.
We recommend that you upgrade at the next available opportunity.
</Highlight>

### Complete list of features
* #6630 Add views for per chunk compression settings

### Complete list of bugfixes
* #6636 Fixes extension update of compressed hypertables with dropped columns
* #6637 Reset sequence numbers on non-rollup compression
* #6639 Disable default indexscan for compression
* #6651 Fix DecompressChunk path generation with per chunk settings

### Acknowledgments
* @anajavi for reporting an issue with extension update of compressed hypertables

## TimescaleDB&nbsp;2.14.0 on 2024-02-08

<Highlight type="note">
This release contains performance improvements and bug fixes since 
the 2.13.1 release. We recommend that you upgrade at the next
available opportunity.

For this release only, you will need to restart the database before running `ALTER EXTENSION`
</Highlight>
 

#### Highlighted features in this release
* Ability to change compression settings on existing compressed hypertables at any time. 
New compression settings take effect on any new chunks that are compressed after the change.
* Reduced locking requirements during chunk recompression
* Limiting tuple decompression during DML operations to avoid decompressing a lot of tuples and causing storage issues (100k limit, configurable)
* Helper functions for determining compression settings
* Plan-time chunk exclusion for real-time Continuous Aggregate by constifying the cagg_watermark function call, leading to faster queries using real-time continuous aggregates

#### Removal notice: Multi-node support
Following the deprecation announcement for Multi-node in TimescaleDB 2.13,
Multi-node is no longer supported starting with TimescaleDB 2.14.

TimescaleDB 2.13 is the last version that includes multi-node support. Learn more about it [here][multi-node-deprecation].

If you want to migrate from multi-node TimescaleDB to single-node TimescaleDB, read the
[migration documentation][multi-node-to-timescale-service].

#### Deprecation notice: recompress_chunk procedure
TimescaleDB 2.14 is the last version that will include the recompress_chunk procedure. Its
functionality will be replaced by the compress_chunk function, which, starting on TimescaleDB 2.14, 
works on both uncompressed and partially compressed chunks. 
The compress_chunk function should be used going forward to fully compress all types of chunks or even recompress 
old fully compressed chunks using new compression settings (through the newly introduced recompress optional parameter).

### Complete list of features
* #6325 Add plan-time chunk exclusion for real-time CAggs
* #6360 Remove support for creating Continuous Aggregates with old format
* #6386 Add functions for determining compression defaults
* #6410 Remove multinode public API
* #6440 Allow SQLValueFunction pushdown into compressed scan
* #6463 Support approximate hypertable size
* #6513 Make compression settings per chunk
* #6529 Remove reindex_relation from recompression
* #6531 Fix if_not_exists behavior for CAgg policy with NULL offsets
* #6545 Remove restrictions for changing compression settings
* #6566 Limit tuple decompression during DML operations
* #6579 Change compress_chunk and decompress_chunk to idempotent version by default
* #6608 Add LWLock for OSM usage in loader 
* #6609 Deprecate recompress_chunk
* #6609 Add optional recompress argument to compress_chunk

### Complete list of bug fixes
* #6541 Inefficient join plans on compressed hypertables.
* #6491 Enable now() plantime constification with BETWEEN
* #6494 Fix create_hypertable referenced by fk succeeds
* #6498 Suboptimal query plans when using time_bucket with query parameters
* #6507 time_bucket_gapfill with timezones doesn't handle daylight savings 
* #6509 Make extension state available through function
* #6512 Log extension state changes
* #6522 Disallow triggers on CAggs
* #6523 Reduce locking level on compressed chunk index during segmentwise recompression
* #6531 Fix if_not_exists behavior for CAgg policy with NULL offsets
* #6571 Fix pathtarget adjustment for MergeAppend paths in aggregation pushdown code 
* #6575 Fix compressed chunk not found during upserts
* #6592 Fix recompression policy ignoring partially compressed chunks
* #6610 Ensure qsort comparison function is transitive

### Acknowledgments
* @coney21 and @GStechschulte for reporting the problem with inefficient join plans on compressed hypertables.
* @HollowMan6 for reporting triggers not working on materialized views of
CAggs
* @jbx1 for reporting suboptimal query plans when using time_bucket with query parameters
* @JerkoNikolic for reporting the issue with gapfill and DST
* @pdipesh02 for working on removing the old Continuous Aggregate format
* @raymalt and @martinhale for reporting very slow query plans on realtime CAggs queries

## TimescaleDB&nbsp;2.13.1 on 2024-01-08

These release notes are for the release of TimescaleDB&nbsp;2.13.1 on
2024-01-08.

<Highlight type="note">
This release contains bug fixes since the 2.13.0 release.
It is recommended that you upgrade at the next available opportunity.
</Highlight>

### Complete list of bug fixes

* #6365 Use numrows_pre_compression in approximate row count
* #6377 Use processed group clauses in PG16
* #6384 Change bgw_log_level to use PGC_SUSET
* #6393 Disable vectorized sum for expressions.
* #6405 Read CAgg watermark from materialized data
* #6408 Fix groupby pathkeys for gapfill in PG16
* #6428 Fix index matching during DML decompression
* #6439 Fix compressed chunk permission handling on PG16
* #6443 Fix lost concurrent CAgg updates
* #6454 Fix unique expression indexes on compressed chunks
* #6465 Fix use of freed path in decompression sort logic

### Acknowledgments
* @MA-MacDonald for reporting an issue with gapfill in PG16
* @aarondglover for reporting an issue with unique expression indexes on compressed chunks
* @adriangb for reporting an issue with security barrier views on pg16


## TimescaleDB&nbsp;2.13.0 on 2023-11-28

<Highlight type="note">
This release contains performance improvements, an improved hypertable DDL API
and bug fixes since the 2.12.2 release. We recommend that you upgrade at the next
available opportunity.
</Highlight>

#### Highlighted features in this release
* Full PostgreSQL 16 support for all existing features
* Vectorized aggregation execution for sum()
* Track chunk creation time used in retention/compression policies

#### Deprecation notice: Multi-node support
TimescaleDB 2.13 is the last version that will include multi-node support. Multi-node
support in 2.13 is available for PostgreSQL 13, 14 and 15. Learn more about it
[here][multi-node-deprecation].

If you want to migrate from multi-node TimescaleDB to single-node TimescaleDB read the
[migration documentation][multi-node-to-timescale-service].

#### PostgreSQL 13 deprecation announcement
We will continue supporting PostgreSQL 13 until April 2024. Sooner to that time, we will announce the specific version of TimescaleDB in which PostgreSQL 13 support will not be included going forward.

#### Starting from TimescaleDB 2.13.0
* No Amazon Machine Images (AMI) are published. If you previously used AMI, please 
use another [installation method](https://docs.timescale.com/self-hosted/latest/install/)
* Continuous Aggregates are materialized only (non-realtime) by default

### Complete list of features
* #5575 Add chunk-wise sorted paths for compressed chunks
* #5761 Simplify hypertable DDL API
* #5890 Reduce WAL activity by freezing compressed tuples immediately
* #6050 Vectorized aggregation execution for sum() 
* #6062 Add metadata for chunk creation time
* #6077 Make Continous Aggregates materialized only (non-realtime) by default
* #6177 Change show_chunks/drop_chunks using chunk creation time
* #6178 Show batches/tuples decompressed during DML operations in EXPLAIN output
* #6185 Keep track of catalog version
* #6227 Use creation time in retention/compression policy
* #6307 Add SQL function cagg_validate_query

### Complete list of bug fixes
* #6188 Add GUC for setting background worker log level
* #6222 Allow enabling compression on hypertable with unique expression index
* #6240 Check if worker registration succeeded
* #6254 Fix exception detail passing in compression_policy_execute
* #6264 Fix missing bms_del_member result assignment
* #6275 Fix negative bitmapset member not allowed in compression
* #6280 Potential data loss when compressing a table with a partial index that matches compression order.
* #6289 Add support for startup chunk exclusion with aggs 
* #6290 Repair relacl on upgrade
* #6297 Fix segfault when creating a cagg using a NULL width in time bucket function
* #6305 Make timescaledb_functions.makeaclitem strict
* #6332 Fix typmod and collation for segmentby columns
* #6339 Fix tablespace with constraints
* #6343 Enable segmentwise recompression in compression policy

### Acknowledgments
* @fetchezar for reporting an issue with compression policy error messages
* @jflambert for reporting the background worker log level issue
* @torazem for reporting an issue with compression and large oids
* @fetchezar for reporting an issue in the compression policy
* @lyp-bobi for reporting an issue with tablespace with constraints
* @pdipesh02 for contributing to the implementation of the metadata for chunk creation time, 
             the generalized hypertable API, and show_chunks/drop_chunks using chunk creation time
* @lkshminarayanan for all his work on PG16 support


## TimescaleDB&nbsp;2.12.2 on 2023-10-20

These release notes are for the release of TimescaleDB&nbsp;2.12.2 on
2023-10-20.

<Highlight type="note">
This release contains bug fixes since the 2.12.1 release.
It is recommended that you upgrade at the next available opportunity.
</Highlight>

### Complete list of bug fixes

* #6155 Align gapfill bucket generation with time_bucket
* #6181 Ensure fixed_schedule field is populated
* #6210 Fix EXPLAIN ANALYZE for compressed DML

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
[multi-node-to-timescale-service]:/migrate/:currentVersion:/playbooks/multi-node-to-timescale-service/
[multi-node-deprecation]: https://github.com/timescale/timescaledb/blob/main/docs/MultiNodeDeprecation.md
