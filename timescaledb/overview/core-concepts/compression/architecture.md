# Compression architecture
TimescaleDB implements compression by converting data from a row-based format to
a compressed column-based format. 

Once you enable compression on a hypertable, you can set a compression policy.
The policy automatically schedules compression jobs to asynchronously compress
older data. You can specify the age at which data should be compressed.

## Data is stored in hybrid row-columnar format
Compression is implemented at the chunk level. A chunk is either compressed or
uncompressed. You cannot compress only part of the data in a chunk. Compression
also doesn't change the number of chunks. One uncompressed chunk is turned into
one compressed chunk.

In an uncompressed chunk, data is stored in row format. For example, you might
have a table that looks like this:

|time|device_id|cpu|energy_consumption|
|-|-|-|-|
|12:00:02|1|88.2|0.8|
|12:00:02|2|300.5|0.9|
|12:00:01|1|88.6|0.85|
|12:00:01|2|299.1|0.95|

Each entry is its own row.

When the chunk is compressed, the data is converted into a hybrid row-columnar
format. Multiple rows are grouped into an array-like data structure and stored
as a single row. Your table looks like this:

|time|device_id|cpu|energy_consumption|
|-|-|-|-|
|[12:00:02, 12:00:02, 12:00:01, 12:00:1]|[1, 2, 1, 2]|[88.2, 300.5, 88.6, 299.1]|[0.8, 0.9, 0.85, 0.95]|

This decreases the amount of disk space required, because a single row uses less
space than many rows. It can also speed up some queries. More disk space is
saved by compressing the rows. For more information, see the section on
[compression algorithms](#type-specific-compression-algorithms-are-used).

For simplicity, this example shows only 4 rows. TimescaleDB can combine
up to 1000 rows into a single row.

<highlight type="note">
Behind the scenes, TimescaleDB actually creates a second, under-the-covers,
hypertable with the compressed data. You shouldn't query this table directly.
Run your queries against the original hypertable, and TimescaleDB finds any
compressed data, decompresses it, and returns it to you.
</highlight>

## Data is segmented and ordered
You can control how TimescaleDB combines rows by using the
`timescaledb.compress_orderby` and `timescaledb.compress_segmentby` parameters.

## Indexes are deleted and created
When you compress a chunk, any indexes on that chunk are deleted, and new
indexes are created.

<highlight type="note">
Your old indexes are deleted because data within array-like structures is not 
indexable in the same way as uncompressed data. For example, before compression,
if you have an index on a column named `data`, the index points to individual
rows with individual values for `data`. After compression, the values for `data`
are now stored in array-like structures, so the index can no longer point to
individual values. Only columns used in `segment_by` can be indexed, since they
are not stored as arrays.
</highlight>

## Additional metadata is stored with table

## Pointers and secondary pages are used to store data
For simplicity, the example tables on this page show the data arrays stored
within the table. In practice, to speed up queries, the table does not store the
actual data arrays. It stores pointers to the data, which is on secondary disk
pages:

|time|device_id|cpu|energy_consumption|
|-|-|-|-|
|`<POINTER_TO_DATA>`|`<POINTER_TO_DATA>`|`<POINTER_TO_DATA>`|`<POINTER_TO_DATA>`|

This reduces the amount of data that must be read from disk. When querying a
compressed chunk, the database reads the table of pointers, which is relatively
lightweight. It then follows the pointers to bring in only the needed columns
from disk.

TimescaleDB implements pointers and secondary pages by using PostgreSQL's TOAST
(The Oversized-Attribute Storage Technique) feature. To learn more, see the
[PostgreSQL documentation on TOAST][TOAST].

## Type-specific compression algorithms are used
TimescaleDB uses type-specific compression algorithms to compress each column.
This compresses data more efficiently than generic, type-agnostic algorithms.
Here are the algorithms used for each data type:

|Data type|Compression method|
|-|-|
|Integers and integer-like types, including timestamps|Delta-of-delta and simple-8b with run-length encoding|
|Floats|Gorilla compression|
|Columns with low cardinality (a few possible values that repeat often)|Whole-row dictionary compression and LZ compression|
|Other data types|LZ-based array compression|

To learn more about the compression algorithms used, see the [compression
algorithms blog post][compression-algorithms].

## Interacting with compressed chunks
In many ways, you interact with compressed chunks just as you interact with
uncompressed chunks. But there are some differences.

### Inserts, updates, and deletes
Since TimescaleDB 2.3, you can insert data into compressed chunks.

You cannot currently update or delete data in compressed chunks. Work around
this by decompressing the chunk, making your changes, and recompressing. You can
also delete an entire chunk at once without decompressing it. To learn more, see
the section on [decompressing chunks][decompress].

To minimize the amount of decompressing and recompressing you need to do, set
your compression policy to compress only data that is infrequently updated.

### Queries
You query compressed data just as you would query uncompressed data. Queries on
compressed data are compatible with all the features of TimescaleDB, including
relational `JOIN`s, analytical queries, and aggressive constraint exclusion to
avoid processing chunks.

When writing the query, it doesn't matter whether your data is compressed.
However, to optimize your queries, it helps to understand what is happening
behind the scenes.

TimescaleDB enables this capability by both (1) transparently appending data
stored in the standard row format with decompressed data from the columnar format,
and (2) transparently decompressing individual columns from selected rows at query time.

During a query, uncompressed chunks are processed normally, while data from
compressed chunks are first decompressed and converted to a standard row
format at query time, before being appended or merged into other data. This
approach is compatible with everything you expect from TimescaleDB, such as
relational JOINs and analytical queries, as well as aggressive constraint exclusion
to avoid processing chunks.

[compression-algorithms]: https://www.timescale.com/blog/time-series-compression-algorithms-explained/
[decompress]: /how-to-guides/compression/decompress-chunks.md
[TOAST]: https://www.postgresql.org/docs/current/storage-toast.html