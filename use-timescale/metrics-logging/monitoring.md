---
title: Monitor your Tiger Cloud services
excerpt: View logs, metrics, and performance insights for your services in Tiger Cloud. Get actionable tips to improve your service performance
products: [cloud]
price_plans: [performance, scale, enterprise]
keywords: [monitoring]
tags: [telemetry, monitor]
---

# Monitor your $SERVICE_LONGs

Get complete visibility into your $SERVICE_SHORT performance with $CLOUD_LONG's powerful monitoring suite. Whether you're optimizing for peak efficiency or troubleshooting unexpected behavior, $CLOUD_LONG gives you the tools to quickly identify and resolve issues.

When something doesn't look right, $CLOUD_LONG provides a complete investigation workflow:

![Monitoring suite in Tiger Cloud](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-cloud-monitoring-workflow-diagram.svg)

1. **Pinpoint the bottleneck**: check [**Metrics**][metrics] to identify exactly when CPU, memory, or storage spiked.
1. **Find the root cause**: review [**Logs**][logs] for errors or warnings that occurred during the incident.
1. **Identify the culprit**: examine [**Insights**][insights] to see which queries were running at that time and how they impacted resources.
1. **Check background activity**: look at [**Jobs**][monitoring-jobs] to see if scheduled tasks triggered the issue.
1. **Investigate active connections**: use [**Connections**][connections] to see what clients were connected and what queries they were running.

Want to save some time? Check out [**Recommendations**][recommendations] for alerts that may have already flagged the problem!

This pages explains what specific data you get at each point.

## Metrics

$CLOUD_LONG shows you CPU, memory, and storage metrics for up to 30 previous days and with down to 10-second granularity.
To access metrics, select your $SERVICE_SHORT in $CONSOLE, then click `Monitoring` > `Metrics`:

![Service metrics](https://assets.timescale.com/docs/images/tiger-cloud-console/service-metrics-tiger-console.png)

The following metrics are represented by graphs:

- CPU, in mCPU
- Memory, in GiB
- Storage used, in GiB
- Storage I/O, in ops/sec
- Storage bandwidth, in MiB/sec

When you hit the limits:

- **For CPU and memory**: provision more for your $SERVICE_SHORT in `Operations` > `Compute and storage`.
- **For storage, I/O, and bandwidth**: these resources depend on your storage type and $IO_BOOST settings. The standard high-performance storage gives you 16TB of compressed data on a single server, regardless of the number of hypertables in your $SERVICE_SHORT. See [About storage tiers][about-storage] for how to change the available storage, I/O, and bandwidth.

Hover over the graph to view metrics for a specific time point. Select an area in the graph to zoom into a specific period.

Gray bars indicate that metrics have not been collected for the period shown:

![Metrics not collected](https://assets.timescale.com/docs/images/tsc-metrics_graybar.webp)

### Understand high memory usage

It is normal to observe high overall memory usage for your $SERVICE_LONGs, especially for workloads with active 
read and write. $SERVICE_LONG run on Linux, and high memory usage is a particularity of the Linux page cache. 
The Linux kernel stores file-backed data in memory to speed up read operations. $PG, and by extension, 
$SERVICE_LONGs rely heavily on disk I/O to access tables, WALs, and indexes. When your $SERVICE_SHORT reads these
files, the kernel caches them in memory to improve performance for future access. 
    
Page cache entries are not [locked memory][locked-memory]: they are evictable and are automatically reclaimed by the kernel when 
actual memory pressure arises. Therefore, high memory usage shown in the monitoring dashboards is often not due to 
$SERVICE_SHORT memory allocation, but the beneficial caching behavior in the Linux kernel. The trick is to distinguish
between normal memory utilization and memory pressure.

High memory usage does not necessarily mean a problem, especially on read replicas or after periods of activity.
For a more accurate view of database memory consumption, look at $PG-specific metrics, such as shared_buffers or memory 
context breakdowns. Only [take action][memory-settings] if you see signs of real memory pressure—such as OOM (Out Of Memory) events 
or degraded performance. 

### $SERVICE_SHORT_CAP states

$CONSOLE_LONG gives you a visual representation of the state of your $SERVICE_SHORT. The following states are represented with the following colors:

| State | Color |
|-------|-------|
| Configuring | <span style="background-color: yellow; padding: 2px 8px; border-radius: 3px;">Yellow</span> |
| Deleted | <span style="background-color: yellow; padding: 2px 8px; border-radius: 3px;">Yellow</span> |
| Deleting | <span style="background-color: yellow; padding: 2px 8px; border-radius: 3px;">Yellow</span> |
| Optimizing | <span style="background-color: green; color: white; padding: 2px 8px; border-radius: 3px;">Green</span> |
| Paused | <span style="background-color: grey; color: white; padding: 2px 8px; border-radius: 3px;">Grey</span> |
| Pausing | <span style="background-color: grey; color: white; padding: 2px 8px; border-radius: 3px;">Grey</span> |
| Queued | <span style="background-color: yellow; padding: 2px 8px; border-radius: 3px;">Yellow</span> |
| Ready | <span style="background-color: green; color: white; padding: 2px 8px; border-radius: 3px;">Green</span> |
| Resuming | <span style="background-color: yellow; padding: 2px 8px; border-radius: 3px;">Yellow</span> |
| Unstable | <span style="background-color: yellow; padding: 2px 8px; border-radius: 3px;">Yellow</span> |
| Upgrading | <span style="background-color: yellow; padding: 2px 8px; border-radius: 3px;">Yellow</span> |
| Read-only | <span style="background-color: red; color: white; padding: 2px 8px; border-radius: 3px;">Red</span> |

## Logs

$CLOUD_LONG shows you detailed logs for your $SERVICE_SHORT, which you can filter by type, date, and time.

To access logs, select your $SERVICE_SHORT in $CONSOLE, then click `Monitoring` > `Logs`:

![Find logs faster](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-console-service-logs.png)

## Insights

Insights help you get a comprehensive understanding of how your queries perform over time, and make the most efficient use of your resources.

To view insights, select your $SERVICE_SHORT, then click `Monitoring` > `Insights`. Search or filter queries by type, maximum execution time, and time frame.

![Insights](https://assets.timescale.com/docs/images/tiger-cloud-console/insights-overview-tiger-console.png)

Insights include `Metrics`, `Current lock contention`, and `Queries`. 

`Metrics` provides a visual representation of CPU, memory, and storage input/output usage over time. It also overlays the execution times of the top three queries matching your search. This helps correlate query executions with resource utilization. Select an area of the graph to zoom into a specific time frame.

`Current lock contention` shows how many queries or transactions are currently waiting for locks held by other queries or transactions.

`Queries` displays the top 50 queries matching your search. This includes executions, total rows, total time, median time, P95 time, related hypertables, tables in the columnstore, and user name. 

![Queries](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-console-query-insights.png)

| Column            | Description                                                                                     |
|-------------------|-------------------------------------------------------------------------------------------------|
| `Executions`      | The number of times the query ran during the selected period.                                   |
| `Total rows`      | The total number of rows scanned, inserted, or updated by the query during the selected period. |
| `Total time`      | The total time of query execution.                                                              |
| `Median time`     | The median (P50) time of query execution.                                                       |
| `P95 time`        | The ninety-fifth percentile, or the maximum time of query execution.                            |
| `Hypertables`     | If the query ran on a $HYPERTABLE.                                                         |
| `Columnar tables` | If the query drew results from a chunk in the $COLUMNSTORE.                                |
| `User name`       | The user name of the user running the query.                                          |

These metrics calculations are based on the entire period you've selected. For example, if you've selected six hours, all the metrics represent an aggregation of the previous six hours of executions.

<Highlight type="note">

If you have just completed a query, it can take some minutes for it to show
in the table. Wait a little, then refresh the page to see your
query. Check out the last update value at the top of the query table to identify the timestamp from the last processed query stat.

</Highlight>

Click a query in the list to see the drill-down view. This view not only helps you identify spikes and unexpected behaviors, but also offers information to optimize your query.

![Queries drill-down view](https://assets.timescale.com/docs/images/tiger-cloud-console/query-drill-down-view-tiger-console.png)

This view includes the following graphs:

- `Execution time`: the median and P95 query execution times over the selected period. This is useful to understand the consistency and efficiency of your query's execution over time.
- `EXPLAIN` plan: for queries that take more than 10 seconds to execute, there is an EXPLAIN plan collected automatically.
- `Rows`: the impact of your query on rows over time. If it's a `SELECT` statement, it shows the number of rows retrieved, while for an `INSERT/UPDATE` statement, it reflects the rows inserted.
- `Plans and executions`: the number of query plans and executions over time. You can use this to optimize query performance, helping you assess if you can benefit from prepared statements to reduce planning overhead.
- `Shared buffers hit and miss`: shared buffers play a critical role in $PG's performance by caching data in memory. A shared buffer hit occurs when the required data block is found in the shared buffer memory, while a miss indicates that $PG couldn't locate the block in memory. A miss doesn't necessarily mean a disk read, because $PG may retrieve the data from the operating system's disk pages cache. If you observe a high number of shared buffer misses, your current shared buffers setting might be insufficient. Increasing the shared buffer size can improve cache hit rates and query speed.
- `Cache hit ratio`: measures how much of your query's data is read from shared buffers. A 100% value indicates that all the data required by the query was found in the shared buffer, while a 0% value means none of the necessary data blocks were in the shared buffers. This metric provides a clear understanding of how efficiently your query leverages shared buffers, helping you optimize data access and database performance.

## Jobs

$CLOUD_LONG summarizes all [$JOBs][jobs] set up for your $SERVICE_SHORT along with their details like type, target object, and status. This includes native $CLOUD_LONG $JOBs as well as custom $JOBs you configure based on your specific needs.

<Procedure>

1. To view $JOBs, select your $SERVICE_SHORT in $CONSOLE, then click `Monitoring` > `Jobs`:

   ![Jobs](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-console-jobs.png)

1. Click a $JOB ID in the list to view its config and run history:

   ![Job details](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-console-job-details.png)

1. Click the pencil icon to edit the $JOB config:

   ![Update job config](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-console-edit-job.png)

</Procedure>

## Connections

$CLOUD_LONG lists current and past connections to your $SERVICE_SHORT. This includes details like the corresponding query, connecting application, username, connection status, start time, and duration.

To view connections, select your $SERVICE_SHORT in $CONSOLE, then click `Monitoring` > `Connections`. Expand the query underneath each connection to see the full SQL.

![Connections](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-console-service-connections.png)

Click the trash icon next to a connection in the list to terminate it. A lock icon means that a connection cannot be terminated; hover over the icon to see the reason.

## Recommendations

$CLOUD_LONG offers specific tips on configuring your $SERVICE_SHORT. This includes a wide range of actions—from finishing $ACCOUNT_SHORT setup to tuning your $SERVICE_SHORT for the best performance. For example, $CLOUD_LONG may recommend a more suitable $CHUNK interval or draw your attention to consistently failing $JOBs.

To view recommendations, select your $SERVICE_SHORT in $CONSOLE, then click `Monitoring` > `Recommendations`:

![Recommendations](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-cloud-console-recommendations.png)

## Query-level statistics with `pg_stat_statements`

<Availability products={['cloud', 'self_hosted', 'mst']} />

You can also get query-level statistics for your $SERVICE_SHORTs with the `pg_stat_statements` extension. This includes the time spent planning and executing each query; the number of blocks hit, read, and written; and more. `pg_stat_statements` comes pre-installed with $CLOUD_LONG.

<Highlight type="note">

For more information about `pg_stat_statements`, see the [$PG documentation][pg-statement-docs].

</Highlight>

Query the `pg_stat_statements` view as you would any $PG view.
The full view includes superuser queries used by $CLOUD_LONG to manage your $SERVICE_SHORT in the background. To view only your
queries, filter by the current user.

[Connect][connect] to your $SERVICE_SHORT and run the following command: 

```sql
SELECT * FROM pg_stat_statements WHERE pg_get_userbyid(userid) = current_user;
```

For example, to identify the top five longest-running queries by their mean execution time:

```sql
SELECT calls,
    mean_exec_time,
    query
FROM pg_stat_statements
WHERE pg_get_userbyid(userid) = current_user
ORDER BY mean_exec_time DESC
LIMIT 5;
```

Or the top five queries with the highest relative variability in the execution time, expressed as a percentage:

```sql
SELECT calls,
    stddev_exec_time/mean_exec_time*100 AS rel_std_dev,
    query
FROM pg_stat_statements
WHERE pg_get_userbyid(userid) = current_user
ORDER BY rel_std_dev DESC
LIMIT 5;
```

For more examples and detailed explanations, see the [blog post on identifying performance bottlenecks with `pg_stat_statements`][blog-pg_stat_statements].

[jobs]: /use-timescale/:currentVersion:/jobs/
[pg-stat]: /use-timescale/:currentVersion:/metrics-logging/service-metrics/#query-level-statistics-with-pg_stat_statements
[blog-pg_stat_statements]: <https://www.timescale.com/blog/identify-postgresql-performance-bottlenecks-with-pg_stat_statements/>
[psql]: /integrations/:currentVersion:/psql/
[connect]: /getting-started/:currentVersion:/services/#connect-to-your-service
[pg-statement-docs]: https://www.postgresql.org/docs/current/pgstatstatements.html
[about-storage]: /use-timescale/:currentVersion:/data-tiering/about-data-tiering/
[recommendations]: /use-timescale/:currentVersion:/metrics-logging/monitoring/#recommendations
[monitoring-jobs]: /use-timescale/:currentVersion:/metrics-logging/monitoring/#jobs
[connections]: /use-timescale/:currentVersion:/metrics-logging/monitoring/#connections 
[metrics]: /use-timescale/:currentVersion:/metrics-logging/monitoring/#metrics
[logs]: /use-timescale/:currentVersion:/metrics-logging/monitoring/#logs
[insights]: /use-timescale/:currentVersion:/metrics-logging/monitoring/#insights
[locked-memory]: https://www.gnu.org/s/libc/manual/html_node/Locked-Memory-Details.html
[memory-settings]: https://www.postgresql.org/docs/current/runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-MEMORY
