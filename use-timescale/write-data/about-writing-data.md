---
title: About writing data
excerpt: Writing data in TimescaleDB works the same way as writing data to regular PostgreSQL tables. Learn the basics of inserting, updating, upserting, and deleting data in your database using SQL
products: [cloud, mst, self_hosted]
keywords: [ingest]
tags: [write]
---

# About writing data

$TIMESCALE_DB supports writing data in the same way as PostgreSQL, using `INSERT`,
`UPDATE`, `INSERT ... ON CONFLICT`, and `DELETE`.

<Highlight type="note">

$TIMESCALE_DB is optimized for running real-time analytics workloads on time-series data. For this reason, hypertables are optimized for
inserts to the most recent time intervals. Inserting data with recent time
values gives
[excellent performance](https://www.timescale.com/blog/timescaledb-vs-6a696248104e/).
However, if you need to make frequent updates to older time intervals, you
might see lower write throughput.

</Highlight>
