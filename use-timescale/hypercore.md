---
title: Hypercore
excerpt: The Timescale hybrid row-columnar storage engine for real-time analytics, powered by time-series data
products: [cloud,]
keywords: [hyperscore, hypertable, compression, row-columnar storage, hypercore]
---

# Hypercore

Hypercore is the Timescale hybrid row-columnar storage engine, designed specifically for 
real-time analytics and powered by time-series data. The advantage of hypercore is its ability 
to seamlessly switch between row-oriented and column-oriented storage. This flexibility enables 
Timescale Cloud to deliver the best of both worlds, solving the key challenges in real-time analytics: 

- High ingest throughput
- Low-latency ingestion 
- Fast query performance
- Efficient handling of data updates and late-arriving data 
- Streamlined data management

Currently, much of this functionality is available as [compression][compression]. However, we are actively 
updating our APIs and docs so you can more easily integrate the following features under the hypercore umbrella.

Hypercore’s hybrid approach combines the benefits of row-oriented and column-oriented formats 
in each Timescale Cloud service:

- **Fast ingest with Rowstore**: new data is initially written to the rowstore, it is optimized for 
  high-speed inserts and updates. This process ensures that real-time applications easily handle 
  rapid streams of incoming data. Mutability—upserts, updates, and deletes happen seamlessly.

- **Efficient analytics with Columnstore**: as the data _cools_ and becomes more suited for 
  analytics, it is automatically migrated to the columnstore. Your data is compressed into small 
  batches and organized for efficient, large-scale queries. This columnar format enables for 
  fast scanning and aggregation, optimizing performance for analytical workloads while also 
  saving significant storage space.

- **Full mutability with transactional semantics**: regardless of where data is stored,
  hypercore provides full ACID support. Like in a vanilla Postgres database, inserts and updates 
  to the rowstore and columnstore are always consistent, and available to queries as soon as they are 
  completed.

![Hypercore workflow](https://assets.timescale.com/docs/images/hypercore-overview.png)


[compression]: /use-timescale/:currentVersion:/compression/
