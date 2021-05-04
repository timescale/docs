# Creating a continuous aggregates

Creating a refreshing [continuous aggregate][api-continuous-aggs] is a two-step
process. First, one needs to create a continuous aggregate view of the data
using [`CREATE MATERIALIZED VIEW`][postgres-createview] with the
`timescaledb.continuous` option. Second, a continuous aggregate
policy needs to be created to keep it refreshed.

You can create several continuous aggregates for the same
hypertable. For example, you could create another continuous aggregate
view for daily data.

```sql
CREATE MATERIALIZED VIEW conditions_summary_daily
WITH (timescaledb.continuous) AS
SELECT device,
       time_bucket(INTERVAL '1 day', time) AS bucket,
       AVG(temperature),
       MAX(temperature),
       MIN(temperature)
FROM conditions
GROUP BY device, bucket;

-- Create the policy
SELECT add_continuous_aggregate_policy('conditions_summary_daily',
	start_offset => INTERVAL '1 month',
	end_offset => INTERVAL '1 day',
	schedule_interval => INTERVAL '1 hour');
```

<highlight type="tip">
If you have a lot of historical data to aggregate into the view, consider using
the `WITH NO DATA` option.
</highlight>

A `time_bucket` on the time partitioning column of the hypertable is
required in all continuous aggregate views. If you do not provide one,
you will get an error.

When the view is created, it will (by default) be populated with data
so that it contains the aggregates computed across the entire
`conditions` hypertable.

It might, however, not always be desirable to populate the continuous
aggregate when created. If the amount of data in `conditions` is large
and new data is continuously being added, it is often more useful to
control the order in which the data is refreshed by combining manual
refresh with a policy. For example, one could use a policy to refresh
only recent (and future) data while historical data is left to manual
refreshes. In those cases, the `WITH NO DATA` option can be used to
avoid aggregating all the data during creation.

The [`refresh_continuous_aggregate`][refresh_continuous_aggregate]
command is used for manual refreshing. For example, to refresh one
month of data you could write:

```sql
CALL refresh_continuous_aggregate('conditions_summary_hourly', '2020-05-01', '2020-06-01');
```

Unlike a regular materialized view, the refresh command will only
recompute the data within the window that has changed in the
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

Continuous aggregates are supported for most aggregate functions that
can be [parallelized by PostgreSQL][postgres-parallel-agg], which
includes the normal aggregates like `SUM` and `AVG`. However,
aggregates using `ORDER BY` and `DISTINCT` cannot be used with
continuous aggregates since they are not possible to parallelize by
PostgreSQL. In addition, TimescaleDB continuous aggregates do not
currently support the `FILTER` clause (not to be confused with
`WHERE`) even though it is possible to parallelize but we might add
support for this in a future version.


## Using `WITH NO DATA` when creating a Continuous Aggregate

If you have a lot of historical data, we suggest creating the continuous aggregate
using the `WITH NO DATA` parameter for the `CREATE MATERIALIZED VIEW` command. Doing
so will allow the continuous aggregate to be created instantly (you won't have to wait
for the data to be aggregated on creation!). Data will then begin to populate as the
continuous aggregate policy begins to run.

**However**, only data newer than `start_offset` would begin to populate the continuous
aggregate. If you have historical data that is older than the `start_offset` INTERVAL,
you need to manually refresh history up to the current `start_offset` to allow
real-time queries to run efficiently.

```sql
CREATE MATERIALIZED VIEW cagg_rides_view WITH
  (timescaledb.continuous)
AS
SELECT vendor_id, time_bucket('1h', pickup_datetime) as day,
  count(*) total_rides,
  avg(fare_amount) avg_fare,
  max(trip_distance) as max_trip_distance,
  min(trip_distance) as min_trip_distance
FROM rides
GROUP BY vendor_id, time_bucket('1h', pickup_datetime)
WITH NO DATA;

CALL refresh_continuous_aggregate('cagg_rides_view', NULL, localtimestamp - INTERVAL '1 week');

SELECT add_continuous_aggregate_policy('cagg_rides_view',
  start_offset => INTERVAL '1 week',
  end_offset   => INTERVAL '1 hour',
  schedule_interval => INTERVAL '30 minutes');
```

[api-continuous-aggs]: /api/:currentVersion:/continuous-aggregates/
[postgres-createview]: https://www.postgresql.org/docs/current/rules-materializedviews.html
[refresh_continuous_aggregate]: /continuous-aggregates/refresh_continuous_aggregate/
