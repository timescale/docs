---
title: About data retention with continuous aggregates
excerpt: How data retention works with continuous aggregates for downsampling
products: [cloud, mst, self_hosted]
keywords: [continuous aggregates, data retention]
---

# About data retention with continuous aggregates

You can downsample your data by combining a data retention policy with
[continuous aggregates][continuous_aggregates]. If you set your refresh policies
correctly, you can delete old data from a hypertable without deleting it from
any continuous aggregates. This lets you save on raw data storage while keeping
summarized data for historical analysis.

<Highlight type="warning">
To keep your aggregates while dropping raw data, you must be careful about
refreshing your aggregates. You can delete raw data from the underlying table
without deleting data from continuous aggregates, so long as you don't refresh
the aggregate over the deleted data. When you refresh a continuous aggregate,
Timescale updates the aggregate based on changes in the raw data for the
refresh window. If it sees that the raw data was deleted, it also deletes the
aggregate data. To prevent this, make sure that the aggregate's refresh window
doesn't overlap with any deleted data. For more information, see the following
example.
</Highlight>

As an example, say that you add a continuous aggregate to a `conditions`
hypertable that stores device temperatures:

```sql
CREATE MATERIALIZED VIEW conditions_summary_daily (day, device, temp)
WITH (timescaledb.continuous) AS
  SELECT time_bucket('1 day', time), device, avg(temperature)
  FROM conditions
  GROUP BY (1, 2);

SELECT add_continuous_aggregate_policy('conditions_summary_daily', '7 days', '1 day', '1 day');
```

This creates a `conditions_summary_daily` aggregate which stores the daily
temperature per device. The aggregate refreshes every day. Every time it
refreshes, it updates with any data changes from 7 days ago to 1 day ago.

You should **not** set a 24-hour retention policy on the `conditions`
hypertable. If you do, chunks older than 1 day are dropped. Then the aggregate
refreshes based on data changes. Since the data change was to delete data older
than 1 day, the aggregate also deletes the data. You end up with no data in the
`conditions_summary_daily` table.

To fix this, set a longer retention policy, for example 30 days:

```sql
SELECT add_retention_policy('conditions', INTERVAL '30 days');
```

Now, chunks older than 30 days are dropped. But when the aggregate refreshes, it
doesn't look for changes older than 30 days. It only looks for changes between 7
days and 1 day ago. The raw hypertable still contains data for that time period.
So your aggregate retains the data.

## Data retention on a continuous aggregate itself

You can also apply data retention on a continuous aggregate itself. For example,
you can keep raw data for 30 days, as mentioned earlier. Meanwhile, you can keep
daily data for 600 days, and no data beyond that.

[continuous_aggregates]: /use-timescale/:currentVersion:/continuous-aggregates
