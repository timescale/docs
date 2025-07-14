---
api_name: add_columnstore_policy()
excerpt: Set a policy to automatically move chunks in a hypertable to the columnstore when they reach a given age.
topics: [hypercore, columnstore, jobs]
keywords: [columnstore, hypercore, policies]
tags: [scheduled jobs, background jobs, automation framework]
products: [cloud, self_hosted]
api:
  license: community
  type: procedure
---

import Since2180 from "versionContent/_partials/_since_2_18_0.mdx";
import OldCreateHypertable from "versionContent/_partials/_old-api-create-hypertable.mdx";

# add_columnstore_policy()

Create a [job][job] that automatically moves chunks in a hypertable to the $COLUMNSTORE after a 
specific time interval.

You enable the $COLUMNSTORE a hypertable or continuous aggregate before you create a $COLUMNSTORE policy. 
You do this by calling `CREATE TABLE` for hypertables and `ALTER MATERIALIZED VIEW` for continuous aggregates. When
$COLUMNSTORE is enabled, [bloom filters][bloom-filters] are enabled by default, and every new chunk has a bloom index. 
If you moved chunks to $COLUMNSTORE using $TIMESCALE_DB v2.19.3 or below, to enable bloom filters on that data you have 
to convert those chunks to the $ROWSTORE, then convert them back to the $COLUMNSTORE. 

Bloom indexes are not retrofitted, meaning that the existing chunks need to be fully recompressed to have the bloom 
indexes present. Please check out the PR description for more in-depth explanations of how bloom filters in 
TimescaleDB work.

To view the policies that you set or the policies that already exist,
see [informational views][informational-views], to remove a policy, see [remove_columnstore_policy][remove_columnstore_policy].

<Since2180 />

## Samples

To create a $COLUMNSTORE job:

<Procedure>

1. **Enable $COLUMNSTORE**

   Create a [$HYPERTABLE][hypertables-section] for your time-series data using [CREATE TABLE][hypertable-create-table].
   For [efficient queries][secondary-indexes] on data in the columnstore, remember to `segmentby` the column you will
   use most often to filter your data. For example:

   * [Use `CREATE TABLE` for a $HYPERTABLE][hypertable-create-table]

     ```sql
     CREATE TABLE crypto_ticks (
        "time" TIMESTAMPTZ,
        symbol TEXT,
        price DOUBLE PRECISION,
        day_volume NUMERIC
     ) WITH (
       tsdb.hypertable,
       tsdb.partition_column='time',
       tsdb.segmentby='symbol', 
       tsdb.orderby='time DESC'
     );
     ```
     <OldCreateHypertable />

   * [Use `ALTER MATERIALIZED VIEW` for a continuous aggregate][compression_continuous-aggregate]
     ```sql
     ALTER MATERIALIZED VIEW assets_candlestick_daily set (
        timescaledb.enable_columnstore = true, 
        timescaledb.segmentby = 'symbol' );
     ```

1. **Add a policy to move chunks to the $COLUMNSTORE at a specific time interval**

   For example:

   * 60 days after the data was added to the table:
     ``` sql
     CALL add_columnstore_policy('crypto_ticks', after => INTERVAL '60d');
     ```
   * 3 months prior to the moment you run the query:

     ``` sql
     CALL add_columnstore_policy('crypto_ticks', created_before => INTERVAL '3 months');
     ```
   * With an integer-based time column:

     ``` sql
     CALL add_columnstore_policy('table_with_bigint_time', BIGINT '600000');
     ```
   * Older than eight weeks:

     ``` sql
     CALL add_columnstore_policy('cpu_weekly', INTERVAL '8 weeks');
     ```

   * Older than eight weeks and using the $HYPERCORE table access method:

     ``` sql
     CALL add_columnstore_policy(
       'cpu_weekly', 
       INTERVAL '8 weeks', 
       hypercore_use_access_method => true);
     ```
   * Control the time your policy runs:
   
     When you create a policy, $TIMESCALE_DB sets `initial_start` to the time of first execution. This value is used to 
     compute the next start time. To fully control the moment your policy runs, you need to set `initial_start` to the 
     start time to base computations on, in addition to `next_start`.
   
     ``` sql
     select * from alter_job(1000, fixed_schedule => true, initial_start => '2025-07-11 10:00:15', next_start => '2025-07-11 10:42:15');
     ```


1. **View the policies that you set or the policies that already exist** 

   ``` sql
   SELECT * FROM timescaledb_information.jobs
   WHERE proc_name='policy_compression';
   ```
   See [timescaledb_information.jobs][informational-views].

</Procedure>

## Arguments

Calls to `add_columnstore_policy` require either `after` or `created_before`, but cannot have both.

<!-- vale Google.Acronyms = NO -->
<!-- vale Vale.Spelling = NO -->

| Name | Type | Default | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|--|--|--|--|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `hypertable`             |REGCLASS| - | ✔ | Name of the hypertable or continuous aggregate to run this [job][job] on.                                                                                                                                                                                                                                                                                                                                                                                                   |
| `after`         |INTERVAL or INTEGER|- | ✖ | Add chunks containing data older than `now - {after}::interval` to the $COLUMNSTORE. <br/> Use an object type that matchs the time column type in `hypertable`: <ul><li><b><code>TIMESTAMP</code>, <code>TIMESTAMPTZ</code>, or <code>DATE</code></b>: use an <code>INTERVAL</code> type.</li><li><b> Integer-based timestamps </b>: set an integer type using the [integer_now_func][set_integer_now_func].</li></ul> `after` is mutually exclusive with `created_before`. |
| `created_before` |INTERVAL| NULL | ✖ | Add chunks with a creation time of `now() - created_before` to the $COLUMNSTORE. <br/> `created_before` is <ul><li>Not supported for continuous aggregates.</li><li>Mutually exclusive with `after`.</li></ul>                                                                                                                                                                                                                                                              |
| `schedule_interval`       |INTERVAL| 12 hours when [chunk_time_interval][chunk_time_interval] >= `1 day` for `hypertable`. Otherwise `chunk_time_interval` / `2`. | ✖        | Set the interval between the finish time of the last execution of this policy and the next start.                                                                                                                                                                                                                                                                                                                                                                           |
| `initial_start`     |TIMESTAMPTZ| The interval from the finish time of the last execution to the [next_start][next-start].| ✖| Set the time this job is first run. This is also the time that `next_start` is calculated from.                                                                                                                                                                                                                                                                                                                                                                             |
| `timezone`          |TEXT| UTC. However, daylight savings time(DST) changes may shift this alignment. | ✖ | Set to a valid time zone to mitigate DST shifting. If `initial_start` is set, subsequent executions of this policy are aligned on `initial_start`.                                                                                                                                                                                                                                                                                                                          |
| `if_not_exists`     |BOOLEAN| `false` | ✖ | Set to `true` so this job fails with a warning rather than an error if a $COLUMNSTORE policy already exists on `hypertable`                                                                                                                                                                                                                                                                                                                                                 |
| `hypercore_use_access_method`         | BOOLEAN | `NULL` | ✖ | Set to `true` to use $HYPERCORE table access method. If set to `NULL` it will use the value from `timescaledb.default_hypercore_use_access_method`.                                                                                                                                                                                                                                                                                                                         |

<!-- vale Google.Acronyms = YES -->
<!-- vale Vale.Spelling = YES -->


[compression_alter-table]: /api/:currentVersion:/hypercore/alter_table/
[compression_continuous-aggregate]: /api/:currentVersion:/hypercore/alter_materialized_view/
[set_integer_now_func]: /api/:currentVersion:/hypertable/set_integer_now_func
[informational-views]: /api/:currentVersion:/informational-views/jobs/
[chunk_time_interval]: /api/:currentVersion:/hypertable/set_chunk_time_interval/
[next-start]: /api/:currentVersion:/informational-views/jobs/#arguments
[job]: /api/:currentVersion:/jobs-automation/add_job/
[remove_columnstore_policy]: /api/:currentVersion:/hypercore/remove_columnstore_policy/
[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
[hypercore]: /use-timescale/:currentVersion:/hypercore/
[secondary-indexes]: /use-timescale/:currentVersion:/hypercore/secondary-indexes/
[bloom-filters]: https://en.wikipedia.org/wiki/Bloom_filter
