# Create a data retention policy

An intrinsic part of working with time-series data is that the relevance of
data can diminish over time. As new data accumulates old data becomes less value
and is rarely, if ever, updated. Thus, you often want to delete old raw
data to save disk space.

This is particularly helpful when combined with continuous aggregates. The raw data
is downsampled into a continuous aggregate and then a data retention policy can drop
order raw data that's no longer needed.

<highlight type="note">
In the following image, dropping data on the underlying hypertable doesn't 
affect the continuous aggregate. Your continuous aggregate is unaffected as long 
as you do not refresh the continuous aggregate for time periods where you dropped data.
</highlight>

  <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/continuous-aggregate-policy-retention.jpg" alt="Continuous aggregate with refresh and retention policies"/>

There are two ways to drop historic data from a hypertable: 
1. Automatic data retention policy
2. Manually dropping chunks


## Creating a data retention policy

**Automated data retention policies** drop data according to a schedule and defined rules. 
These policies are "set it and forget it" in nature, meaning less hassle 
for maintenance and upkeep.

For example, many stock trading apps don't need raw trade data once continuous aggregates
have been created for various time buckets that show the high, low, open, and close
values. To save disk space consumed by raw data that is rarely queried, you may want
to continually remove stock trade data in the underlying hypertable `stocks_real_time` 
after the trade timestamp is older than three weeks ago.

<procedure>

### Create a data retention policy

1. Use the [`add_retention_policy()`][retention-policy] function to an automatic 
   retention policy on the `stocks_real_time` table:
  ```sql
  SELECT add_retention_policy('stocks_real_time', INTERVAL '3 weeks');
  ```

  Once you run this command, all data older than 3 weeks is dropped from `stocks_real_time`, 
  and a recurring retention policy is created. No data is dropped from your continuous aggregate,
  `stocks_real_time_daily`.

1. To see information about your retention policies verify job statistics, query the
   TimescaleDB informational views:

  ```sql
  SELECT * FROM timescaledb_information.jobs;
  ```
  ```bash
  job_id|application_name                          |schedule_interval|max_runtime|max_retries|retry_period|proc_schema          |proc_name                          |owner    |scheduled|config                                                                        |next_start                   |hypertable_schema    |hypertable_name           |
  ------+------------------------------------------+-----------------+-----------+-----------+------------+---------------------+-----------------------------------+---------+---------+------------------------------------------------------------------------------+-----------------------------+---------------------+--------------------------+
      1|Telemetry Reporter [1]                    |         24:00:00|   00:01:40|         -1|    01:00:00|_timescaledb_internal|policy_telemetry                   |postgres |true     |                                                                              |2022-05-04 21:52:45.304 -0400|                     |                          |
    1000|Refresh Continuous Aggregate Policy [1000]|         01:00:00|   00:00:00|         -1|    01:00:00|_timescaledb_internal|policy_refresh_continuous_aggregate|tsdbadmin|true     |{"end_offset": "00:01:00", "start_offset": "02:00:00", "mat_hypertable_id": 3}|2022-05-04 16:21:36.704 -0400|_timescaledb_internal|_materialized_hypertable_3|
  ```

  ```sql
  SELECT * FROM timescaledb_information.job_stats;
  ```
  ```bash
  hypertable_schema    |hypertable_name           |job_id|last_run_started_at          |last_successful_finish       |last_run_status|job_status|last_run_duration|next_start                   |total_runs|total_successes|total_failures|
  ---------------------+--------------------------+------+-----------------------------+-----------------------------+---------------+----------+-----------------+-----------------------------+----------+---------------+--------------+
  _timescaledb_internal|_materialized_hypertable_3|  1000|2022-05-04 15:21:36.443 -0400|2022-05-04 15:21:36.704 -0400|Success        |Scheduled |  00:00:00.260945|2022-05-04 16:21:36.704 -0400|      1978|           1978|             0|
                      |                          |     1|2022-05-03 21:52:45.068 -0400|2022-05-03 21:52:45.304 -0400|Success        |Scheduled |  00:00:00.235434|2022-05-04 21:52:45.304 -0400|       109|            108|             1|
  ```

</procedure>

## Manually drop older hypertable chunks

To manually remove data on a once-off basis, use the TimescaleDB function
[`drop_chunks()`][drop-chunks].

This function takes similar arguments to the data retention policy. However, in
addition to letting you drop data older than a particular interval, it also lets you
drop data that is newer than a particular interval. This means you can drop data
from an interval that is bounded on both ends.

To drop all data older than three months, run:
```sql
SELECT drop_chunks('stocks_real_time', INTERVAL '3 months');
```
To drop all data older than two months but newer than three months old:
```sql
SELECT drop_chunks(
  'stocks_real_time',
  older_than => INTERVAL '2 month',
  newer_than => INTERVAL '3 months'
)
```

## Learn more about data retention

For more details and best practices on data retention and automated data retention
policies, see the [Data Retention docs][data-retention].

[data-retention]: /how-to-guides/data-retention/
[drop-chunks]: /api/:currentVersion:/hypertable/drop_chunks/
[retention-policy]: /api/:currentVersion:/data-retention/add_retention_policy/