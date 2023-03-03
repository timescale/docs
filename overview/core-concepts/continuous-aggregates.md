---
title: Continuous aggregates
excerpt: Learn how continuous aggregates help you speed up queries and downsample data
keywords: [continuous aggregates]
tags: [downsample, materialized views]
---

# Continuous aggregates

Aggregate queries (`min()`, `max()`, `avg()`...)
which touch large swathes of time-series data can
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

## An introductory example

As a quick introductory example, let's create a hypertable
`conditions` containing temperature data for devices and a continuous
aggregate to compute the hourly average, minimum, and maximum
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

In this case, the continuous aggregate is refreshed every hour
and refresh the last month's data.

You can now run a normal `SELECT` on the continuous aggregate and it
gives you the aggregated data, for example, to select the hourly
averages for device 1 during the first three months:

```sql
SELECT bucket, avg
  FROM conditions_summary_hourly
 WHERE device = 1 AND bucket BETWEEN '2020-01-01' AND '2020-03-31'
ORDER BY bucket;
```

<Highlight type="important">
Continuous aggregates support many PostgreSQL aggregate functions and features.
Support depends on your TimescaleDB version. For a table of supported features,
see the
[how-to guide on continuous aggregates](/timescaledb/latest/how-to-guides/continuous-aggregates/about-continuous-aggregates/#supported-functions).
</Highlight>

## Real-time aggregation

A query on a continuous aggregate, by default, uses *real-time
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

<Highlight type="tip">
To use real-time aggregation on a continuous aggregate created
in a version earlier than TimescaleDB 1.7, alter the view to set
`timescaledb.materialized_only=false`.
</Highlight>

### Automatic refresh with a continuous aggregate policy

Continuous aggregates can be kept up-to-date through the last bucket width of
time by using continuous aggregate policies. Policies allow you to keep a
specified window of time within the continuous aggregate updated on a schedule.
This provides the ability to do things like:

*   have the continuous aggregate and the hypertable be in sync, even
  when data is removed from the hypertable, or
*   keep the aggregate data in the continuous aggregate when removing
  source data from the hypertable.

### Manually refreshing continuous aggregate ranges

It is also possible, starting with TimescaleDB 2.0, to manually refresh
a specific window of time in a continuous aggregate using
`refresh_continuous_aggregate`. Using this TimescaleDB function gives users the
ability to have the best of both worlds: automatic refresh of recent data and
targeted updates to time ranges that may occur further in history through
a backfill process. Using both tools to keep continuous aggregates up-to-date
provides great control and flexibility!

[api-alter-cagg]: /api/:currentVersion:/continuous-aggregates/alter_materialized_view/
[postgres-materialized-views]: https://www.postgresql.org/docs/current/rules-materializedviews.html
