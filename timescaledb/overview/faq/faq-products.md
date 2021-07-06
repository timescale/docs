# FAQs - About our products

## What is the difference between Timescale, TimescaleDB, Timescale Forge, and Timescale Cloud?
**Timescale** is the company.

Timescale builds an open-source relational database for time-series called
**TimescaleDB**.

Timescale hosts and manages TimescaleDB on behalf of its customers via
hosted services called **Timescale Forge** and **Timescale Cloud**.

Timescale Forge is a cloud-native TimescaleDB-as-a-service that is easy to
get started and powerful enough for the most demanding scenarios.

Timescale Cloud is a managed TimescaleDB service hosted in 75+ regions in
AWS, Azure, or GCP.

## What is TimescaleDB?
TimescaleDB is an open-source relational database for time-series. Developers
often tell us that TimescaleDB is "PostgreSQL with super-powers." TimescaleDB
is the only open source time-series database that supports full SQL.
Optimized for fast ingest and complex queries, TimescaleDB is easy to use like a
traditional relational database, yet scales in ways previously reserved for NoSQL
databases. In particular, this makes TimescaleDB an ideal candidate for
operational analytics.

## Why should I use TimescaleDB?
As time becomes a more critical dimension along which data is measured,
TimescaleDB enables developers and organizations to harness more of its power
to measure everything that matters.

Unifying time-series data and relational data at the query level removes data
silos, and makes demos and prototypes easier to get off the ground. The
combination of scalability and a full SQL interface empowers a broad variety of
people across an organization (e.g., developers, product managers, business
analysts, etc.) to directly ask questions of the data. In other words, by
supporting a query language already in wide use, TimescaleDB ensures that your
questions are limited by your imagination, not the database.

## What can I use TimescaleDB for?
TimescaleDB is ideal for time-series workloads that would benefit from a SQL interface.
SQL carries a variety of benefits: a query language that most developers already know;
rich set of functions and utilities; and a broad ecosystem of tools, connectors, and
visualization options. Also, since SQL JOINS are natively supported in TimescaleDB, data
from different sources can be combined at query time (e.g., combining relational data stored
in PostgreSQL tables with time-series data stored in TimescaleDB hypertables). This ability
to store relational data alongside time-series data enables developers to simplify their stack,
potentially reducing complex polyglot architectures to a single operational analytical database.

Owing to these advantages, TimescaleDB is currently deployed across a variety of industries,
including manufacturing, energy, utilities, mining, oil and gas, finance, ad tech, smart spaces,
and more. Use cases include complex monitoring and analytics; predicting the performance and
behavior of applications, models, consumers and connected machines; powering operational
analytical workflows and dashboards; for QA and performance testing.

## Why should I choose a managed Timescale offering?
If you want all the benefits of TimescaleDB without the hassle of installing,
maintaining, and administering the database itself, then let Timescale manage and
operate TimescaleDB on your behalf.

With cloud-based TimescaleDB, Timescale manages all of the operational elements of your database so you can
focus on building your applications and not making sure the infrastructure works. We
ensure you have a secure, high availability environment where we manage the infrastructure
all the way down to setting up replications, point-in-time recovery, read replicas,
backups, and more.

## Which cloud providers and regions are supported by Timescale Cloud?
Timescale Cloud is available in the following Clouds and Regions:

* **Amazon Web Services (AWS)**: N. Virginia (`us-east-1`), Ohio (`us-east-2`),
N. California (`us-west-1`), Oregon (`us-west-2`), São Paulo (`sa-east-1`),
Stockholm (`eu-north-1`), Ireland (`eu-west-1`), London (`eu-west-2`), Paris (`eu-west-3`),
Frankfurt (`eu-central-1`), Canada (`ca-central-1`), Singapore (`ap-southeast-1`),
Sydney (`ap-southeast-2`), Tokyo (`ap-northeast-1`), Mumbai (`ap-south-1`), Seoul (`ap-northeast-2`)
* **Microsoft Azure (Azure)**: East US, East US 2, West Europe, Southeast Asia
* **Google Cloud Platform (GCP)**: Northern Virginia, Los Angeles, South Carolina,
Iowa, Oregon, São Paulo, Zürich, London, Frankfurt, Finland, Belgium, Netherlands,
Montréal, Sydney, Taiwan, Mumbai, Hong Kong, Tokyo, Singapore

## What is the version of TimescaleDB offered by Microsoft Azure, Digital Ocean, or other cloud providers?
TimescaleDB is a relational database for time-series, with some features
licensed under the Apache 2.0 License but many of the features you know and
love are licensed via the [Timescale License][timescale-license] (including
continuous aggregates, compression, data retention policies, actions,
multi-node, and more). The "Apache 2.0" version of TimescaleDB offered
by Microsoft, Digital Ocean, and others includes only the features in the
Apache license. The Timescale License prohibits cloud providers from offering
the "community version" of TimescaleDB-as-a-service.

Today, you can deploy the community version of TimescaleDB on-premises or in
your own cloud account, running the software on bare VMs or using our
[open-source k8s helm charts][timescale-k8s]. TimescaleDB acquired in
this manner is totally free to use, and free to even modify for your
own use or for services or products you build on TimescaleDB.

Or, if you prefer, [you can let us run TimescaleDB for you][timescale-signup],
fully managed on AWS, Azure, or GCP in 75+ regions and with access to
our [top-rated support team][timescale-support].

## Do you really support "all of SQL"?
Yes, all of SQL, including: secondary indexes, JOINs, window functions. In fact,
to the outside world, TimescaleDB looks like a PostgreSQL database: You connect
to the database as if it's PostgreSQL, and you can administer the database as if
it's PostgreSQL. Any tools and libraries that connect with PostgreSQL will
automatically work with TimescaleDB.

## Why SQL?
SQL is the most widely-used query language in the world for interacting with a
database and manipulating data. We wanted TimescaleDB to be easy to use and powerful.
Because SQL is so widely-used, it allows an entire organization to access their data,
lending different perspectives to the analysis of that data and empowering people
in their respective roles. It also allows for easy migration of data residing in
PostgreSQL tables to TimescaleDB hypertables. Put another way: we wanted
to ensure that your queries were only limited by your imagination, not by the query
language. For a deeper dive into why we're positive on SQL, read this blog post:
[Why SQL is beating NoSQL, and what this means for the future of data][why-sql]

## What SQL features are supported?
We support all of SQL, including secondary indices, complex predicates, JOINs,
window functions, CTEs, etc. Additionally, we extend SQL to introduce
[new semantics that make time-series manipulation easier][new-queries]. Behind
the scenes, we also optimize the PostgreSQL query planner to enable the database
to properly reason about time-series data, which in some cases leads to over
10,000x improvement in query latency.

## Is there a clustered version and how can I try it?
To enable multi-node deployments, TimescaleDB 2.0 introduces the concept of a
[distributed hypertable][distributed-hypertable].

A regular hypertable, one of our original innovations, is a virtual
table in TimescaleDB that automatically partitions data into many
sub-tables (“chunks”) on a single machine, continuously creating
new ones as necessary, yet provides the illusion of a single continuous
table across all time.

A distributed hypertable is a hypertable that automatically partitions
data into chunks across multiple machines, while still maintaining
the illusion (and user-experience) of a single continuous table across
all time.

## Is TimescaleDB currently being used in production?
Yes. TimescaleDB is currently deployed in production across a variety of industries
including manufacturing, energy, utilities, mining, oil and gas, finance, ad tech,
smart spaces, and more.

## When is TimescaleDB a good choice?**  [](when-good)
TimescaleDB is a good choice:

* If you, and more of your organization, want to make standard SQL queries on time-series data,
even at scale. Most (all?) NoSQL databases require learning either a new query language or using
something that's at best "SQL-ish" (which still breaks compatibility with existing tools and
causes some degree of mental friction).
* If you need to (or would like) only to manage one database for your relational and time-series
data. Otherwise, users often need to silo data into two databases: a "normal" relational one,
and a second time-series one.
* If you want JOINs, which allow you to query relational and time-series data together at the
database layer and might entirely remove the need to develop this capability at the application
layer (read: frees up developer resources).
* If you want query performance for a varied set of queries. More complex queries are often
slow or full table scans on NoSQL databases, while some data stores can't even support many
natural queries.
* If you want to simplify database management. TimescaleDB can be managed just like PostgreSQL
and inherits its support for varied datatypes and indexes (B-tree, hash, range, BRIN, GiST, GIN).
* If support for geospatial data is desirable. Data stored in TimescaleDB can leverage PostGIS's
geometric datatypes, indexes, and queries.
* If you want greater optionality when it comes to using third-party tools. TimescaleDB supports
anything that speaks SQL (i.e., the entire PostgreSQL ecosystem).
* If you already use and like PostgreSQL, and don't want to have to "give it up" and move to a
NoSQL system in order to scale to larger volumes of data.
* If you already chose to abandon PostgreSQL or another relational database for a Hadoop/NoSQL
system due to scaling concerns or issues. We will provide support for the migration back.

## What if my use case is simple key-value reads?
For this scenario, in-memory or column-oriented databases are designed for
key-value storage with fast lookup and a relational database may not be ideal.
However, these systems clearly do not scale to large data volumes and cannot
perform well for more complex queries (whereas relational databases
like TimescaleDB and PostgreSQL are better suited).

## What if I have very sparse or unstructured data?
Good question. TimescaleDB leverages PostgreSQL support for JSON/JSONB formats
and handles sparsity quite efficiently (bitmaps for NULL values). However,
there are some best practices and suggestions that may apply to get optimal
performance depending on your scenario. Please see discussion in these docs
or [join our Slack group][join_slack].

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
[time_bucket]: /api/:currentVersion:/hyperfunctions/time_bucket/
[first]: /api/:currentVersion:/hyperfunctions/first/
[last]: /api/:currentVersion:/hyperfunctions/last/
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
