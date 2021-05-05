# Adding Automatic Refresh Policies

Continuous aggregate policies can be configured to support different
use cases. For example, you might want to:

- have the continuous aggregate and the hypertable be in sync, even
  when data is removed from the hypertable, or
- keep the aggregate data in the continuous aggregate when removing
  source data from the hypertable.

These use cases are supported by different configuration to
[`add_continuous_aggregate_policy`][add-continuous-aggregate-policy].

This function takes three arguments:

- The parameter `start_offset` indicates the start of the refresh
  window relative to the current time when the policy executes.
- The parameter `end_offset` indicates the end of the refresh window
  relative to the current time when the policy executes.
- The parameter `schedule_interval` indicates the refresh interval in
  wall-clock time.

Similar to the `refresh_continuous_aggregate` function, providing
`NULL` to `start_offset` or `end_offset` makes the range open-ended
and will extend to the beginning or end of time,
respectively. However, it seldom makes sense to use `NULL` for the
`end_offset`. Instead, it is recommended to set the `end_offset` so
that at least the most recent time bucket is excluded. For time-series
data that see mostly in-order writes, the time buckets that still see
lots of writes will quickly have out-of-date aggregates. Excluding
those time buckets will provide better performance.

For example, to create a policy for `conditions_summary_hourly` that
keeps the continuous aggregate up to date with the underlying
hypertable `conditions` and runs every hour, you would write:

```sql
SELECT add_continuous_aggregate_policy('conditions_summary_hourly',
	start_offset => NULL,
	end_offset => INTERVAL '1 h',
	schedule_interval => INTERVAL '1 h');
```

This will ensure that all data in the continuous aggregate is up to
date with the hypertable except the last hour and also ensure that we
do not try to refresh the last bucket of the continuous
aggregate. Since we give an open-ended `start_offset`, any data that
is removed from `conditions` (for example, by using `DELETE` or
[`drop_chunks`][api-drop-chunks]) will also be removed from
`conditions_summary_hourly`. In effect, the continuous aggregate will
always reflect the data in the underlying hypertable.

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

