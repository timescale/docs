---
title: User-defined actions
excerpt: User-defined actions help you automate periodic tasks that aren't covered by Timescale policies
products: [cloud, mst, self_hosted]
keywords: [actions]
tags: [user-defined actions, scheduled jobs, background jobs, automation framework]
---

# User-defined actions

User-defined actions let you schedule custom-defined procedures to run within
Timescale. They help you automate periodic tasks that aren't covered by
Timescale's policy features.

In this section:

*   [Learn about user-defined actions][about-user-defined-actions] before you
    start using them
*   [Create and register][create-and-register] a user-defined action
*   [Test and debug][test-and-debug] a user-defined action
*   [Alter and delete][alter-and-delete] a user-defined action
*   Examples of user-defined actions:
    *   Use a user-defined action to set up a
        [generic data retention][generic-retention] policy that applies across
        all hypertables
    *   Use a user-defined action to implement
        [automatic moving of chunks between tablespaces][manage-storage]
    *   Use a user-defined action to automatically
        [downsample and compress][downsample-compress] older chunks
*   [Compare pg_cron jobs][pg-cron-jobs] and user-defined actions

[about-user-defined-actions]: /use-timescale/:currentVersion:/user-defined-actions/about-user-defined-actions/
[alter-and-delete]: /use-timescale/:currentVersion:/user-defined-actions/alter-and-delete/
[create-and-register]: /use-timescale/:currentVersion:/user-defined-actions/create-and-register/
[downsample-compress]: /use-timescale/:currentVersion:/user-defined-actions/example-downsample-and-compress
[generic-retention]: /use-timescale/:currentVersion:/user-defined-actions/example-generic-retention
[manage-storage]: /use-timescale/:currentVersion:/user-defined-actions/example-tiered-storage/
[test-and-debug]: /use-timescale/:currentVersion:/user-defined-actions/test-and-debug/
[pg-cron-jobs]: /use-timescale/:currentVersion:/user-defined-actions/schedule-pg-cron-jobs/
