## Native Compression [](native-compression)

Compression is powered by TimescaleDB’s built-in job scheduler framework. We
leverage it to asynchronously convert individual chunks from an uncompressed
row-based form to a compressed columnar form across a hypertable: Once a chunk
is old enough, the chunk will be transactionally converted from the row to columnar form.

With native compression, even though a single hypertable in TimescaleDB will
store data in both row and columnar forms, users don’t need to worry about
this: they will continue to see a standard row-based schema when querying data.
This is similar to building a view on the decompressed columnar data.

TimescaleDB enables this capability by both (1) transparently appending data
stored in the standard row format with decompressed data from the columnar format,
and (2) transparently decompressing individual columns from selected rows at query time.

During a query, uncompressed chunks will be processed normally, while data from
compressed chunks will first be decompressed and converted to a standard row
format at query time, before being appended or merged into other data. This
approach is compatible with everything you expect from TimescaleDB, such as
relational JOINs and analytical queries, as well as aggressive constraint exclusion
to avoid processing chunks.

For more information on using compression, please see our [Compression Operational Overview].
For a deep dive on the design motivations and architecture supporting
compression, read our [compression blog post].
