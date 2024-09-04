---
title: TimescaleDB release notes and future plans
excerpt: New features and fixes are released regularly
keywords: [upgrades, updates, releases]
---

# Release notes for past releases

<Highlight type="warning">

This is an historical document, it contains release notes for older versions
of TimescaleDB. For details on the most recent release, see the
[Changelog][changelog].

</Highlight>

## What's new in TimescaleDB 2.9:

*   Hierarchical continuous aggregates (continuous aggregate on top of another continuous aggregate)
*   Improve `time_bucket_gapfill` function to allow specifying the timezone to bucket
*   Introduce fixed schedules for background jobs and the ability to check job errors.
*   Use `alter_data_node()` to change the data node configuration. This function introduces the option to configure the availability of the data node.

## 2.9.3 (2023-02-06)

This release contains bug fixes since the 2.9.2 release and a fix for a security vulnerability (#5259). You can check the [security advisory](https://github.com/timescale/timescaledb/security/advisories/GHSA-44jh-j22r-33wq) for more information on the vulnerability and the platforms that are affected.

This release is high priority for upgrade. We strongly recommend that you upgrade as soon as possible.

**Bug fixes**

*   #4804 Skip bucketing when start or end of refresh job is null
*   #5108 Fix column ordering in compressed table index not following the order of a multi-column segment by definition
*   #5187 Don't enable clang-tidy by default
*   #5255 Fix year not being considered as a multiple of day/month in hierarchical continuous aggregates
*   #5259 Lock down search_path in SPI calls

**Thanks**

*   @ssmoss for reporting issues on continuous aggregates
*   @jaskij for reporting the compilation issue that occurred with clang

## 2.9.2 (2023-01-27)

This release contains bug fixes since the 2.9.1 release.
We recommend that you upgrade at the next available opportunity.

**Bugfixes**

*   #5114 Fix issue with deleting data node and dropping the database on multi-node
*   #5133 Fix creating a CAgg on a CAgg where the time column is in a different order of the original hypertable
*   #5152 Fix adding column with NULL constraint to compressed hypertable
*   #5170 Fix CAgg on CAgg variable bucket size validation
*   #5180 Fix default data node availability status on multi-node
*   #5181 Fix ChunkAppend and ConstraintAwareAppend with TidRangeScan child subplan
*   #5193 Fix repartition behavior when attaching data node on multi-node

## 2.9.1 (2022-12-23)

This release contains bug fixes since the 2.9.0 release.
This release is high priority for upgrade. We strongly recommend that you
upgrade as soon as possible.

**Bugfixes**

*   #5072 Fix CAgg on CAgg bucket size validation
*   #5101 Fix enabling compression on caggs with renamed columns
*   #5106 Fix building against PG15 on Windows
*   #5117 Fix postgres server restart on background worker exit
*   #5121 Fix privileges for job_errors in update script

## 2.9.0 (2022-12-15)

This release adds major new features since the 2.8.1 release.
We deem it moderate priority for upgrading.

This release includes these noteworthy features:

*   Hierarchical Continuous Aggregates (aka Continuous Aggregate on top of another Continuous Aggregate)
*   Improve `time_bucket_gapfill` function to allow specifying the timezone to bucket
*   Introduce fixed schedules for background jobs and the ability to check job errors.
*   Use `alter_data_node()` to change the data node configuration. This function introduces the option to configure the availability of the data node.

This release also includes several bug fixes.

**Features**

*   #4476 Batch rows on access node for distributed `COPY`
*   #4567 Exponentially backoff when out of background workers
*   #4650 Show warnings when not following best practices
*   #4664 Introduce fixed schedules for background jobs
*   #4668 Hierarchical Continuous Aggregates
*   #4670 Add timezone support to time_bucket_gapfill
*   #4678 Add interface for troubleshooting job failures
*   #4718 Add ability to merge chunks while compressing
*   #4786 Extend the now() optimization to also apply to CURRENT_TIMESTAMP
*   #4820 Support parameterized data node scans in joins
*   #4830 Add function to change configuration of a data nodes
*   #4966 Handle DML activity when datanode is not available
*   #4971 Add function to drop stale chunks on a data node

**Bug fixes**

*   #4663 Don't error when compression metadata is missing
*   #4673 Fix now() constification for VIEWs
*   #4681 Fix compression_chunk_size primary key
*   #4696 Report warning when enabling compression on hypertable
*   #4745 Fix FK constraint violation error while insert into hypertable which references partitioned table
*   #4756 Improve compression job IO performance
*   #4770 Continue compressing other chunks after an error
*   #4794 Fix degraded performance seen on timescaledb_internal.hypertable_local_size() function
*   #4807 Fix segmentation fault during INSERT into compressed hypertable
*   #4822 Fix missing segmentby compression option in CAGGs
*   #4823 Fix a crash that could occur when using nested user-defined functions with hypertables
*   #4840 Fix performance regressions in the copy code
*   #4860 Block multi-statement DDL command in one query
*   #4898 Fix cagg migration failure when trying to resume
*   #4904 Remove BitmapScan support in DecompressChunk
*   #4906 Fix a performance regression in the query planner by speeding up frozen chunk state checks
*   #4910 Fix a typo in process_compressed_data_out
*   #4918 Cagg migration orphans cagg policy
*   #4941 Restrict usage of the old format (pre 2.7) of continuous aggregates in PostgreSQL 15.
*   #4955 Fix cagg migration for hypertables using timestamp without timezone
*   #4968 Check for interrupts in gapfill main loop
*   #4988 Fix cagg migration crash when refreshing the newly created cagg
*   #5054 Fix segfault after second ANALYZE
*   #5086 Reset baserel cache on invalid hypertable cache

**Thanks**

*   @byazici for reporting a problem with segmentby on compressed caggs
*   @jflambert for reporting a crash with nested user-defined functions.
*   @jvanns for reporting hypertable FK reference to vanilla PostgreSQL partitioned table doesn't seem to work
*   @kou for fixing a typo in process_compressed_data_out
*   @kyrias for reporting a crash when ANALYZE is executed on extended query protocol mode with extension loaded.
*   @tobiasdirksen for requesting Continuous aggregate on top of another continuous aggregate
*   @xima for reporting a bug in Cagg migration
*   @xvaara for helping reproduce a bug with bitmap scans in transparent decompression

## 2.8.1 (2022-10-06)

This release is a patch release. We recommend that you upgrade at the
next available opportunity.

**Bug fixes**

*   #4454 Keep locks after reading job status
*   #4658 Fix error when querying a compressed hypertable with compress_segmentby on an enum column
*   #4671 Fix a possible error while flushing the COPY data
*   #4675 Fix bad TupleTableSlot drop
*   #4676 Fix a deadlock when decompressing chunks and performing SELECTs
*   #4685 Fix chunk exclusion for space partitions in SELECT FOR UPDATE queries
*   #4694 Change parameter names of cagg_migrate procedure
*   #4698 Do not use row-by-row fetcher for parameterized plans
*   #4711 Remove support for procedures as custom checks
*   #4712 Fix assertion failure in constify_now
*   #4713 Fix Continuous Aggregate migration policies
*   #4720 Fix chunk exclusion for prepared statements and dst changes
*   #4726 Fix gapfill function signature
*   #4737 Fix join on time column of compressed chunk
*   #4738 Fix error when waiting for remote COPY to finish
*   #4739 Fix continuous aggregate migrate check constraint
*   #4760 Fix segfault when INNER JOINing hypertables
*   #4767 Fix permission issues on index creation for CAggs

**Thanks**

*   @boxhock and @cocowalla for reporting a segfault when JOINing hypertables
*   @carobme for reporting constraint error during continuous aggregate migration
*   @choisnetm, @dustinsorensen, @jayadevanm and @joeyberkovitz for reporting a problem with JOINs on compressed hypertables
*   @daniel-k for reporting a background worker crash
*   @justinpryzby for reporting an error when compressing very wide tables
*   @maxtwardowski for reporting problems with chunk exclusion and space partitions
*   @yuezhihan for reporting GROUP BY error when having compress_segmentby on an enum column

## 2.8.0 (2022-08-30)

This release adds major new features since the 2.7.2 release.
We deem it moderate priority for upgrading.

This release includes these noteworthy features:

*   time_bucket now supports bucketing by month, year and timezone
*   Improve performance of bulk SELECT and COPY for distributed hypertables
*   1 step continuous aggregate policy management
*   Migrate continuous aggregates to the new format

**Features**

*   #4188 Use COPY protocol in row-by-row fetcher
*   #4307 Mark partialize_agg as parallel safe
*   #4380 Enable chunk exclusion for space dimensions in UPDATE/DELETE
*   #4384 Add schedule_interval to policies
*   #4390 Faster lookup of chunks by point
*   #4393 Support intervals with day component when constifying now()
*   #4397 Support intervals with month component when constifying now()
*   #4405 Support ON CONFLICT ON CONSTRAINT for hypertables
*   #4412 Add telemetry about replication
*   #4415 Drop remote data when detaching data node
*   #4416 Handle TRUNCATE TABLE on chunks
*   #4425 Add parameter check_config to alter_job
*   #4430 Create index on Continuous Aggregates
*   #4439 Allow ORDER BY on continuous aggregates
*   #4443 Add stateful partition mappings
*   #4484 Use non-blocking data node connections for COPY
*   #4495 Support add_dimension() with existing data
*   #4502 Add chunks to baserel cache on chunk exclusion
*   #4545 Add hypertable distributed argument and defaults
*   #4552 Migrate Continuous Aggregates to the new format
*   #4556 Add runtime exclusion for hypertables
*   #4561 Change get_git_commit to return full commit hash
*   #4563 1 step CAgg policy management
*   #4641 Allow bucketing by month, year, century in time_bucket and time_bucket_gapfill
*   #4642 Add timezone support to time_bucket

**Bug fixes**

*   #4359 Create composite index on segmentby columns
*   #4374 Remove constified now() constraints from plan
*   #4416 Handle TRUNCATE TABLE on chunks
*   #4478 Synchronize chunk cache sizes
*   #4486 Adding boolean column with default value doesn't work on compressed table
*   #4512 Fix unaligned pointer access
*   #4519 Throw better error message on incompatible row fetcher settings
*   #4549 Fix dump_meta_data for windows
*   #4553 Fix timescaledb_post_restore GUC handling
*   #4573 Load TSL library on compressed_data_out call
*   #4575 Fix use of `get_partition_hash` and `get_partition_for_key` inside an IMMUTABLE function
*   #4577 Fix segfaults in compression code with corrupt data
*   #4580 Handle default privileges on CAggs properly
*   #4582 Fix assertion in GRANT .. ON ALL TABLES IN SCHEMA
*   #4583 Fix partitioning functions
*   #4589 Fix rename for distributed hypertable
*   #4601 Reset compression sequence when group resets
*   #4611 Fix a potential OOM when loading large data sets into a hypertable
*   #4624 Fix heap buffer overflow
*   #4627 Fix telemetry initialization
*   #4631 Ensure TSL library is loaded on database upgrades
*   #4646 Fix time_bucket_ng origin handling
*   #4647 Fix the error "SubPlan found with no parent plan" that occurred if using joins in RETURNING clause.

**Thanks**

*   @AlmiS for reporting error on `get_partition_hash` executed inside an IMMUTABLE function
*   @Creatation for reporting an issue with renaming hypertables
*   @janko for reporting an issue when adding bool column with default value to compressed hypertable
*   @jayadevanm for reporting error of TRUNCATE TABLE on compressed chunk
*   @michaelkitson for reporting permission errors using default privileges on Continuous Aggregates
*   @mwahlhuetter for reporting error in joins in RETURNING clause
*   @ninjaltd and @mrksngl for reporting a potential OOM when loading large data sets into a hypertable
*   @PBudmark for reporting an issue with dump_meta_data.sql on Windows
*   @ssmoss for reporting an issue with time_bucket_ng origin handling

## 2.7.2 (2022-07-26)

This release is a patch release. We recommend that you upgrade at the
next available opportunity.
Among other things this release fixes several memory leaks, handling
of TOASTed values in GapFill and parameter handling in prepared statements.

**Bugfixes**

*   #4517 Fix prepared statement param handling in ChunkAppend
*   #4522 Fix ANALYZE on dist hypertable for a set of nodes
*   #4526 Fix gapfill group comparison for TOASTed values
*   #4527 Handle stats properly for range types
*   #4532 Fix memory leak in function telemetry
*   #4534 Use explicit memory context with hash_create
*   #4538 Fix chunk creation on hypertables with non-default statistics

**Thanks**

*   @3a6u9ka, @bgemmill, @hongquan, @stl-leonid-kalmaev and @victor-sudakov for reporting a memory leak
*   @hleung2021 and @laocaixw  for reporting an issue with parameter handling in prepared statements

## 2.7.1 (2022-07-07)

**Bug fixes**

*   #4494 Handle TimescaleDB versions aptly in multi-node
*   #4493 Segfault when executing IMMUTABLE functions
*   #4482 Fix race conditions during chunk (de)compression
*   #4367 Improved buffer management in the copy operator
*   #4375 Don't ask for `orderby` column if default already set
*   #4400 Use our implementation of `find_em_expr_for_rel` for PG15+
*   #4408 Fix crash during insert into distributed hypertable
*   #4411 Add `shmem_request_hook`
*   #4437 Fix segfault in `subscription_exec`
*   #4442 Fix perms in copy/move chunk
*   #4450 Retain hypertable ownership on `attach_data_node`
*   #4451 Repair numeric partial state on the fly
*   #4463 Fix empty bytea handlng with distributed tables
*   #4469 Better superuser handling for `move_chunk`

**Features**

*   #4244 Function telemetry
*   #4287 Add internal api for foreign table chunk
*   #4470 Block drop chunk if chunk is in frozen state
*   #4464 Add internal api to associate a hypertable with custom jobs

**Thanks**

*   @xin-hedera Finding bug in empty bytea values for distributed tables
*   @jflambert for reporting a bug with IMMUTABLE functions
*   @nikugogoi for reporting a bug with CTEs and upserts on distributed hypertables

## 2.7.0 (2022-05-24)

This release adds major new features since the 2.6.1 release.
We deem it moderate priority for upgrading.

This release includes these noteworthy features:

*   Optimize continuous aggregate query performance and storage
*   The following query clauses and functions can now be used in a continuous
  aggregate: FILTER, DISTINCT, ORDER BY as well as [Ordered-Set Aggregate](https://www.postgresql.org/docs/current/functions-aggregate.html#FUNCTIONS-ORDEREDSET-TABLE)
  and [Hypothetical-Set Aggregate](https://www.postgresql.org/docs/current/functions-aggregate.html#FUNCTIONS-HYPOTHETICAL-TABLE)
*   Optimize now() query planning time
*   Improve COPY insert performance
*   Improve performance of UPDATE/DELETE on PG14 by excluding chunks
*   Improve performance of reading from compressed hypertables, especially when using JIT.

This release also includes several bug fixes.

If you are upgrading from a previous version and were using compression
with a non-default collation on a segmentby-column you should recompress
those hypertables.

**Features**

*   #4045 Custom origin's support in CAGGs
*   #4120 Add logging for retention policy
*   #4158 Allow ANALYZE command on a data node directly
*   #4169 Add support for chunk exclusion on DELETE to PG14
*   #4209 Add support for chunk exclusion on UPDATE to PG14
*   #4269 Continuous Aggregates finals form
*   #4301 Add support for bulk inserts in COPY operator
*   #4311 Support non-superuser move chunk operations
*   #4330 Add GUC "bgw_launcher_poll_time"
*   #4340 Enable now() usage in plan-time chunk exclusion

**Bug fixes**

*   #3899 Fix segfault in Continuous Aggregates
*   #4225 Fix TRUNCATE error as non-owner on hypertable
*   #4236 Fix potential wrong order of results for compressed hypertable with a non-default collation
*   #4249 Fix option "timescaledb.create_group_indexes"
*   #4251 Fix INSERT into compressed chunks with dropped columns
*   #4255 Fix option "timescaledb.create_group_indexes"
*   #4259 Fix logic bug in extension update script
*   #4269 Fix bad Continuous Aggregate view definition reported in #4233
*   #4289 Support moving compressed chunks between data nodes
*   #4300 Fix refresh window cap for cagg refresh policy
*   #4315 Fix memory leak in scheduler
*   #4323 Remove printouts from signal handlers
*   #4342 Fix move chunk cleanup logic
*   #4349 Fix crashes in functions using AlterTableInternal
*   #4358 Fix crash and other issues in telemetry reporter

**Thanks**

*   @abrownsword for reporting a bug in the telemetry reporter and testing the fix
*   @jsoref for fixing various misspellings in code, comments and documentation
*   @yalon for reporting an error with ALTER TABLE RENAME on distributed hypertables
*   @zhuizhuhaomeng for reporting and fixing a memory leak in our scheduler

## 2.6.1 (2022-04-11)

This release contains bug fixes since the 2.6.0 release.
This release is medium priority for upgrade. We recommend that you upgrade at the next available opportunity.

**Bug fixes**

*   #4121 Fix RENAME TO/SET SCHEMA on distributed hypertable
*   #4122 Fix segfault on INSERT into distributed hypertable
*   #4142 Ignore invalid relid when deleting hypertable
*   #4159 Fix ADD COLUMN IF NOT EXISTS error on compressed hypertable
*   #4161 Fix memory handling during scans
*   #4176 Fix remote EXPLAIN with parameterized queries
*   #4181 Fix spelling errors and omissions
*   #4186 Fix owner change for distributed hypertable
*   #4192 Abort sessions after extension reload
*   #4193 Fix relcache callback handling causing crashes
*   #4199 Remove signal-unsafe calls from signal handlers
*   #4219 Do not modify aggregation state in finalize

**Thanks**

*   @abrownsword for reporting a crash in the telemetry reporter
*   @daydayup863 for reporting issue with remote explain

## 2.6.0 (2022-02-16)

This release adds major new features since the 2.5.2 release, including:

*   Compression in continuous aggregates
*   Experimental support for timezones in continuous aggregates
*   Experimental support for monthly buckets in continuous aggregates

It also includes several bug fixes. Telemetry reports are switched to a new
format, and now include more detailed statistics on compression, distributed
hypertables and indexes. We deem this release to be moderate priority for
upgrading.

**Features**

*   #3768 Allow ALTER TABLE ADD COLUMN with DEFAULT on compressedhypertable
*   #3769 Allow ALTER TABLE DROP COLUMN on compressed hypertable
*   #3873 Enable compression on continuous aggregates
*   #3943 Optimize first/last
*   #3945 Add support for ALTER SCHEMA on multi-node
*   #3949 Add support for DROP SCHEMA on multi-node
*   #3977 Timezones support in CAGGs

**Bug fixes**

*   #3808 Properly handle `max_retries` option
*   #3863 Fix remote transaction heal logic
*   #3869 Fix ALTER SET/DROP NULL contstraint on distributed hypertable
*   #3944 Fix segfault in add_compression_policy
*   #3961 Fix crash in EXPLAIN VERBOSE on distributed hypertable
*   #4015 Eliminate float rounding instabilities in interpolate
*   #4019 Update ts_extension_oid in transitioning state
*   #4073 Fix buffer overflow in partition scheme

**Improvements**

Query planning performance is improved for hypertables with a large number of chunks.

**Thanks**

*   @fvannee for reporting a first/last memory leak
*   @mmouterde for reporting an issue with floats and interpolate

## 2.5.2 (2022-02-09)

This release contains bug fixes since the 2.5.1 release.
This release is high priority for upgrade. We strongly recommend that you
upgrade as soon as possible.

**Bug fixes**

*   #3900 Improve custom scan node registration
*   #3911 Fix role type deparsing for GRANT command
*   #3918 Fix DataNodeScan plans with one-time filter
*   #3921 Fix segfault on insert into internal compressed table
*   #3938 Fix subtract_integer_from_now on 32-bit platforms and improve error handling
*   #3939 Fix projection handling in time_bucket_gapfill
*   #3948 Avoid double PGclear() in data fetchers
*   #3979 Fix deparsing of index predicates
*   #4020 Fix ALTER TABLE EventTrigger initialization
*   #4024 Fix premature cache release call
*   #4037 Fix status for dropped chunks that have catalog entries
*   #4069 Fix riinfo NULL handling in ANY construct
*   #4071 Fix extension installation privilege escalation (CVE-2022-24128)

**Thanks**

*   @carlocperez for reporting crash with NULL handling in ANY construct
*   @erikhh for reporting an issue with time_bucket_gapfill
*   @kancsuki for reporting drop column and partial index creation not working
*   @mmouterde for reporting an issue with floats and interpolate
*   Pedro Gallegos for reporting a possible privilege escalation during extension installation

## 2.5.1 (2021-12-01)

 This release contains bug fixes since the 2.5.0 release.
 We deem it medium priority to upgrade.

 **Bug fixes**

*   #3734 Rework distributed DDL processing logic
*   #3737 Fix flaky pg_dump
*   #3739 Fix compression policy on tables using INTEGER
*   #3766 Fix segfault in ts_hist_sfunc
*   #3789 Fix time_bucket comparison transformation
*   #3799 Fix error printout on correct security label
*   #3801 Fail size utility functions when data nodes do not respond
*   #3809 Fix NULL pointer evaluation in fill_result_error()
*   #3819 Fix reading garbage value from TSConnectionError
*   #3824 Remove pointers from CAGG lists for 64-bit archs
*   #3846 Eliminate deadlock in recompress chunk policy
*   #3881 Fix SkipScan crash due to pruned unique path
*   #3884 Fix create_distributed_restore_point memory issue

 **Thanks**

*   @cbisnett for reporting and fixing a typo in an error message
*   @CaptainCuddleCube for reporting bug on compression policy procedure on tables using INTEGER on time dimension
*   @phemmer for reporting bugs on multi-node

## 2.5.0 (2021-10-28)

**Features**

*   #3034 Add support for PostgreSQL 14
*   #3435 Add continuous aggregates for distributed hypertables
*   #3505 Add support for timezones in time_bucket_ng()

**Bug fixes**

*   #3580 Fix memory context bug executing TRUNCATE
*   #3592 Allow alter column type on distributed hypertable
*   #3598 Improve evaluation of stable functions such as now() on access node
*   #3618 Fix execution of refresh_caggs from user action
*   #3625 Add shared dependencies when creating chunk
*   #3626 Fix memory context bug executing TRUNCATE
*   #3627 Schema qualify UDTs in multi-node
*   #3638 Allow owner change of a data node
*   #3654 Fix index attnum mapping in reorder_chunk
*   #3661 Fix SkipScan path generation with constant DISTINCT column
*   #3667 Fix compress_policy for multi txn handling
*   #3673 Fix distributed hypertable DROP within a procedure
*   #3701 Allow anyone to use size utilities on distributed hypertables
*   #3708 Fix crash in get_aggsplit
*   #3709 Fix ordered append pathkey check
*   #3712 Fix GRANT/REVOKE ALL IN SCHEMA handling
*   #3717 Support transparent decompression on individual chunks
*   #3724 Fix inserts into compressed chunks on hypertables with caggs
*   #3727 Fix DirectFunctionCall crash in distributed_exec
*   #3728 Fix SkipScan with varchar column
*   #3733 Fix ANALYZE crash with custom statistics for custom types
*   #3747 Always reset expr context in DecompressChunk

**Thanks**

*   @binakot and @sebvett for reporting an issue with DISTINCT queries
*   @hardikm10, @DavidPavlicek and @pafiti for reporting bugs on TRUNCATE
*   @mjf for reporting an issue with ordered append and JOINs
*   @phemmer for reporting the issues on multinode with aggregate queries and evaluation of now()
*   @abolognino for reporting an issue with INSERTs into compressed hypertables that have cagg
*   @tanglebones for reporting the ANALYZE crash with custom types on multinode

## 2.4.2 (2021-09-21)

This release contains bug fixes since the 2.4.1 release.
We deem it high priority to upgrade.

**Bug fixes**

*   #3437 Rename on all continuous aggregate objects
*   #3469 Use signal-safe functions in signal handler
*   #3520 Modify compression job processing logic
*   #3527 Fix time_bucket_ng behaviour with origin argument
*   #3532 Fix bootstrap with regresschecks disabled
*   #3574 Fix failure on job execution by background worker
*   #3590 Call cleanup functions on backend exit

**Thanks**

*   @jankatins for reporting a crash with background workers
*   @LutzWeischerFujitsu for reporting an issue with bootstrap

## 2.4.1 (2021-08-19)

**Bug fixes**

*   #3430 Fix havingqual processing for continuous aggregates
*   #3468 Disable tests by default if tools are not found
*   #3462 Fix crash while tracking alter table commands
*   #3494 Improve error message when adding data nodes
*   #3489 Fix continuous agg bgw job failure for PG 12.8 and 13.4

**Thanks**

*   @brianbenns for reporting a segfault with continuous aggregates

## 2.4.0 (2021-07-30)

**Experimental features**

*   #3293 Add timescaledb_experimental schema
*   #3302 Add block_new_chunks and allow_new_chunks API to experimental
schema. Add chunk based refresh_continuous_aggregate.
*   #3211 Introduce experimental time_bucket_ng function
*   #3366 Allow use of experimental time_bucket_ng function in continuous aggregates
*   #3408 Support for seconds, minutes and hours in time_bucket_ng

**Bug fixes**

*   #3401 Fix segfault for RelOptInfo without fdw_private
*   #3411 Verify compressed chunk validity for compressed path
*   #3416 Fix targetlist names for continuous aggregate views
*   #3434 Remove extension check from relcache invalidation callback
*   #3440 Fix remote_tx_heal_data_node to work with only current database

**Thanks**

*   @fvannee for reporting an issue with hypertable expansion in functions
*   @amalek215 for reporting an issue with cache invalidation during pg_class vacuum full
*   @hardikm10 for reporting an issue with inserting into compressed chunks
*   @dberardo-com and @iancmcc for reporting an issue with extension updates after renaming columns of continuous aggregates.

## 2.3.1 (2021-07-05)

This maintenance release contains bug fixes since the 2.3.0 release.
We deem it moderate priority for upgrading.

**Bug fixes**

*   #3279 Add some more randomness to chunk assignment
*   #3288 Fix failed update with parallel workers
*   #3300 Improve trigger handling on distributed hypertables
*   #3304 Remove paths that reference parent relids for compressed chunks
*   #3305 Fix pull_varnos miscomputation of relids set
*   #3310 Generate downgrade script
*   #3314 Fix heap buffer overflow in hypertable expansion
*   #3317 Fix heap buffer overflow in remote connection cache.
*   #3327 Make aggregates in caggs fully qualified
*   #3336 Fix pg_init_privs objsubid handling
*   #3345 Fix SkipScan distinct column identification
*   #3355 Fix heap buffer overflow when renaming compressed hypertable columns.
*   #3367 Improve DecompressChunk qual pushdown
*   #3377 Fix bad use of repalloc

**Thanks**

*   @db-adrian for reporting an issue when accessing cagg view through postgres_fdw
*   @fncaldas and @pgwhalen for reporting an issue accessing caggs when public is not in search_path
*   @fvannee, @mglonnro and @ebreijo for reporting an issue with the upgrade script
*   @fvannee for reporting a performance regression with SkipScan

## 2.3.0 (2021-05-25)

**Features**

*   #3116 Add distributed hypertable compression policies
*   #3162 Use COPY when executing distributed INSERTs
*   #3199 Add GENERATED column support on distributed hypertables
*   #3210 Add trigger support on distributed hypertables
*   #3230 Support for inserts into compressed chunks

**Bug fixes**

*   #3213 Propagate grants to compressed hypertables
*   #3229 Use correct lock mode when updating chunk
*   #3243 Fix assertion failure in decompress_chunk_plan_create
*   #3250 Fix constraint triggers on hypertables
*   #3251 Fix segmentation fault due to incorrect call to chunk_scan_internal
*   #3252 Fix blocking triggers with transition tables

**Thanks**

*   @yyjdelete for reporting a crash with decompress_chunk and identifying the bug in the code
*   @fabriziomello for documenting the prerequisites when compiling against PostgreSQL 13

## 2.2.1 (2021-05-05)

This maintenance release contains bug fixes since the 2.2.0 release. We
deem it high priority for upgrading.

This release extends Skip Scan to multinode by enabling the pushdown
of `DISTINCT` to data nodes. It also fixes a number of bugs in the
implementation of Skip Scan, in distributed hypertables, in creation
of indexes, in compression, and in policies.

**Features**

*   #3113 Pushdown "SELECT DISTINCT" in multi-node to allow use of Skip
  Scan

**Bug fixes**

*   #3101 Use commit date in `get_git_commit()`
*   #3102 Fix `REINDEX TABLE` for distributed hypertables
*   #3104 Fix use after free in `add_reorder_policy`
*   #3106 Fix use after free in `chunk_api_get_chunk_stats`
*   #3109 Copy recreated object permissions on update
*   #3111 Fix `CMAKE_BUILD_TYPE` check
*   #3112 Use `%u` to format Oid instead of `%d`
*   #3118 Fix use after free in cache
*   #3123 Fix crash while using `REINDEX TABLE CONCURRENTLY`
*   #3135 Fix SkipScan path generation in `DISTINCT` queries with expressions
*   #3146 Fix SkipScan for IndexPaths without pathkeys
*   #3147 Skip ChunkAppend if AppendPath has no children
*   #3148 Make `SELECT DISTINCT` handle non-var targetlists
*   #3151 Fix `fdw_relinfo_get` assertion failure on `DELETE`
*   #3155 Inherit `CFLAGS` from PostgreSQL
*   #3169 Fix incorrect type cast in compression policy
*   #3183 Fix segfault in calculate_chunk_interval
*   #3185 Fix wrong datatype for integer based retention policy

**Thanks**

*   @Dead2, @dv8472 and @einsibjarni for reporting an issue with multinode queries and views
*   @aelg for reporting an issue with policies on integer-based hypertables
*   @hperez75 for reporting an issue with Skip Scan
*   @nathanloisel for reporting an issue with compression on hypertables with integer-based timestamps
*   @xin-hedera for fixing an issue with compression on hypertables with integer-based timestamps

## 2.2.0 (2021-04-13)

This release adds major new features since the 2.1.1 release.
We deem it moderate priority for upgrading.

This release adds the Skip Scan optimization, which significantly
improves the performance of queries with DISTINCT ON. This
optimization is not yet available for queries on distributed
hypertables.

This release also adds a function to create a distributed
restore point, which allows performing a consistent restore of a
multi-node cluster from a backup.

The bug fixes in this release address issues with size and stats
functions, high memory usage in distributed inserts, slow distributed
ORDER BY queries, indexes involving INCLUDE, and single chunk query
planning.

**PostgreSQL 11 deprecation announcement**

Timescale is working hard on our next exciting features. To make that
possible, we require functionality that is unfortunately absent on
PostgreSQL 11. For this reason, we continue supporting PostgreSQL
11 only until mid-June 2021. At some point before that time, we are going to
announce in which version of TimescaleDB PostgreSQL 11 support is dropped.

**Major features**

*   #2843 Add distributed restore point functionality
*   #3000 SkipScan to speed up SELECT DISTINCT

**Bug fixes**

*   #2989 Refactor and harden size and stats functions
*   #3058 Reduce memory usage for distributed inserts
*   #3067 Fix extremely slow multi-node order by queries
*   #3082 Fix chunk index column name mapping
*   #3083 Keep Append pathkeys in ChunkAppend

**Thanks**

*   @BowenGG for reporting an issue with indexes with INCLUDE
*   @fvannee for reporting an issue with ChunkAppend pathkeys
*   @pedrokost and @RobAtticus for reporting an issue with size
  functions on empty hypertables
*   @phemmer and @ryanbooz for reporting issues with slow
  multi-node order by queries
*   @stephane-moreau for reporting an issue with high memory usage during
  single-transaction inserts on a distributed hypertable.

## 2.1.1 (2021-03-29)

This maintenance release contains bug fixes since the 2.1.0 release. We
deem it high priority for upgrading.

The bug fixes in this release address issues with CREATE INDEX and
UPSERT for hypertables, custom jobs, and gapfill queries.

This release marks TimescaleDB as a trusted extension in PG13, so that
superuser privileges are not required anymore to install the extension.

**Minor features**

*   #2998 Mark timescaledb as trusted extension

**Bug fixes**

*   #2948 Fix off by 4 error in histogram deserialize
*   #2974 Fix index creation for hypertables with dropped columns
*   #2990 Fix segfault in job_config_check for cagg
*   #2987 Fix crash due to txns in emit_log_hook_callback
*   #3042 Commit end transaction for CREATE INDEX
*   #3053 Fix gapfill/hashagg planner interaction
*   #3059 Fix UPSERT on hypertables with columns with defaults

**Thanks**

*   @eloyekunle and @kitwestneat for reporting an issue with UPSERT
*   @jocrau for reporting an issue with index creation
*   @kev009 for fixing a compilation issue
*   @majozv and @pehlert for reporting an issue with time_bucket_gapfill

## 2.1.0 (2021-02-22)

This release adds major new features since the 2.0.2 release.
We deem it moderate priority for upgrading.

This release adds the long-awaited support for PostgreSQL 13 to TimescaleDB.
The minimum required PostgreSQL 13 version is 13.2 due to a security vulnerability
affecting TimescaleDB functionality present in earlier versions of PostgreSQL 13.

This release also relaxes some restrictions for compressed hypertables;
namely, TimescaleDB now supports adding columns to compressed hypertables
and renaming columns of compressed hypertables.

**Major Features**

*   #2779 Add support for PostgreSQL 13

**Minor features**

*   #2736 Support adding columns to hypertables with compression enabled
*   #2909 Support renaming columns of hypertables with compression enabled

## 2.0.2 (2021-02-19)

This maintenance release contains bug fixes since the 2.0.1 release. We
deem it high priority for upgrading.

The bug fixes in this release address issues with joins, the status of
background jobs, and disabling compression. It also includes
enhancements to continuous aggregates, including improved validation
of policies and optimizations for faster refreshes when there are a
lot of invalidations.

**Minor features**

*   #2926 Optimize cagg refresh for small invalidations

**Bug fixes**

*   #2850 Set status for backend in background jobs
*   #2883 Fix join qual propagation for nested joins
*   #2884 Add GUC to control join qual propagation
*   #2885 Fix compressed chunk check when disabling compression
*   #2908 Fix changing column type of clustered hypertables
*   #2942 Validate continuous aggregate policy

**Thanks**

*   @zeeshanshabbir93 for reporting an issue with joins
*   @Antiarchitect for reporting the issue with slow refreshes of
  continuous aggregates.
*   @diego-hermida for reporting the issue about being unable to disable
  compression
*   @mtin for reporting the issue about wrong job status

## 1.7.5 (2021-02-12)

This maintenance release contains bug fixes since the 1.7.4 release.
Most of these fixes were backported from the 2.0.0 and 2.0.1 releases.
We deem it high priority for upgrading for users on TimescaleDB 1.7.4
or previous versions.

In particular the fixes contained in this maintenance release address
issues in continuous aggregates, compression, JOINs with hypertables,
and when upgrading from previous versions.

**Bug fixes**

*   #2502 Replace check function when updating
*   #2558 Repair dimension slice table on update
*   #2619 Fix segfault in decompress_chunk for chunks with dropped
  columns
*   #2664 Fix support for complex aggregate expression
*   #2800 Lock dimension slices when creating new chunk
*   #2860 Fix projection in ChunkAppend nodes
*   #2865 Apply volatile function quals at decompresschunk
*   #2851 Fix nested loop joins that involve compressed chunks
*   #2868 Fix corruption in gapfill plan
*   #2883 Fix join qual propagation for nested joins
*   #2885 Fix compressed chunk check when disabling compression
*   #2920 Fix repair in update scripts

**Thanks**

*   @akamensky for reporting several issues including segfaults after
  version update
*   @alex88 for reporting an issue with joined hypertables
*   @dhodyn for reporting an issue when joining compressed chunks
*   @diego-hermida for reporting an issue with disabling compression
*   @Netskeh for reporting bug on time_bucket problem in continuous
  aggregates
*   @WarriorOfWire for reporting the bug with gapfill queries not being
  able to find pathkey item to sort
*   @zeeshanshabbir93 for reporting an issue with joins

## 2.0.1 (2021-01-28)

This maintenance release contains bug fixes since the 2.0.0 release.
We deem it high priority for upgrading.

In particular the fixes contained in this maintenance release address
issues in continuous aggregates, compression, JOINs with hypertables
and when upgrading from previous versions.

**Bug fixes**

*   #2772 Always validate existing database and extension
*   #2780 Fix config enum entries for remote data fetcher
*   #2806 Add check for dropped chunk on update
*   #2828 Improve cagg watermark caching
*   #2838 Fix catalog repair in update script
*   #2842 Do not mark job as started when setting next_start field
*   #2845 Fix continuous aggregate privileges during upgrade
*   #2851 Fix nested loop joins that involve compressed chunks
*   #2860 Fix projection in ChunkAppend nodes
*   #2861 Remove compression stat update from update script
*   #2865 Apply volatile function quals at decompresschunk node
*   #2866 Avoid partitionwise planning of partialize_agg
*   #2868 Fix corruption in gapfill plan
*   #2874 Fix partitionwise agg crash due to uninitialized memory

**Thanks**

*   @alex88 for reporting an issue with joined hypertables
*   @brian-from-quantrocket for reporting an issue with extension update and dropped chunks
*   @dhodyn for reporting an issue when joining compressed chunks
*   @markatosi for reporting a segfault with partitionwise aggregates enabled
*   @PhilippJust for reporting an issue with add_job and initial_start
*   @sgorsh for reporting an issue when using pgAdmin on windows
*   @WarriorOfWire for reporting the bug with gapfill queries not being
  able to find pathkey item to sort

## 2.0.0 (2020-12-18)

With this release, we are officially moving TimescaleDB 2.0 to GA,
concluding several release candidates.

TimescaleDB 2.0 adds the much-anticipated support for distributed
hypertables (multi-node TimescaleDB), as well as new features and
enhancements to core functionality to give users better clarity and
more control and flexibility over their data.

Multi-node architecture:  In particular, with TimescaleDB 2.0, users
can now create distributed hypertables across multiple instances of
TimescaleDB, configured so that one instance serves as an access node
and multiple others as data nodes. All queries for a distributed
hypertable are issued to the access node, but inserted data and queries
are pushed down across data nodes for greater scale and performance.

Multi-node TimescaleDB can be self managed or, for easier operation,
launched within Timescale's fully managed cloud services.

This release also adds:

*   Support for user-defined actions, allowing users to define,
  customize, and schedule automated tasks, which can be run by the
  built-in jobs scheduling framework now exposed to users.
*   Significant changes to continuous aggregates, which now separate the
  view creation from the policy. Users can now refresh individual
  regions of the continuous aggregate materialized view, or schedule
  automated refreshing via  policy.
*   Redesigned informational views, including new (and more general)
  views for information about hypertable's dimensions and chunks,
  policies and user-defined actions, as well as support for multi-node
  TimescaleDB.
*   Moving all formerly enterprise features into our Community Edition,
  and updating Timescale License, which now provides additional (more
  permissive) rights to users and developers.

Some of the changes above (for example, continuous aggregates, updated
informational views) do introduce breaking changes to APIs and are not
backwards compatible. While the update scripts in TimescaleDB 2.0
upgrade databases running TimescaleDB 1.x automatically, some of these
API and feature changes may require changes to clients and/or upstream
scripts that rely on the previous APIs. Before upgrading, we recommend
reviewing upgrade documentation at docs.timescale.com for more details.

**Major features**

TimescaleDB 2.0 moves the following major features to GA:

*   #1923 Add support for distributed hypertables
*   #2006 Add support for user-defined actions
*   #2125 #2221 Improve Continuous Aggregate API
*   #2084 #2089 #2098 #2417 Redesign informational views
*   #2435 Move enterprise features to community
*   #2437 Update Timescale License

**Previous release candidates**

*   #2702 Release Candidate 4 (December 2, 2020)
*   #2637 Release Candidate 3 (November 12, 2020)
*   #2554 Release Candidate 2 (October 20, 2020)
*   #2478 Release Candidate 1 (October 1, 2020)

**Minor features**

Since the last release candidate 4, there are several minor
improvements:

*   #2746 Optimize locking for create chunk API
*   #2705 Block tableoid access on distributed hypertable
*   #2730 Do not allow unique index on compressed hypertables
*   #2764 Bootstrap data nodes with versioned extension

**Bug fixes**

Since the last release candidate 4, there are several bug fixes:

*   #2719 Support disabling compression on distributed hypertables
*   #2742 Fix compression status in chunks view for distributed chunks
*   #2751 Fix crash and cancel when adding data node
*   #2763 Fix check constraint on hypertable metadata table

**Thanks**

Thanks to all contributors for the TimescaleDB 2.0 release:

*   @airton-neto for reporting a bug in executing some queries with UNION
*   @nshah14285 for reporting an issue with propagating privileges
*   @kalman5 for reporting an issue with renaming constraints
*   @LbaNeXte for reporting a bug in decompression for queries with
  subqueries
*   @semtexzv for reporting an issue with continuous aggregates on
  int-based hypertables
*   @mr-ns for reporting an issue with privileges for creating chunks
*   @cloud-rocket for reporting an issue with setting an owner on
  continuous aggregate
*   @jocrau for reporting a bug during creating an index with transaction
  per chunk
*   @fvannee for reporting an issue with custom time types
*   @ArtificialPB for reporting a bug in executing queries with
  conditional ordering on compressed hypertable
*   @dutchgecko for reporting an issue with continuous aggregate datatype
  handling
*   @lambdaq for suggesting to improve error message in continuous
  aggregate creation
*   @francesco11112 for reporting memory issue on COPY
*   @Netskeh for reporting bug on time_bucket problem in continuous
  aggregates
*   @mr-ns for reporting the issue with CTEs on distributed hypertables
*   @akamensky for reporting an issue with recursive cache invalidation
*   @ryanbooz for reporting slow queries with real-time aggregation on
  continuous aggregates
*   @cevian for reporting an issue with disabling compression on
  distributed hypertables

## 2.0.0-rc4 (2020-12-02)

This release candidate contains bug fixes since the previous release
candidate, as well as additional minor features. It improves
validation of configuration changes for background jobs, adds support
for gapfill on distributed tables, contains improvements to the memory
handling for large COPY, and contains improvements to compression for
distributed hypertables.

**Minor features**

*   #2689 Check configuration in alter_job and add_job
*   #2696 Support gapfill on distributed hypertable
*   #2468 Show more information in get_git_commit
*   #2678 Include user actions into job stats view
*   #2664 Fix support for complex aggregate expression
*   #2672 Add hypertable to continuous aggregates view
*   #2662 Save compression metadata settings on access node
*   #2707 Introduce additional db for data node bootstrapping

**Bug fixes**

*   #2688 Fix crash for concurrent drop and compress chunk
*   #2666 Fix timeout handling in async library
*   #2683 Fix crash in add_job when given NULL interval
*   #2698 Improve memory handling for remote COPY
*   #2555 Set metadata for chunks compressed before 2.0

**Thanks**

*   @francesco11112 for reporting memory issue on COPY
*   @Netskeh for reporting bug on time_bucket problem in continuous
  aggregates

## 2.0.0-rc3 (2020-11-12)

This release candidate contains bug fixes since the previous release
candidate, as well as additional minor features including support for
"user-mapping" authentication between access/data nodes and an
experimental API for refreshing continuous aggregates on individual
chunks.

**Minor features**

*   #2627 Add optional user mappings support
*   #2635 Add API to refresh continuous aggregate on chunk

**Bug fixes**

*   #2560 Fix SCHEMA DROP CASCADE with continuous aggregates
*   #2593 Set explicitly all lock parameters in alter_job
*   #2604 Fix chunk creation on hypertables with foreign key constraints
*   #2610 Support analyze of internal compression table
*   #2612 Optimize internal cagg_watermark function
*   #2613 Refresh correct partial during refresh on drop
*   #2617 Fix validation of available extensions on data node
*   #2619 Fix segfault in decompress_chunk for chunks with dropped columns
*   #2620 Fix DROP CASCADE for continuous aggregate
*   #2625 Fix subquery errors when using AsyncAppend
*   #2626 Fix incorrect total_table_pages setting for compressed scan
*   #2628 Stop recursion in cache invalidation

**Thanks**

*   @mr-ns for reporting the issue with CTEs on distributed hypertables
*   @akamensky for reporting an issue with recursive cache invalidation
*   @ryanbooz for reporting slow queries with real-time aggregation on
  continuous aggregates

## 2.0.0-rc2 (2020-10-21)

This release candidate contains bug fixes since the previous release candidate.

**Minor features**

*   #2520 Support non-transactional distibuted_exec

**Bug fixes**

*   #2307 Overflow handling for refresh policy with integer time
*   #2503 Remove error for correct bootstrap of data node
*   #2507 Fix validation logic when adding a new data node
*   #2510 Fix outer join qual propagation
*   #2514 Lock dimension slices when creating new chunk
*   #2515 Add if_attached argument to detach_data_node()
*   #2517 Fix member access within misaligned address in chunk_update_colstats
*   #2525 Fix index creation on hypertables with dropped columns
*   #2543 Pass correct status to lock_job
*   #2544 Assume custom time type range is same as bigint
*   #2563 Fix DecompressChunk path generation
*   #2564 Improve continuous aggregate datatype handling
*   #2568 Change use of ssl_dir GUC
*   #2571 Make errors and messages conform to style guide
*   #2577 Exclude compressed chunks from ANALYZE/VACUUM

## 2.0.0-rc1 (2020-10-06)

This release adds major new features and bug fixes since the 1.7.4 release.
We deem it moderate priority for upgrading.

This release adds the long-awaited support for distributed hypertables to
TimescaleDB. With 2.0, users can create distributed hypertables across
multiple instances of TimescaleDB, configured so that one instance serves
as an access node and multiple others as data nodes. All queries for a
distributed hypertable are issued to the access node, but inserted data
and queries are pushed down across data nodes for greater scale and
performance.

This release also adds support for user-defined actions allowing users to
define actions that are run by the TimescaleDB automation framework.

In addition to these major new features, the 2.0 branch introduces _breaking_ changes
to APIs and existing features, such as continuous aggregates. These changes are not
backwards compatible and might require changes to clients and/or scripts that rely on
the previous APIs. Please review our updated documentation and do proper testing to
ensure compatibility with your existing applications.

The noticeable breaking changes in APIs are:

*   Redefined functions for policies
*   A continuous aggregate is now created with `CREATE MATERIALIZED VIEW`
  instead of `CREATE VIEW` and automated refreshing requires adding a policy
  via `add_continuous_aggregate_policy`
*   Redesign of informational views, including new (and more general) views for
  information about policies and user-defined actions

This release candidate is upgradable, so if you are on a previous release (for example, 1.7.4)
you can upgrade to the release candidate and later expect to be able to upgrade to the
final 2.0 release. However, please carefully consider your compatibility requirements
_before_ upgrading.

**Major features**

*   #1923 Add support for distributed hypertables
*   #2006 Add support for user-defined actions
*   #2435 Move enterprise features to community
*   #2437 Update Timescale License

**Minor features**

*   #2011 Constify TIMESTAMPTZ OP INTERVAL in constraints
*   #2105 Support moving compressed chunks

**Bug fixes**

*   #1843 Improve handling of "dropped" chunks
*   #1886 Change ChunkAppend leader to use worker subplan
*   #2116 Propagate privileges from hypertables to chunks
*   #2263 Fix timestamp overflow in time_bucket optimization
*   #2270 Fix handling of non-reference counted TupleDescs in gapfill
*   #2325 Fix rename constraint/rename index
*   #2370 Fix detection of hypertables in subqueries
*   #2376 Fix caggs width expression handling on int based hypertables
*   #2416 Check insert privileges to create chunk
*   #2428 Allow owner change of continuous aggregate
*   #2436 Propagate grants in continuous aggregates

### 1.7.4 (2020-09-08)

This maintenance release contains bugfixes since the 1.7.3 release. We deem it
high priority for upgrading if TimescaleDB is deployed with replicas (synchronous
or asynchronous).

In particular the fixes contained in this maintenance release address an issue with
running queries on compressed hypertables on standby nodes.

**Bugfixes**

*   #2336 Remove tuple lock on select path

The music for this release was Rufus and Chaka Khan's 1974 classic _Rags to Rufus_.

### 1.7.3 (2020-08-27)

This maintenance release contains bugfixes since the 1.7.2 release. We deem it high
priority for upgrading.

In particular the fixes contained in this maintenance release address issues in compression,
drop_chunks and the background worker scheduler.

**Bug fixes**

*   #2059 Improve inferring start and stop arguments from gapfill query
*   #2067 Support moving compressed chunks
*   #2068 Apply SET TABLESPACE for compressed chunks
*   #2090 Fix index creation with IF NOT EXISTS for existing indexes
*   #2092 Fix delete on tables involving hypertables with compression
*   #2164 Fix telemetry installed_time format
*   #2184 Fix background worker scheduler memory consumption
*   #2222 Fix `negative bitmapset member not allowed` in decompression
*   #2255 Propagate privileges from hypertables to chunks
*   #2256 Fix segfault in chunk_append with space partitioning
*   #2259 Fix recursion in cache processing
*   #2261 Lock dimension slice tuple when scanning

**Thanks**

*   @akamensky for reporting an issue with drop_chunks and ChunkAppend with space partitioning
*   @dewetburger430 for reporting an issue with setting tablespace for compressed chunks
*   @fvannee for reporting an issue with cache invalidation
*   @nexces for reporting an issue with ChunkAppend on space-partitioned hypertables
*   @PichetGoulu for reporting an issue with index creation and IF NOT EXISTS
*   @prathamesh-sonpatki for contributing a typo fix
*   @sezaru for reporting an issue with background worker scheduler memory consumption

The music for this release was Bob Dylan's _Blonde on Blonde_.

### 1.7.2 (2020-07-07)

This maintenance release contains bugfixes since the 1.7.1 release. We deem it medium
priority for upgrading.

In particular the fixes contained in this maintenance release address bugs in continuous
aggregates, drop_chunks and compression.

**Features**

*   #1877 Add support for fast pruning of inlined functions

**Bug fixes**

*   #1908 Fix drop_chunks with unique constraints when cascade_to_materializations is false
*   #1915 Check for database in extension_current_state
*   #1918 Unify chunk index creation
*   #1932 Change compression locking order
*   #1938 Fix gapfill locf treat_null_as_missing
*   #1982 Check for disabled telemetry earlier
*   #1984 Fix compression bit array left shift count
*   #1997 Add checks for read-only transactions
*   #2002 Reset restoring gucs rather than explicitly setting 'off'
*   #2028 Fix locking in drop_chunks
*   #2031 Enable compression for tables with compound foreign key
*   #2039 Fix segfault in create_trigger_handler
*   #2043 Fix segfault in cagg_update_view_definition
*   #2046 Use index tablespace during chunk creation
*   #2047 Better handling of chunk insert state destruction
*   #2049 Fix handling of PlaceHolderVar in DecompressChunk
*   #2051 Fix tuple concurrently deleted error with multiple continuous aggregates

**Thanks**

*   @akamensky for reporting an issue with telemetry and an issue with drop_chunks
*   @darko408 for reporting an issue with decompression
*   @Dmitri191 for reporting an issue with failing background workers
*   @eduardotsj for reporting an issue with indexes not inheriting tablespace settings
*   @FourSeventy for reporting an issue with multiple continuous aggregrates
*   @fvannee for contributing optimizations for pruning inlined functions
*   @jflambert for reporting an issue with failing telemetry jobs
*   @nbouscal for reporting an issue with compression jobs locking referenced tables
*   @Nicolai6120 for reporting an issue with locf and treat_null_as_missing
*   @NomAnor for reporting an issue with expression index with table references
*   @Olernov for contributing a fix for compressing tables with compound foreign keys
*   @werjo for reporting an issue with drop_chunks and unique constraints

The music for this release was David Bowie's _The Rise and Fall of Ziggy Stardust and the Spiders From Mars_.

### 1.7.1 (2020-05-18)

This maintenance release contains bugfixes since the 1.7.0 release. We deem it medium
priority for upgrading and high priority for users with multiple continuous aggregates.

In particular the fixes contained in this maintenance release address bugs in continuous
aggregates with real-time aggregation and PostgreSQL 12 support.

**Bug fixes**

*   #1834 Define strerror() for Windows
*   #1846 Fix segfault on COPY to hypertable
*   #1850 Fix scheduler failure due to bad next_start_time for jobs
*   #1851 Fix hypertable expansion for UNION ALL
*   #1854 Fix reorder policy job to skip compressed chunks
*   #1861 Fix qual pushdown for compressed hypertables where quals have casts
*   #1864 Fix issue with subplan selection in parallel ChunkAppend
*   #1868 Add support for WHERE, HAVING clauses with real time aggregates
*   #1869 Fix real time aggregate support for multiple continuous aggregates
*   #1871 Don't rely on timescaledb.restoring for upgrade
*   #1875 Fix hypertable detection in subqueries
*   #1884 Fix crash on SELECT WHERE NOT with empty table

**Thanks**

*   @airton-neto for reporting an issue with queries over UNIONs of hypertables
*   @dhodyn for reporting an issue with UNION ALL queries
*   @frostwind for reporting an issue with casts in where clauses on compressed hypertables
*   @fvannee for reporting an issue with hypertable detection in inlined SQL functions and an issue with COPY
*   @hgiasac for reporting missing where clause with real time aggregates
*   @louisth for reporting an issue with real-time aggregation and multiple continuous aggregates
*   @michael-sayapin for reporting an issue with INSERTs and WHERE NOT EXISTS
*   @Olernov for reporting and fixing an issue with compressed chunks in the reorder policy
*   @pehlert for reporting an issue with pg_upgrade

The music for this release was the Rolling Stone's _Sticky Fingers_.

### 1.7.0 (2020-04-16)

This release adds major new features and bugfixes since the 1.6.1 release.
We deem it moderate priority for upgrading.

This release adds the long-awaited support for PostgreSQL 12 to TimescaleDB.

This release also adds a new default behavior when querying continuous
aggregates that we call real-time aggregation. A query on a continuous
aggregate now combines materialized data with recent data that has
yet to be materialized.

Note that only newly created continuous aggregates have this real-time
query behavior, although it can be enabled on existing continuous aggregates
with a configuration setting as follows:

ALTER VIEW continuous_view_name SET (timescaledb.materialized_only=false);

This release also moves several data management lifecycle features to the
Community version of TimescaleDB (from Enterprise), including data reordering
and data retention policies.

**Deprecation notice:**  Please note that with the release of Timescale 1.7, we are deprecating support for PostgreSQL 9.6.x and 10.x.
The current plan is that the Timescale 2.0 release later this year only supports PostgreSQL major versions 11.x, 12.x, or newer.

**Major features**

*   #1807 Add support for PostgreSQL 12
*   #1685 Add support for real-time aggregation on continuous aggregates

**Bug fixes**

*   #1665 Add ignore_invalidation_older_than to timescaledb_information.continuous_aggregates view
*   #1750 Handle undefined ignore_invalidation_older_than
*   #1757 Restrict watermark to max for continuous aggregates
*   #1769 Add rescan function to CompressChunkDml CustomScan node
*   #1785 Fix last_run_success value in continuous_aggregate_stats view
*   #1801 Include parallel leader in plan execution
*   #1808 Fix ts_hypertable_get_all for compressed tables
*   #1828 Ignore dropped chunks in compressed_chunk_stats

**Licensing changes**
Reorder and policies around reorder and drop chunks are now accessible to community users, not just enterprise
Gapfill functionality no longer warns about expired license

**Thanks**

*   @t0k4rt for reporting an issue with parallel chunk append plans
*   @alxndrdude for reporting an issue when trying to insert into compressed chunks
*   @Olernov for reporting and fixing an issue with show_chunks and drop_chunks for compressed hypertables
*   @mjb512 for reporting an issue with INSERTs in CTEs in cached plans
*   @dmarsh19 for reporting and fixing an issue with dropped chunks in compressed_chunk_stats

### 1.6.1 (2020-03-18)

This maintenance release contains bugfixes since the 1.6.0 release. We deem it medium priority
for upgrading.

In particular the fixes contained in this maintenance release address bugs in continuous aggregates, time_bucket_gapfill,
partial index handling and drop_chunks.

For this release only, you need to restart the database after upgrade before restoring a backup.

**Minor features**

*   #1666 Support drop_chunks API for continuous aggregates
*   #1711 Change log level for continuous aggregate materialization messages

**Bug fixes**

*   #1630 Print notice for COPY TO on hypertable
*   #1648 Drop chunks from materialized hypertable
*   #1668 Cannot add dimension if hypertable has empty chunks
*   #1673 Fix crash when interrupting create_hypertable
*   #1674 Fix time_bucket_gapfill's interaction with GROUP BY
*   #1686 Fix order by queries on compressed hypertables that have char segment by column
*   #1687 Fix issue with disabling compression when foreign keys are present
*   #1688 Handle many BGW jobs better
*   #1698 Add logic to ignore dropped chunks in hypertable_relation_size
*   #1704 Fix bad plan for continuous aggregate materialization
*   #1709 Prevent starting background workers with NOLOGIN
*   #1713 Fix miscellaneous background worker issues
*   #1715 Fix issue with overly aggressive chunk exclusion in outer joins
*   #1719 Fix restoring/scheduler entrypoint to avoid BGW death
*   #1720 Add scheduler cache invalidations
*   #1727 Fix compressing INTERVAL columns
*   #1728 Handle Sort nodes in ConstraintAwareAppend
*   #1730 Fix partial index handling on hypertables
*   #1739 Use release OpenSSL DLLs for debug builds on Windows
*   #1740 Fix invalidation entries from multiple caggs on same hypertable
*   #1743 Fix continuous aggregate materialization timezone handling
*   #1748 Fix remove_drop_chunks_policy for continuous aggregates
*   #1756 Fix handling of dropped chunks in compression background worker

**Thanks**

*   @RJPhillips01 for reporting an issue with drop chunks.
*   @b4eEx for reporting an issue with disabling compression.
*   @darko408 for reporting an issue with order by on compressed hypertables
*   @mrechte for reporting an issue with compressing INTERVAL columns
*   @tstaehli for reporting an issue with ConstraintAwareAppend
*   @chadshowalter for reporting an issue with partial index on hypertables
*   @geoffreybennett for reporting an issue with create_hypertable when interrupting operations
*   @alxndrdude for reporting an issue with background workers during restore
*   @zcavaliero for reporting and fixing an issue with dropped columns in hypertable_relation_size
*   @ismailakpolat for reporting an issue with cagg materialization on hypertables with TIMESTAMP column

### 1.6.0 (2020-01-14)

This release adds major new features and bugfixes since the 1.5.1 release.
We deem it moderate priority for upgrading.

The major new feature in this release allows users to keep the aggregated
data in a continuous aggregate while dropping the raw data with drop_chunks.
This allows users to save storage by keeping only the aggregates.

The semantics of the refresh_lag parameter for continuous aggregates has
been changed to be relative to the current timestamp instead of the maximum
value in the table. This change requires that an integer_now func be set on
hypertables with integer-based time columns to use continuous aggregates on
this table.

We added a timescaledb.ignore_invalidation_older_than parameter for continuous
aggregates. This parameter accept a time-interval (for example, 1 month). If set,
it limits the amount of time for which to process invalidation. Thus, if
timescaledb.ignore_invalidation_older_than = '1 month', then any modifications
for data older than 1 month from the current timestamp at modification time may
not cause continuous aggregate to be updated. This limits the amount of work
that a backfill can trigger. By default, all invalidations are processed.

For more information on this release, read the [announcement blog](https://blog.timescale.com/blog/timescaledb-1-6-data-retention-policies-for-continuous-aggregates/)
and [blog on downsampling](https://blog.timescale.com/blog/how-to-proactively-manage-long-term-data-storage-with-downsampling/).

**Major features**

*   #1589 Allow drop_chunks while keeping continuous aggregates

**Minor features**

*   #1568 Add ignore_invalidation_older_than option to continuous aggs
*   #1575 Reorder group-by clause for continuous aggregates
*   #1592 Improve continuous agg user messages

**Bug fixes**

*   #1565 Fix partial select query for continuous aggregate
*   #1591 Fix locf treat_null_as_missing option
*   #1594 Fix error in compression constraint check
*   #1603 Add join info to compressed chunk
*   #1606 Fix constify params during runtime exclusion
*   #1607 Delete compression policy when drop hypertable
*   #1608 Add jobs to timescaledb_information.policy_stats
*   #1609 Fix bug with parent table in decompression
*   #1624 Fix drop_chunks for ApacheOnly
*   #1632 Check for NULL before dereferencing variable

**Thanks**

*   @optijon for reporting an issue with locf treat_null_as_missing option
*   @acarrera42 for reporting an issue with constify params during runtime exclusion
*   @ChristopherZellermann for reporting an issue with the compression constraint check
*   @SimonDelamare for reporting an issue with joining hypertables with compression

### 1.5.1 (2019-11-12)

This maintenance release contains bugfixes since the 1.5.0 release. We deem it low
priority for upgrading.

In particular the fixes contained in this maintenance release address potential
segfaults and no other security vulnerabilities. The bugfixes are related to bloom
indexes and updates from previous versions.

**Bugfixes**

*   #1523 Fix bad SQL updates from previous updates
*   #1526 Fix hypertable model
*   #1530 Set active snapshots in multi-xact index create

**Thanks**

*   @84660320 for reporting an issue with bloom indexes
*   @gumshoes @perhamm @jermudgeon @gmisagm for reporting the issue with updates

### 1.5.0 (2019-10-31)

This release adds major new features and bugfixes since the 1.4.2 release.
We deem it moderate priority for upgrading.

This release adds compression as a major new feature.
Multiple type-specific compression options are available in this release
(including DeltaDelta with run-length-encoding for integers and
timestamps; Gorilla compression for floats; dictionary-based compression
for any data type, but specifically for low-cardinality datasets;
and other LZ-based techniques). Individual columns can be compressed with
type-specific compression algorithms as Postgres' native row-based format
are rolled up into columnar-like arrays on a per chunk basis.
The query planner then handles transparent decompression for compressed
chunks at execution time.

This release also adds support for migrating of chunks between tablespaces, as
well as support for parallel query coordination to the ChunkAppend node.
Previously ChunkAppend would rely on parallel coordination in the underlying
scans for parallel plans.

For more information on this release, read the [announcement
blog](https://blog.timescale.com/blog/building-columnar-compression-in-a-row-oriented-database)
and this [tutorial on data compression][compress-data].

**For this release only**, you need to restart the database before running
`ALTER EXTENSION`

**Major features**

*   #1393 Moving chunks between different tablespaces
*   #1433 Make ChunkAppend parallel aware
*   #1434 Introducing native compression, multiple compression algorithms, and hybrid row/columnar projections

**Minor features**

*   #1471 Allow setting reloptions on chunks
*   #1479 Add next_start option to alter_job_schedule
*   #1481 Add last_successful_finish to bgw_job_stats

**Bug fixes**

*   #1444 Prevent LIMIT pushdown in JOINs
*   #1447 Fix runtime exclusion memory leak
*   #1464 Fix ordered append with expressions in ORDER BY clause with space partitioning
*   #1476 Fix logic for BGW rescheduling
*   #1477 Fix gapfill treat_null_as_missing
*   #1493 Prevent recursion in invalidation processing
*   #1498 Fix overflow in gapfill's interpolate
*   #1499 Fix error for exported_uuid in pg_restore
*   #1503 Fix bug with histogram function in parallel

**Thanks**

*   @dhyun-obsec for reporting an issue with pg_restore
*   @rhaymo for reporting an issue with interpolate
*   @optijon for reporting an issue with locf treat_null_as_missing
*   @favnee for reporting an issue with runtime exclusion
*   @Lectem for reporting an issue with histograms
*   @rogerdwan for reporting an issue with BGW rescheduling
*   @od0 for reporting an issue with alter_job_schedule

### 1.4.2 (2019-09-11)

This maintenance release contains bugfixes since the 1.4.1 release. We deem it medium
priority for upgrading.

In particular the fixes contained in this maintenance release address 2 potential
segfaults and no other security vulnerabilities. The bugfixes are related to
background workers, OUTER JOINs, ordered append on space partitioned hypertables
and expression indexes.

**Bug fixes**

*   #1327 Fix chunk exclusion with ordered append
*   #1390 Fix deletes of background workers while a job is running
*   #1392 Fix cagg_agg_validate expression handling (segfault)
*   #1408 Fix ChunkAppend space partitioning support for ordered append
*   #1420 Fix OUTER JOIN qual propagation
*   #1422 Fix background worker error handling (segfault)
*   #1424 Fix ChunkAppend LIMIT pushdown
*   #1429 Fix expression index creation

**Thanks**

*   @shahidhk for reporting an issue with OUTER JOINs
*   @cossbow and @xxGL1TCHxx for reporting issues with ChunkAppend and space partitioning
*   @est for reporting an issue with CASE expressions in continuous aggregates
*   @devlucasc for reporting the issue with deleting a background worker while a job is running
*   @ryan-shaw for reporting an issue with expression indexes on hypertables with dropped columns

### 1.4.1 (2019-08-01)

This maintenance release contains bugfixes since the 1.4.0 release. We deem it medium
priority for upgrading.

In particular the fixes contained in this maintenance release address 2 potential
segfaults and no other security vulnerabilities. The bugfixes are related to queries
with prepared statements, PL/pgSQL functions and interoperability with other extensions.
More details below.

**Bug fixes**

*   #1362 Fix ConstraintAwareAppend subquery exclusion
*   #1363 Mark drop_chunks as VOLATILE and not PARALLEL SAFE
*   #1369 Fix ChunkAppend with prepared statements
*   #1373 Only allow PARAM_EXTERN as time_bucket_gapfill arguments
*   #1380 Handle Result nodes gracefully in ChunkAppend

**Thanks**

*   @overhacked for reporting an issue with drop_chunks and parallel queries
*   @fvannee for reporting an issue with ConstraintAwareAppend and subqueries
*   @rrb3942 for reporting a segfault with ChunkAppend and prepared statements
*   @mchesser for reporting a segfault with time_bucket_gapfill and subqueries
*   @lolizeppelin for reporting and helping debug an issue with ChunkAppend and Result nodes

### 1.4.0 (2019-07-18)

This release contains major new functionality for continuous aggregates
and adds performance improvements for analytical queries.

In version 1.3.0 we added support for continuous aggregates which
was initially limited to one continuous aggregate per hypertable.
With this release, we remove this restriction and allow multiple
continuous aggregates per hypertable.

This release adds a new custom node ChunkAppend that can perform
execution time constraint exclusion and is also used for ordered
append. Ordered append no longer requires a LIMIT clause and now
supports space partitioning and ordering by time_bucket.

For more information on this release, read the [announcement blog](https://blog.timescale.com/blog/timescaledb-1-4-introduces-better-performance-for-time-series-analytics/), [blog on implementing
constraint exclusion](https://blog.timescale.com/blog/implementing-constraint-exclusion-for-faster-query-performance/),
and [blog on using OrderedAppend](https://blog.timescale.com/blog/ordered-append-an-optimization-for-range-partitioning/).

**Major features**

*   #1270 Use ChunkAppend to replace Append nodes
*   #1257 Support for multiple continuous aggregates

**Minor features**

*   #1181 Remove LIMIT clause restriction from ordered append
*   #1273 Propagate quals to joined hypertables
*   #1317 Support time bucket functions in Ordered Append
*   #1331 Add warning message for REFRESH MATERIALIZED VIEW
*   #1332 Add job statistics columns to timescaledb_information.continuous_aggregate_stats view
*   #1326 Add architecture and bit size to telemetry

**Bug fixes**

*   #1288 Do not remove Result nodes with one-time filter
*   #1300 Fix telemetry report return value
*   #1339 Fix continuous agg catalog table insert failure
*   #1344 Update continuous agg bgw job start time

**Thanks**

*   @ik9999 for reporting a bug with continuous aggregates and negative refresh lag

### 1.3.2 (2019-06-24)

This maintenance release contains bug and security fixes since the 1.3.1 release. We deem it moderate-to-high priority for upgrading.

This release fixes some security vulnerabilities, specifically related to being able to elevate role-based permissions by database users that already have access to the database. We strongly recommend that users who rely on role-based permissions upgrade to this release as soon as possible.

**Security fixes**

*   #1311 Fix role-based permission checking logic

**Bug fixes**

*   #1315 Fix potentially lost invalidations in continuous aggs
*   #1303 Fix handling of types with custom time partitioning
*   #1299 Arm32: Fix Datum to int cast issue
*   #1297 Arm32: Fix crashes due to long handling
*   #1019 Add ARM32 tests on travis

**Thanks**

*   @hedayat for reporting the error with handling of types with custom time partitioning

### 1.3.1 (2019-06-10)

This maintenance release contains bugfixes since the 1.3.0 release.
We deem it low-to-moderate priority for upgrading.

In particular, the fixes contained in this maintenance release do not address any
security vulnerabilities, while the only one affecting system stability is related
to TimescaleDB running on PostgreSQL 11. More details below.

**Bug fixes**

*   #1220 Fix detecting JOINs for continuous aggs
*   #1221 Fix segfault in VACUUM on PG11
*   #1228 ARM32 Fix: Pass int64 using Int64GetDatum when a Datum is required
*   #1232 Allow Param as time_bucket_gapfill arguments
*   #1236 Stop preventing REFRESH in transaction blocks
*   #1283 Fix constraint exclusion for OUTER JOIN

**Thanks**

*   @od0 for reporting an error with continuous aggs and JOINs
*   @rickbatka for reporting an error when using time_bucket_gapfill in functions
*   @OneMoreSec for reporting the bug with VACUUM
*   @dvdrozdov @od0 @t0k4rt for reporting the issue with REFRESH in transaction blocks
*   @mhagander and @devrimgunduz for suggesting adding a CMAKE flag to control the default telemetry level

### 1.3.0 (2019-05-06)

This release contains major new functionality that we call continuous aggregates.

Aggregate queries which touch large swathes of time-series data can take a long
time to compute because the system needs to scan large amounts of data on every
query execution. Our continuous aggregates continuously calculate the
results of a query in the background and materialize the results. Queries to the
continuous aggregate view are then significantly faster as they do not need to
touch the raw data in the hypertable, instead using the pre-computed aggregates
in the view.

Continuous aggregates are somewhat similar to PostgreSQL materialized
views, but unlike a materialized view, continuous
aggregates do not need to be refreshed manually; the view is refreshed
automatically in the background as new data is added, or old data is
modified. Additionally, it does not need to re-calculate all of the data on
every refresh. Only new and/or invalidated data is calculated. Since this
re-aggregation is automatic, it doesn't add any maintenance burden to your
database.

Our continuous aggregate approach supports high-ingest rates by avoiding the
high-write amplification associated with trigger-based approaches. Instead,
we use invalidation techniques to track what data has changed, and then correct
the materialized aggregate the next time that the automated process executes.

For more information on this release, read our [blog on continuous aggregates](https://blog.timescale.com/blog/continuous-aggregates-faster-queries-with-automatically-maintained-materialized-views/), or visit
[our docs overview](/use-timescale/:currentVersion:/continuous-aggregates/).

**Major features**

*   #1184 Add continuous aggregate functionality

**Minor features**

*   #1005 Enable creating indexes with one transaction per chunk
*   #1007 Remove hypertable parent from query plans
*   #1038 Infer time_bucket_gapfill arguments from WHERE clause
*   #1062 Make constraint aware append parallel safe
*   #1067 Add treat_null_as_missing option to locf
*   #1112 Add support for window functions to gapfill
*   #1130 Add support for cross datatype chunk exclusion for time types
*   #1134 Add support for partitionwise aggregation
*   #1153 Add time_bucket support to chunk exclusion
*   #1170 Add functions for turning restoring on/off and setting license key
*   #1177 Add transformed time_bucket comparison to quals
*   #1182 Enable optimizing SELECTs within INSERTs
*   #1201 Add telemetry for policies: drop_chunk & reorder

**Bug fixes**

*   #1010 Add session locks to CLUSTER
*   #1115 Fix ordered append optimization for join queries
*   #1123 Fix gapfill with prepared statements
*   #1125 Fix column handling for columns derived from GROUP BY columns
*   #1132 Adjust ordered append path cost
*   #1155 Limit initial max_open_chunks_per_insert to PG_INT16_MAX
*   #1167 Fix postgres.conf ApacheOnly license
*   #1183 Handle NULL in a check constraint name
*   #1195 Fix cascade in scheduled drop chunks
*   #1196 Fix UPSERT with prepared statements

**Thanks**

*   @spickman for reporting a segfault with ordered append and JOINs
*   @comicfans for reporting a performance regression with ordered append
*   @Specter-Y for reporting a segfault with UPSERT and prepared statements
*   @erthalion submitting a bugfix for a segfault with validating check constraints

### 1.2.2 (2019-03-14)

This release contains bugfixes.

**Bug fixes**

*   #1097 Adjust ordered append plan cost
*   #1079 Stop background worker on ALTER DATABASE SET TABLESPACE and CREATE DATABASE WITH TEMPLATE
*   #1088 Fix ON CONFLICT when using prepared statements and functions
*   #1089 Fix compatibility with extensions that define planner_hook
*   #1057 Fix chunk exclusion constraint type inference
*   #1060 Fix sort_transform optimization

**Thanks**

*   @esatterwhite for reporting a bug when using timescaledb with zombodb
*   @eeeebbbbrrrr for fixing compatibility with extensions that also define planner_hook
*   @naquad for reporting a segfault when using ON conflict in stored procedures
*   @aaronkaplan for reporting an issue with ALTER DATABASE SET TABLESPACE
*   @quetz for reporting an issue with CREATE DATABASE WITH TEMPLATE
*   @nbouscal for reporting an issue with ordered append resulting in bad plans

### 1.2.1 (2019-02-11)

This release contains bugfixes.

**Notable commits**

*   [2f6b58a] Fix tlist on hypertable inserts inside CTEs
*   [7973b4a] Stop background worker on rename database
*   [32cc645] Fix loading the tsl license in parallel workers

**Thanks**

*   @jamessewell for reporting and helping debug a segfault in last() [034a0b0]
*   @piscopoc for reporting a segfault in time_bucket_gapfill [e6c68f8]

### 1.2.0 (2019-01-29)

**This is our first release to include Timescale-Licensed features, in addition to new Apache-2 capabilities.**

We are excited to be introducing new time-series analytical functions, advanced data lifecycle management capabilities, and improved performance.

*   **Time-series analytical functions**: Users can now use our `time_bucket_gapfill` function, to write complex gapfilling, last object carried forward, and interpolation queries.
*   **Advanced data lifecycle management**: We are introducing scheduled policies, which use our background worker framework to manage time-series data. In this release, we support scheduled `drop_chunks` and `reorder`.
*   **Improved performance**: We added support for ordered appends, which optimize a large range of queries - particularly those that are ordered by time and contain a LIMIT clause. Please note that ordered appends do not support ordering by `time_bucket` at this time.
*   **Postgres 11 Support**: We added beta support for PG11 in 1.1.0. We're happy to announce that our PG11 support is now out of beta, and fully supported.

This release adds code under a new license, LICENSE_TIMESCALE. This code can be found in `tsl`.

**For this release only**, you need to restart the database before running
`ALTER EXTENSION`

**Notable commits**

*   [a531733] switch cis state when we switch chunks
*   [5c6b619] Make a copy of the ri_onConflict object in PG11
*   [61e524e] Make slot for upserts be update for every chunk switch
*   [8a7c127] Fix for ExecSlotDescriptor during upserts
*   [fa61613] Change time_bucket_gapfill argument names
*   [01be394] Fix bgw_launcher restart when failing during launcher setup
*   [7b3929e] Add ordered append optimization
*   [a69f84c] Fix signal processing in background workers
*   [47b5b7d] Log which chunks are dropped by background workers
*   [4e1e15f] Add reorder command
*   [2e4bb5d] Recluster and drop chunks scheduling code
*   [ef43e52] Add alter_policy_schedule API function
*   [5ba740e] Add gapfill query support
*   [be7c74c] Add logic for automatic DB maintenance functions
*   [4ff6ac7] Initial Timescale-Licensed-Module and License-Key Implementation
*   [fc42539] Add new top-level licensing information
*   [31e9c5b] Fix time column handling in get_create_command
*   [1b8ceca] Avoid loading twice in parallel workers and load only from $libdir
*   [76d7875] Don't throw errors when extension is loaded but not installed yet
*   [eecd845] Add Timescale License (TSL)
*   [4b42b30] Free ChunkInsertStates when the es_per_tuple_exprcontext is freed

**Thanks**

*   @fordred for reporting our docker-run.sh script was out of date
*   @JpWebster for reporting a deadlock between reads an drop_chunks
*   @chickenburgers for reporting an issue with our CMake
*   Dimtrj and Asbjørn D., on slack, for creating a reproducible testcase for an UPSERT bug
*   @skebanga for reporting a loader bug

For more information on this release, read the [blog announcement](https://blog.timescale.com/blog/timescaledb-1-2-analytical-functions-advanced-data-lifecycle-management-improved-performance/) and
[blog on using `time_bucket_gapfill`, `interpolate`, and `locf`](https://blog.timescale.com/blog/sql-functions-for-time-series-analysis/).

### 1.1.1 (2018-12-20)

This release contains bugfixes.

**High-level changes**

*   Fix issue when upgrading with pg_upgrade
*   Fix a segfault that sometimes appeared in long COPYs
*   Other bug and stability fixes

**Notable commits**

*   [f99b540] Avoid loading twice in parallel workers and load only from $libdir
*   [e310f7d] Don't throw errors when extension is loaded but not installed yet
*   [8498416] Free ChunkInsertStates when the es_per_tuple_exprcontext is freed
*   [937eefe] Set C standard to C11

**Thanks**

*   @costigator for reporting the pg_upgrade bug
*   @FireAndIce68 for reporting the parallel workers issue
*   @damirda for reporting the copy bug

### 1.1.0 (2018-12-13)

Our 1.1 release introduces beta support for PG 11, as well as several performance optimizations aimed at improving chunk exclusion for read queries. We are also packaging our new timescale-tune tool (currently in beta) with our Debian and Linux releases. If you encounter any issues with our beta features, please file a GitHub issue.

**Potential breaking changes**

*   In addition to optimizing first() / last() to utilize indices for non-group-by queries, we adjusted its sorting behavior to match that of PostgreSQL's max() and min() functions. Previously, if the column being sorted had NULL values, a NULL would be returned. First() and last() now instead ignore NULL values.

**Notable commits**

*   [71f3a0c] Fix Datum conversion issues
*   [5aa1eda] Refactor compatibility functions and code to support PG11
*   [e4a4f8e] Add support for functions on open (time) dimensions
*   [ed5067c] Fix interval_from_now_to_internal timestamptz handling
*   [019971c] Optimize FIRST/LAST aggregate functions
*   [83014ee] Implement drop_chunks in C
*   [9a34028] Implement show_chunks in C and have drop_chunks use it
*   [d461959] Add view to show hypertable information
*   [35dee48] Remove version-checking from client-side
*   [5b6a5f4] Change size utility and job functions to STRICT
*   [7e55d91] Add checks for NULL arguments to DDL functions
*   [c1db608] Fix upsert TLE translation when mapping variable numbers
*   [55a378e] Check extension exists for DROP OWNED and DROP EXTENSION
*   [0c8c085] Exclude unneeded chunks for IN/ANY/ALL operators
*   [f27c0a3] Move int time_bucket functions with offset to C

**Thanks**

*   @did-g for some memory improvements

### 1.0.1 (2018-12-05)

This commit contains bugfixes and optimizations for 1.0.0

**Notable commits**

*   [6553aa4] Make a number of size utility functions to `STRICT`
*   [bb1d748] Add checks for NULL arguments to `set_adaptive_chunking`, `set_number_partitions`, `set_chunk_time_interval`, `add_dimension`, and `create_hypertable`
*   [a534ed4] Fix upsert TLE translation when mapping variable numbers
*   [aecd55b] Check extension exists for DROP OWNED and DROP EXTENSION

### 1.0.0 (2018-10-30)

**This is our 1.0 release!**

For notable commits between 0.12.0/0.12.1 and this final 1.0 release, please see previous entries for the release candidates (rc1, rc2, and rc3).

**Thanks**
To all the external contributors who helped us debug the release candidates, as well as anyone who has contributed bug reports, PRs, or feedback on Slack, GitHub, and other channels. All input has been valuable and helped us create the product we have today!

**Potential breaking changes**

*   To better align with the ISO standard so that time bucketing starts each week by default on a Monday (rather than Saturday), the `time_bucket` epoch/origin has been changed from January 1, 2000 to January 3, 2000.  The function now includes an `origin` parameter that can be used to adjust this.
*   Error codes are now prefixed with `TS` instead of the prior `IO` prefix. If you were checking for these error codes by name, please update your code.

For more information on this release, read the [blog announcement](https://blog.timescale.com/blog/1-0-enterprise-production-ready-time-series-database-open-source-d32395a10cbf/).

**For releases prior to 1.0, please visit the [changelog](https://github.com/timescale/timescaledb/blob/master/CHANGELOG.md).**

[whats-new]: /about/:currentVersion:/release-notes/#what-x27-s-new-in-timescaledb-2-8/
[compress-data]: /use-timescale/:currentVersion:/compression/
[distributed-hypertables]: /use-timescale/:currentVersion:/distributed-hypertables/
[distributed-hypertables-setup]: /self-hosted/:currentVersion:/multi-node-setup/
[github-issue]: <https://github.com/timescale/timescaledb/issues/new/choose>
[github-repo]: <https://github.com/timescale/timescaledb>
[community]: https://www.timescale.com/community/
[changelog]: /about/:currentVersion:/changelog/