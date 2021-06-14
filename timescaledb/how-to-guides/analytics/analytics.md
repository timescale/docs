# Analytics
Timescale Analytics is a PostreSQL extension containing a specialized set of
functions that allow you to to analyze time-series data. You can use it to
analyze anything you have stored as time-series data, including IoT devices, IT
systems, marketing analytics, user behavior, financial metrics, and
cryptocurrency. Timescale Analytics uses [Promscale][doc-promscale], an
open-source analytics platform for Prometheus monitoring data.

Timescale Analytics allows you to perform critical time-series queries quickly,
analyze time-series data, and extract meaningful information. It aims to
identify, build, and combine all of the functionality SQL needs to perform
time-series analysis into a single extension.

## Monotonic counters
Monotonic counters are basic counters that only ever increase. For example,
measuring the number of visitors to a website. If you want to know how many
people are visiting your website over time, you can use the change in the
monotonic counter to determine the success fo the campaighn. You can do this in
native SQL with a query like this:
```sql
SELECT sum(counter_reset_val) + last(counter, ts) - first(counter, ts) as counter_delta
FROM (
    SELECT *,
        CASE WHEN counter - lag(counter) OVER (ORDER BY ts ASC) < 0
            THEN lag(counter) OVER (ORDER BY ts ASC)
            ELSE 0
        END as counter_reset_val
    FROM user_counter
) f;
```
To perform the same query in Timescale Analytics:
```sql
SELECT delta(counter_agg(counter, ts)) as counter_delta FROM user_counter;
```
There are many examples like this: scenarios where it’s possible to write a
query native SQL, but the resulting code is relatively complicated to write, and
to understand.

Additionally, monotonic counters should only ever increase, but the value is
often read from an ephemeral source that can get reset to zero at any time, due
to a disk problem or other catastrophic event. To analyze data effectively from
this kind of source, you need to be able to account for resets. To do this,
whenever the counter appears to decrease, it is assumed that a reset occurred,
and the value read after the reset is added to the value immediately before the
reset.

## Tools for graphing
When you graphing time-series data you need to perform operations such as
change-point analysis, downsampling, or smoothing. Usually, the easiest way to
do this is with a front-end service such as Grafana. This means the graphs you
use are heavily tied to the renderer you're using to create them.

Timescale Analytics brings graphing functions to the database. This allows you
to choose your graphing front-end based on how well it does graphing, not on how
well it does data analytics. It also allows you to run queries that stay
consistent across all front-end tools and consumers of your data. Additionally,
by doing all the graphing work in the database, you need to send a much smaller
number of data points over the network.

## Pipelining
SQL queries can get long, especially if you have multiple layers of aggregation
and function-calls. Timescale Analytics includes a a unified pipeline API
capability that can greatly simplify  your queries. For example, to write a
pairwise delta at minute-granularity in SQL looks like this:
```sql
SELECT minutes, sampled - lag(sampled) OVER (ORDER BY minutes) as delta
FROM (
    SELECT
        time_bucket_gapfill(time, '1 minute') minutes,
        interpolate(first(value, time)) sampled
    FROM data
    GROUP BY time_bucket_gapfill(time, '1 minute')
) interpolated;
```
With Timescale Analytics, it looks like this:
```sql
SELECT timeseries(time, value) |> sample('1 minute') |> interpolate('linear') |> delta() FROM data;
```

This API also enables some powerful optimizations, such as incremental
pipelines, single pass processing, and vectorization.

## Contribute to Timescale Analytics
We want and need your feedback! What are the frustrating parts of analyzing time-series data? What takes far more code than you feel it should? What runs slowly, or only runs quickly after many rewrites? We want to solve community-wide problems and incorporate as much feedback as possible.

*   Join the [discussion][gh-discussions].
*   Check out the [proposed features][gh-proposed].
*   Explore the current [feature requests][gh-requests].
*   Add your own [feature request][gh-newissue].

[doc-promscale]: /tutorials/promscale
[gh-discussions]: https://github.com/timescale/timescale-analytics/discussions
[gh-proposed]: https://github.com/timescale/timescale-analytics/labels/proposed-feature
[gh-requests]: https://github.com/timescale/timescale-analytics/labels/feature-request
[gh-newissue]: https://github.com/timescale/timescale-analytics/issues/new?assignees=&labels=feature-request&template=feature-request.md&title=
