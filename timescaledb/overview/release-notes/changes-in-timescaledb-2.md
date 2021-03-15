# Changes in TimescaleDB 2.0

TimescaleDB 2.0 introduces new features and capabilities to its advanced relational 
database for time-series data. Driven by user feedback and our experience building 
products like [Promscale](https://github.com/timescale/promscale), 2.0 is a major 
milestone and introduces the first multi-node, petabyte-scale relational database 
for time-series. In addition to multi-node capabilities, this release includes new 
features - and improvements to existing ones - focused on giving users more flexibility,
 control over their data and the ability to customize behavior to suit their needs.

To facilitate many of the improvements in [TimescaleDB 2.0](https://github.com/timescale/timescaledb/releases/tag/2.0.0-rc3),
 several existing APIs and function definitions have been modified which may require updates to your existing code. 

Most notably, the following API and PostgreSQL compatibility changes may impact 
existing code using these interfaces. If your workloads use any of the features, 
this document covers each in detail to help you understand what - if any - action 
you need to take.

*   **Dropping support for PostgreSQL versions 9.6 and 10:** As mentioned in 
[our upgrade documentation](/v2.0/update-timescaledb), TimescaleDB 2.0
 no longer supports older PostgreSQL versions. You will need to be running PostgreSQL
  version 11 or 12 to upgrade your TimescaleDB installation to 2.0.
*   **Continuous Aggregates:** We have made major changes in the creation and management 
of continuous aggregates to address user feedback.
*   **Data Retention and Compression Policies:**  All policies are now managed through a 
unified API and a consolidated set of Views.
*   **Informational Views:** Based on user feedback and our desire to make TimescaleDB 
easy to manage, multiple information views have been consolidated for better clarity. 

The following migration document provides more information on each of these API changes 
and how they affect users of TimescaleDB 1.x . We’ve also included a bit of information 
about the impetus for these changes and our design decisions. For a more in-depth coverage
 of APIs, as well as a detailed description of new features included in 2.0, such as 
 distributed hypertables and the ability to run user-defined actions (custom background jobs),
  please [review our updated documentation](/v2.0/main) 
  (navigate to specific features of interest).

Once you have read through this guide and understand the impact that upgrading to the latest
 version may have on your existing application and infrastructure, please follow our 
 [upgrade to TimescaleDB 2.0](/v2.0/update-timescaledb/update-tsdb-2)
  documentation. You will find straight-forward instructions and recommendations to ensure 
  everything is updated and works correctly.


## Why we’ve made these changes [](why-changes)

It’s been two years since we released TimescaleDB 1.0 in October 2018 with the ambition 
to make it easy to scale PostgreSQL for time-series workloads. Since that initial release, 
we’ve added many new capabilities: support for compression, continuous aggregates, data 
lifecycle management, and numerous optimizations, as well as two new underlying PostgreSQL 
versions (11 and 12). At the same time, the core of TimescaleDB hasn’t changed significantly: 
we still have hypertables, auto-partitioning, query optimizations, and a basic user 
experience that many have come to appreciate because things “just work”. 

Still, as with any technology solution, there are some things that we didn’t get 100% 
right in our first release. In particular, as usage of TimescaleDB has skyrocketed, many 
users have told us that our informational views aren’t always clear and consistent, nor 
do they provide enough detail on what is happening in the background. Likewise, while it 
is “easy” to create a continuous aggregate, it wasn’t always clear why aggregates sometimes 
returned no data, or why new raw data is slow to be materialized. As a side effect of creating 
a continuous aggregate, data retention on hypertables can become blocked, and understanding 
how to re-enable it is a common support question.

While our ambition to provide a solution that “just works” remains, too much “magic” and 
automation behind the scenes related to features like hypertables, compression, and continuous 
aggregations can lead to outcomes not in line with user expectations or intentions. And, with 
a general database like PostgreSQL, the expected behavior varies widely depending on the use 
case (and users’ expertise). **This has led us to recommit to the user experience: simplifying 
APIs and making them more consistent, yet at the same time empowering users with more control 
to customize behaviors when needed.**

For example, in TimescaleDB 2.0 we’ve separated the automation of _refreshing_ continuous aggregate 
data from the core functionality, giving users the option to manually refresh the data and, if 
desired, add automation via a policy. This also makes this feature consistent with TimescaleDB’s 
other policy-driven features – such as retention, reordering, and compression – which offer both 
manual control and automation via policies. We have also opened up our jobs scheduling framework 
to enable user-defined actions, i.e, custom background jobs that users can define themselves.

In the rest of this document, we go through each of the features and API changes in detail, and 
what users migrating from an earlier version of TimescaleDB should consider prior to updating to TimescaleDB 2.0. 


## Working with hypertables [](hypertables)

In TimescaleDB 2.0, we have made changes to existing APIs for working with hypertables, as well 
as improvements to the related information views and size functions. These views and functions 
provide information about basic configuration, partitioning, data chunks, and disk size, and they 
also have been updated to work for distributed hypertables.


### Creating hypertables and changing configuration

The following APIs to create and configure hypertables have changed:

*   [`create_hypertable`](/v2.0/api#create_hypertable):  The `main_table` parameter has been renamed to `relation`, and additional parameters for distributed hypertables have been added.
*   [`set_chunk_time_interval`](/v2.0/api#set_chunk_time_interval), [`set_number_of_partitions`](/v2.0/api#set_number_partitions), [`add_dimension`](/v2.0/api#add_dimension):  The `main_table` parameter has been renamed to `hypertable`.

### Viewing information about hypertables

Consistent with our desire to improve visibility into all aspects of TimescaleDB configuration, 
the following views and functions about hypertable information have been updated or added:

*   [`timescaledb_information.hypertables`](/v2.0/api#timescaledb_information-hypertables): 
    *   The view with basic information about hypertables has been renamed from the singular “hypertable”.
    *   Some columns have new names for consistency with other views.
    *   Table size information has been removed and made available through new size functions discussed later.
    *   Additional columns have been added related to distributed hypertables.
    *   The view no longer shows internal hypertables for continuous aggregates and compression.
    *   For continuous aggregates, the internal materialized hypertable name is available in the `timescaledb_information.continuous_aggregates` view.
*   [`timescaledb_information.dimensions`](/v2.0/api#timescaledb_information-dimensions):  A new view allows 
users to see partitioning information and settings for various dimensions, such as the chunk time interval or 
number of space partitions used in a hypertable.
*   [`timescaledb_information.chunks`](/v2.0/api#timescaledb_information-chunks):   A new view allows users 
to see information about individual data chunks of all hypertables, including the tablespace or data node on which 
each chunk is stored.
*   [`show_chunks(relation)`](/v2.0/api#show_chunks):  The function now requires providing a 
hypertable or continuous aggregate identifier as the first argument, which is consistent with `drop_chunks(relation)`. 
Previously, it was possible to view the chunks of all hypertables by eliding the hypertable argument. To view all 
chunks in the database, we instead recommend using the new chunks view described above.

These views can be used together to answer certain questions.  For example:

**Q:  Get all chunks written to tablespace “ts1” during the past month:**

```SQL
SELECT * FROM timescaledb_information.chunks 
  WHERE hypertable_name = 'conditions' 
    AND chunk_tablespace = 'ts1' 
    AND range_start > now() - INTERVAL '1 month';
```

**Q:  Get compression status of all chunks on hypertables with compression enabled:**

```SQL
SELECT h.hypertable_schema, h.hypertable_name, 
  chunk_schema, chunk_name, 
  range_start, range_end, is_compressed 
FROM timescaledb_information.chunks c 
  INNER JOIN timescaledb_information.hypertables h
    ON (c.hypertable_schema = h.hypertable_schema 
      AND c.hypertable_name = h.hypertable_name) 
  WHERE h.compression_enabled = true;
```

### New functions for size information 

Information views no longer display size information about hypertables and other objects, instead 
size information is available through a set of functions that all return the size in number of 
bytes. Removing size information makes the views faster since the information is often read dynamically 
from disk, or, in the case of distributed hypertables, read across a network. 

Size functions are also split into basic and detailed ones. The former class of functions return 
only a single aggregate value and can be easily applied in queries, while the detailed functions 
return multiple columns and (possibly) multiple rows of information.

*   [`hypertable_detailed_size(hypertable)`](/v2.0/api#hypertable_detailed_size):  
The function has been renamed from `hypertable_relation_size(hypertable)`.  Further, if the hypertable is distributed, 
it will return multiple rows, one per each of the hypertable’s data nodes.
*   [`hypertable_size(hypertable)`](/v2.0/api#hypertable_size):  Returns a single 
value giving the aggregated hypertable size, including both tables (chunks) and indexes.
*   [`chunks_detailed_size(hypertable)`](/v2.0/api#chunks_detailed_size):  Returns 
the size information about each of the chunks in a hypertable. On a distributed hypertable, this function 
returns one row per data node that holds a copy of the chunk.
*   [`hypertable_index_size(index)`](/v2.0/api#hypertable_index_size): Returns the 
aggregate number of bytes corresponding to a hypertable index across all chunks.
*   [`approximate_row_count(relation)`](/v2.0/api#approximate_row_count):  The function 
has been renamed from `hypertable_approximate_row_count`, but can now also be called on non-hypertables.

In previous versions of TimescaleDB, you could get size information for all hypertables in the `hypertable` view. 
In TimescaleDB 2.0, you can now instead combine the new `hypertables` view with size functions to achieve a similar result:


```SQL
SELECT hypertable_name, hypertable_size(hypertable_name::regclass) FROM timescaledb_information.hypertables;

 hypertable_name | hypertable_size
-----------------+-----------------
 devices         |      	360448
 conditions      |      	253952
```

## Continuous Aggregates [](caggs)

Major changes have been made to Continuous Aggregates in TimescaleDB 2.0 to better clarify this feature.

First, Continuous Aggregates have always been more closely aligned with Materialized Views in PostgreSQL. Therefore, 
creating a continuous aggregate now uses `CREATE MATERIALIZED VIEW`, rather than `CREATE VIEW`.

Second, the continuous aggregate API now separates the explicit mechanism for updating a continuous aggregate from 
the policy that automates the process of keeping a continuous aggregate up-to-date.  This change both 
simplifies the continuous aggregate API in TimescaleDB 2.0, provides more flexibility to users (especially when 
combined with user-defined actions and a newly-exposed API for scheduling jobs directly), and makes it consistent 
with other policy automation in TimescaleDB 2.0:

Action API                    | Policy API for Automation
------------------------------|--------------------------
`drop_chunks`                 | `add_retention_policy`
`reorder_chunk`               | `add_reorder_policy`
`compress_chunk`              | `add_compression_policy`
`refresh_continuous_aggregate`|`add_continuous_aggregate_policy`


In practice, this means that creating a continuous aggregate in TimescaleDB 2.0 is now a two-step process:

1. Create via a [`CREATE MATERIALIZED VIEW`](/v2.0/api#continuous_aggregate-create_view) statement
2. Add an (automation) policy on the continuous aggregate via a separate [API function call](/v2.0/api#add_continuous_aggregate_policy)

```SQL
CREATE MATERIALIZED VIEW conditions_by_2h
  WITH (timescaledb.continuous, 
    timescaledb.materialized_only=false)
  AS 
    SELECT time_bucket('2 hours', time) as bin, 
      COUNT(device) as value
    FROM conditions
    GROUP BY bin
  WITH NO DATA;

SELECT add_continuous_aggregate_policy(
  continuous_aggregate => 'conditions_by_2h', 
  start_offset         => '4 weeks', 
  end_offset           => '2 hours',
  schedule_interval    => '1 hour');
```

In the example above, `CREATE MATERIALIZED VIEW `creates a continuous aggregate without any automation yet 
associated with it.  Notice also that  `WITH NO DATA` is specified at the end. This prevents the view from 
materializing data at creation time, instead deferring the population of aggregated data until the policy runs 
as a background job or as part of a manual refresh. Therefore, we recommend that users create continuous aggregates 
using the `WITH NO DATA` option, especially if a significant amount of historical data will be materialized.

Once the Continuous Aggregate is created, calling `add_continuous_aggregate_policy` creates a continuous 
aggregate policy, which automatically materializes or refreshes the data following the schedule and rules 
provided. Inputs to the policy function include the continuous aggregate name, a refresh window, and a 
schedule interval.  The refresh window is specified by the start and end offsets, which are used to calculate 
a new refresh window every time the policy runs by subtracting the offsets from the current time (as normally 
returned by the function `now()`).


### Understanding Continuous Aggregate Policies [](cagg-policies)

It is worth noting the way that “start_offset” and “end_offset” work as new data arrives and is added to the source hypertables.

The above example sets the refresh interval as between four weeks and two hours ago (start_offset and end_offset 
respectively). Therefore, if any late data arrives with timestamps within the last four weeks and is backfilled 
into the source hypertable, then the continuous aggregate view is updated with this old data the next time the policy executes. 

This policy will, in the worst case, materialize the whole window every time it runs if data at least four weeks 
old continues to arrive and be inserted into the source hypertables.  However, since a continuous aggregate tracks 
changes since the last refresh, it will in most cases materialize a subset of the window that corresponds to the 
data that has actually changed. 

In this example, data backfilled more than 4 weeks ago is not rematerialized, nor does the continuous aggregate 
include data less than 2 hours old.  However, _querying the continuous aggregate view can still return aggregates 
about the latest data, and not just aggregated data more than 2 hours old, based on support for 
[real-time aggregation](https://docs.timescale.com/latest/using-timescaledb/continuous-aggregates#real-time-aggregates)_, 
specified as before with the `timescaledb.materialized_only=false` parameter. Real-time aggregates are still the default 
setting unless otherwise specified.

Finally, it is recommended that the `end_offset` lags the current time by at least one `time_bucket `as defined 
in the aggregate SQL, otherwise it might affect performance when inserting new data, which usually is written to 
what would be the latest bucket.  In TimescaleDB 1.x, the `refresh_lag` parameter was used for a similar purpose, 
but we found that  using it correctly was more difficult to understand.


### Manually refreshing regions of continuous aggregates [](cagg-refresh)

TimescaleDB 2.0 removes support for `REFRESH MATERIALIZED VIEW` in favor of the new, more flexible function, 
[refresh_continuous_aggregate](/v2.0/api#refresh_continuous_aggregate), which enables 
a user to refresh a specific window in a continuous aggregate:


```SQL
CALL refresh_continuous_aggregate(
  continuous_aggregate => 'conditions_by_2h',
  window_start         => '2020-05-01', 
  window_end           => '2020-05-03');
```

Users can use this command explicitly; a typical use of this command is to manually refresh historical data 
while creating a continuous aggregate policy to aggregate new data. It is even possible to build custom 
continuous aggregation policies using this function within the new user-defined action framework which are 
then scheduled via `add_job`. 

Note that `refresh_continuous_aggregate` only recomputes the aggregated time buckets that completely fall 
inside the given refresh window and are in a region that has seen changes in the underlying hypertable. 
Thus, if no changes have occurred in the underlying source data (that is, no data has been backfilled to the 
region or no updates to existing data have been made), no materialization will be performed either over that 
region. This behavior is similar to the continuous aggregate policy and ensures more efficient operation.


### Using data retention and continuous aggregates together [](retention-and-caggs)

With greater power and flexibility also comes a greater responsibility to understand how features interact. Specifically, 
users should understand the interactions between data retention policy settings and continuous aggregate settings. 

Before starting the upgrade to TimescaleDB 2.0, **we highly recommend checking the database log for errors related 
to failed retention policies that were occurring in TimescaleDB 1.x** and then either removing them or updating them 
to be compatible with existing continuous aggregates. Any remaining retention policies that are still incompatible 
with the `ignore_invalidation_older_than` setting will automatically be disabled with a notice during the upgrade.

As an example, if a data retention policy on a hypertable is set for `drop_after => '4 weeks'`, then the policy 
associated with a continuous aggregate on that same hypertable should have a `start_offset` less than or equal 
to 4 weeks.  Similarly, any manual call to `refresh_continuous_aggregate` should likely specify a `window_start` 
that’s also less than the date from 4 weeks ago. 

If not understood properly, users could overwrite existing aggregated data in continuous aggregates with empty 
data by recomputing data over a now-dropped time window of data, not likely the result a user was expecting. 
Instead, users seeking to keep only a certain time window of data in their continuous aggregate view should 
create a data retention policy on the continuous aggregate itself.

**This differs significantly from how TimescaleDB 1.x handled conflicts between retention policies and continuous aggregates.**

Previously, if the continuous aggregation setting `ignore_invalidation_older_than` overlapped with data that would 
be dropped by a retention policy, the retention policy would silently fail.  Making the retention policy work again 
required users to modify settings in either the retention policy or the continuous aggregate, and even then some 
data wasn’t always materialized as expected. 

After upgrading to TimescaleDB 2.0, **retention policies will no longer fail due to incompatibilities with 
continuous aggregates** and users have to ensure that retention and continuous aggregate policies have the 
desired interplay. 

Another change in 2.0 is that `drop_chunks` and the retention policy will no longer 
automatically refresh continuous aggregates to account for changes in original hypertable 
after the last refresh. Previously, the goal was to ensure that all updates were processed 
prior to dropping chunks in the original hypertable. In practice, it often didn't work as intended.

In TimescaleDB 2.0 users can ensure that all updates are processed before dropping data by 
combining the following experimental function, which refreshes updates in the given chunk, 
with `drop_chunks`.
```sql
_timescaledb_internal.refresh_continuous_aggregate(continuous_aggregate REGCLASS, chunk REGCLASS)
```
The example below demonstrates how to use the chunk-based refresh function to define a 
retention policy, which ensures that all updates to data in the original hypertable are 
refreshed in all continuous aggregates prior dropping chunks older than 2 weeks:

```sql
CREATE OR REPLACE PROCEDURE refresh_and_drop_policy(job_id int, config jsonb) LANGUAGE PLPGSQL AS
$$
DECLARE
  drop_after interval;
  hypertable text;
BEGIN
  SELECT jsonb_object_field_text(config, 'drop_after')::interval
    INTO STRICT drop_after;
  SELECT jsonb_object_field_text(config, 'hypertable')::regclass
    INTO STRICT hypertable;

  BEGIN;
  SELECT _timescaledb_internal.refresh_continuous_aggregate(cagg, 
      show_chunks(older_than => drop_after))
  FROM timescaledb_information.continuous_aggregates
  WHERE format('%I.%I', hypertable_schema, hypertable_name)::regclass = hypertable;

    SELECT drop_chunks(hypertable, older_than => drop_after);
  COMMIT;
END
$$;

SELECT add_job('refresh_and_drop_policy', '2 weeks', 
   config => '{"hypertable":"public.conditions", "drop_after":"2 weeks"}');
```

### Differences in the handling of backfill on continuous aggregates [](cagg-backfill)

In TimescaleDB 1.x, data that was backfilled into hypertables wasn’t handled optimally; modification of 
any hypertable data, regardless of how old, would cause the continuous aggregate materializer job to restart 
from the point of the earliest backfill and then materialize from that point forward. Unfortunately, 
this could also cause the materializer to get “stuck”, since the background job only processed a limited 
amount of data per run, as governed by the `max_interval_per_job` setting. When this happened, one job run 
could potentially force the next job to start all over again. 

To prevent this, the `ignore_invalidation_older_than` setting could be used to ignore backfill data older than 
a specified interval (e.g., ignore backfill older than 1 week), preventing the materializer from restarting if 
hypertable data was modified beyond this interval boundary. However, this would also stop TimescalDB 1.x from 
tracking changes in the underlying data beyond the `ignore_invalidation_older_than` threshold too. This meant 
that it was not possible to revert this setting later to a larger interval (e.g., 1 month) without potentially 
having a mismatch between the raw data and the aggregated data in the continuous aggregate.

In contrast, TimescaleDB 2.0 never stops tracking backfill, and to avoid materializing too much historical data, 
one should simply use a refresh window that does not include that region of data. The backfilled region can 
always be refreshed at a later time, either manually or via a policy.

To ensure that previously ignored backfill can be refreshed after the upgrade to TimescaleDB 2.0, the upgrade 
process will mark the region older than the `ignore_invalidation_older_than` threshold as “requiring refresh”. 
This allows a manual refresh to bring a continuous aggregate up-to-date with the underlying source data. If 
the `ignore_invalidation_older_than` threshold was modified at some point to a longer interval, we recommend 
setting it back to the smaller interval prior to upgrading to ensure that all the backfill can be refreshed, 
if one so desires. 

Note again, however, that if backfill was previously ignored due to a retention policy on the underlying hypertable, 
a manual refresh of older data into a continuous aggregate could remove data when hypertable chunks have been 
dropped due to a data retention policy as discussed in the previous section.

### Viewing information about continuous aggregates [](cagg-information-views)

In TimescaleDB 2.0, views surrounding continuous aggregates (and other policies) have been simplified and generalized.

#### Changes and Additions
*   [`timescaledb_information.continuous_aggregates`](/v2.0/api#timescaledb_information-continuous_aggregate): 
now provides information related to the materialized view, which includes the view name and owner, the real 
time aggregation flag, the materialization and the view definition (the select statement defining the view).
*   [`timescaledb_information.jobs`](/v2.0/api#timescaledb_information-jobs): displays information for 
all policies including continuous aggregates.  
*   [`timescaledb_information.job_stats`](/v2.0/api#timescaledb_information-jobs_stats): displays job 
statistics related to all jobs.

#### Removed
* [`timescaledb_information.continuous_aggregate_stats`](/v1.7/api#timescaledb_information-continuous_aggregate_stats): Removed in favor of the `job_stats` view mentioned above.

### Updating existing continuous aggregates [](updating-continuous-aggregates)

If you have existing continuous aggregates and you update your database to TimescaleDB 2.0, the update scripts 
will automatically reconfigure your continuous aggregates to use the new framework.

In particular, the update process should:

*   Maintain the same view schema, name, owner, and view definition as before, as well as the setting for `materialized_only`.
*   Schedule the refresh to run at the same interval as before (although the parameter is now named `schedule_interval` r
ather than `refresh_interval`).
*   Automatically configure `start_offset` to the same offset as specified by the old `ignore_invalidation_older_than` setting. 
*   Automatically configure `end_offset` to have an offset from `now()` equivalent to  the old `refresh_lag` setting.
*   Mark all the data older than the interval `ignore_invalidation_older_than` as out-of-date, so that it can be refreshed.
*   Disable any retention policies that are failing due to being incompatible with the current setting of 
`ignore_invalidation_older_than` on a continuous aggregate (as described above). Disabled policies will remain post 
upgrade, but will not be scheduled to run (`scheduled=false `in` timescaledb_information.jobs`). If failing policies 
were to be migrated to 2.0 they would start to work again, but likely with unintended consequences. Therefore, any 
retention policies that are disabled post update should have their settings carefully reviewed before being enabled again.

You can validate these in the proper informational views, given above.

## Other Superficial API Changes [](other-changes)

Other minor changes were made to various APIs for greater understandability and consistency, including in the following areas.

### Data Retention [](data-retention)

#### Changes and Additions
*   [`drop_chunks`](/v2.0/api#drop_chunks): This function now requires specifying a 
hypertable or continuous aggregate as the first argument, and does not allow dropping chunks across all hypertables 
in a database.  Additionally, the arguments `cascade` and `cascade_to_materializations` were removed (and behave as 
if the arguments were set to `false` in earlier versions). In TimescaleDB 2.0, we instead recommend creating a 
separate retention policy on each continuous aggregate. 
*   [`add_retention_policy`](/v2.0/api#add_retention_policy), [`remove_retention_policy`](/v2.0/api#remove_retention_policy):  
Creating (or removing) a data retention policy now has explicit functions. Additionally, the arguments `cascade` 
and `cascade_to_materializations` were removed (and behave as if the arguments were set to `false` in earlier versions).
*   [`timescaledb_information.jobs`](/v2.0/api#jobs): General information about data retention 
policies are now available in the main jobs view.

#### Removed
*   [`add_drop_chunks_policy`](/v1.7/api#add_drop_chunks_policy): removed in favor of the 
explicit functions above.
*   [`timescaledb_information.drop_chunks_policies`](/v1.7/api#timescaledb_information-drop_chunks_policies):
 view has been removed in favor of the more general jobs view.


### Compression [](compression)

#### Changes and Additions
*   [`add_compression_policy`](/v2.0/api#add_compression_policy), [`remove_compression_policy`](/v2.0/api#remove_compression_policy):  
Creating (or removing) a compression policy now has explicit functions.
*   [`hypertable_compression_stats(hypertable)`](/v2.0/api#hypertable_compression_stats): The function 
 returns statistics only for hypertables with compression enabled.
*   [`chunk_compression_stats(hypertable)`](/v2.0/api#chunk_compression_stats):  The function returns 
information about currently compressed chunks.
*   [`timescaledb_information.compression_settings`](/v2.0/api#timescaledb_information-compression_settings)
: This new view gives information about the compression settings on hypertables.
*   [`timescaledb_information.jobs`](/v2.0/api#timescaledb_information-jobs): General information about 
compression policies are now available in the main jobs view.

#### Removed
* [`add_compress_chunk_policy`](/v1.7/api#add_compress_chunks_policy): Removed in favor of the 
explicit functions above.
* [`timescaledb_information.compressed_hypertable_stats`](/v1.7/api#timescaledb_information-compressed_hypertable_stats): 
Removed in favor of the new `hypertable_compression_stats(hypertable)` function linked above
* [`timescaledb_information.compressed_chunk_stats`](/v1.7/api#timescaledb_information-compressed_chunk_stats): 
Removed in favor of the new `chunk_compression_stats(hypertable)` function linked above.

## Managing policies and other jobs [](jobs)

TimescaleDB 2.0 introduces user-defined actions and creates a more unified jobs API. Now, jobs created by the 
TimescaleDB policies and for user-defined actions can be managed and viewed through a single API.

*   [`add_job`](/v2.0/api#add_job): Adds a new user-defined action to the job scheduling framework.
*   [`alter_job`](/v2.0/api#alter_job): Changes settings for existing jobs.  Renamed from `alter_job_schedule` in previous versions,  it 
introduces additional settings, including  `scheduled` to pause and resume jobs, and `config` to change policy 
or action-specific settings.
*   [`run_job`](/v2.0/api#run_job): Manually executes a job immediately and in the foreground.
*   [`delete_job`](/v2.0/api#delete_job): Removes the job from the scheduler.  This is equivalent to functions that remove policies for 
built-in actions (e.g., `remove_retention_policy`). 
*   [`timescaledb_information.jobs`](/v2.0/api#timescaledb_information-jobs):  The new view provides all job settings available, and it replaces all policy-specific views.
*   [`timescaledb_information.jobs_stats`](/v2.0/api#timescaledb_information-jobs-stats):  The view presents statistics of executing jobs for policies and actions.


## License information [](license-changes)

In TimescaleDB 2.0, all features which had been classified previously as “enterprise” have become “community” features 
and are available for free under the Timescale License.  As such, the need for an “enterprise license” to unlock any 
features has been removed; all features are available either under the community Timescale License or under the 
open-source Apache-2 License. [This blog post](https://blog.timescale.com/blog/building-open-source-business-in-cloud-era-v2/) 
explains the changes. The following changes were made to license API:

*   [`timescaledb_information.license`](/v1.7/api#timescaledb_information-license):  This view 
has been removed, as it primarily provided information on the enterprise license key’s expiration date, which is no 
longer applicable. The current license used by the extension can instead be viewed in the GUC below.
*   `timescaledb.license`: This GUC value (which replaces the former [`timescaledb.license_key`](https://docs.timescale.com/latest/api#timescaledb_license-key) GUC) 
can take the value `timescale` or `apache`. It can be set only at startup (in the postgresql.conf configuration file 
or on the server command line), and allows limiting access to certain features by license. For example, setting the l
icense to `apache` allows access to only Apache-2 licensed features.
