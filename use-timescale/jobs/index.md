---
title: Jobs in Timescale Cloud
excerpt: Increase efficiency and reduce overhead by automating routine tasks. Set up custom jobs on top of Timescale Cloud policies. Learn how to create them in your service
products: [cloud, mst, self_hosted]
keywords: [actions]
tags: [scheduled jobs, background jobs, automation framework]
---

# $JOB_CAPs

$JOB_CAPs let you schedule custom-defined procedures to run within
Timescale. They help you automate periodic tasks that aren't covered by
Timescale's policy features.

In this section:

*   [Learn about $JOBs][about-jobs] before you
    start using them
*   [Create and register][create-and-register] a $JOB
*   [Test and debug][test-and-debug] a $JOB
*   [Alter and delete][alter-and-delete] a $JOB
*   Examples of $JOBs:
    *   Use a $JOB to set up a
        [generic data retention][generic-retention] policy that applies across
        all hypertables
    *   Use a $JOB to implement
        [automatic moving of chunks between tablespaces][manage-storage]
    *   Use a $JOB to automatically
        [downsample and compress][downsample-compress] older chunks

[about-jobs]: /use-timescale/:currentVersion:/jobs/about-jobs/
[alter-and-delete]: /use-timescale/:currentVersion:/jobs/alter-and-delete/
[create-and-register]: /use-timescale/:currentVersion:/jobs/create-and-register/
[downsample-compress]: /use-timescale/:currentVersion:/jobs/example-downsample-and-compress
[generic-retention]: /use-timescale/:currentVersion:/jobs/example-generic-retention
[manage-storage]: /use-timescale/:currentVersion:/jobs/example-tiered-storage/
[test-and-debug]: /use-timescale/:currentVersion:/jobs/test-and-debug/
