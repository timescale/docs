# Native compression
TimescaleDB supports native compression for hypertable data. Native compression
doesn't require a specific file system or any external software. It works with
the PostgreSQL file system and TimescaleDB extension that you already have.

Compressing time-series data can significantly reduce its storage size. In many
cases, it also speeds up queries on compressed data.

The user interface remains the same after your data is converted to a columnar
format. You continue to query your data as usual, and the database retrieves and
decompresses columns as needed.

## Compression and column-based storage
TimescaleDB implements compression by storing older, historical data in a hybrid
row-columnar format. It stores newer, frequently updated data in the standard
PostgreSQL row format. This combination achieves good performance for the insert
and query patterns usually seen with time-series data. To learn more about
TimescaleDB's compression architecture, see the
[architecture section][compression-architecture].

## Benefits and trade-offs of compression
### Benefits of column-based storage
Column-based storage is best for narrow queries, especially on wide tables. In
other words, it works well if you have many columns but only want to read a few
of them at a time. The database can selectively retrieve only the needed
columns, so less data needs to be read from disk.

Also, column-based storage allows more-efficient compression algorithms, because
it stores data of the same type together. For example, a column might contain
only integers. This allows the use of integer-specific compression algorithms,
rather than less-efficient generic algorithms.

### Trade-offs of column-based storage
Column-based storage doesn't perform as well as row-based storage for wide
queries. For example, queries of the form `SELECT * FROM ...` are often slower.
This is because all the columns need to be retrieved separately and
decompressed.

Inserts are also slower. Rather than writing the entire row contiguously, the
database needs to split it into separate columns.

Also, in TimescaleDB, updates and deletes are not currently possible on
compressed data.

### Balancing benefits and trade-offs
In time-series applications, recent data is often queried with wide-and-shallow
queries, while historical data is queried with deep-and-narrow queries. Data
with recent timestamps is frequently added and updated, whereas older data is
infrequently modified. For these reasons, older data benefits from the storage
savings and performance optimizations of compression. Newer data should be kept
uncompressed to better suit its query and modification patterns.

## Compression performance
In tests, TimescaleDB achieves 91-96% storage savings with its native lossless
compression. This corresponds to a compression ratio between 10 and 23 times.
For comparison, a compressed file system, such as ZFS or BTRFS, usually achieves
3 to 9 times compression.

Compression can also improve query performance for some queries, when data needs
to be read from disk. In tests using disk-bound, "cold" data, TimescaleDB
compression improves query speed by 1.15 to 70.45 times for example queries.
However, not all queries on compressed data have improved performance. For more
information about query performance, see the section on 
[queries on compressed data][compressed-queries]. To optimize your data storage 
for your query patterns, see the section on 
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
[compressed-queries]: /overview/core-concepts/compression/architecture/#queries
[improving-compression]: /how-to-guides/compression/improve-compression/
