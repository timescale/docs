---
title: TimescaleDB overview
excerpt: Learn about TimescaleDB, the open-source relational database for time-series data
---

# TimescaleDB Overview

TimescaleDB is an open-source relational database for time-series data. It uses
full SQL and is just as easy to use as a traditional relational database, yet
scales in ways previously reserved for NoSQL databases.

## Supercharged PostgreSQL

TimescaleDB uses the same PostgreSQL you know and love, with full SQL,
rock‑solid reliability, and the largest ecosystem of developer and management
tools.

*   **Full SQL**, [powerful analytics][hyperfunctions], no restrictions
*   Leverage your **favorite PostgreSQL extensions**
*   **Your entire toolset works**: ORMs, connectors, JDBC, applications
*   **Connect Prometheus** for all your observability metrics
*   Visualize data using **[the dashboards you love][grafana]**

## Accelerated performance

Achieve 10-100x faster queries than PostgreSQL, InfluxDB, and MongoDB. Leverage
query parallelization, continuous aggregates, and other performance
optimizations.

*   **Achieve 10x faster inserts and ingest 1.5M+ more metrics per second** per
    server for high-cardinality workloads
*   **Optimized time-series queries** and
    [advanced time-series analytics][hyperfunctions]
*   **Real-time insights** over automated
    [continuous aggregations][continuous-aggregates]
*   **Fast scans** over compressed columnar storage
*   **Query faster** over longer time horizons with downsampling

## Massive scale

Write millions of data points per second. Store hundreds of terabytes on a single
node or petabytes across multiple nodes. Handle high‑cardinality data easily.

*   **Store hundreds of billions of rows** and hundreds of TBs of data per
    server with compression, or tens of TBs uncompressed
*   **Record billions of distinct time‑series**, collect everything you need
*   **Best‑of‑breed datatype‑specific compression** for 16x storage capacity
*   **[Create distributed hypertables][multinode]** across many TimescaleDB
    nodes
*   **Parallelize scans and aggregation queries** across many nodes

## Relational and time-series, together

Simplify your stack and store your relational data alongside time‑series data.
Ask more complex queries, and build more powerful applications faster.

*   **Centralize storage** of time‑series, application, and sensor data
*   **Correlate metrics** with business and system‑of‑record data
*   **Unlimited metadata**, don't worry about cardinality of labels
*   **Perform JOINs to understand relations** with time‑series data
*   **Ensure clean, correct data** with foreign keys and constraints

## Worry-free operations

Let us run TimescaleDB for you, fully managed on AWS, Azure, or GCP in over 75
regions, with a top-rated support team to ensure your success.

*   Spin up a pre‑configured instance in **30 seconds, pay‑as‑you‑go**
*   **Effortless upgrades**, fully managed without downtime
*   **[Automated, continuous backups][backups]** with point‑in‑time recovery
*   Choose **[highly‑available replicated pairs][replication]** for business
    continuity
*   **Integrated metrics, logs, security and user controls** at your fingertips

## Lower costs

Spend less with compression savings from best‑in‑class algorithms, including delta-delta and Gorilla, and a memory‑efficient architecture.

*   **Reduce storage costs** with 94-97% lossless
    [compression rates][compression]
*   **Downsampling** keeps aggregated metrics without wasting disk space
*   Optimize storage consumption with
    **[data retention policies][data-retention]**
*   **Transparent pricing**, always know what you'll pay
*   **Dynamically scale compute and storage** based on changing needs

This section describes the design and motivation around the TimescaleDB
architecture, including why time-series data is different, and how we leverage
its characteristics with TimescaleDB.

## Watch the videos

If you prefer to learn by watching and want an intro to TimescaleDB, check out
our [YouTube channel][youtube].

[backups]: /timescaledb/:currentVersion:/how-to-guides/backup-and-restore/
[compression]: /timescaledb/:currentVersion:/how-to-guides/compression/
[continuous-aggregates]: /api/:currentVersion:/continuous-aggregates/create_materialized_view/
[data-retention]: /timescaledb/:currentVersion:/how-to-guides/data-retention/
[grafana]: /timescaledb/:currentVersion:/tutorials/grafana/
[hyperfunctions]: /api/:currentVersion:/hyperfunctions/
[multinode]: /api/:currentVersion:/distributed-hypertables/
[replication]: /timescaledb/:currentVersion:/how-to-guides/replication-and-ha/
[youtube]: https://www.youtube.com/c/TimescaleDB/featured/
