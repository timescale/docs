---
title: Compression architecture
excerpt: How compressed chunks are set up in TimescaleDB
---

# Compression architecture

TimescaleDB compresses data by:

*   Converting it from a row-based format to a [hybrid row-columnar
    format][row-columnar-format]
    *   [Ordering and segmenting][ordering-and-segmenting] the data according to
        the parameters you specify
*   Compressing the columns, using [type-specific compression
    algorithms][compression-algorithms] where possible

In addition:

*   Data is stored on [secondary disk pages][secondary-pages]
*   Old indexes are removed and [new indexes are created][indexes]

Understanding compression architecture is important to improving how you
[work with compressed data][work-with-compressed-data].

## Hybrid row-columnar format for chunks

In TimescaleDB, compression is done chunk by chunk. Each chunk is either
compressed or uncompressed. You can't compress only part of the data in a
chunk. Compression also doesn't change the number of chunks. One uncompressed
chunk turns into one compressed chunk.

In an uncompressed chunk, data is stored in row format. For example, you might
have a table that looks like this. Each entry occupies its own row:

|time|device_id|cpu|energy_consumption|
|-|-|-|-|
|12:00:02|1|88.2|0.8|
|12:00:02|2|300.5|0.9|
|12:00:01|1|88.6|0.85|
|12:00:01|2|299.1|0.95|

When the chunk is compressed, the data is converted to a hybrid row-columnar
format. Multiple records are grouped into a single row. The columns of this row
hold an array-like structure that stores all the data. Your table looks like
this:

|time|device_id|cpu|energy_consumption|
|-|-|-|-|
|[12:00:02, 12:00:02, 12:00:01, 12:00:1]|[1, 2, 1, 2]|[88.2, 300.5, 88.6, 299.1]|[0.8, 0.9, 0.85, 0.95]|

Each column is then compressed. For information about compression algorithms,
see the [algorithms section][compression-algorithms].

For simplicity, this example shows only 4 entries. TimescaleDB can combine up to
1000 entries into a single row.

<highlight type="note">
Behind the scenes, TimescaleDB actually creates a second, under-the-covers,
hypertable with the compressed data. You shouldn't query this table directly.
Run your queries against the original hypertable, and TimescaleDB finds any
compressed data, decompresses it, and returns it to you.
</highlight>

## Data ordering and segmenting

By default, TimescaleDB orders rows by decreasing time value when compressing.
Then it combines the rows into columns of up to 1000 entries.

<highlight type="note">
At a first approximation, this means that a chunk with `N` rows turns into a
compressed chunk with `ceiling(N / 1000)` rows. In practice, the number might
differ slightly, depending on the start and end ranges of your data and chunks.
</highlight>

You can change the ordering and segmenting behavior to improve compression
efficiency and query performance. The best choice depends on your application
query patterns. For more information, see the [how-to guide on
compression][about-compression].

<!-- TODO: Change when improving compression section is done
For more information, see the section on [improving
compression][improving-compression].
-->

### Data ordering with timescaledb.compress_orderby

If you often `ORDER BY` a column other than time, you can change the compressed
chunk's data order by using `timescaledb.compress_orderby`. For more
information, see the [how-to guide for ordering entries][ordering-entries].

TimescaleDB speeds up queries by storing the minimum and maximum values of the
`orderby` columns for each row. For example, when ordering by time, it stores
the `min_time` and `max_time`:

|time|device_id|cpu|energy_consumption|min_time|max_time|
|-|-|-|-|-|-|
|[12:00:02, 12:00:02, 12:00:01, 12:00:1]|[1, 2, 1, 2]|[88.2, 300.5, 88.6, 299.1]|[0.8, 0.9, 0.85, 0.95]|12:00:01|12:00:02|

The query planner can quickly decide if it needs to read a row, without needing
to decompress the data.

### Data segmenting with timescaledb.segment_by

By default, TimescaleDB doesn't segment compressed chunks. It combines entries
in the order of your `orderby` columns, without taking into account the value of
any other column.

In some applications, the values of those other columns are useful. For example,
you might use a `WHERE` clause to filter by `device_id` or `location`. You can
specify these columns as segmenting columns by using
`timescaledb.compress_segmentby`. For more information, see the [how-to guide on
segmenting columns][segmenting-columns].

`segmentby` columns are not compressed. Instead, for each value of the
`segmentby` column, separate compressed rows are created. You can think of this
as working like a `GROUP BY` clause for compression. In the following example,
the compressed table is segmented by `device_id`:

|time|device_id|cpu|energy_consumption|
|-|-|-|-|
|[12:00:02, 12:00:01]|1|[88.2, 88.6]|[0.8, 0.85]|
|[12:00:02, 12:00:01]|2|[300.5, 299.1]|[0.9, 0.95]|

## Type-specific compression algorithms

TimescaleDB uses type-specific compression algorithms to compress each column.
This compresses data more efficiently than generic, type-agnostic algorithms.
Here are the algorithms used for each data type:

|Data type|Compression method|
|-|-|
|Integers and integer-like types, including timestamps|Delta-of-delta and simple-8b with run-length encoding|
|Floats|Gorilla compression|
|Columns with low cardinality (columns with only a few possible values that often repeat)|Whole-row dictionary compression|
|Other data types|LZ compression|

Here are brief descriptions of the compression algorithms. For more information,
see the [compression algorithms blog post][compression-algorithms-blog].

|Compression method|Description|
|-|-|
|Delta-of-delta|Delta encoding stores the difference between a value and a reference value. The reference value can be the previous value. Delta-of-delta applies delta encoding a second time over delta-encoded data. This works best for data that changes slowly, where delta values are small and often 0.|
|Simple-8b|Simple-8b stores integers efficiently inside fixed-size blocks. A set of integers is stored within each block, using the minimum bit-length needed to encode the largest integer in the set. The first bits of each block denote the integer bit-length for that block.|
|Run-length encoding|Run-length encoding compresses data that contains the same value repeated over and over. Values are stored in the form `{number of repeats; value}`. For example, `11, 12, 12, 12` is stored as `{1; 11}, {3; 12}`.|
|Gorilla compression|Gorilla compression compresses floating point numbers by XORing each value with the previous value.|
|Dictionary compression|Dictionary compression uses a separate list of possible values. It then stores indexes into this dictionary, rather than storing the full repeated value multiple times. This works best for datasets with many repeated values.|
|LZ compression|Another type of dictionary compression, but not applied at the whole-row level. Regular PostgreSQL uses LZ compression for TOAST (The Oversized-Attribute Storage Technique) tables.|

## Indexes on compressed chunks

When you compress a chunk, any indexes on that chunk are removed. New indexes
are created on each `segmentby` column. The indexes are in the form
`(<SEGMENT_BY_COLUMN>, _ts_meta_sequence_num)`, where `_ts_meta_sequence_num` is
some internal metadata on the compressed chunk.

If you decompress a chunk, your old indexes are restored.

<highlight type="note">
Your old indexes are removed because compressed data isn't indexable in the same
way as uncompressed data. For example, say that you have an index on a column
named `data`. Before compression, the index points to individual rows with
individual values for `data`. After compression, the values for `data` are
stored in array-like structures, so the index can no longer point to individual
values. Only columns used in `segment_by` can be indexed, since they are stored
as their original values.
</highlight>

## Data storage for compressed chunks

For simplicity, the examples on this page show data arrays contained within the
compressed tables. In practise, to speed up queries, data isn't stored within
the tables. Instead, it is stored on secondary disk pages. The tables contain
pointers to those pages:

|time|device_id|cpu|energy_consumption|
|-|-|-|-|
|`<POINTER_TO_DATA>`|`<POINTER_TO_DATA>`|`<POINTER_TO_DATA>`|`<POINTER_TO_DATA>`|

This reduces the amount of data that must be read from disk. When querying a
compressed chunk, the database reads the table of pointers, which is relatively
lightweight. It then follows the pointers to read only the needed columns
from disk.

TimescaleDB implements pointers and secondary pages by using PostgreSQL's TOAST
feature. To learn more, see the [PostgreSQL documentation on TOAST][TOAST].

## Interacting with compressed chunks

In many ways, you interact with compressed chunks just as you interact with
uncompressed chunks. But there are some differences.

### Inserts

With TimescaleDB 2.3 and above, you can insert data into compressed chunks. You
write an `INSERT` statement as normal. Behind the scenes, TimescaleDB compresses
the inserted row as a single row. It then saves it within the appropriate chunk.
Periodically, it recompresses the chunk, which combines the individually
inserted rows with the previously compressed rows.

This minimizes the performance penalty at insert time, because recompression is
batched and performed asynchronously.

To insert large batches of data, you can use a [backfilling
function][backfilling].

### Updates and deletes

You can't update or delete data in compressed chunks. You can work around this
by decompressing the chunk, making your changes, and recompressing. You can also
drop entire chunks at once without decompressing them, either manually or via
data retention policy. For more information, see the sections on
[decompression][decompress] and [data retention][data-retention].

To minimize the amount of decompressing and recompressing you need to do, set
your compression policy to only compress data that is rarely updated.

### Queries

You query compressed data just as you would query uncompressed data. Queries on
compressed data are compatible with all the features of TimescaleDB.

Because features and query syntax remain the same, you can write your queries
without thinking about whether the data is compressed. However, to optimize your
queries, it helps to understand what is happening behind the scenes.

When you query data across both compressed and uncompressed chunks, TimescaleDB:

1.  Finds the compressed chunks and decompresses the requested columns
1.  Appends the decompressed data to more recent, uncompressed, data
1.  Returns the final results to you as if all the data were stored uncompressed

You incur a performance penalty to decompress the data. But you save on I/O,
because you read only the required columns from the compressed chunks, rather
than the full, uncompressed data. Overall, this can [improve query
performance][query-performance].

Note that this only applies to data on disk, not in memory. Access to data in
memory isn't I/O-bound. So, compression is most likely to improve performance
for older, less-frequently accessed data.

Even for data on disk, not all queries perform faster on compressed data.
Queries that involve many columns, such as `SELECT * ...` queries, incur
performance penalties to decompress and recombine all the columns. At the same
time, they don't benefit from the performance boost of reading fewer columns.

In addition, queries that benefit from particular indexes might be slower,
because compressed chunks can only be indexed on their `segmentby` columns. But
such situations are rare. Choosing the right `segmentby` column for your query
patterns can help. For more information, see the [how-to guide on
compression][about-compression].

<!-- TODO: change reference when improving compression page is done
For more information, see the section on [optimizing
compression][improving-compression].
-->

[about-compression]: /timescaledb/:currentVersion:/how-to-guides/compression/about-compression/
[backfilling]: /timescaledb/:currentVersion:/how-to-guides/compression/backfill-historical-data/
[compression-algorithms]: #type-specific-compression-algorithms
[compression-algorithms-blog]: https://www.timescale.com/blog/time-series-compression-algorithms-explained/
[data-retention]: /timescaledb/:currentVersion:/how-to-guides/data-retention/
[decompress]: /timescaledb/:currentVersion:/how-to-guides/compression/decompress-chunks/
[improving-compression]: /timescaledb/:currentVersion:/how-to-guides/compression/improve-compression.md
[indexes]: #indexes-on-compressed-chunks
[ordering-and-segmenting]: #data-ordering-and-segmenting
[ordering-entries]: /timescaledb/:currentVersion:/how-to-guides/compression/about-compression/#order-entries
[query-performance]: /timescaledb/:currentVersion:/overview/core-concepts/compression/#compression-performance
[row-columnar-format]: #hybrid-row-columnar-format-for-chunks
[secondary-pages]: #data-storage-for-compressed-chunks
[segmenting-columns]: /timescaledb/:currentVersion:/how-to-guides/compression/about-compression/#segment-by-columns
[TOAST]: https://www.postgresql.org/docs/current/storage-toast.html
[work-with-compressed-data]: #interacting-with-compressed-chunks
