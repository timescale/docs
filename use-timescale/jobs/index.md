---
title: Jobs in TimescaleDB
excerpt: Increase efficiency and reduce overhead by automating routine tasks. Set up custom jobs on top of TimescaleDB policies
products: [cloud, mst, self_hosted]
keywords: [jobs]
tags: [jobs, scheduled jobs, background jobs, automation framework]
---

# $JOB_CAPs

$TIMESCALE_DB natively includes some $JOB-scheduling policies, such as:

*   [$CAGG_CAP policies][refresh-policy] to automatically refresh $CAGGs
*   [$HYPERCORE_CAP policies][setup-hypercore] to optimize and compress historical data
*   [Retention policies][retention-policy] to drop historical data
*   [Reordering policies][reordering] to reorder data within $CHUNKs

If these don't cover your use case, you can create and schedule custom-defined $JOBs to run within
your database. They help you automate periodic tasks that aren't covered by the native policies.

In this section, you see how to:

*   [Create and manage $JOBs][create-jobs]
*   Set up a [generic data retention][generic-retention] policy that applies across all $HYPERTABLEs
*   Implement [automatic moving of $CHUNKs between tablespaces][manage-storage]
*   Automatically [downsample and compress][downsample-compress] older $CHUNKs

[create-jobs]: /use-timescale/:currentVersion:/jobs/create-and-manage-jobs/
[downsample-compress]: /use-timescale/:currentVersion:/jobs/example-downsample-and-compress
[generic-retention]: /use-timescale/:currentVersion:/jobs/example-generic-retention
[manage-storage]: /use-timescale/:currentVersion:/jobs/example-tiered-storage/
[refresh-policy]: /use-timescale/:currentVersion:/continuous-aggregates/refresh-policies/
[reordering]: /api/:currentVersion:/hypertable/add_reorder_policy/
[retention-policy]: /use-timescale/:currentVersion:/data-retention/create-a-retention-policy/
[setup-hypercore]: /use-timescale/:currentVersion:/hypercore/real-time-analytics-in-hypercore/
