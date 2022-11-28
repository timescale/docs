---
title: Scheduled jobs stop running
section: troubleshooting
topics: [jobs, continuous aggregates, data retention, compression]
apis:
  - [continuous aggregates, add_continuous_aggregate_policy()]
  - [continuous aggregates, add_policies()]
  - [hypertables, add_reorder_policy()]
  - [hypertables, add_retention_policy()]
  - [hypertables, add_compression_policy()]
  - [hypertables, add_continuous_aggregate_policy()]
  - [information, timescaledb_information.jobs]
  - [information, timescaledb_information.job_stats]
  - [jobs, add_job()]
keywords: [jobs, policies, actions]
tags: [jobs, scheduled jobs, background jobs, background workers, automation framework, policies, actions]
---

import CloudMSTRestartWorkers from 'versionContent/_partials/_cloud-mst-restart-workers.mdx';

Your scheduled jobs might stop running for various reasons. On self-hosted
TimescaleDB, you can fix this by restarting background workers:

```sql
SELECT _timescaledb_internal.start_background_workers();
```

<CloudMSTRestartWorkers />
