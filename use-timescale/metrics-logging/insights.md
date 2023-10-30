---
title: Insights
excerpt: Get query-level performance insights, such as slow queries, memory and data access patterns, and execution metrics
products: [cloud]
keywords: [metrics, monitoring, services, query, performance, insights]
tags: [dashboard, cpu, memory, storage, query, performance]
cloud_ui:
    path:
        - [services, :serviceId, insights]
---

# Insights

Insights allows you to gain a comprehensive understanding of how your queries perform over time. It empowers you to optimize your queries and make the most efficient use of your instance resources.

On the `Insights` tab, you can access insights on queries and instance resources for the previous 24 hours.

<img class="main-content__illustration"
    width={1375} height={944}
    src="https://assets.timescale.com/docs/images/insights_overview.png"
    alt="Timescale Insights page"/>

At the top of the page, you'll find a set of filters, including query types, query text matching, minimum execution time, and a time frame selector, enabling you to find the queries you would like to analyze. Moreover, within the Queries table list view, you can customize the order of the result set by selecting a specific metric. For instance, when seeking out slow queries, you can sort by P95 Time, which brings the slowest queries to the forefront. The result set is limited to 50 queries, so if you're dealing with many unique queries, these filters are useful in helping you pinpoint the information you need.

## Resource metrics

The Metrics graph provides a visual representation of CPU, memory, and Storage IO usage over time. In addition, it overlays the top 3 queries execution times from the list view onto the resource metrics. This feature allows you to easily correlate your query executions with resource utilization. Moreover, you can zoom the graph, enabling you to define specific time frames for a more detailed analysis.

## Query list view

The query list view displays the top 50 entries that match the selected filters. In this table, the following metrics are shown: executions, total rows, hypertables, compressed tables, user name,  median, and p95 execution time. The metrics are calculated based on the entire period you've selected. For example, if you've chosen the past 6 hours in the time frame selector, all the metrics represent an aggregation of the last 6 hours of executions of data.

<img class="main-content__illustration"
    width={1375} height={944}
    src="https://assets.timescale.com/docs/images/insights_query_text.png"
    alt="The image shows the Timescale Insights queries list table, showing an example with some metrics available at this table"/>


#### Details
|Column|Description|
|-|-|
|Executions|Number of times the query has been run during the results period|
|Total rows|Total number of rows scanned, inserted, or updated by the query during the results period|
|Median time|Median (P50) number of microseconds (µs) or milliseconds (ms) it took to run the query|
|P95 time|The ninety-fifth percentile, or the maximum time this query took|
|Hypertables|A green check mark is shown if the query touched a hypertable|
|Compressed tables|A green check mark is shown if results were drawn from a compressed chunk|
|User name|Username of the logged in user running the query|


<Highlight type="note">
If you have just completed a query, it can take some minutes for it to show
in the query stats viewer. Wait a little, and then refresh the page to see your
query. Check out the Last update value at the top of the queries list table to identify the timestamp from last processed query stat.
</Highlight>


## Drill down view

Each query entry in the Queries table is clickable, leading you to the detailed query drill-down page. Graphs shows 5-minute granularity data points for every graph, providing you with insights into your query's behavior over time. These graphs not only help you identify spikes and unexpected behaviors but also offer information to optimize your query.

<img class="main-content__illustration"
    width={1375} height={944}
    src="https://assets.timescale.com/docs/images/drill_down_view.png"
    alt="Timescale Insights drill down page showing illustrations for all available graphs"/>

### Execution time

The execution time graph displays the median and p95 query execution times over the selected period. This information is useful for understanding the consistency and efficiency of your query's execution over time

### Rows

This graph reveals the impact of your query on rows over time. If it's a SELECT statement, it shows the number of rows retrieved, while for an INSERT/UPDATE statement, it reflects the rows inserted.

### Plans and executions

The Plans and Executions graph shows the number of query plans and executions over time. You can use this information for optimizing query performance, helping you assess whether you can benefit from prepared statements to reduce planning overhead.

### Shared buffers hit and miss

Shared buffers play a critical role in PostgreSQL's performance by caching data in memory. A shared buffer hit occurs when the required data block is found in the shared buffer memory, while a miss indicates that PostgreSQL couldn't locate the block in memory. It's important to note that a miss doesn't necessarily mean a disk read because PostgreSQL may retrieve the data from the operating system's disk pages cache. If you observe a high number of shared buffer misses, it may suggest that your current shared buffers setting is insufficient. Increasing the shared buffer size can improve cache hit rates and query speed.

### Cache hit ratio

The Cache Hit Ratio is a direct metric that measures how much of your query's data is read from shared buffers. A 100% value indicates that all the data required by the query was found in the shared buffer, while a 0% value means none of the necessary data blocks were in the shared buffers. This metric provides a clear understanding of how efficiently your query leverages shared buffers, helping you optimize data access and database performance.