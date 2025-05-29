---
title: Continuous aggregates
excerpt: Lightning fast queries are a must for efficient real-time analytics. Timescale Cloud continuous aggregates make sure you always have the latest aggregated data at your fingertips
products: [cloud, mst, self_hosted]
keywords: [continuous aggregates]
---

# Continuous aggregates

From real-time dashboards to performance monitoring and historical trend analysis, data aggregation is a must-have for any sort of analytical application. To address this need, $CLOUD_LONG continuous aggregates precompute and store aggregate data for you. Using PostgreSQL [materialized views][postgres-materialized-views], continuous aggregates incrementally refresh the aggregation query in the background, so that when you do run it, only the data that has changed needs to be computed, not the entire dataset. This means you always have the latest aggregate data at your fingertips - and spend as little resources on it, as possible. 

In this section you:

*   [Learn about continuous aggregates][about-caggs] to understand how it works
    before you begin using it.
*   [Create a continuous aggregate][cagg-create] and query it.
*   [Create a continuous aggregate on top of another continuous aggregate][cagg-on-cagg].
*   [Add refresh policies][cagg-autorefresh] to an existing continuous aggregate.
*   [Manage time][cagg-time] in your continuous aggregates.
*   [Drop data][cagg-drop] from your continuous aggregates.
*   [Manage materialized hypertables][cagg-mat-hypertables].
*   [Use real-time aggregates][cagg-realtime].
*   [Convert continuous aggregates to the columnstore][cagg-compression].
*   [Migrate your continuous aggregates][cagg-migrate] from old to new format.
    Continuous aggregates created in Timescale&nbsp;2.7 and later are in the new
    format, unless explicitly created in the old format.
*   [Troubleshoot][cagg-tshoot] continuous aggregates.

[about-caggs]: /use-timescale/:currentVersion:/continuous-aggregates/about-continuous-aggregates
[cagg-autorefresh]: /use-timescale/:currentVersion:/continuous-aggregates/refresh-policies
[cagg-compression]: /use-timescale/:currentVersion:/continuous-aggregates/compression-on-continuous-aggregates
[cagg-create]: /use-timescale/:currentVersion:/continuous-aggregates/create-a-continuous-aggregate
[cagg-on-cagg]: /use-timescale/:currentVersion:/continuous-aggregates/hierarchical-continuous-aggregates/
[cagg-drop]: /use-timescale/:currentVersion:/continuous-aggregates/drop-data
[cagg-mat-hypertables]: /use-timescale/:currentVersion:/continuous-aggregates/materialized-hypertables
[cagg-migrate]: /use-timescale/:currentVersion:/continuous-aggregates/migrate
[cagg-realtime]: /use-timescale/:currentVersion:/continuous-aggregates/real-time-aggregates
[cagg-time]: /use-timescale/:currentVersion:/continuous-aggregates/time
[cagg-tshoot]: /use-timescale/:currentVersion:/continuous-aggregates/troubleshooting
[postgres-materialized-views]: https://www.postgresql.org/docs/current/rules-materializedviews.html
