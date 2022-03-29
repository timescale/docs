# Compression architecture
TimescaleDB implements compression by converting data from a row-based format to
a compressed column-based format. 

Once you enable compression on a hypertable, you can set a compression policy.
The policy automatically schedules compression jobs to asynchronously compress
older data. You can specify the age at which data should be compressed.

## Compressed chunks use hybrid row-columnar format
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

Each record has its own row.

When the chunk is compressed, the data is converted into a hybrid row-columnar
format. Multiple rows are grouped into an array-like data structure and stored
as a single row. Your table looks like this:

|time|device_id|cpu|energy_consumption|
|-|-|-|-|
|[12:00:02, 12:00:02, 12:00:01, 12:00:1]|[1, 2, 1, 2]|[88.2, 300.5, 88.6, 299.1]|[0.8, 0.9, 0.85, 0.95]|

This decreases the amount of disk space required, because a single row uses less
space than many rows. It can also speed up some queries. Even more disk space is
saved by compressing the columns. For more information, see the section on
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

`orderby` determines the order of items inside the compressed arrays. By
default, items are ordered by descending time. 

For each `orderby` column, TimescaleDB automatically calculates the minimum and
maximum value within the compressed arrays. It creates new columns to store
these values within the table:

|time|device_id|cpu|energy_consumption|min_time|max_time|
|-|-|-|-|-|-|
|[12:00:02, 12:00:02, 12:00:01, 12:00:1]|[1, 2, 1, 2]|[88.2, 300.5, 88.6, 299.1]|[0.8, 0.9, 0.85, 0.95]|12:00:01|12:00:02|

This allows the query planner to quickly determine the range covered by each
compressed column, without having to decompress the data.

`segmentby` determines which items are combined together within a compressed
chunk. If you don't provide a `segmentby` column, TimescaleDB combines items
contiguously by the `orderby` parameters, into compressed columns of up to 1000
items. Therefore, if the uncompressed chunk has `N` rows, the compressed chunk
has roughly `ceiling( N / 1000 )` rows.

If you define `segmentby` columns, the values in those columns are not combined
into arrays. Rather, separate compressed rows are created for each value. In
other words, each row of the compressed table contains only a single value in
the `segmentby` columns, and contains arrays of multiple values in every other
column. In the following example, the compressed table is segmented by
`device_id`:

|time|device_id|cpu|energy_consumption|
|-|-|-|-|
|[12:00:02, 12:00:01]|1|[88.2, 88.6]|[0.8, 0.85]|
|[12:00:02, 12:00:01]|2|[300.5, 299.1]|[0.9, 0.95]|

The choice of `orderby` and `segmentby` columns can affect compression
efficiency and query performance. For tips on optimizing performance, see the
section on [improving compression][improving-compression].

<highlight type="note">
The estimation for number of rows in compressed chunks is close but not exact,
because other factors affect the boundaries of compressed columns.
</highlight>

## Indexes are deleted and created
When you compress a chunk, any indexes on that chunk are removed. New indexes
are created on each `segmentby` column.

If you decompress a chunk, your old indexes are restored.

<highlight type="note">
Your old indexes are removed because data within array-like structures is not 
indexable in the same way as uncompressed data. For example, before compression,
if you have an index on a column named `data`, the index points to individual
rows with individual values for `data`. After compression, the values for `data`
are now stored in array-like structures, so the index can no longer point to
individual values. Only columns used in `segment_by` can be indexed, since they
are not stored as arrays.
</highlight>

## Pointers and secondary pages are used to store data
For simplicity, the examples on this page show the compressed tables with the
data arrays stored within them. In practice, to speed up queries, a compressed
table doesn't store the actual data arrays. It stores pointers to the data,
which is on secondary disk pages:

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

## Type-specific compression algorithms are used on each column
TimescaleDB uses type-specific compression algorithms to compress each column.
This compresses data more efficiently than generic, type-agnostic algorithms.
Here are the algorithms used for each data type:

|Data type|Compression method|
|-|-|
|Integers and integer-like types, including timestamps|Delta-of-delta and simple-8b with run-length encoding|
|Floats|Gorilla compression|
|Columns with low cardinality (a few possible values that repeat often)|Whole-row dictionary compression and LZ compression|
|Other data types|LZ-based array compression|

To learn more about the algorithms, see the 
[compression algorithms blog post][compression-algorithms].

## Interacting with compressed chunks
In many ways, you interact with compressed chunks just as you interact with
uncompressed chunks. However, there are some differences.

### Inserts
With TimescaleDB 2.3 and above, you can insert data into compressed chunks.
Behind the scenes, TimescaleDB compresses the inserted row as a single row and
saves it within the appropriate chunk. Periodically, it recompresses the chunk
to combine the individually inserted rows with the previously compressed rows. 

This minimizes the performance penalty at insert time, and performs most of the
computation asynchronously and as a batch. You insert data as normal, and
TimescaleDB's job-scheduling framework handles the recompression automatically.

### Updates and deletes
You can't update or delete data in compressed chunks. Work around this by
decompressing the chunk, making your changes, and recompressing. To delete
batches of data, you can drop entire chunks at once without decompressing them,
either manually or via data retention policy. For more information, see the
sections on [decompression][decompress] and [data retention][data-retention].

To minimize the amount of decompressing and recompressing you need to do, set
your compression policy to compress only data that is infrequently updated.

### Queries
You query compressed data just as you would query uncompressed data. Queries on
compressed data are compatible with all the features of TimescaleDB, including
relational `JOIN`s, analytical queries, and planner optimizations such as
constraint exclusion.

When writing the query, it doesn't matter whether your data is compressed.
However, to optimize your queries, it helps to understand what is happening
behind the scenes.

When you query both compressed and uncompressed data, TimescaleDB:
1.  Decompresses the requested columns from compressed chunks
2.  Appends the decompressed data to more recent, uncompressed, data
3.  Returns the final results to you as if all the data were stored uncompressed

You incur a performance penalty to decompress the data. But you save on I/O by
reading from disk only the required, compressed columns, rather than the full,
uncompressed data. Overall, this can
[improve query performance][query-performance].

Note that this only applies to data on disk, not in memory. Access to data in
memory isn't I/O-bound. Thus, compression is most likely to improve performance
for older, less-frequently accessed data.

Even for data on disk, not all queries perform faster on compressed data.
Queries that involve many columns, such as `SELECT * ...` queries, incur
performance penalties to decompress and recombine all the columns, without
benefitting from the performance boost of reading fewer columns.

In addition, queries that benefit from particular indexes may be slower, because
compressed chunks can only be indexed on their `segmentby` columns. However,
such situations are rare. Choosing the right `segmentby` column for your query
patterns can improve performance. For more information, see the section on
[optimizing compression][improving-compression].

[compression-algorithms]: https://www.timescale.com/blog/time-series-compression-algorithms-explained/
[data-retention]: /how-to-guides/data-retention/
[decompress]: /how-to-guides/compression/decompress-chunks.md
[improving-compression]: /how-to-guides/compression/improve-compression.md
[query-performance]: /overview/core-concepts/compression/#compression-performance
[TOAST]: https://www.postgresql.org/docs/current/storage-toast.html