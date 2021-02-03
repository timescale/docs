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

You can then create a continuous aggregate view to compute the daily
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

### A detailed look at continuous aggregates [](detailed-look)

As shown above, creating a refreshing [continuous
aggregate][api-continuous-aggs] is a two-step process. First, one
needs to create a continuous aggregate view of the data using [`CREATE
MATERIALIZED VIEW`][postgres-createview] with the
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

#### Automatic refresh with a continuous aggregate policy

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

>:WARNING: It is important to consider data retention policies when
>setting up continuous aggregate policies. If the continuous aggregate
>policy window covers data that is removed by the data retention
>policy, the aggregates for those buckets will be refreshed and
>consequently the data will be removed. For example, if you have a
>data retention policy that will remove all data older than 2 weeks,
>the continuous aggregate policy above will only have data for the
>last two weeks. A more reasonable data retention policy for this case
>would then be to remove data that is older than 1 month.
>
>You can read more about data retention with continuous aggregates in
>the [*Data retention*][sec-data-retention] section.

A continuous aggregate may be dropped by using the `DROP MATERIALIZED
VIEW` command. It does not affect the data in the hypertable from
which the continuous aggregate is derived (`conditions` in the example
above).

```sql
DROP MATERIALIZED VIEW conditions_summary_hourly;
```

---

### Querying Continuous Aggregates [](using)

To query data from a continuous aggregate, use a `SELECT` query on
the continuous aggregate view. For instance, you can get the average,
minimum, and maximum for the first quarter of 2020 for device 5:

```sql
SELECT * FROM conditions_summary_hourly
WHERE device = 5
  AND bucket >= '2020-01-01' AND bucket < '2020-04-01';
```

Or we can do more complex queries on the aggregates themselves, for instance, if
we wanted to know the top 20 largest metric spreads in that quarter, we could do
something like:
```sql
SELECT * FROM conditions_summary_hourly
WHERE max - min > 1800
  AND bucket >= '2020-01-01' AND bucket < '2020-04-01'
ORDER BY bucket DESC, device_id DESC LIMIT 20;
```

---

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

>:TIP: To use real-time aggregation on a continuous aggregate created
in a version earlier than TimescaleDB 1.7, alter the view to set
`timescaledb.materialized_only=false`.

---

### Advanced Topics [](advanced-usage)

#### Refreshing continuous aggregates [](refresh-cagg)

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

>:TIP: You should avoid refreshing time intervals that still see a lot
>of writes, which is usually the last bucket of the continuous
>aggregate. These intervals are still changing and are unlikely to
>produce accurate aggregates, while at the same time slowing down the
>ingest rate of the hypertable due to write amplification. If you want
>to include the latest bucket in your queries, you should instead rely
>on [real-time aggregation][real-time-aggregates].

The `schedule_interval` option to `add_continuous_aggregate_policy`
controls how frequently materialization jobs will be run. Setting a
shorter interval will refresh more frequently but at the same time
consume more background worker resources.

#### Using `timescaledb.information` Views
The various options used to create the continuous aggregate view, as well as its
definition, can be found in the
[`timescaledb_information.continuous_aggregates` view][api-continuous-aggregates-info],
and information about the state and progress of the materialization background worker jobs can be found in the
[`timescaledb_information.job_stats` view][api-job-stats].
These views can be quite useful for administering continuous aggregates and
tuning other options noted below.

### Dropping Data with Continuous Aggregates Enabled [](dropping-data)
Note that if any still-refreshing (more recent than `start_offset`) part of the
continuous aggregate is dropped via a [retention policy][api-add-retention] or
direct [`drop_chunks`][api-drop-chunks] call, the aggregate will be updated to
reflect the loss of data. For this reason, if it is desired to retain the continuous
aggregate after dropping the underlying data, the `start_offset` of the aggregate
policy must be set to a smaller interval than the `drop_after` parameter of a
hypertable's retention policy. Similiarly, when calling `drop_chunks`, extra
care should also be taken to ensure that any such chunks are not within the
refresh window of a continuous aggregate that still needs the data.  More detail
and examples of this can be seen in the the [data retention documentation][retention-aggregate].

This is also a consideration when manually refreshing a continuous aggregate.
Calling `refresh_continuous_aggregate` on a region containing dropped chunks will
recalculate the aggregate without the dropped data. This can lead to undesirable
results, such as replacing previous aggregate data with NULL values, given that the
raw data has subsequently been dropped.

#### Continuous Aggregates using Integer-Based Time [](create-integer)

Usually, continuous aggregates are defined on a
[date/time-type](https://www.postgresql.org/docs/current/datatype-datetime.html)
column, but it is also possible to create your own custom scheme for
handling aggregation for tables that are using an integer time
column. This can be useful if you have tables that use other measures
of time that can be represented as integer values, such as nanosecond
epochs, minutes since founding date, or whatever is suitable for your
application.

As an example, suppose that you have a table with CPU and disk usage
for some devices where time is measured in
[microfortnights][fff-system] (a microfortnight is a little more than
a second). Since you are using an integer-valued column as time, you
need to provide the chunk time interval when creating the
hypertable. In this case, let each chunk consist of a millifortnight
(a 1000 microfortnights, which is about 20 minutes).

```sql
CREATE TABLE devices(
  time BIGINT,        -- Time in microfortnights since epoch
  cpu_usage INTEGER,  -- Total CPU usage
  disk_usage INTEGER, -- Total disk usage
  PRIMARY KEY (time)
);

SELECT create_hypertable('devices', 'time',
                         chunk_time_interval => 1000);
```

To define a continuous aggregate on a hypertable that is using an
integer time dimension, it is necessary to have a function to get the
current time in whatever representation that you are using and set it
for the hypertable using
[`set_integer_now_func`][api-set-integer-now-func]. The function can
be defined as a normal PostgreSQL function, but needs to be
[`STABLE`][pg-func-stable], take no arguments, and return an integer
value of the same type as the time column in the table. In our case,
this should suffice:

```sql
CREATE FUNCTION current_microfortnight() RETURNS BIGINT
LANGUAGE SQL STABLE AS $$
	SELECT CAST(1209600 * EXTRACT(EPOCH FROM CURRENT_TIME) / 1000000 AS BIGINT)
$$;

SELECT set_integer_now_func('devices', 'current_microfortnight');
```

Once the replacement for current time has been set up, you can define
a continuous aggregate for the `devices` table.

```sql
CREATE MATERIALIZED VIEW devices_summary
WITH (timescaledb.continuous) AS
SELECT time_bucket('500', time) AS bucket,
       avg(cpu_usage) AS avg_cpu,
       avg(disk_usage) AS avg_disk
     FROM devices
     GROUP BY bucket;
```

You can now insert some rows to check if the aggregation works as
expected.

```sql
CREATE EXTENSION tablefunc;

INSERT INTO devices(time, cpu_usage, disk_usage)
SELECT time,
       normal_rand(1,70,10) AS cpu_usage,
	   normal_rand(1,2,1) * (row_number() over()) AS disk_usage
  FROM generate_series(1,10000) AS time;
```

>:TIP: You can use the `tablefunc` extension to generate a normal
>distribution and use the `row_number` function to turn it into a
>cumulative sequence.

You can now check that the view contains the correct data.

```sql
postgres=# SELECT * FROM devices_summary ORDER BY bucket LIMIT 10;
 bucket |       avg_cpu       |       avg_disk
--------+---------------------+----------------------
      0 | 63.0000000000000000 |   6.0000000000000000
      5 | 69.8000000000000000 |   9.6000000000000000
     10 | 70.8000000000000000 |  24.0000000000000000
     15 | 75.8000000000000000 |  37.6000000000000000
     20 | 71.6000000000000000 |  26.8000000000000000
     25 | 67.6000000000000000 |  56.0000000000000000
     30 | 68.8000000000000000 |  90.2000000000000000
     35 | 71.6000000000000000 |  88.8000000000000000
     40 | 66.4000000000000000 |  81.2000000000000000
     45 | 68.2000000000000000 | 106.0000000000000000
(10 rows)
```

---

### Best Practices [](best-practices)

**Modifying the Materialization Hypertable:**
Advanced users may find the need to modify certain properties of the
materialization hypertable (e.g. chunk size) or to create further indexes.
To help with such, we can find the name of the materialization hypertable in the
`timescaledb_information.continuous_aggregates` view ([API Docs][api-continuous-aggregates-info]).
We can then modify the materialization hypertable as if it were a normal
hypertable. For instance, we may want to set the materialization hypertable's
`chunk_time_interval` to something other than the default; this can be
accomplished by running [`set_chunk_time_interval`][api-set-chunk-interval] on
the materialization hypertable.

**Creating Indexes on the Materialization Hypertable:** By default,
the database will automatically create composite indexes on each
column specified in the `GROUP BY` combined with the `time_bucket`
column (i.e., in our example, because the continuous aggregate view
is defined as `GROUP BY device, bucket`, we would automatically
create a composite index on `{device, bucket}`.  If we had additionally
grouped by additional columns (e.g., `GROUP BY device, foo, bar, bucket`),
we would create additional indexes as well (`{foo, bucket}` and
`{bar, bucket}`). Setting `timescaledb.create_group_indexes` to `false` when
creating the view will prevent this.  If we want to create additional
indexes or drop some of the default ones, we can do so by creating or
dropping the appropriate indexes on the materialization hypertable
directly.

>:TIP: You can find the names of all the materialized hypertables by
>querying `timescaledb_information.continuous_aggregates`.
>
> ```sql
> SELECT view_name, materialization_hypertable
>     FROM timescaledb_information.continuous_aggregates;
>          view_name         |            materialization_hypertable
> ---------------------------+---------------------------------------------------
>  conditions_summary_hourly | _timescaledb_internal._materialized_hypertable_30
>  conditions_summary_daily  | _timescaledb_internal._materialized_hypertable_31
> (2 rows)
> ```

**Choosing an appropriate bucket interval:**
The materialisation of the continuous aggregates stores partials, which are then 
used to calculate the final aggregations at query time.  This means that there is
a base amount of overhead for any query, which becomes a greater factor for smaller
intervals.  For smaller intervals, it can be more performant to run an aggregate 
query on the raw data in the hypertable, so test both methods to determine what is
best for your data set and desired bucket interval. 

**Dealing with Timezones:**
Functions that depend on a local timezone setting inside a continuous aggregate
are not supported. We cannot cast to a local time because the timezone setting
will change from user to user. So attempting to create a continuous aggregate
like:
```sql
CREATE MATERIALIZED VIEW device_summary
WITH (timescaledb.continuous)
AS
SELECT
  time_bucket('1 hour', observation_time ) AS bucket,
  min(observation_time::timestamp) AS min_time,
  device_id,
  avg(metric) AS metric_avg,
  max(metric) - min(metric) AS metric_spread
FROM
  device_readings
GROUP BY bucket, device_id;
```
will fail.

Instead, we can use explicit timezones in our view definition like:
```sql
CREATE MATERIALIZED VIEW device_summary
WITH (timescaledb.continuous)
AS
SELECT
  time_bucket('1 hour', observation_time) AS bucket,
  min(observation_time AT TIME ZONE 'EST') AS min_time,
  device_id,
  avg(metric) AS metric_avg,
  max(metric) - min(metric) AS metric_spread
FROM
  device_readings
GROUP BY bucket, device_id;
```
Or we can cast to a timestamp on the way out of the view:
```sql
SELECT min_time::timestamp FROM device_summary;
```

---


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
