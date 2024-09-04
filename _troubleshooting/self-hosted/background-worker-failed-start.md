---
title: Failed to start a background worker
section: troubleshooting
products: [self_hosted]
topics: [jobs, continuous aggregates, data retention, compression]
errors:
  - language: bash
    message: |-
      "<TYPE_OF_BACKGROUND_JOB>": failed to start a background worker
apis:
  - [jobs, timescaledb_information.jobs]
  - [jobs, timescaledb_information.job_stats]
  - [jobs, timescaledb_information.add_job()]
  - [hypertables, add_reorder_policy()]
  - [hypertables, add_retention_policy()]
  - [hypertables, add_compression_policy()]
  - [hypertables, add_continuous_aggregate_policy()]
keywords: [jobs, policies, actions]
tags: [jobs, scheduled jobs, background jobs, background workers, automation framework, policies, user-defined actions]
---

{/*
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
*/}

You might see this error message in the logs if background workers aren't
properly configured.

To fix this error, make sure that `max_worker_processes`,
`max_parallel_workers`, and `timescaledb.max_background_workers` are properly
set. `timescaledb.max_background_workers` should equal the number of databases
plus the number of concurrent background workers. `max_worker_processes` should
equal the sum of `timescaledb.max_background_workers` and
`max_parallel_workers`.

For more information, see the [worker configuration docs][worker-config].

[worker-config]: /self-hosted/latest/configuration/about-configuration/#workers
