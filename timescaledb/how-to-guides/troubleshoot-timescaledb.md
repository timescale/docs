---
title: Troubleshooting TimescaleDB
excerpt: Troubleshoot common problems that occur when using TimescaleDB
products: [cloud, mst, self_hosted]
keywords: [troubleshooting]
---

import CloudMSTRestartWorkers from 'versionContent/_partials/_cloud-mst-restart-workers.mdx';

# Troubleshooting

## Scheduled jobs stop running

Your scheduled jobs might stop running for various reasons.

<CloudMSTRestartWorkers />

## Getting more information

### EXPLAINing query performance

PostgreSQL's EXPLAIN feature allows users to understand the underlying query
plan that PostgreSQL uses to execute a query. There are multiple ways that
PostgreSQL can execute a query: for example, a query might be fulfilled using a
slow sequence scan or a much more efficient index scan. The choice of plan
depends on what indexes are created on the table, the statistics that PostgreSQL
has about your data, and various planner settings. The EXPLAIN output let's you
know which plan PostgreSQL is choosing for a particular query. PostgreSQL has a
[in-depth explanation][using explain] of this feature.

To understand the query performance on a hypertable, we suggest first
making sure that the planner statistics and table maintenance is up-to-date on the hypertable
by running `VACUUM ANALYZE <your-hypertable>;`. Then, we suggest running the
following version of EXPLAIN:

```sql
EXPLAIN (ANALYZE on, BUFFERS on) <original query>;
```

If you suspect that your performance issues are due to slow IOs from disk, you
can get even more information by enabling the
[track\_io\_timing][track_io_timing] variable with `SET track_io_timing = 'on';`
before running the above EXPLAIN.

When asking query-performance related questions in our [support portal][]
or via [slack][], providing the EXPLAIN output of a
query is immensely helpful.

[slack]: https://slack.timescale.com/
[support portal]: https://www.timescale.com/support
[track_io_timing]: https://www.postgresql.org/docs/current/static/runtime-config-statistics.html#GUC-TRACK-IO-TIMING
[using explain]: https://www.postgresql.org/docs/current/static/using-explain.html
