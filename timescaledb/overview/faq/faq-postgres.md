# FAQs - Comparing to PostgreSQL

## Why would I use TimescaleDB over vanilla PostgreSQL?
Read our TimescaleDB-PostgreSQL benchmarks:
* [TimescaleDB vs. PostgreSQL for time-series data][PostgreSQL-benchmark]
* [Problems with PostgreSQL 10 for time-series data][PostgreSQL-problems-time-series]

To summarize, TimescaleDB offers:
* Ease-of-use: TimescaleDB is far easier to use because creating partitions (or what we call
"chunks") is automatically performed for the user. All of the complexity of automatic
partitioning is abstracted away behind a "hypertable", which users interact with just as
they would with a PostgreSQL table.
* Much higher ingest scale: TimescaleDB sees throughput more than 20X that of
PostgreSQL once tables reach moderate size (e.g., 10s of millions of rows).
While vanilla PostgreSQL is suitable for time-series data at low volumes, it does
not scale well to the volume of data that most time-series applications produce, especially
when running on a single server. In particular, vanilla PostgreSQL has poor write performance
for moderate tables, and this problem only becomes worse over time as data volume grows
linearly in time. These problems emerge when table indexes can no longer fit in memory,
as each insert will translate to many disk fetches to swap in portions of the indexes'
B-Trees. TimescaleDB solves this through its heavy utilization of
time-space partitioning, even when running _on a single machine_. So all writes
to recent time intervals are only to tables that remain in memory, and updating any
secondary indexes is also fast as a result.
* Superior (or similar) query performance: Queries that can reason
specifically about time ordering can be _much_ more performant (1000s of times faster)
in TimescaleDB. On single disk machines, at least, many simple queries that just perform
indexed lookups or table scans are similarly performant between PostgreSQL and TimescaleDB.
* Much faster data deletion: To save space or to implement data retention policies,
vanilla PostgreSQL requires expensive "vacuuming" operations to defragment
the disk storage associated with such tables. TimescaleDB avoids vacuuming operations
and easily enforces data retention policies by specifying the data you wish to be
deleted that is older than a specified time period. For more information, see [Data Retention][data-retention].
* Extended time-oriented features: TimescaleDB includes time-series specific features
not included in vanilla PostgreSQL and entirely unique to TimescaleDB
(e.g., [`time_bucket`][time_bucket],[`first`][first] and [`last`][last]), with more to come.

## How compatible is TimescaleDB with PostgreSQL?
TimescaleDB is implemented as an extension to PostgreSQL that introduces
transparent scalability and performance optimizations, as well as time-series
specific features (e.g., arbitrary aggregations, data retention policies). TimescaleDB
connects with any and all third party tools that communicate with standard PostgreSQL
connectors. TimescaleDB supports the same extensions, tools and drivers that PostgreSQL
supports. You can continue to run your existing PostgreSQL databases and work with your
current visualization and reporting tools.

## How does TimescaleDB handle geospatial data?
As an extension of PostgreSQL, TimescaleDB works well with PostGIS. For example,
[see our tutorial][postgis] using PostGIS and TimescaleDB on NYC taxicab data.

[api]: /api/:currentVersion:/
[why-sql]: https://www.timescale.com/blog/why-sql-beating-nosql-what-this-means-for-future-of-data-time-series-database-348b777b847a
[new-queries]: /how-to-guides/query-data/advanced-analytic-queries/
[INSERT]: /how-to-guides/write-data/insert/
[SELECT]: /how-to-guides/query-data/select/
[rdbms > nosql]: http://www.timescale.com/blog/time-series-data-why-and-how-to-use-a-relational-database-instead-of-nosql-d0cd6975e87c
[benchmarks]: https://blog.timescale.com/blog/timescaledb-2-0-a-multi-node-petabyte-scale-completely-free-relational-database-for-time-series/
[distributed-hypertable]: /timescaledb/:currentProduct:/how-to-guides/distributed-hypertables
[docs-architecture]: /overview/core-concepts/hypertables-and-chunks/
[hypertable-best-practices]: /how-to-guides/hypertables/best-practices/
[PostgreSQL-benchmark]: https://www.timescale.com/blog/timescaledb-vs-6a696248104e
[PostgreSQL-problems-time-series]: https://www.timescale.com/blog/time-series-data-postgresql-10-vs-timescaledb-816ee808bac5
[time_bucket]: /api/:currentVersion:/analytics/time_bucket/
[first]: /api/:currentVersion:/analytics/first/
[last]: /api/:currentVersion:/analytics/last/
[data-retention]: /how-to-guides/data-retention/
[postgis]: /tutorials/nyc-taxi-cab
[GitHub]: https://github.com/timescale/timescaledb/issues
[contact]: https://www.timescale.com/contact
[join_slack]: https://slack.timescale.com/
[install]: /how-to-guides/install-timescaledb/
[update]: /how-to-guides/update-timescaledb/
[compression-docs]: /how-to-guides/compression/
[compression-blog]: https://blog.timescale.com/blog/building-columnar-compression-in-a-row-oriented-database/
[timescale-license]: https://www.timescale.com/legal/licenses
[timescale-k8s]: https://github.com/timescale/timescaledb-kubernetes
[timescale-signup]: https://www.timescale.com/timescale-signup
[timescale-support]: https://www.timescale.com/support
