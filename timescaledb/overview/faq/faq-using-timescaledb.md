# FAQs - Using TimescaleDB

## What can I use TimescaleDB for?
TimescaleDB is ideal for time-series workloads that would benefit from a SQL interface.
SQL carries a variety of benefits: a query language that most developers already know;
rich set of functions and utilities; and a broad ecosystem of tools, connectors, and
visualization options. Also, since SQL JOINS are natively supported in TimescaleDB, data
from different sources can be combined at query time (for example, combining relational data stored
in PostgreSQL tables with time-series data stored in TimescaleDB hypertables). This ability
to store relational data alongside time-series data enables developers to simplify their stack,
potentially reducing complex polyglot architectures to a single operational analytical database.

Owing to these advantages, TimescaleDB is currently deployed across a variety of industries,
including manufacturing, energy, utilities, mining, oil and gas, finance, ad tech, smart spaces,
and more. Use cases include complex monitoring and analytics; predicting the performance and
behavior of applications, models, consumers and connected machines; powering operational
analytical workflows and dashboards; and QA and performance testing.

## How do I write data?
Just via normal SQL, but here are some [insert examples][INSERT].

## How do I read data?
Just via normal SQL, but here are some [query examples][SELECT].

## What are my compression options?
Since v1.5,
TimescaleDB has supported native compression that uses a hybrid row/columnar
approach combined with type-specific compression algorithms (for example, different
compression algorithms for timestamps, integers, floats, strings, or other
data). Many users see between a 90-98% reduction in their storage footprint,
leading to significant cost savings (and other query performance improvements).
Note that compression must be *explicitly turned on and configured* for a
hypertable; compression is off by default. For more details about how to use
TimescaleDB compression, please see [our compression docs][compression-docs]
or a longer technical deep-dive [on our blog ][compression-blog].

## How far can TimescaleDB scale?
In our internal benchmarks on standard cloud VMs, we regularly test
single-node TimescaleDB to hundreds of terabytes of data, while sustaining
insert rates of 100-200k rows / second (1-2 million metric inserts / second).
Multi-node TimescaleDB can scale to 10+ million metric inserts / second, and
store petabytes of data. You can read more about
[insert and query benchmarks][benchmarks] for multi-node TimescaleDB.

TimescaleDB is designed to combine the scalability of popular NoSQL databases
with the native query complexity supported by RDBMS systems. Read on for more
details on clustering.

## How does TimescaleDB scale?
TimescaleDB's architecture leverages two key properties of time-series data:

* Time-series data is largely immutable. New data continually arrives, typically
as writes (inserts) to the latest time intervals, not as updates to existing records.
* Workloads have a natural partitioning across both time and space.

TimescaleDB leverages these properties by automatically partitioning data into
two-dimensional chunks that operate like smaller PostgreSQL tables, performing
operations and optimizing query planning across all chunks. This partitioning of the
data into chunks ensures that recent tables' indexes are kept in memory as data is inserted
into the database. Yet all this complexity is abstracted away from the user and
they are exposed to a single table interface (a "hypertable") that functions exactly as
a normal table in PostgreSQL does. For more information, see this blog post:
[Time-series data: Why (and how) to use a relational database instead of NoSQL][rdbms > nosql].

## What are hypertables and chunks?
Our [documentation][docs-architecture] describes these design elements in more depth.

## How should I configure chunking?
See the [Best Practices][hypertable-best-practices] section of our documentation.

## How are hypertable chunks determined across the space dimension?
All hypertable chunks are partitioned automatically across time, which is necessary for
right-sizing the chunks such that the B-trees for a table's indexes can reside in memory
during inserts to avoid thrashing that would otherwise occur while modifying arbitrary locations
in those trees. In addition, the user has the option when creating the hypertable to
partition across the space dimension (partition key) on something like a device id,
customer id, or other unique id. Space partitions use hashing: Every distinct item
is hashed to one of N buckets. The main purpose of space partitioning is to enable
parallel I/O to the same time interval or to build smaller tables when regularly
performing a range query for a single device/customer/ticker. For more
details on space partitioning, see [Best Practices][hypertable-best-practices].

## How do I install TimescaleDB?
See our [install documentation][install].

## How do I update an existing installation?
See our [updating documentation][update].


[INSERT]: /how-to-guides/write-data/insert/
[SELECT]: /how-to-guides/query-data/select/
[rdbms > nosql]: http://www.timescale.com/blog/time-series-data-why-and-how-to-use-a-relational-database-instead-of-nosql-d0cd6975e87c
[benchmarks]: https://blog.timescale.com/blog/timescaledb-2-0-a-multi-node-petabyte-scale-completely-free-relational-database-for-time-series/
[docs-architecture]: /overview/core-concepts/hypertables-and-chunks/
[hypertable-best-practices]: /how-to-guides/hypertables/best-practices/
[install]: /install/latest/
[update]: /how-to-guides/update-timescaledb/
[compression-docs]: /how-to-guides/compression/
[compression-blog]: https://blog.timescale.com/blog/building-columnar-compression-in-a-row-oriented-database/
