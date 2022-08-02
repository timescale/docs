---
title: Scheduled jobs stop running
section: troubleshooting
topics: [jobs, continuous aggregates, data retention, compression]
apis:
  - [jobs, timescaledb_information.jobs]
  - [jobs, timescaledb_information.job_stats]
  - [jobs, timescaledb_information.add_job()]
  - [hypertables, add_reorder_policy()]
  - [hypertables, add_retention_policy()]
  - [hypertables, add_compression_policy()]
  - [hypertables, add_continuous_aggregate_policy()]
keywords: [jobs, policies, user-defined actions]
tags: [jobs, scheduled jobs, background jobs, background workers, automation framework, policies, user-defined actions]
---

<!---
* Keep this section in alphabetical order
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
-->

If your scheduled jobs stop running, try restarting the background workers:
```
SELECT _timescaledb_internal.start_background_workers();
```
