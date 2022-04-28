# About writing data
TimescaleDB supports writing data in the same way as PostgreSQL, using `INSERT`,
`UPDATE`, `INSERT ... ON CONFLICT`, and `DELETE`.

<highlight type="note">
Because TimescaleDB is a time-series database, hypertables are optimized for
inserts to the most recent time intervals. Inserting data with recent time
values gives
[excellent performance](https://www.timescale.com/blog/timescaledb-vs-6a696248104e/).
If instead your workload involves frequent updates to old time intervals, you
may see lower write throughput.
</highlight>
