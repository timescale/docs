# Continuous Aggregates

Aggregate queries which touch large swathes of time-series data can
take a long time to compute because the system needs to scan large
amounts of data on every query execution. To make such queries faster,
a continuous aggregate allows materializing the computed aggregates,
while also providing means to continuously, and with low overhead,
keep them up-to-date as the underlying source data changes.

Continuous aggregates are somewhat similar to PostgreSQL's
[materialized views][postgres-materialized-views], but, unlike a
materialized view, a continuous aggregate can be continuously and
incrementally refreshed. The refreshing can be done either manually or
via a policy that runs in the background, and can cover the entire
continuous aggregate or just a specific time range. In either case,
the refresh only recomputes the aggregate buckets that have changed
since the last refresh.
 
### An introductory example [](quick-start)

As a quick introductory example, let's create a hypertable
`conditions` containing temperature data for devices and a continuous
aggregate to compute the daily average, minimum, and maximum
temperature. Start off by creating the hypertable and populate it with
some data:

```sql
CREATE TABLE conditions (
      time TIMESTAMPTZ NOT NULL,
      device INTEGER NOT NULL,
      temperature FLOAT NOT NULL,
      PRIMARY KEY(time, device)
);
SELECT * FROM create_hypertable('conditions', 'time', 'device', 3);

INSERT INTO conditions
SELECT time, (random()*30)::int, random()*80 - 40
FROM generate_series(TIMESTAMP '2020-01-01 00:00:00',
     		     TIMESTAMP '2020-06-01 00:00:00',
		     INTERVAL '10 min') AS time;
```

You can then create a continuous aggregate view to compute the hourly
average, minimum, and maximum temperature:

```sql
CREATE MATERIALIZED VIEW conditions_summary_hourly
WITH (timescaledb.continuous) AS
SELECT device,
       time_bucket(INTERVAL '1 hour', time) AS bucket,
       AVG(temperature),
       MAX(temperature),
       MIN(temperature)
FROM conditions
GROUP BY device, bucket;
```

Lastly, you should add a policy to ensure that the continuous
aggregate is refreshed on a regular basis.

```sql
SELECT add_continuous_aggregate_policy('conditions_summary_hourly',
	start_offset => INTERVAL '1 month',
	end_offset => INTERVAL '1 h',
	schedule_interval => INTERVAL '1 h');
```

In this case, the continuous aggregate will be refreshed every hour
and refresh the last month's data.

You can now run a normal `SELECT` on the continuous aggregate and it
will give you the aggregated data, for example, to select the daily
averages for device 1 during the first three months:

```sql
SELECT bucket, avg
  FROM conditions_summary_hourly
 WHERE device = 1 AND bucket BETWEEN '2020-01-01' AND '2020-03-31'
ORDER BY bucket;
```

Continuous aggregates are supported for most aggregate functions that
can be [parallelized by PostgreSQL][postgres-parallel-agg], which
includes the normal aggregates like `SUM` and `AVG`. However,
aggregates using `ORDER BY` and `DISTINCT` cannot be used with
continuous aggregates since they are not possible to parallelize by
PostgreSQL. In addition, TimescaleDB continuous aggregates do not
currently support the `FILTER` clause (not to be confused with
`WHERE`) even though it is possible to parallelize but we might add
support for this in a future version.

### Real-Time Aggregation [](real-time-aggregates)

A query on a continuous aggregate will, by default, use *real-time
aggregation* (first introduced in TimescaleDB 1.7) to combine
materialized aggregates with recent data from the source
hypertable. By combining raw and materialized data in this way,
real-time aggregation produces accurate and up-to-date results while
still benefiting from pre-computed aggregates for a large portion of
the result.

Real-time aggregation is the default behavior for any new continuous
aggregates. To disable real-time aggregation and show only
materialized data, add the parameter
`timescaledb.materialized_only=true` when creating the continuous
aggregate view or set it on an existing continuous aggregate using
[`ALTER MATERIALIZED VIEW`][api-alter-cagg].

<highlight type="tip">
To use real-time aggregation on a continuous aggregate created
in a version earlier than TimescaleDB 1.7, alter the view to set
`timescaledb.materialized_only=false`.
</highlight>

#### Automatic refresh with a continuous aggregate policy

Continuous aggregates can be kept up-to-date through the last bucket width of
time by using continuous aggregate policies. Policies allow you to keep a
specified window of time within the continuous aggregate updated on a schedule.
This provides the ability to do things like: 

- have the continuous aggregate and the hypertable be in sync, even
  when data is removed from the hypertable, or
- keep the aggregate data in the continuous aggregate when removing
  source data from the hypertable.

#### Manually Refreshing continuous aggregate ranges [](refresh-cagg)

It is also possible, starting with TimescaleDB 2.0, to manually refresh
a specific window of time in a continuous aggregate using 
`refresh_continuous_aggregate`. Using this TimescaleDB function gives users the
ability to have the best of both worlds: automatic refresh of recent data and
targeted updates to time ranges that may occur further in history through 
a backfill process. Using both tools to keep continuous aggregates up-to-date
provides great control and flexibility!


[fff-system]: https://en.wikipedia.org/wiki/FFF_system
[sec-data-retention]: /using-timescaledb/data-retention#data-retention
[postgres-materialized-views]: https://www.postgresql.org/docs/current/rules-materializedviews.html
[api-continuous-aggs]:/api#continuous-aggregates
[postgres-createview]: https://www.postgresql.org/docs/current/static/sql-createview.html
[pg-func-stable]: https://www.postgresql.org/docs/current/static/sql-createfunction.html
[time-bucket]: /api#time_bucket
[api-continuous-aggs-create]: /api#continuous_aggregate-create_view
[postgres-parallel-agg]:https://www.postgresql.org/docs/current/parallel-plans.html#PARALLEL-AGGREGATION
[api-refresh-continuous-aggs]: /api#continuous_aggregate-refresh_view
[api-alter-cagg]: /api#continuous_aggregate-alter_view
[api-continuous-aggregates-info]: /api#timescaledb_information-continuous_aggregate
[api-job-stats]: /api#timescaledb_information-job_stats
[api-drop-chunks]: /api#drop_chunks
[api-set-chunk-interval]: /api#set_chunk_time_interval
[api-set-integer-now-func]: /api#set_integer_now_func
[api-add-retention]: /api#add_retention_policy
[timescale-github]: https://github.com/timescale/timescaledb
[support-slack]: https://slack-login.timescale.com
[postgres-ordered-set]: https://www.postgresql.org/docs/current/functions-aggregate.html#FUNCTIONS-ORDEREDSET-TABLE
[clock_timestamp]: http://www.postgresql.org/docs/12/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT
[add-continuous-aggregate-policy]: /api#add_continuous_aggregate_policy
[refresh_continuous_aggregate]: /api#refresh_continuous_aggregate
[retention-aggregate]: /using-timescaledb/data-retention#retention-with-aggregates
