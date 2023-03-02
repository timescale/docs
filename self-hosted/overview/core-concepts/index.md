---
title: Why use TimescaleDB
excerpt: TimescaleDB is PostgreSQL, enhanced for time-series data
---

# Why use TimescaleDB

TimescaleDB is a **relational database for time-series data**.

It is implemented as an extension to PostgreSQL, which means that it runs
within a PostgreSQL server as part of the same process, with code that
introduces new capabilities for time-series data management, new functions
for data analytics, new query planner and query execution optimizations, and
new storage mechanisms for more cost effective and performant analytics.
Any operations to a PostgreSQL database that includes TimescaleDB (whether
SELECTs or INSERTs, or schema management like creating indexes) are first
processed by TimescaleDB to determine how they should be planned or
executed against TimescaleDB's data structures.

This extension model allows the database to take advantage of the richness of
PostgreSQL, from 40+ data types (integers, floats, strings, timestamps,
to arrays and JSON data types), to a dozen types of indexes, to complex
schemas, to an advanced query planner, and to a larger extension ecosystem
that plays nicely with TimescaleDB (including geo-spatial support through
PostGIS, monitoring with pg_stat_statements, foreign data wrappers, and more).

This design also allows TimescaleDB to take advantage of PostgreSQL's maturity
from a reliability, robustness, security, and ecosystem perspective. One can
use PostgreSQL's physical replication to create multiple replicas for higher-
availability and scaling read queries; snapshots and incremental WAL streaming
for continuous backups to support full point-in-time recovery; role-based
access control at the schema, table, or even row-level; and integrations with
a huge number of third-party connectors and systems that speak the standard
PostgreSQL protocol, such as popular programming languages, ORMs, data science
tools, streaming systems, ETL tools, visualization libraries and dashboards,
and more.

At the same time, TimescaleDB leverages the high degree of customization
available to extensions by adding hooks deep into PostgreSQL's query planner,
data and storage model, and execution engine. This allows for new,
advanced capabilities designed specifically for time-series data, including:

- **Transparent and automated time partitioning**, where time-series tables are
  automatically and continuously "chunked" into smaller intervals to improve
  performance and to unlock various data-management capabilities. Data
  and indexes for the latest chunks naturally remain in memory,
  ensuring fast inserts and performant queries to recent data.

- **Native columnar compression** with advanced datatype-specific compression,
  employing various best-in-class algorithms based on whether the data are
  timestamps, integers, floats, strings, or others. Users typically report 94-97%
  storage reduction and faster queries to compressed data.

- **Continuous and real-time aggregations**, in which the database continually
  and incrementally maintains a materialized view of aggregate time-series data
  to improve query performance, while properly handling late data or data
  backfills. TimescaleDB even enables queries to transparently merge pre-
  computed aggregates with the latest raw data to ensure always up-to-date
  answers.

- **Automated time-series data management features**, such as explicit or
  policy-based data retention policies, data reordering policies, aggregation
  and compression policies, downsampling policies, and more.

- **In-database job-scheduling framework** to power both native policies and to
  support user-defined actions, including those written in SQL or PL/pgSQL.

- **Horizontally-scalable multi-node operation** to automatically and
  elastically scale your time-series data across many TimescaleDB databases,
  while still giving the abstraction of a single time-series table.

To better understand TimescaleDB, we first want to better explain two main
concepts of how TimescaleDB scales: its data abstractions of **hypertables**
and **chunks** (and how these are stored and processed), and how TimescaleDB
can be deployed as either a single-node, with physical replicas, or as a multi-
node cluster to enable distributed hypertables.
