# Create a data retention policy

An intrinsic part of working with time-series data is that the relevance of
data can diminish over time. New data accumulates, and old data
is rarely, if ever, updated. Thus, you often want to delete old raw
data to save disk space.

You can use continuous aggregates to downsample the data, combined with
data retention policies to discard historic raw data points.

<highlight type="note">
In the following image, dropping data on the underlying hypertable doesn't 
affect the continuous aggregate. Your aggregate is unaffected as long as you do not refresh the continuous aggregate 
for time periods where you dropped data.
</highlight>

  <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/continuous-aggregate-policy-retention.jpg" alt="Continuous aggregate with refresh and retention policies"/>

There are two ways to drop historic data from a hypertable: 
1. Automatic data retention policy
2. Manually dropping chunks

This first section describes the automatic refresh policy, which removes data 
on a schedule. 

## Automatic data retention policies

**Automated data retention policies** drop data according to a schedule and defined rules. 
These policies are "set it and forget it" in nature, meaning less hassle 
for maintenance and upkeep.

For example, you may want to continually remove stock data in the underlying hypertable 
`stocks_real_time` for time periods greater than three weeks ago. You can use this code with 
the [`add_retention_policy()`][retention-policy] function to set up the automatic retention policy for this:

```sql
SELECT add_retention_policy('stocks_real_time', INTERVAL '3 weeks');
```
Once you run this command, all data older than 3 weeks is dropped from `stocks_real_time`, 
and a recurring retention policy is created. No data is dropped from your continuous aggregate,
`stocks_real_time_daily`.

To see information about your retention policies and their job statistics, use the
following code to see the informational views:

```sql
SELECT * FROM timescaledb_information.jobs;

SELECT * FROM timescaledb_information.job_stats;
```

## Manual data retention

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