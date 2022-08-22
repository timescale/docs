---
title: Refresh continuous aggregates
excerpt: Refresh a continuous aggregate to keep it up to date
keywords: [continuous aggregates, refresh, policies]
---

import OneStepPolicy from "versionContent/_partials/_caggs-one-step-policy.mdx";

# Refresh continuous aggregates

Continuous aggregates can have a range of different refresh policies. In
addition to refreshing the continuous aggregate automatically using a policy,
you can also refresh it manually.

## Change the refresh policy

Continuous aggregates require a policy for automatic refreshing. You can adjust
this to suit different use cases. For example, you can have the continuous
aggregate and the hypertable stay in sync, even when data is removed from the
hypertable, or you could keep source data in the continuous aggregate even after
it is removed from the hypertable.

You can change the way your continuous aggregate is refreshed by adjusting the
[add_continuous_aggregate_policy][api-add-continuous-aggregate-policy].
The policy takes three arguments:

*   `start_offset`: the start of the refresh window relative to when the policy
    runs
*   `end_offset`: the end of the refresh window relative to when the policy runs
*   `schedule_interval`: the refresh interval in minutes or hours. Defaults to
    24 hours.

If you set the `start_offset` or `end_offset` to `NULL`, the range is open-ended
and extends to the beginning or end of time. However, it's recommended to set
the `end_offset` so that at least the most recent time bucket is excluded. For
time-series data that mostly contains writes that occur in time stamp order, the
time buckets that see lots of writes quickly have out-of-date aggregates. You
get better performance by excluding the time buckets that are getting a lot of
writes.

In addition, materializing the most recent bucket might interfere with
[real-time aggregation][future-watermark].

<procedure>

### Changing a refresh policy to use a `NULL` `start_offset`

1.  At the `psql` prompt, create a new policy called `conditions_summary_hourly`
    that keeps the continuous aggregate up to date, and runs every hour:

    ```sql
    SELECT add_continuous_aggregate_policy('conditions_summary_hourly',
      start_offset => NULL,
      end_offset => INTERVAL '1 h',
      schedule_interval => INTERVAL '1 h');
    ```

</procedure>

The policy in this example ensures that all the data in the continuous aggregate
is up to date with the hypertable except for anything written in the last hour.
It also does not refresh the last time bucket of the continuous aggregate.
Because it has an open-ended `start_offset` parameter, any data that is removed
from the table, for example with a DELETE or with `drop_chunks`, is also removed
from the continuous aggregate view. This means that the continuous aggregate
always reflects the data in the underlying hypertable.

If you want to keep data in the continuous aggregate even if it is removed from
the underlying hypertable, you can set the `start_offset` to match the [data
retention policy][sec-data-retention] on the source hypertable. For example, if
you have a retention policy that removes data older than one month, set
`start_offset` to one month or less. This sets your policy so that it does
not refresh the dropped data.

<procedure>

### Changing a refresh policy to keep removed data

1.  At the `psql` prompt, create a new policy called `conditions_summary_hourly`
    that keeps data removed from the hypertable in the continuous aggregate, and
    runs every hour:

    ```sql
    SELECT add_continuous_aggregate_policy('conditions_summary_hourly',
      start_offset => INTERVAL '1 month',
      end_offset => INTERVAL '1 h',
      schedule_interval => INTERVAL '1 h');
    ```

</procedure>

<highlight type="note">
It is important to consider your data retention policies when you're setting up
continuous aggregate policies. If the continuous aggregate policy window covers
data that is removed by the data retention policy, the data will be removed when
the aggregates for those buckets are refreshed. For example, if you have a data
retention policy that removes all data older than two weeks, the continuous
aggregate policy will only have data for the last two weeks.
</highlight>

<OneStepPolicy policyType="refresh" withHeading={true} />

## Manually refresh a continuous aggregate

If you need to manually refresh a continuous aggregate, you can use the
`refresh` command. This recomputes the data within the window that has changed
in the underlying hypertable since the last refresh. Therefore, if only a few
buckets need updating, the refresh runs quickly.

If you have recently dropped data from a hypertable with a continuous aggregate,
calling `refresh_continuous_aggregate` on a region containing dropped chunks
recalculates the aggregate without the dropped data. See
[drop data][cagg-drop-data] for more information.

The `refresh` command takes three arguments:

*   The name of the continuous aggregate view to refresh
*   The timestamp of the beginning of the refresh window
*   The timestamp of the end of the refresh window

Only buckets that are wholly within the range specified are refreshed. For
example, if you specify `2021-05-01', '2021-06-01` the only buckets that are
refreshed are those up to but not including 2021-06-01. It is possible to
specify NULL in a manual refresh to get an open-ended range, but we do not
recommend using it, because you could inadvertently materialize a large amount
of data, slow down your performance, and have unintended consequences on other
policies like data retention.

<procedure>

### Manually refreshing a continuous aggregate

1.  To manually refresh a continuous aggregate, use the `refresh` command:

    ```sql
    CALL refresh_continuous_aggregate('example', '2021-05-01', '2021-06-01');
    ```

</procedure>

Avoid refreshing time intervals that are likely to have a lot of writes. In
general, this means you should never refresh the most recent time bucket.
Because the of constant change in the underlying data, they are unlikely to
produce accurate aggregates. Additionally, refreshing this data slows down the
ingest rate of the hypertable due to write amplification. If you want to include
the latest bucket in your queries,
use [real-time aggregation][real-time-aggregates] instead.

[api-add-continuous-aggregate-policy]: /api/:currentVersion:/continuous-aggregates/add_continuous_aggregate_policy
[cagg-drop-data]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/drop-data
[future-watermark]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/troubleshooting/#continuous-aggregate-watermark-is-in-the-future
[real-time-aggregates]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/real-time-aggregates
[sec-data-retention]: /timescaledb/:currentVersion:/how-to-guides/data-retention
