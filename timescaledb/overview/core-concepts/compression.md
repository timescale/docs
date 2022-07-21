---
title: Native compression
excerpt: Learn how TimescaleDB native compression works
keywords: [compression]
---

# Native compression

TimescaleDB supports the ability to natively compress data stored in hypertables.
Native compression does not require the use of any specific file system or external
software. Compressing time-series data can significantly reduce the storage requirement
of your data and, in many cases, speed up the responsiveness of queries on
historical, compressed data.

Compression is powered by TimescaleDB's built-in job scheduler framework. We
leverage it to asynchronously convert individual chunks from an uncompressed
row-based form to a compressed columnar form across a hypertable: Once a chunk
is old enough, the chunk is transactionally converted from the row to columnar form.

With native compression, even though a single hypertable in TimescaleDB
stores data in both row and columnar forms, users don't need to worry about
this: they continue to see a standard row-based schema when querying data.
This is similar to building a view on the decompressed columnar data.

TimescaleDB enables this capability by both (1) transparently appending data
stored in the standard row format with decompressed data from the columnar format,
and (2) transparently decompressing individual columns from selected rows at query time.

During a query, uncompressed chunks are processed normally, while data from
compressed chunks are first decompressed and converted to a standard row
format at query time, before being appended or merged into other data. This
approach is compatible with everything you expect from TimescaleDB, such as
relational JOINs and analytical queries, as well as aggressive constraint exclusion
to avoid processing chunks.

For more information on using compression, please see our [Compression How-to guide].
For a deep dive on the design motivations and architecture supporting
compression, read our [compression blog post].

[Compression How-to guide]: /timescaledb/:currentVersion:/how-to-guides/compression/
[compression blog post]: https://blog.timescale.com/blog/building-columnar-compression-in-a-row-oriented-database
