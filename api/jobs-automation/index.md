---
title: Jobs
excerpt: Timescale Cloud API reference for jobs. Includes SQL functions for adding, altering, deleting, and running a job
keywords: [jobs]
tags: [background jobs, scheduled jobs, automation framework]
products: [cloud, mst, self_hosted]
---

# $JOB_CAPs <Tag type="community">Community</Tag>

$JOB_CAPs allow you to run functions and procedures implemented in a
language of your choice on a schedule within Timescale. This allows
automatic periodic tasks that are not covered by existing policies and
even enhancing existing policies with additional functionality.

The following APIs and views allow you to manage the $JOBs that you create and
get details around automatic $JOBs used by other TimescaleDB functions like
continuous aggregation refresh policies and data retention policies. To view the
policies that you set or the policies that already exist, see
[informational views][informational-views].

[informational-views]: /api/:currentVersion:/informational-views/jobs/
