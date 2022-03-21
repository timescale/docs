Compression is powered by TimescaleDB's built-in job scheduler framework. We
leverage it to asynchronously convert individual chunks from an uncompressed
row-based form to a compressed columnar form across a hypertable: Once a chunk
is old enough, the chunk is transactionally converted from the row to columnar
form.

TimescaleDB enables this capability by both (1) transparently appending data
stored in the standard row format with decompressed data from the columnar format,
and (2) transparently decompressing individual columns from selected rows at query time.

During a query, uncompressed chunks are processed normally, while data from
compressed chunks are first decompressed and converted to a standard row
format at query time, before being appended or merged into other data. This
approach is compatible with everything you expect from TimescaleDB, such as
relational JOINs and analytical queries, as well as aggressive constraint exclusion
to avoid processing chunks.