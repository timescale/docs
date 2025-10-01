---
title: Hyperfunctions
excerpt:  The ultimate tool for running real-time analytics workloads, TimescaleDB hyperfunctions make sure you get what you need with near-zero latency and zero complexity
products: [cloud, mst, self_hosted]
keywords: [hyperfunctions, Toolkit, analytics]
---

# Hyperfunctions

Real-time analytics demands more than basic SQL functions—efficient computation becomes essential as datasets grow in size and complexity. That’s where $TIMESCALE_DB hyperfunctions come in: high-performance, SQL-native functions purpose-built for time-series analysis. They are designed to process, aggregate, and analyze large volumes of data with maximum efficiency while maintaining consistently high performance. With hyperfunctions, you can run sophisticated analytical queries and extract meaningful insights in real time.

Hyperfunctions introduce partial aggregation, letting $TIMESCALE_DB store intermediate states instead of raw data or final results. These partials can be merged later for rollups, eliminating costly reprocessing and slashing compute overhead, especially when paired with continuous aggregates.

Take tracking p95 latency across thousands of app instances as an example: 

- With standard SQL, every rollup requires rescanning and resorting massive datasets. 
- With $TIMESCALE_DB, the `percentile_agg` hyperfunction stores a compact state per minute, which you simply merge to get hourly or daily percentiles—no full reprocess needed.

![Tiger Cloud hyperfunctions](https://assets.timescale.com/docs/images/tiger-cloud-console/percentile_agg_hyperfunction.svg)

The result? Scalable, real-time percentile analytics that deliver fast, accurate insights across high-ingest, high-resolution data, while keeping resource use lean.

$CLOUD_LONG includes all hyperfunctions by default, while self-hosted $TIMESCALE_DB includes a subset of them. To include all hyperfunctions with $TIMESCALE_DB, install the [$TOOLKIT_LONG][install-toolkit] $PG extension on your self-hosted $PG deployment.

For more information, read the [hyperfunctions blog post][hyperfunctions-blog].

## Learn hyperfunction basics and install $TOOLKIT_LONG

*   [Learn about hyperfunctions][about-hyperfunctions] to understand how they
    work before using them.
*   Install the [$TOOLKIT_LONG extension][install-toolkit] to access more
    hyperfunctions on self-hosted $TIMESCALE_DB.

## Browse hyperfunctions and $TOOLKIT_LONG features by category

[about-hyperfunctions]: /use-timescale/:currentVersion:/hyperfunctions/about-hyperfunctions
[hyperfunctions-blog]: https://www.tigerdata.com/blog/time-series-analytics-for-postgresql-introducing-the-timescale-analytics-project
[install-toolkit]: /self-hosted/:currentVersion:/tooling/install-toolkit/
