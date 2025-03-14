---
title: Hypercore
excerpt: The Timescale hybrid row-columnar storage engine for real-time analytics, powered by time-series data
products: [cloud,]
keywords: [hypercore, hypertable, compression, row-columnar storage]
---

import UsageBasedStorage from "versionContent/_partials/_usage-based-storage-intro.mdx";

# Hypercore

Hypercore is the $TIMESCALE_DB hybrid row-columnar storage engine, designed specifically for
real-time analytics and powered by time-series data. The advantage of Hypercore is its ability
to seamlessly switch between row-oriented and column-oriented storage. This flexibility enables
$CLOUD_LONG to deliver the best of both worlds, solving the key challenges in real-time analytics:

- High ingest throughput
- Low-latency ingestion
- Fast query performance
- Efficient handling of data updates and late-arriving data
- Streamlined data management

Hypercore’s hybrid approach combines the benefits of row-oriented and column-oriented formats
in each $SERVICE_LONG:

- **Fast ingest with rowstore**: new data is initially written to the rowstore, which is optimized for
  high-speed inserts and updates. This process ensures that real-time applications easily handle
  rapid streams of incoming data. Mutability—upserts, updates, and deletes happen seamlessly.

- **Efficient analytics with columnstore**: as the data _cools_ and becomes more suited for
  analytics, it is automatically migrated to the columnstore. This columnar format enables
  fast scanning and aggregation, optimizing performance for analytical workloads while also
  saving significant storage space.

- **Faster queries on compressed data in columnstore**: in columnstore conversion, hypertable
  chunks are compressed by more than 90%, and organized for efficient, large-scale queries. Combined with [chunk skipping][chunk-skipping], this helps you save on storage costs and keep your queries operating at lightning speed.

- **Full mutability with transactional semantics**: regardless of where data is stored,
  Hypercore provides full ACID support. Like in a vanilla Postgres database, inserts and updates
  to the rowstore and columnstore are always consistent, and available to queries as soon as they are
  completed.


![Hypercore workflow](https://assets.timescale.com/docs/images/hypercore-overview.png)

In Timescale Cloud you only pay for what you use. Data moved to the columnstore is compressed, which 
immediately translates into cost savings. 


This section shows you how to:

* [Optimize your data for real-time analytics][setup-hypercore]
* [Modify data in the columnstore][modify-data-in-hypercore]

[setup-hypercore]: /use-timescale/:currentVersion:/hypercore/real-time-analytics-in-hypercore/
[modify-data-in-hypercore]: /use-timescale/:currentVersion:/hypercore/modify-data-in-hypercore/
[indexing-data-in-hypercore]: /use-timescale/:currentVersion:/hypercore/best-practice-for-large-amounts-of-data/
[compression]: /use-timescale/:currentVersion:/compression/
[chunk-skipping]: /use-timescale/:currentVersion:/hypertables/improve-query-performance/
