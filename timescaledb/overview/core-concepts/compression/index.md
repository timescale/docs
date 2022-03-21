# Native compression
TimescaleDB supports native compression for data stored in hypertables. Native
compression does not require the use of any specific file system or external
software. Compressing time-series data can significantly reduce the storage
requirement of your data. In many cases, it can also speed up queries on
compressed data.

TimescaleDB implements compression by storing older, historical data in a hybrid
row-columnar format. It stores newer, frequently updated data in the standard
PostgreSQL row format. This combination achieves good performance for the insert
and query patterns usually seen with time-series data.

These optimizations happen behind the scenes. As a user, you continue to
query your data as if it stays in its standard row-based format.

## Benefits and trade-offs of compression


## Compression performance
In tests, TimescaleDB achieves 91-96% storage savings with its native lossless
compression. This corresponds to a compression ratio between 10 to 23 times. For
comparison, a compressed file system, such as ZFS or BTRFS, usually achieves 3
to 9 times compression.

Compression can also improve query performance for some queries, when data needs
to be read from disk. In tests using disk-bound, "cold" data, TimescaleDB
compression improves query speed by 1.15 to 70.45 times for example queries.
However, not all queries on compressed data have improved performance. To
optimize your data storage for your query patterns, see the section on
[improving compression performance][improving-compression].

## More resources
Learn more about compression from several resources:
*   For how to enable compression and improve compression performance, see the
    [compression how-to guide][compression-how-to].
*   For conceptual information on compression architecture, see the section on
    [compression architecture][compression-architecture].
*   For a deep dive on the design motivations and architecture, see the
    [compression blog post][compression-blog-post].

[compression-architecture]: /overview/core-concepts/compression/architecture/
[compression-blog-post]: https://blog.timescale.com/blog/building-columnar-compression-in-a-row-oriented-database
[compression-how-to]: /how-to-guides/compression/
[improving-compression]: /how-to-guides/compression/improve-compression/
