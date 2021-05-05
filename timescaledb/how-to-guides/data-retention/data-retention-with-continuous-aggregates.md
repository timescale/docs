# Data Retention with Continuous Aggregates

Extra care must be taken when using retention policies or `drop_chunks` calls on
hypertables which have [continuous aggregates][continuous_aggregates] defined on
them. Similar to a refresh of a materialized view, a refresh on a continuous aggregate
will update the aggregate to reflect changes in the underlying source data. This means
that any chunks that are dropped in the region still being refreshed by the
continuous aggregate will cause the chunk data to disappear from the aggregate as
well. If the intent is to keep the aggregate while dropping the underlying data,
the interval being dropped should not overlap with the offsets for the continuous
aggregate.

As an example, let's add a continuous aggregate to our `conditions` hypertable:
```sql
CREATE MATERIALIZED VIEW conditions_summary_daily (day, device, temp)
WITH (timescaledb.continuous) AS
  SELECT time_bucket('1 day', time), device, avg(temperature)
  FROM conditions
  GROUP BY (1, 2);

SELECT add_continuous_aggregate_policy('conditions_summary_daily', '7 days', '1 day', '1 day');
```

This will create the `conditions_summary_daily` aggregate which will store the daily
temperature per device from our `conditions` table. However, we have a problem here
if we're using our 24 hour retention policy from above, as our aggregate will capture
changes to the data for up to seven days. As a result, we will update the aggregate
when we drop the chunk from the table, and we'll ultimately end up with no data in our
`conditions_summary_daily` table.

We can fix this by replacing the `conditions` retention policy with one having a more
suitable interval:
```sql
SELECT remove_retention_policy('conditions');
SELECT add_retention_policy('conditions', INTERVAL '30 days');
```

It's worth noting that continuous aggregates are also valid targets for `drop_chunks`
and retention policies. To continue our example, we now have our `conditions` table
holding the last 30 days worth of data, and our `conditions_daily_summary` holding
average daily values for an indefinite window after that. The following will change
this to also drop the aggregate data after 600 days:

```sql
SELECT add_retention_policy('conditions_summary_daily', INTERVAL '600 days');
```


[drop_chunks]: /api/:currentVersion:/hypertable/drop_chunks
[add_retention_policy]: /api/:currentVersion:/data-retention/add_retention_policy
[continuous_aggregates]: /how-to-guides/continuous-aggregates
