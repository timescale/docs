---
title: Create a data retention policy
excerpt: Automatically drop historical data with a data retention policy
products: [cloud, mst, self_hosted]
keywords: [data retention, policies, create]
layout_components: [next_prev_large]
content_group: Getting started
---

# Create a data retention policy

An intrinsic part of working with time-series data is that the relevance of data
can diminish over time. As new data accumulates, old data becomes less valuable and
is rarely, if ever, updated. So, you often want to delete old raw data to save
disk space.

This is particularly helpful when combined with continuous aggregates. The raw
data is downsampled into a continuous aggregate and then a data retention policy
can drop older raw data that's no longer needed.

In this image, dropping data on the underlying hypertable doesn't affect the
continuous aggregate. Your continuous aggregate is unaffected as long as you do
not refresh the continuous aggregate for time periods where you dropped data:

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/continuous-aggregate-policy-retention.jpg" alt="Continuous aggregate with refresh and retention policies"/>

There are two ways to drop historic data from a hypertable:

*   Automatic data retention policy
*   Manually dropping chunks

## Create an automated data retention policy

Automated data retention policies drop data according to a schedule and defined
rules. These policies are "set it and forget it" in nature, meaning less hassle
for maintenance and upkeep.

For example, many stock trading apps don't need raw trade data once continuous
aggregates have been created for various time buckets that show the high, low,
open, and close values. To save disk space consumed by raw data that is rarely
queried, you may want to continually remove stock trade data in the underlying
hypertable `stocks_real_time` after the trade timestamp is older than three
weeks ago.

<Procedure>

### Creating an automated data retention policy

1.  Use the [`add_retention_policy()`][retention-policy] function to add an
    automatic retention policy to the `stocks_real_time` table:

    ```sql
    SELECT add_retention_policy('stocks_real_time', INTERVAL '3 weeks');
    ```

  When you run this command, all data older than 3 weeks is dropped from
  `stocks_real_time`, and a recurring retention policy is created. No data is
  dropped from your continuous aggregate, `stocks_real_time_daily`.

1.  To see information about your retention policies and verify job statistics,
    query the Timescale informational views:

    ```sql
    SELECT * FROM timescaledb_information.jobs;
    ```

    The results look like this:

    ```bash
    job_id|application_name                          |schedule_interval|max_runtime|max_retries|retry_period|proc_schema          |proc_name                          |owner    |scheduled|config                                                                        |next_start                   |hypertable_schema    |hypertable_name           |
    ------+------------------------------------------+-----------------+-----------+-----------+------------+---------------------+-----------------------------------+---------+---------+------------------------------------------------------------------------------+-----------------------------+---------------------+--------------------------+
        1|Telemetry Reporter [1]                    |         24:00:00|   00:01:40|         -1|    01:00:00|_timescaledb_internal|policy_telemetry                   |postgres |true     |                                                                              |2022-05-04 21:52:45.304 -0400|                     |                          |
      1000|Refresh Continuous Aggregate Policy [1000]|         01:00:00|   00:00:00|         -1|    01:00:00|_timescaledb_internal|policy_refresh_continuous_aggregate|tsdbadmin|true     |{"end_offset": "00:01:00", "start_offset": "02:00:00", "mat_hypertable_id": 3}|2022-05-04 16:21:36.704 -0400|_timescaledb_internal|_materialized_hypertable_3|
    ```

1.  Or you can try this query:

    ```sql
    SELECT * FROM timescaledb_information.job_stats;
    ```

    The results look like this:

    ```bash
    hypertable_schema    |hypertable_name           |job_id|last_run_started_at          |last_successful_finish       |last_run_status|job_status|last_run_duration|next_start                   |total_runs|total_successes|total_failures|
    ---------------------+--------------------------+------+-----------------------------+-----------------------------+---------------+----------+-----------------+-----------------------------+----------+---------------+--------------+
    _timescaledb_internal|_materialized_hypertable_3|  1000|2022-05-04 15:21:36.443 -0400|2022-05-04 15:21:36.704 -0400|Success        |Scheduled |  00:00:00.260945|2022-05-04 16:21:36.704 -0400|      1978|           1978|             0|
                        |                          |     1|2022-05-03 21:52:45.068 -0400|2022-05-03 21:52:45.304 -0400|Success        |Scheduled |  00:00:00.235434|2022-05-04 21:52:45.304 -0400|       109|            108|             1|
    ```

</Procedure>

## Manually drop older hypertable chunks

To manually remove data on a once-off basis, use the Timescale function
[`drop_chunks()`][drop-chunks].

This function takes similar arguments to the data retention policy. However, in
addition to letting you drop data older than a particular interval, it also lets
you drop data that is newer than a particular interval. This means you can drop
data from an interval that is bounded on both ends.

To drop all data older than three weeks, run:

```sql
SELECT drop_chunks('stocks_real_time', INTERVAL '3 weeks');
```

To drop all data older than two weeks but newer than three weeks old:

```sql
SELECT drop_chunks(
  'stocks_real_time',
  older_than => INTERVAL '2 weeks',
  newer_than => INTERVAL '3 weeks'
)
```

## Learn more about data retention

For more details and best practices on data retention and automated data retention
policies, see the [Data Retention docs][data-retention].

<Video url="https://www.youtube.com/embed/BJRIntSAmHM"></Video>

[data-retention]: /use-timescale/:currentVersion:/data-retention/
[drop-chunks]: /api/:currentVersion:/hypertable/drop_chunks/
[retention-policy]: /api/:currentVersion:/data-retention/add_retention_policy/
