## Refreshing continuous aggregates

When using `refresh_continuous_aggregate` it is possible to use `NULL`
to indicate an open-ended range either for the start of the window or
the end of the window. For example, to refresh the complete range of a
continuous aggregate, write:

```sql
CALL refresh_continuous_aggregate('conditions_summary_hourly, NULL, NULL);
```

However, we do not recommend open-ended refreshes on continuous
aggregates when there is a continuous ingest of new data since that
would trigger a refresh of time buckets that are not yet completely
filled. It might also materialize a lot of data, increase write
amplification, and affect other policies such as data retention.

You should avoid refreshing time intervals that still see a lot
of writes, which is usually the last bucket of the continuous
aggregate. These intervals are still changing and are unlikely to
produce accurate aggregates, while at the same time slowing down the
ingest rate of the hypertable due to write amplification. If you want
to include the latest bucket in your queries, you should instead rely
on [real-time aggregation][real-time-aggregates].

The `schedule_interval` option to `add_continuous_aggregate_policy`
controls how frequently materialization jobs will be run. Setting a
shorter interval will refresh more frequently but at the same time
consume more background worker resources.

[real-time-aggregates]: https://blog.timescale.com/blog/achieving-the-best-of-both-worlds-ensuring-up-to-date-results-with-real-time-aggregation/
