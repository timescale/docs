# Data Retention [](data-retention)

An intrinsic part of time-series data is that new data is accumulated
and old data is rarely, if ever, updated and the relevance of the data
diminishes over time.  It is therefore often desirable to delete old
data to save disk space.

As an example, if you have a hypertable definition of `conditions`
where you collect raw data into chunks of one day:

```sql
CREATE TABLE conditions(
    time TIMESTAMPTZ NOT NULL,
    device INTEGER,
    temperature FLOAT
);

SELECT * FROM create_hypertable('conditions', 'time',
       chunk_time_interval => INTERVAL '1 day');
```

If you collect a lot of data and realize that you never actually use
raw data older than 30 days, you might want to delete data older than
30 days from `conditions`.

However, deleting large swaths of data from tables can be costly and
slow if done row-by-row using the standard `DELETE` command. Instead,
TimescaleDB provides a function `drop_chunks` that quickly drop data
at the granularity of chunks without incurring the same overhead.

For example:

```sql
SELECT drop_chunks('conditions', INTERVAL '24 hours');
```

This will drop all chunks from the hypertable `conditions` that _only_
include data older than this duration, and will _not_ delete any
individual rows of data in chunks.

For example, if one chunk has data more than 36 hours old, a second
chunk has data between 12 and 36 hours old, and a third chunk has the
most recent 12 hours of data, only the first chunk is dropped when
executing `drop_chunks`. Thus, in this scenario,
the `conditions` hypertable will still have data stretching back 36 hours.

For more information on the `drop_chunks` function and related
parameters, please review the [API documentation][drop_chunks].

### Automatic Data Retention Policies [](retention-policy)

TimescaleDB includes a background job scheduling framework for automating data
management tasks, such as enabling easy data retention policies.

To add such data retention policies, a database administrator can create,
remove, or alter policies that cause `drop_chunks` to be automatically executed
according to some defined schedule.

To add such a policy on a hypertable, continually causing chunks older than 24
hours to be deleted, simply execute the command:
```sql
SELECT add_retention_policy('conditions', INTERVAL '24 hours');
```

To subsequently remove the policy:
```sql
SELECT remove_retention_policy('conditions');
```

The scheduler framework also allows one to view scheduled jobs:
```sql
SELECT * FROM timescaledb_information.job_stats;
```

For more information, please see the [API documentation][add_retention_policy].

### Data Retention with Continuous Aggregates [](retention-with-aggregates)

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

[drop_chunks]: /api#drop_chunks
[add_retention_policy]: /api#add_retention_policy
[continuous_aggregates]: /using-timescaledb/continuous-aggregates
