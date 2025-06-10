---
title: Monitor your Timescale Cloud services
excerpt: View logs, metrics, and performance insights for your Timescale Cloud services in Timescale Console. Get actionable tips to improve your service performance
products: [cloud]
price_plans: [performance, scale, enterprise]
keywords: [monitoring]
tags: [telemetry, monitor]
---

# Monitor your $SERVICE_LONGs

$CONSOLE offers you a quick, convenient look into how your $SERVICE_SHORTs are performing and how to make them run smoother. This includes:

- **Recommendations**: tips to ensure your $SERVICE_SHORT is set up to achieve the best performance. 
- **Jobs**: a list of all the jobs scheduled for your $SERVICE_SHORT and their status. 
- **Connections**: a list of all current connections to your $SERVICE_SHORT. You can terminate any process in the list. 
- **Metrics**: CPU, memory, and storage usage over time. 
- **Logs**: your $SERVICE_SHORT logs with filtering and timeframe selection. 
- **Insights**: an in-depth look into your query performance. 

## Recommendations

$CLOUD_LONG offers specific tips on configuring your $SERVICE_SHORT. This includes a wide range of actions—from finishing account setup to tuning your $SERVICE_SHORT for the best performance. For example, $CLOUD_LONG may recommend a more suitable $CHUNK interval or draw your attention to consistently failing $JOBs. 

To view recommendations, select your $SERVICE_SHORT in $CONSOLE, then click `Monitoring` > `Recommendations`:

![Recommendations](https://assets.timescale.com/docs/images/recommendations.png)

## Jobs

$CLOUD_LONG summarizes all [$JOBs][jobs] set up for your $SERVICE_SHORT along with their details like type, target object, and status. This includes native $CLOUD_LONG $JOBs as well as custom $JOBs you configure based on your specific needs. 

To view $JOBs, select your $SERVICE_SHORT in $CONSOLE, then click `Monitoring` > `Jobs`:

![Jobs](https://assets.timescale.com/docs/images/jobs.png)

Click on a $JOB ID in the list to view its config and run history:

![Job details](https://assets.timescale.com/docs/images/job-details.png)

## Connections

$CLOUD_LONG lists current connections to your $SERVICE_SHORT. This includes details like the corresponding query, connecting application, connection status, start time, and duration. 

To view connections, select your $SERVICE_SHORT in $CONSOLE, then click `Monitoring` > `Connections`. Click on a query name in the list to see the SQL:

![Connections](https://assets.timescale.com/docs/images/connections.png)

## Metrics

$CLOUD_LONG shows you CPU, memory, and storage metrics for up to 30 previous days and with down to 10-second granularity.
To access metrics, select your $SERVICE_SHORT in $CONSOLE, then click `Monitoring` > `Metrics`:

![Service metrics](https://assets.timescale.com/docs/images/service-metrics-timescale.png)

The following metrics are represented by graphs:

- CPU, in mCPU
- Memory, in GiB
- Storage used, in GiB
- Storage IO, in ops/sec
- Storage bandwidth, in MiB/sec

Hover over the graph to view metrics for a specific time point. Select an area in the graph to zoom into a specific period.

Gray bars indicate that metrics have not been collected for the period shown.

![Metrics not collected](https://assets.timescale.com/docs/images/tsc-metrics_graybar.webp)

## Logs

$CLOUD_LONG shows you detailed logs for your $SERVICE_SHORT, which you can filter by type, date, and time. 

To access logs, select your $SERVICE_SHORT in $CONSOLE, then click `Monitoring` > `Logs`:

![Find logs faster](https://assets.timescale.com/docs/images/timescale-service-logs.png)

## Insights

Insights help you get a comprehensive understanding of how your queries perform over time, and make the most efficient use of your resources.

To view insights, select your $SERVICE_SHORT, then click `Monitoring` > `Insights`. Search or filter queries by type, maximum execution time, and time frame.

![Insights](https://assets.timescale.com/docs/images/insights_overview_timescale.png)

Insights include `Metrics`, `Current lock contention`, and `Queries`. 

`Metrics` provides a visual representation of CPU, memory, and storage input/output usage over time. It also overlays the execution times of the top three queries matching your search. This helps correlate query executions with resource utilization. Select an area of the graph to zoom into a specific time frame.

`Current lock contention` shows how many queries or transactions are currently waiting for locks held by other queries or transactions.

`Queries` displays the top 50 queries matching your search. This includes executions, total rows, total time, median time, P95 time, related hypertables, tables in the columnstore, and user name. 

![Queries](https://assets.timescale.com/docs/images/query-insights.png)

| Column            | Description                                                                                     |
|-------------------|-------------------------------------------------------------------------------------------------|
| `Executions`      | The number of times the query ran during the selected period.                                   |
| `Total rows`      | The total number of rows scanned, inserted, or updated by the query during the selected period. |
| `Total time`      | The total time of query execution.                                                              |
| `Median time`     | The median (P50) time of query execution.                                                       |
| `P95 time`        | The ninety-fifth percentile, or the maximum time of query execution.                            |
| `Hypertables`     | Whether the query ran on a $HYPERTABLE.                                                         |
| `Columnar tables` | Whether the query drew results from a chunk in the $COLUMNSTORE.                                |
| `User name`       | The user name of the logged-in user running the query.                                          |

These metrics are calculated based on the entire period you've selected. For example, if you've selected six hours, all the metrics represent an aggregation of the previous six hours of executions.

<Highlight type="note">

If you have just completed a query, it can take some minutes for it to show
in the table. Wait a little, then refresh the page to see your
query. Check out the last update value at the top of the query table to identify the timestamp from the last processed query stat.

</Highlight>

Click a query in the list to see the drill-down view. This view not only helps you identify spikes and unexpected behaviors, but also offers information to optimize your query.

![Queries drill-down view](https://assets.timescale.com/docs/images/query-drill-down-view-timescale-console.png)

This view includes the following graphs:

- `Execution time`: the median and P95 query execution times over the selected period. This is useful for understanding the consistency and efficiency of your query's execution over time.
- `Rows`: the impact of your query on rows over time. If it's a `SELECT` statement, it shows the number of rows retrieved, while for an `INSERT/UPDATE` statement, it reflects the rows inserted.
- `Plans and executions`: the number of query plans and executions over time. You can use this to optimize query performance, helping you assess whether you can benefit from prepared statements to reduce planning overhead.
- `Shared buffers hit and miss`: shared buffers play a critical role in PostgreSQL's performance by caching data in memory. A shared buffer hit occurs when the required data block is found in the shared buffer memory, while a miss indicates that PostgreSQL couldn't locate the block in memory. A miss doesn't necessarily mean a disk read, because PostgreSQL may retrieve the data from the operating system's disk pages cache. If you observe a high number of shared buffer misses, your current shared buffers setting might be insufficient. Increasing the shared buffer size can improve cache hit rates and query speed.
- `Cache hit ratio`: measures how much of your query's data is read from shared buffers. A 100% value indicates that all the data required by the query was found in the shared buffer, while a 0% value means none of the necessary data blocks were in the shared buffers. This metric provides a clear understanding of how efficiently your query leverages shared buffers, helping you optimize data access and database performance.

## Query-level statistics with `pg_stat_statements`

<Availability products={['cloud', 'self_hosted']} />

You can also get query-level statistics for your $SERVICE_SHORTs with the `pg_stat_statements` extension. This includes the time spent planning and executing each query; the number of blocks hit, read, and written; and more. `pg_stat_statements` comes pre-installed with $CLOUD_LONG.

<Highlight type="note">

For more information about `pg_stat_statements`, see the [PostgreSQL documentation][pg-statement-docs].

</Highlight>

Query the `pg_stat_statements` view as you would any PostgreSQL view.
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

For more examples and detailed explanations, see the [blog post on identifying
performance bottlenecks with `pg_stat_statements`][blog-pg_stat_statements].

[jobs]: /use-timescale/:currentVersion:/jobs/
[metrics-dashboard]: /use-timescale/:currentVersion:/metrics-logging/service-metrics/
[pg-stat]: /use-timescale/:currentVersion:/metrics-logging/service-metrics/#query-level-statistics-with-pg_stat_statements
[blog-pg_stat_statements]: <https://www.timescale.com/blog/identify-postgresql-performance-bottlenecks-with-pg_stat_statements/>
[psql]: /integrations/:currentVersion:/psql/
[connect]: /getting-started/:currentVersion:/services/#connect-to-your-service
[pg-statement-docs]: https://www.postgresql.org/docs/current/pgstatstatements.html

