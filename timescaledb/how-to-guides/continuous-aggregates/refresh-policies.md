# Refresh continuous aggregates
Continuous aggregates can have a range of different refresh policies. In addition to refreshing the continuous aggregate automatically using a policy, you can also refresh it manually.

## Change the refresh policy
Continuous aggregates require a policy for automatic refreshing. You can adjust
this to suit different use cases. For example, you can have the continuous
aggregate and the hypertable stay in sync, even when data is removed from the
hypertable, or you could keep source data in the continuous aggregate even after
it is removed from the hypertable.

You can change the way your continuous aggregate is refreshed by adjusting the
[add_continuous_aggregate_policy][api-add-continuous-aggregate-policy]. The
policy takes three arguments:
*   `start_offset`: the start of the refresh window relative to when the policy runs
*   `end_offset`: the end of the refresh window relative to when the policy runs
*   `schedule_interval`: the refresh interval in minutes or hours

If you set the `start_offset` or `end_offset` to NULL, the range is open-ended
and will extend to the beginning or end of time. However, we recommend that you set the `end_offset` so that at least the most recent time bucket is excluded. For time-series
data that mostly contains writes that occur in time stamp order, the time buckets that see
lots of writes will quickly have out-of-date aggregates. You get better performance by excluding the time buckets that are getting a lot of writes.

### Procedure: Changing a refresh policy
1.  At the `psql` prompt, create a new policy called `conditions_summary_hourly` that keeps the continuous aggregate up to date and runs every hour:
    ```sql
    SELECT add_continuous_aggregate_policy('conditions_summary_hourly',
	     start_offset => NULL,
	     end_offset => INTERVAL '1 h',
	     schedule_interval => INTERVAL '1 h');
    ```

The policy in this example ensures that all the data in the continuous aggregate is up to
date with the hypertable except for anything written in the last hour. It also ensures that we do not try to refresh the last time bucket of the continuous aggregate. Because it has an open-ended `start_offset` parameter, any data that is removed from the table, for example with a DELETE or with `drop_chunks`, is also removed from the continuous aggregate view. This means that the continuous aggregate will always reflect the data in the underlying hypertable.

<!---
Lana, you're up to here! --LKB 2021-06-22
-->

If you instead want to keep data in the continuous aggregate even if
the source data is removed from the underlying hypertable, you also
need to set the `start_offset` in way that is compatible with the
[data retention policy][sec-data-retention] on the source
hypertable. For example, if you have a retention policy that removes
data older than one month, you need to set `start_offset` to one month
(or less) and thereby not refresh the region of dropped data.

```sql
SELECT add_continuous_aggregate_policy('conditions_summary_hourly',
	start_offset => INTERVAL '1 month',
	end_offset => INTERVAL '1 h',
	schedule_interval => INTERVAL '1 h');
```

<highlight type="warning">
It is important to consider data retention policies when
setting up continuous aggregate policies. If the continuous aggregate
policy window covers data that is removed by the data retention
policy, the aggregates for those buckets will be refreshed and
consequently the data will be removed. For example, if you have a
data retention policy that will remove all data older than 2 weeks,
the continuous aggregate policy above will only have data for the
last two weeks. A more reasonable data retention policy for this case
would then be to remove data that is older than 1 month.

You can read more about data retention with continuous aggregates in
the [*Data retention*][sec-data-retention] section.
</highlight>

A continuous aggregate may be dropped by using the `DROP MATERIALIZED
VIEW` command. It does not affect the data in the hypertable from
which the continuous aggregate is derived (`conditions` in the example
above).

```sql
DROP MATERIALIZED VIEW conditions_summary_hourly;
```




[sec-data-retention]: /hot-to-guides/data-retention
[api-drop-chunks]: /api/:currentVersion:/hypertable/drop_chunks
[api-add-continuous-aggregate-policy]: /api/:currentVersion:/continuous-aggregates/add_continuous_aggregate_policy


## Manually refresh a continuous aggregate
The refresh command recomputes the data within the window that has changed in the
underlying hypertable since the last refresh. Therefore, if only a few
buckets need updating, then the refresh is quick.

Note that the end range is exclusive and aligned to the buckets of the
continuous aggregate, so this will refresh only the buckets that are
fully in the date range `['2020-05-01', '2020-06-01')`, that is, up to
but not including `2020-06-01`. While it is possible to use `NULL` to
indicate an open-ended range, we do not in general recommend using
it. Such a refresh might materialize a lot of data, have a negative
affect on performance, and can affect other policies such as data
retention. For more information, see the [Advanced
Usage](#advanced-usage) section below.

### Procedure: Refreshing a continuous aggregate
1.  To manually refresh a continuous aggregate, use the `refresh` command:
    ```sql
    CALL refresh_continuous_aggregate('conditions_summary_hourly', '2020-05-01', '2020-06-01');
    ```



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
