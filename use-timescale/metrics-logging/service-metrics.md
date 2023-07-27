---
title: Service metrics
excerpt: View metrics for your Timescale service, such as CPU, memory, and storage usage
products: [cloud]
keywords: [metrics, monitoring, services]
tags: [dashboard, cpu, memory, storage, disk space]
cloud_ui:
    path:
        - [services, :serviceId, metrics]
---

import EarlyAccess from "versionContent/_partials/_early_access.mdx";

# Service metrics

You can view your service metrics from the Timescale
[metrics dashboard][metrics-dashboard]. This dashboard gives you service-level
information, such as CPU, memory, and storage usage.

You can view query-level statistics from the `Query stats` tab. You can also
view your query-level statistics by using the pre-installed
[`pg_stat_statements`][pg-stat] extension from a PostgreSQL client.

## Metrics dashboard

Timescale provides a metrics dashboard for managing your services. You can
see the Metrics dashboard in your Timescale account by navigating to the
`Services` section, clicking the service you want to explore, and selecting the
`Metrics` tab.

You can view metrics for your services for any of these time ranges:

*   Last hour, with one minute granularity
*   Last 24 hours, with one minute granularity
*   Last seven days, with one hour granularity
*   Last 30 days, with one hour granularity

To change the view, select the time range from the drop-down menu.

<img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tsc-metrics_lastmonth.png" alt="Timescale Metrics dashboard"/>

Additionally, you can turn automatic metric refreshes on and off. When automatic
metric refresh is on, the dashboard updates every thirty seconds.

In some cases, gray vertical bars display on the metrics dashboard, like this:

<img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tsc-metrics_graybar.png" alt="Timescale Metrics not collected"/>

This indicates that metrics have not been collected for the period shown. It
does not mean that your Timescale service was down.

## Continuous storage monitoring

Timescale continuously monitors the health and resource consumption of all
database services. You can check your health data by navigating to the `metrics`
tab in your service dashboard. These metrics are also monitored by the Timescale
operations team.

<img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tsc-disk-metrics.png" alt="Timescale metrics dashboard"/>

If your database exceeds a storage threshold of available resources, some
automated actions are triggered, including notifications and preventative
actions.

### Automated user alerting

When your disk usage exceeds certain thresholds, you receive an email
notification. These notifications occur at:

*   75%
*   85%
*   95%

So that you aren't overwhelmed by automated messages, the alerting thresholds use
low and high watermarks, and we limit the frequency of messages we send you
about a particular service.

### Automated overload protection

If your database continues to increase in size past these thresholds, automated
overload protection is activated when your disk becomes 99% full. When this
happens, your database is put into read-only mode, you receive an
email notification, and the Timescale console shows the changed status.

When your disk is in read-only mode, you can still query your database, but you
cannot add any new data to it. This ensures that your disk does not fill up
to 100%, and thus prevents the database from crashing due to an out of memory (OOM)
error.

With your database in read-only mode, you need to decide if you are going to
increase your storage capacity, or reduce the size of your database. When you
have done that, you can also add a retention policy, or turn on compression, to
avoid the problem occurring again in the future.

## Query-level statistics in the Timescale dashboard

You can analyze your queries by navigating to the `Query stats` tab from the
Services dashboard.

<EarlyAccess />

Use the filter at the top of the page to view details of your queries, including
how many rows the query returned, and the time the query took to run.

<img class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc_querystats_expanded.webp"
width={1375} height={944}
alt="The Timescale query stats viewer showing the statistics for a recent query" />

In the results window, use the horizontal scroll bar at the bottom of the screen
to see statistics for your query. You can also use the arrow to the left of the
query to expand it. The columns show these details about your queries:

|Column|Description|
|-|-|
|Executions|Number of times the query has been run during the results period|
|Total rows|Total number of rows scanned, inserted, or updated by the query during the results period|
|Median rows|Median number of rows touched each time the query is run|
|P05 time|The fifth percentile, or the minimum time this query took|
|Median time|Median number of microseconds (µs) or milliseconds (ms) it took to run the query|
|P95 time|The ninety-fifth percentile, or the maximum time this query took|
|Median memory|Median amount of memory consumed by the query
|P95 memory|The ninety-fifth percentile, or the maximum memory this query used|
|Median bytes read|Median number of bytes used each time the query is run|
|P95 bytes read|The ninety-fifth percentile, or the maximum number of bytes this query used|
|Cache hit ratio|Ratio of memory used compared to disk used, as a percentage. Calculated as `cache hit / (cache hit + cache miss)`.|
|Hypertables|A green check mark is shown if results were drawn from a hypertable|
|Compressed tables|A green check mark is shown if results were drawn from a compressed table|
|User name|Username of the logged in user running the query|

<Highlight type="note">
If you have just completed a query, it can take a minute or two for it to show
in the query stats viewer. Wait a little, and then refresh the page to see your
query.
</Highlight>

## Query-level statistics with pg_stat_statements

The `pg_stat_statements` extension gives you query-level statistics for your SQL
statements. It comes pre-installed with Timescale.

<Highlight type="note">
For more information about `pg_stat_statements`, see the
[PostgreSQL documentation](https://www.postgresql.org/docs/current/pgstatstatements.html).
</Highlight>

<Highlight type="important">
You cannot currently enable `track_io_timing` for your database. Statistics that
depend on `track_io_timing`, such as `blk_read_time` and `blk_write_time`, are
not collected.
</Highlight>

### Query the pg_stat_statements view

You can view statistics for your queries through the `pg_stat_statements`
extension, which provides a `pg_stat_statements` view. The recorded statistics
include the time spent planning and executing each query; the number of blocks
hit, read, and written; and more.

You can query the `pg_stat_statements` view as you would any PostgreSQL view.
The full view includes superuser queries, which are used by Timescale to
manage your service in the background. To view only your
queries, filter by the current user.

Connect to your database using a PostgreSQL client, such as [`psql`][psql], and
run:

```sql
SELECT * FROM pg_stat_statements WHERE pg_get_userbyid(userid) = current_user;
```

### Example usage

With `pg_stat_statements`, you can view performance statistics that help you
monitor and optimize your queries.

Here are some sample scenarios to try.

Identify the 5 longest-running queries by their mean execution time:

```sql
SELECT calls,
    mean_exec_time,
    query
FROM pg_stat_statements
WHERE pg_get_userbyid(userid) = current_user
ORDER BY mean_exec_time DESC
LIMIT 5;
```

Identifying queries with highly variable execution time:

The relative standard deviation, or the standard deviation expressed as a
percentage of the mean, measures how variable the execution time is. The higher
the relative standard deviation, the more variable the query execution time.

```sql
SELECT calls,
    stddev_exec_time/mean_exec_time*100 AS rel_std_dev,
    query
FROM pg_stat_statements
WHERE pg_get_userbyid(userid) = current_user
ORDER BY rel_std_dev DESC
LIMIT 5;
```

For more examples and detailed explanations, see the [blog post on identifying
performance bottlenecks with `pg_stat_statements`][blog-pg_stat_statements].

[metrics-dashboard]: /use-timescale/:currentVersion:/metrics-logging/service-metrics/
[pg-stat]: /use-timescale/:currentVersion:/metrics-logging/service-metrics/#query-level-statistics-with-pg_stat_statements
[blog-pg_stat_statements]: <https://www.timescale.com/blog/identify-postgresql-performance-bottlenecks-with-pg_stat_statements/>
[psql]: /use-timescale/:currentVersion:/connecting/about-psql/
