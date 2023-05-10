---
title: About writing data
excerpt: How to write data to Timescale
products: [cloud, mst, self_hosted]
keywords: [ingest]
tags: [write]
---

# About writing data

Timescale supports writing data in the same way as PostgreSQL, using `INSERT`,
`UPDATE`, `INSERT ... ON CONFLICT`, and `DELETE`.

<Highlight type="note">
Because Timescale is a time-series database, hypertables are optimized for
inserts to the most recent time intervals. Inserting data with recent time
values gives
[excellent performance](https://www.timescale.com/blog/timescaledb-vs-6a696248104e/).
However, if you need to make frequent updates to older time intervals, you
might see lower write throughput.
</Highlight>
