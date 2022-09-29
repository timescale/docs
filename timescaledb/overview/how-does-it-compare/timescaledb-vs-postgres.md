---
title: Why use TimescaleDB over PostgreSQL?
excerpt: How TimescaleDB + PostgreSQL compares to regular PostgreSQL alone
keywords: [PostgreSQL]
tags: [compare]
---

# Why use TimescaleDB over PostgreSQL?

TimescaleDB _is_ PostgreSQL. Because TimescaleDB is a PostgreSQL extension, the
question isn't "Why use TimescaleDB over PostgreSQL?", but rather, "Why use
TimescaleDB and PostgreSQL over PostgreSQL alone?"

TimescaleDB expands PostgreSQL in 3 key areas:

*   [Better performance at scale][better-performance]
*   [Lower storage costs][lower-cost]
*   [Features that speed up development time][dev-features]

Alongside these features, you still get 100% of regular PostgreSQL. That's
because TimescaleDB is an extension, not a fork. With your TimescaleDB database,
you can install other PostgreSQL extensions, make full use of the type system,
and benefit from the diverse PostgreSQL ecosystem.

## Better performance at scale

TimescaleDB performs orders of magnitude better at high data volumes. Your
applications are future-proof even if they grow rapidly.

### 1000 times faster performance for time-series queries

We tested the performance of TimescaleDB + PostgreSQL against PostgreSQL alone,
using different time-based queries. We used one month's worth of data, which
amounted to one billion rows organized into four-hour partitions. Running 100
queries at a time, TimescaleDB + PostgreSQL consistently outperformed a standard
PostgreSQL database. Queries are up to 1000&nbsp;times faster.

This table shows the query latency of PostgreSQL compared to TimescaleDB +
PostgreSQL. The data uses PostgreSQL 14 and TimescaleDB 2.7. For more
information on the comparison, see the [comparison blog
post][blog-postgresql-vs-timescaledb].

<img class="main-content__illustration"
src="https://www.timescale.com/blog/content/images/2022/09/Query-latency-deep-dive--1--1.png"
alt="PostgreSQL query latency in milliseconds, compared to TimescaleDB. For 14
query statements, TimescaleDB performs faster in 13 cases, with improvement
ranging from 4 times to 1031 times. In the thirteenth case, TimescaleDB performs
slightly worse, at 0.8 times as fast as standard PostgreSQL." />

TimescaleDB achieves this performance by using [hypertables][hypertables]. With
hypertables, your data is automatically partitioned by time, but you get the
simplified experience of interacting with a single, virtual table.

Partitioning makes queries faster by quickly excluding irrelevant data. It also
allows us to make enhancements to query planning and execution.

When hypertables are [compressed][compression], performance can improve even
more, because less data needs to be read from disk.

### Millisecond performance for commonly run aggregate queries

When working with time-series data, you often need to aggregate data by grouping
over minutes, hours, days, months, or more. TimescaleDB's continuous aggregates
make time-based aggregates faster. When comparing continuous aggregates to
directly querying raw data, TimescaleDB often means queries take
milliseconds, instead of minutes or hours. For more information, see the
[FlightAware case study][flightaware].

Continuous aggregates automatically materialize aggregated data. They also stay
up-to-date automatically, providing a more convenient developer experience. With
automatically refreshing continuous aggregates, you can downsample your data
automatically. You can delete the underlying raw data on a schedule, while the
continuous aggregate stores the aggregated data.

Continuous aggregates are similar to PostgreSQL materialized views, but they
solve some of their limitations. PostgreSQL materialized views
recreate the entire view every time the materialization process runs, even if
little or no data has changed. Materialized views also don't provide any data
retention management. Any time you delete raw data and update the materialized
view, the aggregated data is removed as well.

In contrast, TimescaleDB's continuous aggregates automatically update on the
schedule you set. They refresh only the portions of new data that were modified
since the last materialization. And they can have data retention policies
applied separately from the raw data, so you can keep old data in a continuous
aggregate even as you delete it from the underlying hypertable.

### Scale PostgreSQL horizontally

With TimescaleDB multi-node, you can scale PostgreSQL horizontally to insert
over 1 million rows per second into petabyte-scale datasets, while maintaining
ingest and query performance.

TimescaleDB multi-node works with distributed hypertables, which automatically
partition your data across multiple data nodes. This happens behind the scenes,
and you still get the simplified experience of interacting with your distributed
hypertable in the same way as a regular PostgreSQL table.

## Lower storage costs

With compression and downsampling, TimescaleDB can dramatically reduce the size
of your tables and reduce your storage costs.

### Greater than 90% storage savings with best-in-class compression algorithms

TimescaleDB provides [native columnar compression][compression]. Users often see
their disk consumption decrease by over 90%, compared to storing the same amount
of data in standard PostgreSQL. If you're using [Timescale Cloud][cloud], which
decouples billing for compute and storage, enabling compression significantly
decreases your storage bill.

This chart shows the size of an example dataset when stored in TimescaleDB with
compression, compared to its size in a regular PostgreSQL database. For more
information on the comparison, see the [comparison blog
post][blog-postgresql-vs-timescaledb].

<img class="main-content__illustration"
src="https://www.timescale.com/blog/content/images/2022/09/image-5.png"
alt="Storage size of a dataset in TimescaleDB compared to PostgreSQL.
TimescaleDB stores the data in 8.6 GB, while standard PostgreSQL stores the data
in 159 GB." />

With compression policies, chunks can be compressed automatically once all data
in the chunk has aged beyond the specified time interval. In practice, this
means that a hypertable can store data as row-oriented for newer data, and
column-oriented for older data.

Having the data stored as both row and column store also matches the typical
query patterns of time-series applications. This improves overall query
performance.

### Automatic downsampling and removal of old data with one command

To save even more on storage costs, you can set up an automatic [data retention
policy][retention] with one SQL command. By combining continuous aggregates and
data retention policies, you can downsample data and drop the raw measurements.
This allows you to retain higher-level rollups of historical data. You have
control over the granularity of your data and your storage costs.

To set this up in standard PostgreSQL, you'd either need to `DELETE` individual
records, which is inefficient, or set up declarative partitioning and automation
yourself.

## Features that speed up development time

TimescaleDB adds many features to standard PostgreSQL, which make it faster to
build and run time-series applications. This includes a library of over 100
hyperfunctions. These hyperfunctions improve the ergonomics of writing complex
SQL queries, including queries that handle count approximation, statistical
aggregates, and more. TimescaleDB also includes a job-scheduling engine for
setting up automated workflows.

### Hyperfunctions that make data analysis easy in SQL

TimescaleDB includes a library of more than 100 hyperfunctions. These functions
simplify calculations that would otherwise be complex in SQL, including
time-weighted averages, downsampling, complex time-bucketing, and backfilling.

This example shows average temperature every day for each device over the
last seven days, carrying forward the last value for missing readings:

```sql
SELECT
  time_bucket_gapfill('1 day', time) AS day,
  device_id,
  avg(temperature) AS value,
  locf(avg(temperature))
FROM metrics
WHERE time > now () - INTERVAL '1 week'
GROUP BY day, device_id
ORDER BY day;
```

To learn more, see the [hyperfunctions API documentation][hyperfunctions].

### Built-in job scheduler for workflow automation

TimescaleDB lets you add [user-defined actions][user-defined-actions], so you
can execute custom stored procedures on a schedule. You can rely on
user-defined actions to calculate complex service level agreements, send event
emails based on data correctness, poll tables, and more.

User-defined actions provide similar capabilities to a third-party scheduler
such `pg_cron`, but without the need to maintain multiple PostgreSQL extensions
or databases.

[better-performance]: #better-performance-at-scale
[blog-postgresql-vs-timescaledb]: https://www.timescale.com/blog/postgresql-timescaledb-1000x-faster-queries-90-data-compression-and-much-more/
[cloud]: /cloud/latest/
[compression]: /timescaledb/:currentVersion:/overview/core-concepts/compression/
[dev-features]: #features-that-speed-up-development-time
[flightaware]: https://www.timescale.com/blog/how-flightaware-fuels-flight-prediction-models-with-timescaledb-and-grafana/
[hyperfunctions]: /api/:currentVersion:/hyperfunctions/
[hypertables]: /timescaledb/:currentVersion:/how-to-guides/hypertables/about-hypertables/
[lower-cost]: #lower-storage-costs
[retention]: /timescaledb/:currentVersion:/how-to-guides/data-retention/about-data-retention/
[user-defined-actions]: /timescaledb/:currentVersion:/how-to-guides/user-defined-actions/
