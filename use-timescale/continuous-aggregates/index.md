---
title: Continuous aggregates
excerpt: Lightning fast queries are a must for efficient real-time analytics. Continuous aggregates make sure you always have the latest aggregated data at your fingertips
products: [cloud, mst, self_hosted]
keywords: [continuous aggregates]
---

# Continuous aggregates

From real-time dashboards to performance monitoring and historical trend analysis, data aggregation is a must-have for any sort of analytical application. To address this need, $TIMESCALE_DB uses continuous aggregates to precompute and store aggregate data for you. Using $PG [materialized views][postgres-materialized-views], $TIMESCALE_DB incrementally refreshes the aggregation query in the background. When you do run the query, only the data that has changed needs to be computed, not the entire dataset. This means you always have the latest aggregate data at your fingertips—and spend as little resources on it, as possible. 

In this section you:

*   [Learn about continuous aggregates][caggs] to understand how it works
    before you begin using it.
*   [Create a continuous aggregate][create-cagg] and query it.
*   [Create a continuous aggregate on top of another continuous aggregate][hierarchical-caggs].
*   [Add refresh policies][refresh-policy] to an existing continuous aggregate.
*   [Manage time][cagg-time] in your continuous aggregates.
*   [Drop data][cagg-drop-data] from your continuous aggregates.
*   [Manage materialized hypertables][cagg-mat-hypertables].
*   [Use real-time aggregates][real-time-aggregates].
*   [Convert continuous aggregates to the columnstore][cagg-compression].
*   [Migrate your continuous aggregates][cagg-migrate] from old to new format.
    Continuous aggregates created in $TIMESCALE_DB v2.7 and later are in the new
    format, unless explicitly created in the old format.
*   [Troubleshoot][cagg-tshoot] continuous aggregates.

[cagg-compression]: /use-timescale/:currentVersion:/continuous-aggregates/compression-on-continuous-aggregates
[cagg-drop-data]: /use-timescale/:currentVersion:/continuous-aggregates/drop-data
[cagg-mat-hypertables]: /use-timescale/:currentVersion:/continuous-aggregates/materialized-hypertables
[cagg-migrate]: /use-timescale/:currentVersion:/continuous-aggregates/migrate
[cagg-time]: /use-timescale/:currentVersion:/continuous-aggregates/time
[cagg-tshoot]: /use-timescale/:currentVersion:/continuous-aggregates/troubleshooting
[caggs]: /use-timescale/:currentVersion:/continuous-aggregates/about-continuous-aggregates
[create-cagg]: /use-timescale/:currentVersion:/continuous-aggregates/create-a-continuous-aggregate
[hierarchical-caggs]: /use-timescale/:currentVersion:/continuous-aggregates/hierarchical-continuous-aggregates/
[postgres-materialized-views]: https://www.postgresql.org/docs/current/rules-materializedviews.html
[real-time-aggregates]: /use-timescale/:currentVersion:/continuous-aggregates/real-time-aggregates
[refresh-policy]: /use-timescale/:currentVersion:/continuous-aggregates/refresh-policies
