$HYPERCORE_CAP is a hybrid row-columnar storage engine in $TIMESCALE_DB. It is designed specifically for
real-time analytics and powered by time-series data. The advantage of $HYPERCORE is its ability
to seamlessly switch between row-oriented and column-oriented storage, delivering the best of both worlds:

![Hypercore workflow](https://assets.timescale.com/docs/images/hypercore-overview.png)

$HYPERCORE_CAP solves the key challenges in real-time analytics:

- High ingest throughput
- Low-latency ingestion
- Fast query performance
- Efficient handling of data updates and late-arriving data
- Streamlined data management

$HYPERCORE_CAP’s hybrid approach combines the benefits of row-oriented and column-oriented formats:

- **Fast ingest with $ROWSTORE**: new data is initially written to the $ROWSTORE, which is optimized for
  high-speed inserts and updates. This process ensures that real-time applications easily handle
  rapid streams of incoming data. Mutability—upserts, updates, and deletes happen seamlessly.

- **Efficient analytics with $COLUMNSTORE**: as the data **cools** and becomes more suited for
  analytics, it is automatically converted to the $COLUMNSTORE. This columnar format enables
  fast scanning and aggregation, optimizing performance for analytical workloads while also
  saving significant storage space.

- **Faster queries on compressed data in $COLUMNSTORE**: in the $COLUMNSTORE conversion, hypertable
  chunks are compressed by up to 98%, and organized for efficient, large-scale queries. Combined with [chunk skipping][chunk-skipping], this helps you save on storage costs and keeps your queries operating at lightning speed.

- **Fast modification of compressed data in $COLUMNSTORE**: just use SQL to add or modify data in the $COLUMNSTORE.
   $TIMESCALE_DB is optimized for superfast INSERT and UPSERT performance.  

- **Full mutability with transactional semantics**: regardless of where data is stored,
  $HYPERCORE provides full ACID support. Like in a vanilla $PG database, inserts and updates
  to the $ROWSTORE and $COLUMNSTORE are always consistent, and available to queries as soon as they are
  completed.

For an in-depth explanation of how $HYPERTABLEs and $HYPERCORE work, see the [Data model][data-model].

[chunk-skipping]: /use-timescale/:currentVersion:/hypertables/improve-query-performance/
[data-model]: /about/:currentVersion:/whitepaper/#data-model