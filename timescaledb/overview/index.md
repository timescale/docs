# TimescaleDB Overview

TimescaleDB is an open-source time-series database optimized for fast
ingest and complex queries.  It speaks "full SQL" and is
correspondingly easy to use like a traditional relational database,
yet scales in ways previously reserved for NoSQL databases.

Compared to the trade-offs demanded by these two alternatives
(relational vs. NoSQL), TimescaleDB offers the best of both
worlds **for time-series data:**

## Easy to Use

- **Full SQL interface** for all SQL natively supported by
PostgreSQL (including secondary indexes, non-time based aggregates,
sub-queries, JOINs, window functions).
- **Connects** to any client or tool that speaks PostgreSQL, no changes needed.
- **Time-oriented** features, API functions, and optimizations.
- Robust support for **Data retention policies**.


## Scalable

- **Transparent time/space partitioning** for both scaling up (single node)
and scaling out (forthcoming).
- **High data write rates** (including batched commits, in-memory
indexes, transactional support, support for data backfill).
- **Right-sized chunks** (two-dimensional data partitions) on single nodes to
ensure fast ingest even at large data sizes.
- **Parallelized operations** across chunks and servers.

## Reliable

- **Engineered up** from PostgreSQL, packaged as an extension.
- **Proven foundations** benefiting from 20+ years of PostgreSQL
research (including streaming replication, backups).
- **Flexible management options** (compatible with existing PostgreSQL
ecosystem and tooling).

The rest of this section describes the design and motivation around the TimescaleDB
architecture, including why time-series data is different, and how we leverage
its characteristics when building TimescaleDB. 

**Next:** In part to understand TimescaleDB's design choices, let us ask: [What is time-series data?][time-series-data]

## Download the Guide
If you want a quick visual intro to TimescaleDB, click on the image below to download the starter guide. 

[<img class="main-content__illustration" style="margin: 0 5% 0 10%;"
src="https://assets.timescale.com/images/covers/TimescaleDB_Starter_Guide.svg" 
alt="starter guide"/>][starter-guide]

[time-series-data]: /introduction/time-series-data
[starter-guide]: https://assets.timescale.com/resources/TimescaleDB_Starter_Guide.pdf

