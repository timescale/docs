---
title:  Timescale products
excerpt: An exhaustive list of the features supplied by Timescale products
product: Timescale
---

# Timescale products

Timescale is Postgres made powerful. Our products are:

- **Fast and scalable**: store and query data quickly and efficiently with automatic partitioning, columnar compression, and real-time aggregation. Grow effortlessly with dynamic scaling and infinite storage. Learn more

- **Resource/cost savings**:  better engineering leads to efficient compute and storage, which results in costs savings. Save even more with compression, bottomless data tiering to Amazon S3 and usage-based storage. Learn more

- **Worry free and easy**: focus on your app not DBOps, with easy tools and features: Programmatic APIs, job scheduling, one-click forking, high availability, replication, seamless upgrades, expert support, and more. Learn more

- **PostgreSQL but better**: built on PostgreSQL so you can rely on rock-solid architecture and the entire ecosystem, but also get 1,000x faster queries, 90% data compression, and 100+ SQL data analysis hyperfunctions. Learn more

## Timescale Cloud

When your data is on Timescale Cloud you can: 

* Focus on using PostgreSQL, not configuring, hardening, and maintaining complex clusters.
* Sleep easy knowing that restoring from backups and failing over to a standby will work when you need it to.
* Work smarter by spinning up new instances and changing compute resources from the web console, or from your code pipeline.
* Schedule minor upgrades with no downtime, test major upgrades on a fork when you’re ready.
* Everything you need for production, with multi-AZ high availability, read-replicas, forked instances, connection pooling, metric and log export, VPCs and multiple cloud users.

Grow your app, not your costs:

* **Cost-effective and flexible pricing** with usage-based storage and dynamic compute options. Stop worrying about resource waste.

* **Increase performance** with fewer compute resources plus custom optimizations for time-series data and analytics.

* **Stop worrying** about size. No more running out of storage space, managing disk allocations, or getting stuck in the wrong CPU/memory configuration.

* **Simplified bills** that you will understand, without backup, ingress/egress/data transfer, cost-per-query, or cost-per-data-scanned charges.

Get insights into your queries: 

* **Find misbehaving queries** before they bring your application down.
* **Per-query drill downs** into execution times, row results, plans, memory buffer management, and cache performance.
* **Analyze query performance** over time linking slow application performance to the queries which cause it.

### Time series and analytics

- **Faster queries using less compute**:

   Modern databases are fast, but how many are fast while using less compute?

   Timescale can write millions of data points per second without giving up flexibility. It transparently converts recent rows to columnar storage and delivers millisecond-response times across historical data and complex aggregate queries.

   This advanced approach to compression requires fewer resources while giving you responsive queries and applications. And it's all built on 100% PostgreSQL.

- **Increased analytic query performance with compression**:

  Compression usually leads to performance losses. Usually.
  
  Timescale employs advanced type-specific compression algorithms that save anywhere from 80% to 95% on storage space—without dropping performance. In fact, it often improves it.
  
  As your workloads grow, you can scale query capacity with read replicas and connection pools. You can also dynamically scale compute independently, and easily store 100 TBs across tiers and still query them as standard SQL tables.

- **Control costs with no concessions, so you can grow your application not your spend**

  With Timescale, if you don't use it, you don't pay for it.
  
  Usage-based storage, automated data retention policies, continuous aggregation, and other features help you control how much storage you use. You can also tier data to bottomless object storage to further reduce your storage footprint and costs. Dynamic compute and custom optimizations for time-series data and analytics make it easy for you to increase performance while using fewer compute resources.
  
  What's more, you'll always receive a simplified bill without hidden data transfer, cost-per-query, or cost-per-data-scanned charges.

### AI and vector

Lower latency and higher query throughput—all with full SQL.

- **A simple stack for AI applications**: 

  With one database for your application's metadata, vector embeddings, and time-series data, you can say goodbye to the operational complexity of data duplication, synchronization, and keeping track of updates across multiple systems.

- **Lower latency search. Happier end users**: 

  Compared to Pinecone’s storage optimized index (s1), PostgreSQL with pgvector and pgvectorscale achieves 28x lower p95 latency and 16x higher query throughput for approximate nearest neighbor queries at 99% recall— all at 75% lower monthly cost.

- **A vector database with full SQL**

   Write full SQL relational queries incorporating vector embeddings, complete with WHERE clauses, ORDER BY, and other PostgreSQL features. Leverage all PostgreSQL data types to store and filter richer metadata. Easily JOIN vector search results with relevant user metadata for more contextually relevant responses.

Scale from POC to Production

- **One platform for your AI application**

  Timescale’s enhanced PostgreSQL data platform is the home for your application's vector, relational and time-series data.

- **Flexible and transparent pricing**

  No “pay per query” or “pay per index”. Decoupled compute and storage for flexible resource scaling as you grow. Usage-based storage and dynamic compute (coming soon), so you pay only for what you actually use.

- **Ready to scale from day one**

  Push to prod with the confidence of automatic backups, failover and High Availability. Use read replicas to scale query load. One-click database forking for testing new embedding and LLM models. Consultative support to guide you as you grow at no extra cost.

- **Enterprise-grade security and data privacy**

  SOC2 Type II and GDPR compliance. Data encryption at rest and in motion. VPC peering for your Amazon VPC. Secure backups. Multi-factor authentication.


## Managed Service for TimescaleDB  

GCP and Azure

A reliable and worry-free PostgreSQL cloud for all your workloads for:

| Feature        | Description  | 
|----------------|--------------|
| Something cool | How it helps |

sigh

## TimescaleDB

TimescaleDB is an open-source database designed to make SQL scalable for time-series data. It is engineered up from PostgreSQL and packaged as a PostgreSQL extension, providing automatic partitioning across time and space (partitioning key), as well as full SQL support.


## TimescaleDB Toolkit

Ease all things analytics when using TimescaleDB, with a particular focus on developer ergonomics and performance. Our issue tracker contains more on the features we're planning to work on and the problems we're trying to solve, and our Discussions forum contains ongoing conversation.

## pgai

pgai simplifies the process of building search, and Retrieval Augmented Generation(RAG) AI applications with PostgreSQL.

pgai brings embedding and generation AI models closer to the database. With pgai, you can now do the following directly from within PostgreSQL in a SQL query:

- Create embeddings for your data.
- Retrieve LLM chat completions from models like OpenAI GPT4o and Llama 3.
- Generate responses for models such as Ollama.
- Reason over your data and facilitate use cases like classification, summarization, and data enrichment on your existing relational data in PostgreSQL.

## pgvectorscale

pgvectorscale complements pgvector, the open-source vector data extension for PostgreSQL, and introduces the following key innovations for pgvector data:

A new index type called StreamingDiskANN, inspired by the DiskANN algorithm, based on research from Microsoft.
Statistical Binary Quantization: developed by Timescale researchers, This compression method improves on standard Binary Quantization.
On a benchmark dataset of 50 million Cohere embeddings with 768 dimensions each, PostgreSQL with pgvector and pgvectorscale achieves 28x lower p95 latency and 16x higher query throughput compared to Pinecone's storage optimized (s1) index for approximate nearest neighbor queries at 99% recall, all at 75% less cost when self-hosted on AWS EC2.

## pgspot

Spot vulnerabilities in PostgreSQL extension scripts.

pgspot checks extension scripts for following PostgreSQL security best practices. In addition to checking extension scripts it can also be used to check security definer functions or any other PostgreSQL SQL code.

pgspot checks for the following vulnerabilities:

* search_path-based attacks
* unsafe object creation

## live migration

You use the [live-migration][live-migration-docker-image] Docker image to move 100GB-10TB+ of data to a Timescale Cloud service
seamlessly with only a few minutes downtime.

[Live-migration][live-migration-docker-image] is an end-to-end solution that copies the database schema and data to
your target Timescale Cloud service, then replicates the database activity in your source database
to the target service in real-time. Live-migration uses the PostgreSQL logical decoding
functionality and leverages [pgcopydb].

Best practice is to use live-migration when:
- Modifying your application logic to perform dual writes is a significant effort.
- The insert workload does not exceed 20,000 rows per second, and inserts are batched.

  Use [Dual write and backfill][dual-write-and-backfill] for greater workloads.
- Your source database:
  - Uses `UPDATE` and `DELETE` statements on uncompressed time-series data.

    Live-migration does not support replicating `INSERT`/`UPDATE`/`DELETE` statements on compressed data.
  - Has large, busy tables with primary keys.
  - Does not have many `UPDATE` or `DELETE` statements.


## Support Services

We offer a range of support options to adapt to your use case, infrastructure, and budget:

- **Cloud Support**
  - **Cloud Basic Support**
  
     Included with all Timescale trials and subscriptions. It covers support tickets via email during business hours with a 1 business day target response time, as well as direct assistance for general questions and best practices.

  - **Cloud Production Support**

    Focused on keeping production workloads operational, providing on-call assistance for critical applications. It gives you 24x7 coverage for severe incidents, with 1h target response times for issues involving a production database down.

- **Self-managed support**

  - **TimescaleDB Development Support**

    For development, test, and non-critical TimescaleDB workloads that do not require production-level response times. It includes:
    - Unlimited support tickets via email during primary business hours, related to TimescaleDB usage. Target response time 1 business day.
    - Direct assistance for general questions and best practices, including consultative support related to data modeling, query optimization, and performance tuning.

  -  **TimescaleDB Production Support**

    Focused on keeping production workloads operational, providing on-call assistance for critical applications. It includes everything in Development Support, plus:
     - Support tickets via email or portal on TimescaleDB production databases with 24x7 coverage and 1h target response times for issues involving a production database down.
     - Operational support for TimescaleDB and PostgreSQL functionality as well as selected third-party PostgreSQL tooling around backup-restore, replication, and connection pooling.
