---
title: User-defined actions
excerpt: User-defined actions help you automate periodic tasks that aren't covered by TimescaleDB policies
keywords: [actions]
tags: [user-defined actions, scheduled jobs, background jobs, automation framework]
---

# User-defined actions

User-defined actions let you schedule custom-defined procedures to run within
TimescaleDB. They help you automate periodic tasks that aren't covered by
TimescaleDB's policy features.

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

[about-user-defined-actions]: /timescaledb/:currentVersion:/how-to-guides/user-defined-actions/about-user-defined-actions/
[alter-and-delete]: /timescaledb/:currentVersion:/how-to-guides/user-defined-actions/alter-and-delete/
[create-and-register]: /timescaledb/:currentVersion:/how-to-guides/user-defined-actions/create-and-register/
[downsample-compress]: /timescaledb/:currentVersion:/how-to-guides/user-defined-actions/example-downsample-and-compress
[generic-retention]: /timescaledb/:currentVersion:/how-to-guides/user-defined-actions/example-generic-retention
[manage-storage]: /timescaledb/:currentVersion:/how-to-guides/schema-management/manage-storage/
[test-and-debug]: /timescaledb/:currentVersion:/how-to-guides/user-defined-actions/test-and-debug/
