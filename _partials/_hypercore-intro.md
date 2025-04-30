$HYPERCORE_CAP is the $TIMESCALE_DB hybrid row-columnar storage engine, designed specifically for
real-time analytics and powered by time-series data. The advantage of $HYPERCORE is its ability
to seamlessly switch between row-oriented and column-oriented storage. This flexibility enables
$CLOUD_LONG to deliver the best of both worlds, solving the key challenges in real-time analytics:

- High ingest throughput
- Low-latency ingestion
- Fast query performance
- Efficient handling of data updates and late-arriving data
- Streamlined data management

$HYPERCORE_CAP’s hybrid approach combines the benefits of row-oriented and column-oriented formats
in each $SERVICE_LONG:

- **Fast ingest with $ROWSTORE**: new data is initially written to the $ROWSTORE, which is optimized for
  high-speed inserts and updates. This process ensures that real-time applications easily handle
  rapid streams of incoming data. Mutability—upserts, updates, and deletes happen seamlessly.

- **Efficient analytics with $COLUMNSTORE**: as the data **cools** and becomes more suited for
  analytics, it is automatically converted to the columnstore. This columnar format enables
  fast scanning and aggregation, optimizing performance for analytical workloads while also
  saving significant storage space.

- **Faster queries on compressed data in $COLUMNSTORE**: in the $COLUMNSTORE conversion, hypertable
  chunks are compressed by more than 90%, and organized for efficient, large-scale queries. Combined with [chunk skipping][chunk-skipping], this helps you save on storage costs and keeps your queries operating at lightning speed.

- **Full mutability with transactional semantics**: regardless of where data is stored,
  $HYPERCORE provides full ACID support. Like in a vanilla PostgreSQL database, inserts and updates
  to the $ROWSTORE and $COLUMNSTORE are always consistent, and available to queries as soon as they are
  completed.

![Hypercore workflow](https://assets.timescale.com/docs/images/hypercore-overview.png)

[chunk-skipping]: /use-timescale/:currentVersion:/hypertables/improve-query-performance/