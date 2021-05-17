# Best practices

### Modifying the materialization hypertable
Advanced users may find the need to modify certain properties of the
materialization hypertable (e.g. chunk size) or to create further indexes.
To help with such, we can find the name of the materialization hypertable in the
`timescaledb_information.continuous_aggregates` view ([API Docs][api-continuous-aggregates-info]).
We can then modify the materialization hypertable as if it were a normal
hypertable. For instance, we may want to set the materialization hypertable's
`chunk_time_interval` to something other than the default; this can be
accomplished by running [`set_chunk_time_interval`][api-set-chunk-interval] on
the materialization hypertable.

### Creating indexes on the materialization hypertable
By default, the database will automatically create composite indexes on each
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

<highlight type="tip">
You can find the names of all the materialized hypertables by
querying `timescaledb_information.continuous_aggregates`.

 ```sql
 SELECT view_name, materialization_hypertable
     FROM timescaledb_information.continuous_aggregates;
          view_name         |            materialization_hypertable
 ---------------------------+---------------------------------------------------
  conditions_summary_hourly | _timescaledb_internal._materialized_hypertable_30
  conditions_summary_daily  | _timescaledb_internal._materialized_hypertable_31
 (2 rows)
 ```
</highlight>

### Choosing an appropriate bucket interval
The materialisation of the continuous aggregates stores partials, which are then
used to calculate the final aggregations at query time.  This means that there is
a base amount of overhead for any query, which becomes a greater factor for smaller
intervals.  For smaller intervals, it can be more performant to run an aggregate
query on the raw data in the hypertable, so test both methods to determine what is
best for your data set and desired bucket interval.

### Dealing with timezones
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



[api-continuous-aggregates-info]: /api/:currentVersion:/informational-views/timescaledb_information-continuous_aggregates/
[api-set-chunk-interval]: /api/:currentVersion:/hypertable/set_chunk_time_interval
