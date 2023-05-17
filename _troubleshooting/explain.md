---
title: A particular query executes more slowly than expected
section: troubleshooting
products: [cloud, mst, self_hosted]
topics: [queries]
keywords: [EXPLAIN]
tags: [queries, query, explain, performance]
---

<!---
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
-->

To troubleshoot a query, you can examine its EXPLAIN plan.

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

[track_io_timing]: https://www.postgresql.org/docs/current/static/runtime-config-statistics.html#GUC-TRACK-IO-TIMING
[using explain]: https://www.postgresql.org/docs/current/static/using-explain.html
