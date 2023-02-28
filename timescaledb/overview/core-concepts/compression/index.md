---
title: Compression
excerpt: Learn how native compression works in TimescaleDB
products: [cloud, mst, self_hosted]
keywords: [compression]
---

# Compression

Compression reduces the amount of space taken up by your data. For some queries,
it also speeds up query time, because fewer bytes need to be read from disk.

TimescaleDB supports native compression for storage and time savings.

## When to compress data

It's best to compress chunks that:

*   Don't have frequent inserts and updates
*   Are queried for only a few columns at a time, rather than for all columns
    at once (`SELECT * FROM ...`)
*   Often reside on disk rather than in memory

For time-series data, these conditions usually apply to older data. The exact
age depends on your application insert and query patterns. To learn more, see
the section on [benefits and trade-offs of compression][benefits-trade-offs].

<!-- TODO: add this link as well when section is complete
[improving
compression](/timescaledb/latest/how-to-guides/compression/improve-compression/).
-->

## Native compression to column-based storage

TimescaleDB uses native compression for hypertable data. That means it doesn't
need a specific file system or extra software. Compression works out-of-the-box.

Compressed data is stored in a hybrid row-columnar format. This format works
best for older data, which is queried but rarely changed. Newer, often-changed
data should be stored in uncompressed row format. To learn more about
TimescaleDB's compression architecture, see the [architecture
section][compression-architecture].

The user interface remains the same after your data is compressed. You continue
to query your data as normal, and the database decompresses data as needed.

<Highlight type="important">
 Inserts and queries work as usual, but there are
limitations on updates and deletes. For more information, see the section on
[trade-offs](#benefits-and-trade-offs-of-compression).
</Highlight>

## Compression performance

In tests, TimescaleDB achieves 91-96% storage savings with lossless compression.
This equals a compression ratio between 10 and 23. For comparison, a compressed
file system, such as ZFS or BTRFS, usually achieves 3 to 9 times compression.

Compression also improves query performance for some queries, when data needs to
be read from disk. In tests using disk-bound data, TimescaleDB
compression improves query speed by 1.15 to 70.45 times. But not all queries on
compressed data have improved performance.

For more information about query performance, see the section on [queries
on compressed data][compressed-queries].

<!-- TODO: add after improving compression page is done
To optimize compression for your query patterns, see the section on [improving
compression performance][improving-compression].
-->

## Benefits and trade-offs of compression

Compression has both benefits and trade-offs. To decide whether to use
compression, and what data to compress, consider your application's insert and
query patterns.

### Benefits of column-based compression

Column-based storage is best for narrow queries, especially on wide tables. In
other words, it works well if you have many columns, but you only want to read a
few of them at a time. The database only needs to retrieve the columns you ask
for. Less data is read from disk.

Also, column-based storage allows the database to use more efficient compression
algorithms. Because data of the same type is stored together, it can be
compressed with a type-specific algorithm. For example, a column containing
integers is compressed with an integer-specific algorithm, not a less-efficient
generic algorithm.

### Trade-offs of column-based compression

Column-based storage doesn't perform as well for wide queries. For example,
queries of the form `SELECT * FROM ...` are often slower. All the columns need
to be retrieved separately and decompressed.

Inserts are also slower. The database needs to split the row into columns and
write each column's data separately.

In TimescaleDB, updates and deletes are not currently possible on compressed
data.

### Balancing benefits and trade-offs

In time-series applications, recent data is often queried with wide-and-shallow
queries. Historical data is often queried with deep-and-narrow queries. Data
with recent timestamps is often added and updated, while older data is rarely
changed.

For these reasons, older data benefits most from compression. Newer data should
be kept uncompressed to accommodate inserts, updates, and wide queries.

## More resources

Learn more about compression from several resources:

*   For how to enable compression and improve compression performance, see the
    [compression how-to guide][compression-how-to].
*   For conceptual information on compression architecture, see the section on
    [compression architecture][compression-architecture].
*   For a deep dive on the design motivations, see the [compression blog
    post][compression-blog-post].

[benefits-trade-offs]: #benefits-and-trade-offs-of-compression
[compression-architecture]: /timescaledb/:currentVersion:/overview/core-concepts/compression/architecture/
[compression-blog-post]: https://blog.timescale.com/blog/building-columnar-compression-in-a-row-oriented-database
[compression-how-to]: /timescaledb/:currentVersion:/how-to-guides/compression/
[compressed-queries]: /timescaledb/:currentVersion:/overview/core-concepts/compression/architecture/#interacting-with-compressed-chunks
[improving-compression]: /timescaledb/:currentVersion:/how-to-guides/compression/improve-compression/
