---
title: FAQs - Comparing to PostgreSQL
excerpt: Why to choose TimescaleDB over regular PostgreSQL
keywords: [PostgreSQL, faq]
tags: [geospatial data, compare]
---

# FAQs - Comparing to PostgreSQL

## Why would I use TimescaleDB over vanilla PostgreSQL?
Read our TimescaleDB-PostgreSQL benchmarks:
* [TimescaleDB vs. PostgreSQL for time-series data][PostgreSQL-benchmark]
* [Problems with PostgreSQL 10 for time-series data][PostgreSQL-problems-time-series]

To summarize, TimescaleDB offers:
* Ease-of-use: TimescaleDB is far easier to use because creating partitions (or what we call
"chunks") is automatically performed for the user. All of the complexity of automatic
partitioning is abstracted away behind a hypertable, which users interact with just as
they would with a PostgreSQL table.
* Much higher ingest scale: TimescaleDB sees throughput more than 20 times that of 
<!-- vale Google.Units = NO -->
PostgreSQL once tables reach moderate size (for example, tens of millions of
rows). 
<!-- vale Google.Units = YES -->
While vanilla PostgreSQL is suitable for time-series data at low volumes, it does
not scale well to the volume of data that most time-series applications produce, especially
when running on a single server. In particular, vanilla PostgreSQL has poor write performance
for moderate tables, and this problem only becomes worse over time as data volume grows
linearly in time. These problems emerge when table indexes can no longer fit in memory,
as each insert translates to many disk fetches to swap in portions of the indexes'
B-Trees. TimescaleDB solves this through its heavy utilization of
time-space partitioning, even when running _on a single machine_. So all writes
to recent time intervals are only to tables that remain in memory, and updating any
secondary indexes is also fast as a result.
* Superior (or similar) query performance: Queries that can reason
specifically about time ordering can be _much_ more performant (thousands of times faster)
in TimescaleDB. On single disk machines, at least, many simple queries that just perform
indexed lookups or table scans are similarly performant between PostgreSQL and TimescaleDB.
* Much faster data deletion: To save space or to implement data retention policies,
vanilla PostgreSQL requires expensive "vacuuming" operations to defragment
the disk storage associated with such tables. TimescaleDB avoids vacuuming operations
and easily enforces data retention policies by specifying the data you wish to be
deleted that is older than a specified time period. For more information, see [Data Retention][data-retention].
* Extended time-oriented features: TimescaleDB includes time-series specific features
not included in vanilla PostgreSQL and entirely unique to TimescaleDB
(such as [`time_bucket`][time_bucket],[`first`][first], and [`last`][last]), 
with more to come.

## How compatible is TimescaleDB with PostgreSQL?
TimescaleDB is implemented as an extension to PostgreSQL that introduces
transparent scalability and performance optimizations, as well as time-series
specific features (for example, arbitrary aggregations, data retention
policies). TimescaleDB connects with any and all third-party tools that
communicate with standard PostgreSQL connectors. TimescaleDB supports the same
extensions, tools and drivers that PostgreSQL supports. You can continue to run
your existing PostgreSQL databases and work with your current visualization and
reporting tools.

## How does TimescaleDB handle geospatial data?
As an extension of PostgreSQL, TimescaleDB works well with PostGIS. For example,
[see our tutorial][postgis] using PostGIS and TimescaleDB on NYC taxicab data.

[PostgreSQL-benchmark]: https://blog.timescale.com/blog/timescaledb-vs-6a696248104e/
[PostgreSQL-problems-time-series]: https://blog.timescale.com/blog/time-series-data-postgresql-10-vs-timescaledb-816ee808bac5/
[data-retention]: /timescaledb/:currentVersion:/how-to-guides/data-retention/
[first]: /api/:currentVersion:/hyperfunctions/first/
[last]: /api/:currentVersion:/hyperfunctions/last/
[postgis]: /timescaledb/:currentVersion:/tutorials/nyc-taxi-cab
[time_bucket]: /api/:currentVersion:/hyperfunctions/time_bucket/
