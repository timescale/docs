---
title: Continuous aggregates on continuous aggregates
excerpt: Create continuous aggregates on top of continuous aggregates to summarize data at different granularities
keywords: [continuous aggregates, hierarchical, create]
---

# Hierarchical continuous aggregates

You can create continuous aggregates on top of other continuous aggregates. This
allows you to summarize data at different levels of granularity. For example,
you might have an hourly continuous aggregate that summarizes minute-by-minute
data. To get a daily summary, you can create a new continuous aggregate on top
of your hourly aggregate. This is more efficient than creating the daily
aggregate on top of the original hypertable, because you can reuse the
calculations from the hourly aggregate.

This feature is available in Timescale&nbsp;2.9 and later.

## Create a continuous aggregate on top of another continuous aggregate

Creating a continuous aggregate on top of another continuous aggregate works the
same way as creating it on top of a hypertable. In your query, select from a
continuous aggregate rather than from the hypertable, and use the time-bucketed
column from the existing continuous aggregate as your time column.

For more information, see the instructions for
[creating a continuous aggregate][create-cagg].

## Use real-time aggregation with hierarchical continuous aggregates

By default, all continuous aggregates use real-time aggregation. That means they
always return up-to-date data in response to queries. They accomplish this by
joining the materialized data in the continuous aggregate with unmaterialized
raw data from the source table or view.

When continuous aggregates are stacked, each continuous aggregate is only aware
of the layer immediately below. The joining of unmaterialized data happens
recursively until it reaches the bottom layer, giving you access to recent data
down to that layer.

If you keep all continuous aggregates in the stack as real-time aggregates, the
bottom layer is the source hypertable. That means every continuous aggregate in
the stack has access to all recent data.

If there is a non-real-time continuous aggregate somewhere in the stack, the
recursive joining stops at that non-real-time continuous aggregate. Higher-level
continuous aggregates don't receive any unmaterialized data from lower levels.

For example, say you have the following continuous aggregates:

*   A real-time hourly continuous aggregate on the source hypertable
*   A real-time daily continuous aggregate on the hourly continuous aggregate
*   A non-real-time, or materialized-only, monthly continuous aggregate on the
    daily continuous aggregate
*   A real-time yearly continuous aggregate on the monthly continuous aggregate

Queries on the hourly and daily continuous aggregates include real-time,
non-materialized data from the source hypertable. Queries on the monthly
continuous aggregate only return already-materialized data. Queries on the
yearly continuous aggregate return materialized data from the yearly continuous
aggregate itself, plus more recent data from the monthly continuous aggregate.
However, the data is limited to what is already materialized in the monthly
continuous aggregate, and doesn't get even more recent data from the source
hypertable. This happens because the materialized-only continuous aggregate
provides a stopping point, and the yearly continuous aggregate is unaware of any
layers beyond that stopping point. This is similar to
[how stacked views work in PostgreSQL][postgresql-views].

To make queries on the yearly continuous aggregate access all recent data, you
can either:

*   Make the monthly continuous aggregate real-time, or
*   Redefine the yearly continuous aggregate on top of the daily continuous
    aggregate.

<img class="main-content__illustration"
 width={1375} height={944}
 src="https://assets.timescale.com/docs/images/cagg_hierarchy.webp"
 alt="Example of hierarchical continuous aggregates in a finance application"/>

## Roll up calculations

When summarizing already-summarized data, be aware of how stacked calculations
work. Not all calculations return the correct result if you stack them.

For example, if you take the maximum of several subsets, then take the maximum
of the maximums, you get the maximum of the entire set. But if you take the
average of several subsets, then take the average of the averages, that can
result in a different figure than the average of all the data.

To simplify such calculations when using continuous aggregates on top of
continuous aggregates, you can use the [hyperfunctions][hyperfunctions] from
TimescaleDB Toolkit, such as the [statistical aggregates][stats-aggs]. These
hyperfunctions are designed with a two-step aggregation pattern that allows you
to roll them up into larger buckets. The first step creates a summary aggregate
that can be rolled up, just as a maximum can be rolled up. You can store this
aggregate in your continuous aggregate. Then, you can call an accessor function
as a second step when you query from your continuous aggregate. This accessor
takes the stored data from the summary aggregate and returns the final result.

For example, you can create an hourly continuous aggregate using `percentile_agg`
over a hypertable, like this:

```sql
CREATE MATERIALIZED VIEW response_times_hourly
WITH (timescaledb.continuous)
AS SELECT
    time_bucket('1 h'::interval, ts) as bucket,
    api_id,
    avg(response_time_ms),
    percentile_agg(response_time_ms) as percentile_hourly
FROM response_times
GROUP BY 1, 2;
```

To then stack another daily continuous aggregate over it, you can use a `rollup`
function, like this:

```sql
CREATE MATERIALIZED VIEW response_times_daily
WITH (timescaledb.continuous)
AS SELECT
    time_bucket('1 d'::interval, bucket) as bucket_daily,
    api_id,
    rollup(percentile_hourly) as percentile_daily
FROM response_times_hourly
GROUP BY 1, 2;
```

For more information and examples about using `rollup` functions to stack
calculations, see the [percentile approximation API documentation][percentile_agg_api].

## Restrictions

There are some restrictions when creating a continuous aggregate on top of
another continuous aggregate. In most cases, these restrictions are in place to
ensure valid time-bucketing:

*   You can only create a continuous aggregate on top of a finalized continuous
    aggregate. This new finalized format is the default for all continuous
    aggregates created since Timescale&nbsp;2.7. If you need to create a continuous
    aggregate on top of a continuous aggregate in the old format, you need to
    [migrate your continuous aggregate][migrate-cagg] to the new format first.

*   The time bucket of a continuous aggregate should be greater than or equal to
    the time bucket of the underlying continuous aggregate. It also needs to be
    a multiple of the underlying time bucket. For example, you can rebucket an
    hourly continuous aggregate into a new continuous aggregate with time
    buckets of 6 hours. You can't rebucket the hourly continuous aggregate into
    a new continuous aggregate with time buckets of 90 minutes, because 90
    minutes is not a multiple of 1 hour.

*   A continuous aggregate with a fixed-width time bucket can't be created on
    top of a continuous aggregate with a variable-width time bucket. Fixed-width
    time buckets are time buckets defined in seconds, minutes, hours, and days,
    because those time intervals are always the same length. Variable-width time
    buckets are time buckets defined in months or years, because those time
    intervals vary by the month or on leap years. This limitation prevents a
    case such as trying to rebucket monthly buckets into `61 day` buckets, where
    there is no good mapping between time buckets for month combinations such as
    July/August (62 days).

    Note that even though weeks are fixed-width intervals, you can't use monthly
    or yearly time buckets on top of weekly time buckets for the same reason.
    The number of weeks in a month or year is usually not an integer.

    However, you can stack a variable-width time bucket on top of a fixed-width
    time bucket. For example, creating a monthly continuous aggregate on top of
    a daily continuous aggregate works, and is the one of the main use cases for
    this feature.

[create-cagg]: /use-timescale/:currentVersion:/continuous-aggregates/create-a-continuous-aggregate/
[hyperfunctions]: /use-timescale/:currentVersion:/hyperfunctions/
[migrate-cagg]: /use-timescale/:currentVersion:/continuous-aggregates/migrate/
[postgresql-views]: https://www.postgresql.org/docs/current/rules-views.html
[stats-aggs]: /api/:currentVersion:/hyperfunctions/statistical-and-regression-analysis/stats_agg-one-variable/
[percentile_agg_api]: /api/:currentVersion:/hyperfunctions/percentile-approximation/uddsketch/#aggregate-and-roll-up-percentile-data-to-calculate-daily-percentiles-using-percentile_agg
