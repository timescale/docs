# Create a data retention policy

An intrinsic part of working with time-series data is that the relevance of
data can diminish over time. New data accumulates, and old data
is rarely if ever, updated. Thus, it is often desirable to delete old raw
data to save disk space.

In practice, continuous aggregates downsample the data and then
 data retention policies discard historic raw data points.

<highlight type="note">
In the following image, dropping data on the underlying hypertable doesn't 
affect the continuous aggregate. Your aggregate is unaffected as long as you do not refresh the continuous aggregate 
for time periods where you dropped data.
</highlight>

  <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/continuous-aggregate-policy-retention.jpg" alt="Continuous aggregate with refresh and retention policies"/>

There are two ways to drop historic data from a hypertable: 
1. Automatic data retention policy
2. Manually dropping chunks

In this first section, we look at the automatic refresh policy and remove data 
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
Similar to the continuous aggregates policy, once you run this code, all data 
from three weeks prior will be dropped in `stocks_real_time`, and a recurring retention
policy is created. 

To see information about your retention policies and their job statistics, use the
following code to see the informational views:

```sql
SELECT * FROM timescaledb_information.jobs;

SELECT * FROM timescaledb_information.job_stats;
```

## Manual data retention

Timescale also provides a function that drops chunks for situations where 
you want to perform manual **one-time** removal of data. This function is 
[`drop_chunks()`][drop-chunks]

This function has similar arguments to the retention policy above. However, besides 
setting an interval for when to drop data after, you can also specify a
parameter to drop data before. This means that you can drop all data after a particular 
time **or** specify to drop data within an interval of time. 

Use this code for dropping all data older than three months:
```sql
SELECT drop_chunks('stocks_real_time', INTERVAL '3 months');
```
Use this code for dropping data older than two months but earlier than three months old:
```sql
SELECT drop_chunks('stocks_real_time', older_than => INTERVAL '2 month', newer_than => INTERVAL '3 months')
```

## Learn more about data retention

For more details and best practices on data retention and automated data retention
policies, see the [Data Retention docs][data-retention].

[data-retention]: /how-to-guides/data-retention/
[drop-chunks]: /api/:currentVersion:/hypertable/drop_chunks/
[retention-policy]: /api/:currentVersion:/data-retention/add_retention_policy/