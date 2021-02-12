# Core Concepts

TimescaleDB is implemented as an extension on PostgreSQL, which means that it
runs within an overall PostgreSQL instance.  The extension
model allows the database to take advantage of many of the attributes of
PostgreSQL such as reliability, security, and connectivity to a wide range of
third-party tools.  At the same time, TimescaleDB leverages the high degree of
customization available to extensions by adding hooks deep into PostgreSQL's
query planner, data model, and execution engine.

From a user perspective, TimescaleDB exposes what look like singular tables,
called **hypertables**, that are actually an abstraction or a virtual view of
many individual tables holding the data, called **chunks**.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/illustration-hypertable-chunk.svg" alt="hypertable and chunks"/>

Chunks are created by partitioning the hypertable's data into
one or multiple dimensions: All hypertables are partitioned by a time interval,
and can additionally be partitioned by a key such as device ID, location,
user id, etc. We sometimes refer to this as partitioning across "time and space".



[data model]: /introduction/data-model
[chunking]: https://www.timescale.com/blog/time-series-data-why-and-how-to-use-a-relational-database-instead-of-nosql-d0cd6975e87c#2362
[jumpSQL]: /using-timescaledb/hypertables
[TvsP]: /introduction/timescaledb-vs-postgres
[Compression Operational Overview]: /using-timescaledb/compression
[compression blog post]: https://blog.timescale.com/blog/building-columnar-compression-in-a-row-oriented-database
[contact]: https://www.timescale.com/contact
[slack]: https://slack.timescale.com/
[distributed-hypertable-limitations]: /using-timescaledb/limitations#distributed-hypertable-limitations
[multi-node-basic]: /getting-started/setup-multi-node-basic
