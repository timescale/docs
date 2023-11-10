---
title: Scheduled jobs stop running
section: troubleshooting
products: [cloud, mst, self_hosted]
topics: [jobs, continuous aggregates, data retention, compression, tiered storage]
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

<!---
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
-->

Your scheduled jobs might stop running for various reasons. On self-hosted
TimescaleDB, you can fix this by restarting background workers:

<Tabs title="Restart Background Workers">
<Tab title="TimescaleDB >= 2.12">

```sql
SELECT _timescaledb_functions.start_background_workers();
```

</Tab>

<Tab title="TimescaleDB < 2.12">

```sql
SELECT _timescaledb_internal.start_background_workers();
```

</Tab>
</Tabs>


<CloudMSTRestartWorkers />
