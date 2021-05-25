# TimescaleDB release notes and future plans

Interested in what's coming down the pipeline? Review our
Future Plans section. Interested in learning more about
what's already available? Jump down below to see what's
been released.

## Future plans

TimescaleDB is an open-source project with a vibrant community.
We are currently focusing on making our priorities known by that community;
we welcome you to visit our Github repo or join our [Slack community](https://slack.timescale.com).

### What to expect from our next release

For our next release, we plan to add:

- Downgrading between Timescale DB 2.x versions.
- High Availability: Adding nodes to a multinode cluster.
- Various bug fixes.

The current GA (Generally Available) version is 2.3.0.

You can read more about our architecture and design for distributed hypertables
[here][distributed-hypertables].

If you have questions about distributed hypertables, join our #multinode channel on
[community slack](https://slack.timescale.com/) for installation details and
follow these [setup instructions][distributed-hypertables-setup].

In addition to multi-node, we've also reassessed how some core
functionality works, and, as a result, made APIs simpler and more consistent,
while also empowering users with more control and flexibility to customize
behaviors to suit your needs.  Some of these API updates are **breaking changes**.

### What's new in TimescaleDB 2.3.0:

Skip Scan optimization on single node and multinode. This feature offers significant
improvements in performance of `SELECT` queries with `DISTINCT ON`.

This release also adds support for creating distributed
restore points. This allows performing consistent restores of
multi-node clusters from a backup.

The bug fixes in this release address issues in size and stats
functions, high memory usage in distributed inserts, slow distributed
ORDER BY queries, indexes involving INCLUDE, single chunk query
planning, compression, and policies.

**PostgreSQL 11 deprecation announcement**

Timescale is working hard on our next exciting features. 
To make that possible, we require functionality that is unfortunately absent on
PostgreSQL 11. 
For this reason, Timescale DB 2.3 will be the last version supporting PostgreSQL 11. 
From TimescaleDB 2.4 forward we will no longer support PostgreSQL 11.

<highlight type="tip">
TimescaleDB 2.3 is currently GA, and we encourage
users to upgrade in testing environments to gain experience and provide feedback on
new and updated features.

Especially because some API updates from TimescaleDB 1.x to 2.0 are breaking changes,
we recommend reviewing the [Changes in TimescaleDB 2.0](/timescaledb/latest/overview/release-notes/changes-in-timescaledb-2/)
for more information and links to installation instructions when upgrading from TimescaleDB 1.x.
</highlight>

## Release notes

In this section, we will cover historical information on
past releases and how you can learn more.

**Please note: When updating your database, you should connect using
`psql` with the `-X` flag to prevent any `.psqlrc` commands from
accidentally triggering the load of a previous DB version.**

## Unreleased

## 2.3.0 (2021-05-25)
TBD

## 2.2.1 (2021-05-05)

This maintenance release contains bugfixes since the 2.2.0 release. We
deem it high priority for upgrading.

This release extends Skip Scan to multinode by enabling the pushdown
of `DISTINCT` to data nodes. It also fixes a number of bugs in the
implementation of Skip Scan, in distributed hypertables, in creation
of indexes, in compression, and in policies.

**Features**
* #3113 Pushdown "SELECT DISTINCT" in multi-node to allow use of Skip
  Scan

**Bugfixes**
* #3101 Use commit date in `get_git_commit()`
* #3102 Fix `REINDEX TABLE` for distributed hypertables
* #3104 Fix use after free in `add_reorder_policy`
* #3106 Fix use after free in `chunk_api_get_chunk_stats`
* #3109 Copy recreated object permissions on update
* #3111 Fix `CMAKE_BUILD_TYPE` check
* #3112 Use `%u` to format Oid instead of `%d`
* #3118 Fix use after free in cache
* #3123 Fix crash while using `REINDEX TABLE CONCURRENTLY`
* #3135 Fix SkipScan path generation in `DISTINCT` queries with expressions
* #3146 Fix SkipScan for IndexPaths without pathkeys
* #3147 Skip ChunkAppend if AppendPath has no children
* #3148 Make `SELECT DISTINCT` handle non-var targetlists
* #3151 Fix `fdw_relinfo_get` assertion failure on `DELETE`
* #3155 Inherit `CFLAGS` from PostgreSQL
* #3169 Fix incorrect type cast in compression policy
* #3183 Fix segfault in calculate_chunk_interval
* #3185 Fix wrong datatype for integer based retention policy

**Thanks**
* @Dead2, @dv8472 and @einsibjarni for reporting an issue with multinode queries and views
* @aelg for reporting an issue with policies on integer-based hypertables
* @hperez75 for reporting an issue with Skip Scan
* @nathanloisel for reporting an issue with compression on hypertables with integer-based timestamps
* @xin-hedera for fixing an issue with compression on hypertables with integer-based timestamps

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
PostgreSQL 11. For this reason, we will continue supporting PostgreSQL
11 until mid-June 2021. Sooner to that time, we will announce the
specific version of TimescaleDB in which PostgreSQL 11 support will
not be included going forward.

**Major features**
* #2843 Add distributed restore point functionality
* #3000 SkipScan to speed up SELECT DISTINCT

**Bug fixes**
* #2989 Refactor and harden size and stats functions
* #3058 Reduce memory usage for distributed inserts
* #3067 Fix extremely slow multi-node order by queries
* #3082 Fix chunk index column name mapping
* #3083 Keep Append pathkeys in ChunkAppend

**Thanks**
* @BowenGG for reporting an issue with indexes with INCLUDE
* @fvannee for reporting an issue with ChunkAppend pathkeys
* @pedrokost and @RobAtticus for reporting an issue with size
  functions on empty hypertables
* @phemmer and @ryanbooz for reporting issues with slow
  multi-node order by queries
* @stephane-moreau for reporting an issue with high memory usage during
  single-transaction inserts on a distributed hypertable.

## 2.1.1 (2021-03-29)

This maintenance release contains bugfixes since the 2.1.0 release. We
deem it high priority for upgrading.

The bug fixes in this release address issues with CREATE INDEX and
UPSERT for hypertables, custom jobs, and gapfill queries.

This release marks TimescaleDB as a trusted extension in PG13, so that
superuser privileges are not required anymore to install the extension.

**Minor features**
* #2998 Mark timescaledb as trusted extension

**Bug fixes**
* #2948 Fix off by 4 error in histogram deserialize
* #2974 Fix index creation for hypertables with dropped columns
* #2990 Fix segfault in job_config_check for cagg
* #2987 Fix crash due to txns in emit_log_hook_callback
* #3042 Commit end transaction for CREATE INDEX
* #3053 Fix gapfill/hashagg planner interaction
* #3059 Fix UPSERT on hypertables with columns with defaults

**Thanks**
* @eloyekunle and @kitwestneat for reporting an issue with UPSERT
* @jocrau for reporting an issue with index creation
* @kev009 for fixing a compilation issue
* @majozv and @pehlert for reporting an issue with time_bucket_gapfill

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
* #2779 Add support for PostgreSQL 13

**Minor features**
* #2736 Support adding columns to hypertables with compression enabled
* #2909 Support renaming columns of hypertables with compression enabled

## 2.0.2 (2021-02-19)

This maintenance release contains bugfixes since the 2.0.1 release. We
deem it high priority for upgrading.

The bug fixes in this release address issues with joins, the status of
background jobs, and disabling compression. It also includes
enhancements to continuous aggregates, including improved validation
of policies and optimizations for faster refreshes when there are a
lot of invalidations.

**Minor features**
* #2926 Optimize cagg refresh for small invalidations

**Bugfixes**
* #2850 Set status for backend in background jobs
* #2883 Fix join qual propagation for nested joins
* #2884 Add GUC to control join qual propagation
* #2885 Fix compressed chunk check when disabling compression
* #2908 Fix changing column type of clustered hypertables
* #2942 Validate continuous aggregate policy

**Thanks**
* @zeeshanshabbir93 for reporting an issue with joins
* @Antiarchitect for reporting the issue with slow refreshes of
  continuous aggregates.
* @diego-hermida for reporting the issue about being unable to disable
  compression
* @mtin for reporting the issue about wrong job status

## 1.7.5 (2021-02-12)

This maintenance release contains bugfixes since the 1.7.4 release.
Most of these fixes were backported from the 2.0.0 and 2.0.1 releases.
We deem it high priority for upgrading for users on TimescaleDB 1.7.4
or previous versions.

In particular the fixes contained in this maintenance release address
issues in continuous aggregates, compression, JOINs with hypertables,
and when upgrading from previous versions.

**Bug fixes**
* #2502 Replace check function when updating
* #2558 Repair dimension slice table on update
* #2619 Fix segfault in decompress_chunk for chunks with dropped
  columns
* #2664 Fix support for complex aggregate expression
* #2800 Lock dimension slices when creating new chunk
* #2860 Fix projection in ChunkAppend nodes
* #2865 Apply volatile function quals at decompresschunk
* #2851 Fix nested loop joins that involve compressed chunks
* #2868 Fix corruption in gapfill plan
* #2883 Fix join qual propagation for nested joins
* #2885 Fix compressed chunk check when disabling compression
* #2920 Fix repair in update scripts

**Thanks**
* @akamensky for reporting several issues including segfaults after
  version update
* @alex88 for reporting an issue with joined hypertables
* @dhodyn for reporting an issue when joining compressed chunks
* @diego-hermida for reporting an issue with disabling compression
* @Netskeh for reporting bug on time_bucket problem in continuous
  aggregates
* @WarriorOfWire for reporting the bug with gapfill queries not being
  able to find pathkey item to sort
* @zeeshanshabbir93 for reporting an issue with joins

## 2.0.1 (2021-01-28)

This maintenance release contains bugfixes since the 2.0.0 release.
We deem it high priority for upgrading.

In particular the fixes contained in this maintenance release address
issues in continuous aggregates, compression, JOINs with hypertables
and when upgrading from previous versions.

**Bugfixes**
* #2772 Always validate existing database and extension
* #2780 Fix config enum entries for remote data fetcher
* #2806 Add check for dropped chunk on update
* #2828 Improve cagg watermark caching
* #2838 Fix catalog repair in update script
* #2842 Do not mark job as started when setting next_start field
* #2845 Fix continuous aggregate privileges during upgrade
* #2851 Fix nested loop joins that involve compressed chunks
* #2860 Fix projection in ChunkAppend nodes
* #2861 Remove compression stat update from update script
* #2865 Apply volatile function quals at decompresschunk node
* #2866 Avoid partitionwise planning of partialize_agg
* #2868 Fix corruption in gapfill plan
* #2874 Fix partitionwise agg crash due to uninitialized memory

**Thanks**
* @alex88 for reporting an issue with joined hypertables
* @brian-from-quantrocket for reporting an issue with extension update and dropped chunks
* @dhodyn for reporting an issue when joining compressed chunks
* @markatosi for reporting a segfault with partitionwise aggregates enabled
* @PhilippJust for reporting an issue with add_job and initial_start
* @sgorsh for reporting an issue when using pgAdmin on windows
* @WarriorOfWire for reporting the bug with gapfill queries not being
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
launched within Timescale's fully-managed cloud services.

This release also adds:

* Support for user-defined actions, allowing users to define,
  customize, and schedule automated tasks, which can be run by the
  built-in jobs scheduling framework now exposed to users.
* Significant changes to continuous aggregates, which now separate the
  view creation from the policy.  Users can now refresh individual
  regions of the continuous aggregate materialized view, or schedule
  automated refreshing via  policy.
* Redesigned informational views, including new (and more general)
  views for information about hypertable's dimensions and chunks,
  policies and user-defined actions, as well as support for multi-node
  TimescaleDB.
* Moving all formerly enterprise features into our Community Edition,
  and updating Timescale License, which now provides additional (more
  permissive) rights to users and developers.

Some of the changes above (e.g., continuous aggregates, updated
informational views) do introduce breaking changes to APIs and are not
backwards compatible. While the update scripts in TimescaleDB 2.0 will
upgrade databases running TimescaleDB 1.x automatically, some of these
API and feature changes may require changes to clients and/or upstream
scripts that rely on the previous APIs.  Before upgrading, we recommend
reviewing upgrade documentation at docs.timescale.com for more details.

**Major features**

TimescaleDB 2.0 moves the following major features to GA:
* #1923 Add support for distributed hypertables
* #2006 Add support for user-defined actions
* #2125 #2221 Improve Continuous Aggregate API
* #2084 #2089 #2098 #2417 Redesign informational views
* #2435 Move enterprise features to community
* #2437 Update Timescale License

**Previous release candidates**

* #2702 Release Candidate 4 (December 2, 2020)
* #2637 Release Candidate 3 (November 12, 2020)
* #2554 Release Candidate 2 (October 20, 2020)
* #2478 Release Candidate 1 (October 1, 2020)

**Minor features**

Since the last release candidate 4, there are several minor
improvements:
* #2746 Optimize locking for create chunk API
* #2705 Block tableoid access on distributed hypertable
* #2730 Do not allow unique index on compressed hypertables
* #2764 Bootstrap data nodes with versioned extension

**Bug fixes**

Since the last release candidate 4, there are several bugfixes:
* #2719 Support disabling compression on distributed hypertables
* #2742 Fix compression status in chunks view for distributed chunks
* #2751 Fix crash and cancel when adding data node
* #2763 Fix check constraint on hypertable metadata table

**Thanks**

Thanks to all contributors for the TimescaleDB 2.0 release:
* @airton-neto for reporting a bug in executing some queries with UNION
* @nshah14285 for reporting an issue with propagating privileges
* @kalman5 for reporting an issue with renaming constraints
* @LbaNeXte for reporting a bug in decompression for queries with
  subqueries
* @semtexzv for reporting an issue with continuous aggregates on
  int-based hypertables
* @mr-ns for reporting an issue with privileges for creating chunks
* @cloud-rocket for reporting an issue with setting an owner on
  continuous aggregate
* @jocrau for reporting a bug during creating an index with transaction
  per chunk
* @fvannee for reporting an issue with custom time types
* @ArtificialPB for reporting a bug in executing queries with
  conditional ordering on compressed hypertable
* @dutchgecko for reporting an issue with continuous aggregate datatype
  handling
* @lambdaq for suggesting to improve error message in continuous
  aggregate creation
* @francesco11112 for reporting memory issue on COPY
* @Netskeh for reporting bug on time_bucket problem in continuous
  aggregates
* @mr-ns for reporting the issue with CTEs on distributed hypertables
* @akamensky for reporting an issue with recursive cache invalidation
* @ryanbooz for reporting slow queries with real-time aggregation on
  continuous aggregates
* @cevian for reporting an issue with disabling compression on
  distributed hypertables

## 2.0.0-rc4 (2020-12-02)

This release candidate contains bugfixes since the previous release
candidate, as well as additional minor features. It improves
validation of configuration changes for background jobs, adds support
for gapfill on distributed tables, contains improvements to the memory
handling for large COPY, and contains improvements to compression for
distributed hypertables.

**Minor features**
* #2689 Check configuration in alter_job and add_job
* #2696 Support gapfill on distributed hypertable
* #2468 Show more information in get_git_commit
* #2678 Include user actions into job stats view
* #2664 Fix support for complex aggregate expression
* #2672 Add hypertable to continuous aggregates view
* #2662 Save compression metadata settings on access node
* #2707 Introduce additional db for data node bootstrapping

**Bug fixes**
* #2688 Fix crash for concurrent drop and compress chunk
* #2666 Fix timeout handling in async library
* #2683 Fix crash in add_job when given NULL interval
* #2698 Improve memory handling for remote COPY
* #2555 Set metadata for chunks compressed before 2.0

**Thanks**
* @francesco11112 for reporting memory issue on COPY
* @Netskeh for reporting bug on time_bucket problem in continuous
  aggregates

## 2.0.0-rc3 (2020-11-12)

This release candidate contains bugfixes since the previous release
candidate, as well as additional minor features including support for
"user-mapping" authentication between access/data nodes and an
experimental API for refreshing continuous aggregates on individual
chunks.

**Minor features**
* #2627 Add optional user mappings support
* #2635 Add API to refresh continuous aggregate on chunk

**Bug fixes**
* #2560 Fix SCHEMA DROP CASCADE with continuous aggregates
* #2593 Set explicitly all lock parameters in alter_job
* #2604 Fix chunk creation on hypertables with foreign key constraints
* #2610 Support analyze of internal compression table
* #2612 Optimize internal cagg_watermark function
* #2613 Refresh correct partial during refresh on drop
* #2617 Fix validation of available extensions on data node
* #2619 Fix segfault in decompress_chunk for chunks with dropped columns
* #2620 Fix DROP CASCADE for continuous aggregate
* #2625 Fix subquery errors when using AsyncAppend
* #2626 Fix incorrect total_table_pages setting for compressed scan
* #2628 Stop recursion in cache invalidation

**Thanks**
* @mr-ns for reporting the issue with CTEs on distributed hypertables
* @akamensky for reporting an issue with recursive cache invalidation
* @ryanbooz for reporting slow queries with real-time aggregation on
  continuous aggregates

## 2.0.0-rc2 (2020-10-21)

This release candidate contains bugfixes since the previous release candidate.

**Minor features**
* #2520 Support non-transactional distibuted_exec

**Bug fixes**
* #2307 Overflow handling for refresh policy with integer time
* #2503 Remove error for correct bootstrap of data node
* #2507 Fix validation logic when adding a new data node
* #2510 Fix outer join qual propagation
* #2514 Lock dimension slices when creating new chunk
* #2515 Add if_attached argument to detach_data_node()
* #2517 Fix member access within misaligned address in chunk_update_colstats
* #2525 Fix index creation on hypertables with dropped columns
* #2543 Pass correct status to lock_job
* #2544 Assume custom time type range is same as bigint
* #2563 Fix DecompressChunk path generation
* #2564 Improve continuous aggregate datatype handling
* #2568 Change use of ssl_dir GUC
* #2571 Make errors and messages conform to style guide
* #2577 Exclude compressed chunks from ANALYZE/VACUUM

## 2.0.0-rc1 (2020-10-06)

This release adds major new features and bugfixes since the 1.7.4 release.
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
- Redefined functions for policies
- A continuous aggregate is now created with `CREATE MATERIALIZED VIEW`
  instead of `CREATE VIEW` and automated refreshing requires adding a policy
  via `add_continuous_aggregate_policy`
- Redesign of informational views, including new (and more general) views for
  information about policies and user-defined actions

This release candidate is upgradable, so if you are on a previous release (e.g., 1.7.4)
you can upgrade to the release candidate and later expect to be able to upgrade to the
final 2.0 release. However, please carefully consider your compatibility requirements
_before_ upgrading.

**Major features**
* #1923 Add support for distributed hypertables
* #2006 Add support for user-defined actions
* #2435 Move enterprise features to community
* #2437 Update Timescale License

**Minor features**
* #2011 Constify TIMESTAMPTZ OP INTERVAL in constraints
* #2105 Support moving compressed chunks

**Bug fixes**
* #1843 Improve handling of "dropped" chunks
* #1886 Change ChunkAppend leader to use worker subplan
* #2116 Propagate privileges from hypertables to chunks
* #2263 Fix timestamp overflow in time_bucket optimization
* #2270 Fix handling of non-reference counted TupleDescs in gapfill
* #2325 Fix rename constraint/rename index
* #2370 Fix detection of hypertables in subqueries
* #2376 Fix caggs width expression handling on int based hypertables
* #2416 Check insert privileges to create chunk
* #2428 Allow owner change of continuous aggregate
* #2436 Propagate grants in continuous aggregates

### 1.7.4 (2020-09-08)

This maintenance release contains bugfixes since the 1.7.3 release. We deem it
high priority for upgrading if TimescaleDB is deployed with replicas (synchronous
or asynchronous).

In particular the fixes contained in this maintenance release address an issue with
running queries on compressed hypertables on standby nodes.

**Bugfixes**
* #2336 Remove tuple lock on select path

The music for this release was Rufus and Chaka Khan's 1974 classic _Rags to Rufus_.

### 1.7.3 (2020-08-27)

This maintenance release contains bugfixes since the 1.7.2 release. We deem it high
priority for upgrading.

In particular the fixes contained in this maintenance release address issues in compression,
drop_chunks and the background worker scheduler.

**Bug fixes**
* #2059 Improve inferring start and stop arguments from gapfill query
* #2067 Support moving compressed chunks
* #2068 Apply SET TABLESPACE for compressed chunks
* #2090 Fix index creation with IF NOT EXISTS for existing indexes
* #2092 Fix delete on tables involving hypertables with compression
* #2164 Fix telemetry installed_time format
* #2184 Fix background worker scheduler memory consumption
* #2222 Fix `negative bitmapset member not allowed` in decompression
* #2255 Propagate privileges from hypertables to chunks
* #2256 Fix segfault in chunk_append with space partitioning
* #2259 Fix recursion in cache processing
* #2261 Lock dimension slice tuple when scanning

**Thanks**
* @akamensky for reporting an issue with drop_chunks and ChunkAppend with space partitioning
* @dewetburger430 for reporting an issue with setting tablespace for compressed chunks
* @fvannee for reporting an issue with cache invalidation
* @nexces for reporting an issue with ChunkAppend on space-partitioned hypertables
* @PichetGoulu for reporting an issue with index creation and IF NOT EXISTS
* @prathamesh-sonpatki for contributing a typo fix
* @sezaru for reporting an issue with background worker scheduler memory consumption

The music for this release was Bob Dylan's _Blonde on Blonde_.

### 1.7.2 (2020-07-07)

This maintenance release contains bugfixes since the 1.7.1 release. We deem it medium
priority for upgrading.

In particular the fixes contained in this maintenance release address bugs in continuous
aggregates, drop_chunks and compression.

**Features**
* #1877 Add support for fast pruning of inlined functions

**Bug fixes**
* #1908 Fix drop_chunks with unique constraints when cascade_to_materializations is false
* #1915 Check for database in extension_current_state
* #1918 Unify chunk index creation
* #1932 Change compression locking order
* #1938 Fix gapfill locf treat_null_as_missing
* #1982 Check for disabled telemetry earlier
* #1984 Fix compression bit array left shift count
* #1997 Add checks for read-only transactions
* #2002 Reset restoring gucs rather than explicitly setting 'off'
* #2028 Fix locking in drop_chunks
* #2031 Enable compression for tables with compound foreign key
* #2039 Fix segfault in create_trigger_handler
* #2043 Fix segfault in cagg_update_view_definition
* #2046 Use index tablespace during chunk creation
* #2047 Better handling of chunk insert state destruction
* #2049 Fix handling of PlaceHolderVar in DecompressChunk
* #2051 Fix tuple concurrently deleted error with multiple continuous aggregates

**Thanks**
* @akamensky for reporting an issue with telemetry and an issue with drop_chunks
* @darko408 for reporting an issue with decompression
* @Dmitri191 for reporting an issue with failing background workers
* @eduardotsj for reporting an issue with indexes not inheriting tablespace settings
* @FourSeventy for reporting an issue with multiple continuous aggregrates
* @fvannee for contributing optimizations for pruning inlined functions
* @jflambert for reporting an issue with failing telemetry jobs
* @nbouscal for reporting an issue with compression jobs locking referenced tables
* @Nicolai6120 for reporting an issue with locf and treat_null_as_missing
* @NomAnor for reporting an issue with expression index with table references
* @Olernov for contributing a fix for compressing tables with compound foreign keys
* @werjo for reporting an issue with drop_chunks and unique constraints

The music for this release was David Bowie's _The Rise and Fall of Ziggy Stardust and the Spiders From Mars_.

### 1.7.1 (2020-05-18)

This maintenance release contains bugfixes since the 1.7.0 release. We deem it medium
priority for upgrading and high priority for users with multiple continuous aggregates.

In particular the fixes contained in this maintenance release address bugs in continuous
aggregates with real-time aggregation and PostgreSQL 12 support.

**Bug fixes**
* #1834 Define strerror() for Windows
* #1846 Fix segfault on COPY to hypertable
* #1850 Fix scheduler failure due to bad next_start_time for jobs
* #1851 Fix hypertable expansion for UNION ALL
* #1854 Fix reorder policy job to skip compressed chunks
* #1861 Fix qual pushdown for compressed hypertables where quals have casts
* #1864 Fix issue with subplan selection in parallel ChunkAppend
* #1868 Add support for WHERE, HAVING clauses with real time aggregates
* #1869 Fix real time aggregate support for multiple continuous aggregates
* #1871 Don't rely on timescaledb.restoring for upgrade
* #1875 Fix hypertable detection in subqueries
* #1884 Fix crash on SELECT WHERE NOT with empty table

**Thanks**
* @airton-neto for reporting an issue with queries over UNIONs of hypertables
* @dhodyn for reporting an issue with UNION ALL queries
* @frostwind for reporting an issue with casts in where clauses on compressed hypertables
* @fvannee for reporting an issue with hypertable detection in inlined SQL functions and an issue with COPY
* @hgiasac for reporting missing where clause with real time aggregates
* @louisth for reporting an issue with real-time aggregation and multiple continuous aggregates
* @michael-sayapin for reporting an issue with INSERTs and WHERE NOT EXISTS
* @Olernov for reporting and fixing an issue with compressed chunks in the reorder policy
* @pehlert for reporting an issue with pg_upgrade

The music for this release was the Rolling Stone's _Sticky Fingers_.

### 1.7.0 (2020-04-16)

This release adds major new features and bugfixes since the 1.6.1 release.
We deem it moderate priority for upgrading.

This release adds the long-awaited support for PostgreSQL 12 to TimescaleDB.

This release also adds a new default behavior when querying continuous
aggregates that we call real-time aggregation. A query on a continuous
aggregate will now combine materialized data with recent data that has
yet to be materialized.

Note that only newly created continuous aggregates will have this real-time
query behavior, although it can be enabled on existing continuous aggregates
with a configuration setting as follows:

ALTER VIEW continuous_view_name SET (timescaledb.materialized_only=false);

This release also moves several data management lifecycle features to the
Community version of TimescaleDB (from Enterprise), including data reordering
and data retention policies.

**Deprecation notice:**  Please note that with the release of Timescale 1.7, we are deprecating support for PostgreSQL 9.6.x and 10.x.
The current plan is that the Timescale 2.0 release later this year will only support PostgreSQL major versions 11.x, 12.x, or newer.

**Major features**
* #1807 Add support for PostgreSQL 12
* #1685 Add support for real-time aggregation on continuous aggregates

**Bug fixes**
* #1665 Add ignore_invalidation_older_than to timescaledb_information.continuous_aggregates view
* #1750 Handle undefined ignore_invalidation_older_than
* #1757 Restrict watermark to max for continuous aggregates
* #1769 Add rescan function to CompressChunkDml CustomScan node
* #1785 Fix last_run_success value in continuous_aggregate_stats view
* #1801 Include parallel leader in plan execution
* #1808 Fix ts_hypertable_get_all for compressed tables
* #1828 Ignore dropped chunks in compressed_chunk_stats

**Licensing changes**
Reorder and policies around reorder and drop chunks are now accessible to community users, not just enterprise
Gapfill functionality no longer warns about expired license

**Thanks**
* @t0k4rt for reporting an issue with parallel chunk append plans
* @alxndrdude for reporting an issue when trying to insert into compressed chunks
* @Olernov for reporting and fixing an issue with show_chunks and drop_chunks for compressed hypertables
* @mjb512 for reporting an issue with INSERTs in CTEs in cached plans
* @dmarsh19 for reporting and fixing an issue with dropped chunks in compressed_chunk_stats

### 1.6.1 (2020-03-18)

This maintenance release contains bugfixes since the 1.6.0 release. We deem it medium priority
for upgrading.

In particular the fixes contained in this maintenance release address bugs in continuous aggregates, time_bucket_gapfill,
partial index handling and drop_chunks.

For this release only, you will need to restart the database after upgrade before restoring a backup.

**Minor features**
* #1666 Support drop_chunks API for continuous aggregates
* #1711 Change log level for continuous aggregate materialization messages

**Bug fixes**
* #1630 Print notice for COPY TO on hypertable
* #1648 Drop chunks from materialized hypertable
* #1668 Cannot add dimension if hypertable has empty chunks
* #1673 Fix crash when interrupting create_hypertable
* #1674 Fix time_bucket_gapfill's interaction with GROUP BY
* #1686 Fix order by queries on compressed hypertables that have char segment by column
* #1687 Fix issue with disabling compression when foreign keys are present
* #1688 Handle many BGW jobs better
* #1698 Add logic to ignore dropped chunks in hypertable_relation_size
* #1704 Fix bad plan for continuous aggregate materialization
* #1709 Prevent starting background workers with NOLOGIN
* #1713 Fix miscellaneous background worker issues
* #1715 Fix issue with overly aggressive chunk exclusion in outer joins
* #1719 Fix restoring/scheduler entrypoint to avoid BGW death
* #1720 Add scheduler cache invalidations
* #1727 Fix compressing INTERVAL columns
* #1728 Handle Sort nodes in ConstraintAwareAppend
* #1730 Fix partial index handling on hypertables
* #1739 Use release OpenSSL DLLs for debug builds on Windows
* #1740 Fix invalidation entries from multiple caggs on same hypertable
* #1743 Fix continuous aggregate materialization timezone handling
* #1748 Fix remove_drop_chunks_policy for continuous aggregates
* #1756 Fix handling of dropped chunks in compression background worker

**Thanks**
* @RJPhillips01 for reporting an issue with drop chunks.
* @b4eEx for reporting an issue with disabling compression.
* @darko408 for reporting an issue with order by on compressed hypertables
* @mrechte for reporting an issue with compressing INTERVAL columns
* @tstaehli for reporting an issue with ConstraintAwareAppend
* @chadshowalter for reporting an issue with partial index on hypertables
* @geoffreybennett for reporting an issue with create_hypertable when interrupting operations
* @alxndrdude for reporting an issue with background workers during restore
* @zcavaliero for reporting and fixing an issue with dropped columns in hypertable_relation_size
* @ismailakpolat for reporting an issue with cagg materialization on hypertables with TIMESTAMP column

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
aggregates. This parameter accept a time-interval (e.g. 1 month). If set,
it limits the amount of time for which to process invalidation. Thus, if
timescaledb.ignore_invalidation_older_than = '1 month', then any modifications
for data older than 1 month from the current timestamp at modification time may
not cause continuous aggregate to be updated. This limits the amount of work
that a backfill can trigger. By default, all invalidations are processed.

For more information on this release, read the [announcement blog](https://blog.timescale.com/blog/timescaledb-1-6-data-retention-policies-for-continuous-aggregates/)
and [blog on downsampling](https://blog.timescale.com/blog/how-to-proactively-manage-long-term-data-storage-with-downsampling/).

**Major features**
* #1589 Allow drop_chunks while keeping continuous aggregates

**Minor features**
* #1568 Add ignore_invalidation_older_than option to continuous aggs
* #1575 Reorder group-by clause for continuous aggregates
* #1592 Improve continuous agg user messages

**Bug fixes**
* #1565 Fix partial select query for continuous aggregate
* #1591 Fix locf treat_null_as_missing option
* #1594 Fix error in compression constraint check
* #1603 Add join info to compressed chunk
* #1606 Fix constify params during runtime exclusion
* #1607 Delete compression policy when drop hypertable
* #1608 Add jobs to timescaledb_information.policy_stats
* #1609 Fix bug with parent table in decompression
* #1624 Fix drop_chunks for ApacheOnly
* #1632 Check for NULL before dereferencing variable

**Thanks**
* @optijon for reporting an issue with locf treat_null_as_missing option
* @acarrera42 for reporting an issue with constify params during runtime exclusion
* @ChristopherZellermann for reporting an issue with the compression constraint check
* @SimonDelamare for reporting an issue with joining hypertables with compression

### 1.5.1 (2019-11-12)

This maintenance release contains bugfixes since the 1.5.0 release. We deem it low
priority for upgrading.

In particular the fixes contained in this maintenance release address potential
segfaults and no other security vulnerabilities. The bugfixes are related to bloom
indexes and updates from previous versions.

**Bugfixes**
* #1523 Fix bad SQL updates from previous updates
* #1526 Fix hypertable model
* #1530 Set active snapshots in multi-xact index create

**Thanks**
* @84660320 for reporting an issue with bloom indexes
* @gumshoes @perhamm @jermudgeon @gmisagm for reporting the issue with updates

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

This release also adds support for basic data tiering by supporting
the migration of chunks between tablespaces, as well as support for
parallel query coordination to the ChunkAppend node.
Previously ChunkAppend would rely on parallel coordination in the
underlying scans for parallel plans.

For more information on this release, read the [announcement blog](https://blog.timescale.com/blog/building-columnar-compression-in-a-row-oriented-database), this [tutorial](https://docs.timescale.com/latest/tutorials/compression-tutorial),
and the [blog on data tiering](https://blog.timescale.com/blog/optimize-your-storage-costs-with-timescaledbs-data-tiering-functionality/).

**For this release only**, you will need to restart the database before running
`ALTER EXTENSION`

**Major features**
* #1393 Moving chunks between different tablespaces
* #1433 Make ChunkAppend parallel aware
* #1434 Introducing native compression, multiple compression algorithms, and hybrid row/columnar projections

**Minor features**
* #1471 Allow setting reloptions on chunks
* #1479 Add next_start option to alter_job_schedule
* #1481 Add last_successful_finish to bgw_job_stats

**Bug fixes**
* #1444 Prevent LIMIT pushdown in JOINs
* #1447 Fix runtime exclusion memory leak
* #1464 Fix ordered append with expressions in ORDER BY clause with space partitioning
* #1476 Fix logic for BGW rescheduling
* #1477 Fix gapfill treat_null_as_missing
* #1493 Prevent recursion in invalidation processing
* #1498 Fix overflow in gapfill's interpolate
* #1499 Fix error for exported_uuid in pg_restore
* #1503 Fix bug with histogram function in parallel

**Thanks**
* @dhyun-obsec for reporting an issue with pg_restore
* @rhaymo for reporting an issue with interpolate
* @optijon for reporting an issue with locf treat_null_as_missing
* @favnee for reporting an issue with runtime exclusion
* @Lectem for reporting an issue with histograms
* @rogerdwan for reporting an issue with BGW rescheduling
* @od0 for reporting an issue with alter_job_schedule

### 1.4.2 (2019-09-11)

This maintenance release contains bugfixes since the 1.4.1 release. We deem it medium
priority for upgrading.

In particular the fixes contained in this maintenance release address 2 potential
segfaults and no other security vulnerabilities. The bugfixes are related to
background workers, OUTER JOINs, ordered append on space partitioned hypertables
and expression indexes.

**Bug fixes**
* #1327 Fix chunk exclusion with ordered append
* #1390 Fix deletes of background workers while a job is running
* #1392 Fix cagg_agg_validate expression handling (segfault)
* #1408 Fix ChunkAppend space partitioning support for ordered append
* #1420 Fix OUTER JOIN qual propagation
* #1422 Fix background worker error handling (segfault)
* #1424 Fix ChunkAppend LIMIT pushdown
* #1429 Fix expression index creation

**Thanks**
* @shahidhk for reporting an issue with OUTER JOINs
* @cossbow and @xxGL1TCHxx for reporting reporting issues with ChunkAppend and space partitioning
* @est for reporting an issue with CASE expressions in continuous aggregates
* @devlucasc for reporting the issue with deleting a background worker while a job is running
* @ryan-shaw for reporting an issue with expression indexes on hypertables with dropped columns

### 1.4.1 (2019-08-01)

This maintenance release contains bugfixes since the 1.4.0 release. We deem it medium
priority for upgrading.

In particular the fixes contained in this maintenance release address 2 potential
segfaults and no other security vulnerabilities. The bugfixes are related to queries
with prepared statements, PL/pgSQL functions and interoperability with other extensions.
More details below.

**Bug fixes**
* #1362 Fix ConstraintAwareAppend subquery exclusion
* #1363 Mark drop_chunks as VOLATILE and not PARALLEL SAFE
* #1369 Fix ChunkAppend with prepared statements
* #1373 Only allow PARAM_EXTERN as time_bucket_gapfill arguments
* #1380 Handle Result nodes gracefully in ChunkAppend

**Thanks**
* @overhacked for reporting an issue with drop_chunks and parallel queries
* @fvannee for reporting an issue with ConstraintAwareAppend and subqueries
* @rrb3942 for reporting a segfault with ChunkAppend and prepared statements
* @mchesser for reporting a segfault with time_bucket_gapfill and subqueries
* @lolizeppelin for reporting and helping debug an issue with ChunkAppend and Result nodes

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
* #1270 Use ChunkAppend to replace Append nodes
* #1257 Support for multiple continuous aggregates

**Minor features**
* #1181 Remove LIMIT clause restriction from ordered append
* #1273 Propagate quals to joined hypertables
* #1317 Support time bucket functions in Ordered Append
* #1331 Add warning message for REFRESH MATERIALIZED VIEW
* #1332 Add job statistics columns to timescaledb_information.continuous_aggregate_stats view
* #1326 Add architecture and bit size to telemetry

**Bug fixes**
* #1288 Do not remove Result nodes with one-time filter
* #1300 Fix telemetry report return value
* #1339 Fix continuous agg catalog table insert failure
* #1344 Update continuous agg bgw job start time

**Thanks**
* @ik9999 for reporting a bug with continuous aggregates and negative refresh lag

### 1.3.2 (2019-06-24)

This maintenance release contains bug and security fixes since the 1.3.1 release. We deem it moderate-to-high priority for upgrading.

This release fixes some security vulnerabilities, specifically related to being able to elevate role-based permissions by database users that already have access to the database.  We strongly recommend that users who rely on role-based permissions upgrade to this release as soon as possible.

**Security fixes**
* #1311 Fix role-based permission checking logic

**Bug fixes**
* #1315 Fix potentially lost invalidations in continuous aggs
* #1303 Fix handling of types with custom time partitioning
* #1299 Arm32: Fix Datum to int cast issue
* #1297 Arm32: Fix crashes due to long handling
* #1019 Add ARM32 tests on travis

**Thanks**
* @hedayat for reporting the error with handling of types with custom time partitioning

### 1.3.1 (2019-06-10)

This maintenance release contains bugfixes since the 1.3.0 release.
We deem it low-to-moderate priority for upgrading.

In particular, the fixes contained in this maintenance release do not address any
security vulnerabilities, while the only one affecting system stability is related
to TimescaleDB running on PostgreSQL 11. More details below.

**Bug fixes**
* #1220 Fix detecting JOINs for continuous aggs
* #1221 Fix segfault in VACUUM on PG11
* #1228 ARM32 Fix: Pass int64 using Int64GetDatum when a Datum is required
* #1232 Allow Param as time_bucket_gapfill arguments
* #1236 Stop preventing REFRESH in transaction blocks
* #1283 Fix constraint exclusion for OUTER JOIN

**Thanks**
* @od0 for reporting an error with continuous aggs and JOINs
* @rickbatka for reporting an error when using time_bucket_gapfill in functions
* @OneMoreSec for reporting the bug with VACUUM
* @dvdrozdov @od0 @t0k4rt for reporting the issue with REFRESH in transaction blocks
* @mhagander and @devrimgunduz for suggesting adding a CMAKE flag to control the default telemetry level

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
aggregates do not need to be refreshed manually; the view will be refreshed
automatically in the background as new data is added, or old data is
modified. Additionally, it does not need to re-calculate all of the data on
every refresh. Only new and/or invalidated data will be calculated.  Since this
re-aggregation is automatic, it doesn’t add any maintenance burden to your
database.

Our continuous aggregate approach supports high-ingest rates by avoiding the
high-write amplification associated with trigger-based approaches. Instead,
we use invalidation techniques to track what data has changed, and then correct
the materialized aggregate the next time that the automated process executes.

For more information on this release, read our [blog on continuous aggregates](https://blog.timescale.com/blog/continuous-aggregates-faster-queries-with-automatically-maintained-materialized-views/),
[our docs overview](http://docs.timescale.com/timescaledb/:currentVersion:/overview/core-concepts/continuous-aggregates/),
and visit this [tutorial](http://docs.timescale.com/tutorials/continuous-aggs-tutorial).

**Major features**
* #1184 Add continuous aggregate functionality

**Minor features**
* #1005 Enable creating indexes with one transaction per chunk
* #1007 Remove hypertable parent from query plans
* #1038 Infer time_bucket_gapfill arguments from WHERE clause
* #1062 Make constraint aware append parallel safe
* #1067 Add treat_null_as_missing option to locf
* #1112 Add support for window functions to gapfill
* #1130 Add support for cross datatype chunk exclusion for time types
* #1134 Add support for partitionwise aggregation
* #1153 Add time_bucket support to chunk exclusion
* #1170 Add functions for turning restoring on/off and setting license key
* #1177 Add transformed time_bucket comparison to quals
* #1182 Enable optimizing SELECTs within INSERTs
* #1201 Add telemetry for policies: drop_chunk & reorder

**Bug fixes**
* #1010 Add session locks to CLUSTER
* #1115 Fix ordered append optimization for join queries
* #1123 Fix gapfill with prepared statements
* #1125 Fix column handling for columns derived from GROUP BY columns
* #1132 Adjust ordered append path cost
* #1155 Limit initial max_open_chunks_per_insert to PG_INT16_MAX
* #1167 Fix postgres.conf ApacheOnly license
* #1183 Handle NULL in a check constraint name
* #1195 Fix cascade in scheduled drop chunks
* #1196 Fix UPSERT with prepared statements

**Thanks**
* @spickman for reporting a segfault with ordered append and JOINs
* @comicfans for reporting a performance regression with ordered append
* @Specter-Y for reporting a segfault with UPSERT and prepared statements
* @erthalion submitting a bugfix for a segfault with validating check constraints

### 1.2.2 (2019-03-14)

This release contains bugfixes.

**Bug fixes**
* #1097 Adjust ordered append plan cost
* #1079 Stop background worker on ALTER DATABASE SET TABLESPACE and CREATE DATABASE WITH TEMPLATE
* #1088 Fix ON CONFLICT when using prepared statements and functions
* #1089 Fix compatibility with extensions that define planner_hook
* #1057 Fix chunk exclusion constraint type inference
* #1060 Fix sort_transform optimization

**Thanks**
* @esatterwhite for reporting a bug when using timescaledb with zombodb
* @eeeebbbbrrrr for fixing compatibility with extensions that also define planner_hook
* @naquad for reporting a segfault when using ON conflict in stored procedures
* @aaronkaplan for reporting an issue with ALTER DATABASE SET TABLESPACE
* @quetz for reporting an issue with CREATE DATABASE WITH TEMPLATE
* @nbouscal for reporting an issue with ordered append resulting in bad plans

### 1.2.1 (2019-02-11)

This release contains bugfixes.

**Notable commits**
* [2f6b58a] Fix tlist on hypertable inserts inside CTEs
* [7973b4a] Stop background worker on rename database
* [32cc645] Fix loading the tsl license in parallel workers

**Thanks**

* @jamessewell for reporting and helping debug a segfault in last() [034a0b0]
* @piscopoc for reporting a segfault in time_bucket_gapfill [e6c68f8]

### 1.2.0 (2019-01-29)

**This is our first release to include Timescale-Licensed features, in addition to new Apache-2 capabilities.**

We are excited to be introducing new time-series analytical functions, advanced data lifecycle management capabilities, and improved performance.
- **Time-series analytical functions**: Users can now use our `time_bucket_gapfill` function, to write complex gapfilling, last object carried forward, and interpolation queries.
- **Advanced data lifecycle management**: We are introducing scheduled policies, which use our background worker framework to manage time-series data. In this release, we support scheduled `drop_chunks` and `reorder`.
- **Improved performance**: We added support for ordered appends, which optimize a large range of queries - particularly those that are ordered by time and contain a LIMIT clause. Please note that ordered appends do not support ordering by `time_bucket` at this time.
- **Postgres 11 Support**: We added beta support for PG11 in 1.1.0. We're happy to announce that our PG11 support is now out of beta, and fully supported.

This release adds code under a new license, LICENSE_TIMESCALE. This code can be found in `tsl`.

**For this release only**, you will need to restart the database before running
`ALTER EXTENSION`

**Notable commits**

* [a531733] switch cis state when we switch chunks
* [5c6b619] Make a copy of the ri_onConflict object in PG11
* [61e524e] Make slot for upserts be update for every chunk switch
* [8a7c127] Fix for ExecSlotDescriptor during upserts
* [fa61613] Change time_bucket_gapfill argument names
* [01be394] Fix bgw_launcher restart when failing during launcher setup
* [7b3929e] Add ordered append optimization
* [a69f84c] Fix signal processing in background workers
* [47b5b7d] Log which chunks are dropped by background workers
* [4e1e15f] Add reorder command
* [2e4bb5d] Recluster and drop chunks scheduling code
* [ef43e52] Add alter_policy_schedule API function
* [5ba740e] Add gapfill query support
* [be7c74c] Add logic for automatic DB maintenance functions
* [4ff6ac7] Initial Timescale-Licensed-Module and License-Key Implementation
* [fc42539] Add new top-level licensing information
* [31e9c5b] Fix time column handling in get_create_command
* [1b8ceca] Avoid loading twice in parallel workers and load only from $libdir
* [76d7875] Don't throw errors when extension is loaded but not installed yet
* [eecd845] Add Timescale License (TSL)
* [4b42b30] Free ChunkInsertStates when the es_per_tuple_exprcontext is freed

**Thanks**

* @fordred for reporting our docker-run.sh script was out of date
* @JpWebster for reporting a deadlock between reads an drop_chunks
* @chickenburgers for reporting an issue with our CMake
* Dimtrj and Asbjørn D., on slack, for creating a reproducible testcase for an UPSERT bug
* @skebanga for reporting a loader bug

For more information on this release, read the [blog announcement](https://blog.timescale.com/blog/timescaledb-1-2-analytical-functions-advanced-data-lifecycle-management-improved-performance/) and
[blog on using `time_bucket_gapfill`, `interpolate`, and `locf`](https://blog.timescale.com/blog/sql-functions-for-time-series-analysis/).

### 1.1.1 (2018-12-20)

This release contains bugfixes.

**High-level changes**
* Fix issue when upgrading with pg_upgrade
* Fix a segfault that sometimes appeared in long COPYs
* Other bug and stability fixes

**Notable commits**

* [f99b540] Avoid loading twice in parallel workers and load only from $libdir
* [e310f7d] Don't throw errors when extension is loaded but not installed yet
* [8498416] Free ChunkInsertStates when the es_per_tuple_exprcontext is freed
* [937eefe] Set C standard to C11

**Thanks**

* @costigator for reporting the pg_upgrade bug
* @FireAndIce68 for reporting the parallel workers issue
* @damirda for reporting the copy bug

### 1.1.0 (2018-12-13)

Our 1.1 release introduces beta support for PG 11, as well as several performance optimizations aimed at improving chunk exclusion for read queries. We are also packaging our new timescale-tune tool (currently in beta) with our Debian and Linux releases. If you encounter any issues with our beta features, please file a GitHub issue.

**Potential breaking changes**
- In addition to optimizing first() / last() to utilize indices for non-group-by queries, we adjusted its sorting behavior to match that of PostgreSQL’s max() and min() functions. Previously, if the column being sorted had NULL values, a NULL would be returned. First() and last() now instead ignore NULL values.

**Notable commits**

* [71f3a0c] Fix Datum conversion issues
* [5aa1eda] Refactor compatibility functions and code to support PG11
* [e4a4f8e] Add support for functions on open (time) dimensions
* [ed5067c] Fix interval_from_now_to_internal timestamptz handling
* [019971c] Optimize FIRST/LAST aggregate functions
* [83014ee] Implement drop_chunks in C
* [9a34028] Implement show_chunks in C and have drop_chunks use it
* [d461959] Add view to show hypertable information
* [35dee48] Remove version-checking from client-side
* [5b6a5f4] Change size utility and job functions to STRICT
* [7e55d91] Add checks for NULL arguments to DDL functions
* [c1db608] Fix upsert TLE translation when mapping variable numbers
* [55a378e] Check extension exists for DROP OWNED and DROP EXTENSION
* [0c8c085] Exclude unneeded chunks for IN/ANY/ALL operators
* [f27c0a3] Move int time_bucket functions with offset to C

**Thanks**
* @did-g for some memory improvements

### 1.0.1 (2018-12-05)

This commit contains bugfixes and optimizations for 1.0.0

**Notable commits**

* [6553aa4] Make a number of size utility functions to `STRICT`
* [bb1d748] Add checks for NULL arguments to `set_adaptive_chunking`, `set_number_partitions`, `set_chunk_time_interval`, `add_dimension`, and `create_hypertable`
* [a534ed4] Fix upsert TLE translation when mapping variable numbers
* [aecd55b] Check extension exists for DROP OWNED and DROP EXTENSION

### 1.0.0 (2018-10-30)

**This is our 1.0 release!**

For notable commits between 0.12.0/0.12.1 and this final 1.0 release, please see previous entries for the release candidates (rc1, rc2, and rc3).

**Thanks**
To all the external contributors who helped us debug the release candidates, as well as anyone who has contributed bug reports, PRs, or feedback on Slack, GitHub, and other channels. All input has been valuable and helped us create the product we have today!

**Potential breaking changes**
* To better align with the ISO standard so that time bucketing starts each week by default on a Monday (rather than Saturday), the `time_bucket` epoch/origin has been changed from January 1, 2000 to January 3, 2000.  The function now includes an `origin` parameter that can be used to adjust this.
* Error codes are now prefixed with `TS` instead of the prior `IO` prefix. If you were checking for these error codes by name, please update your code.

For more information on this release, read the [blog announcement](https://blog.timescale.com/blog/1-0-enterprise-production-ready-time-series-database-open-source-d32395a10cbf/).


**For releases prior to 1.0, please visit the [changelog](https://github.com/timescale/timescaledb/blob/master/CHANGELOG.md).**


[distributed-hypertables]: /overview/core-concepts/distributed-hypertables/
[distributed-hypertables-setup]: /how-to-guides/multi-node-setup/
[changes-in-timescaledb-2]: /overview/release-notes/changes-in-timescaledb-2/
[multinode-intro]: /overview/core-concepts/distributed-hypertables
[multinode-setup]: /how-to-guides/multi-node-setup/
