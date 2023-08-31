---
title: Designing your database for compression
excerpt: Learn how to design your database for the most effective compression
products: [cloud, mst, self_hosted]
keywords: [compression, schema, tables]
---

# Designing for compression

Traditionally, databases are considered either row-based, or column based. And
each type of database brings benefits and drawbacks, including query speed,
insert speed, and the level to which they can effectively compress data.
Generally speaking, column-oriented databases are highly compressible, but
inserting data can take longer. Conversely, row-oriented databases have faster
queries, but can't compress as well.

Time-series data can be unique, in that it needs to handle both shall and wide
queries, such as "What's happened across the deployment in the last 10 minutes,"
and deep and narrow, such as "What is the average CPU usage for this server
over the last 24 hours." Time-series data usually has a very high rate of
inserts as well; hundreds of thousands of writes per second can be very normal
for a time-series dataset. Additionally, time-series data is often very
granular, and data is collected at a higher resolution than many other
datasets. This can result in terabytes of data being collected over time.

All this means that if you need great compression rates, you probably need to
consider the design of your database, before you start ingesting data. This
section covers some of the things you need to take into consideration when
designing your database for maximum compression effectiveness.

## Array format

TimescaleDB is built on PostgreSQL which is, by nature, a row-based database.
Because time-series data is accessed in order of time, TimescaleDB converts many
wide rows of data into a single row of data, called an array form. This means
that each field of that new, wide row stores an ordered set of data comprising
the entire column.

For example, if you had a table with data that looked a bit like this:

|Timestamp|Device ID|Status Code|Temperature|
|-|-|-|-|
|12:00:01|A|0|70.11|
|12:00:01|B|0|69.70|
|12:00:02|A|0|70.12|
|12:00:02|B|0|69.69|
|12:00:03|A|0|70.14|
|12:00:03|B|4|69.70|

You can convert this to a single row in array form, like this:

|Timestamp|Device ID|Status Code|Temperature|
|-|-|-|-|
|[12:00:01, 12:00:01, 12:00:02, 12:00:02, 12:00:03, 12:00:03]|[A, B, A, B, A, B]|[0, 0, 0, 0, 0, 4]|[70.11, 69.70, 70.12, 69.69, 70.14, 69.70]|

Even before you compress any data, this format immediately saves storage by
reducing the per-row overhead. PostgreSQL typically adds around 27 bytes of
overhead per row. So even without any compression, if our schema above is say 32
bytes, then 1000 rows of data which previously took about 59 kilobytes
(`1000 x (32 + 27) ~= 59 kilobytes`), now takes about 32 kilobytes
(`1000 x 32 + 27 ~= 32 kilobytes`) in this format.

This format arranges the data so that similar data, such as timestamps, device
IDs, or temperature readings, is stored contiguously. This means that you can
then use type-specific compression algorithms to compress the data further, and
each array is separately compressed. For more information about the compression
methods used, see the [compression methods section][compression-methods].

When the data is in array format, you can perform queries that require a subset
of the columns very quickly. For example, if you have a query like this one, that
asks for the average temperature over the past day:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
SELECT time_bucket(‘1 minute’, timestamp) as minute
 AVG(temperature)
FROM table
WHERE timestamp > now() - interval ‘1 day’
ORDER BY minute DESC
GROUP BY minute;
`} />

The query engine can fetch and decompress only the timestamp and temperature
columns to efficiently compute and return these results.

Finally, TimescaleDB uses non-inline disk pages to store the compressed arrays.
This means that the in-row data points to a secondary disk page that stores the
compressed array, and the actual row in the main table becomes very small,
because it is now just pointers to the data. When data stored like this is
queried, only the compressed arrays for the required columns are read from disk,
further improving performance by reducing disk reads and writes.

## Querying compressed data

In the previous example, the database has no way of knowing which rows need to
be fetched and decompressed to resolve a query. For example, the database can't
easily determine which rows contain data from the past day, as the timestamp
itself is in a compressed column. You don't want to have to decompress all the
data in a chunk, or even an entire hypertable, to determine which rows are
required.

TimescaleDB automatically includes more information in the row and includes
additional groupings to improve query performance. When you compress a
hypertable, either manually or through a compression policy, you need to specify
an `ORDER BY` column.

`ORDER BY` columns specify how the rows that are part of a compressed patch are
ordered. For most time-series workloads, this is by timestamp, but you can also
specify a second dimension, such as location.

For each `ORDER BY` column, TimescaleDB automatically creates additional columns
that store the minimum and maximum value of that column. This way, the query
planner can look at the range of timestamps in the compressed column, without
having to do any decompression, and determine whether the row could possibly
match the query.

When you compress your hypertable, you can also choose to specify a `SEGMENT BY`
column. This allows you to segment compressed rows by a specific column,
so that each compressed row corresponds to a data about a single item such as,
for example, a specific device ID. This further allows the query planner to
determine if the row could possibly match the query. For example:

|Device ID|Timestamp|Status Code|Temperature|Min Timestamp|Max Timestamp|
|-|-|-|-|-|-|
|A|[12:00:01, 12:00:02, 12:00:03]|[0, 0, 0]|[70.11, 70.12, 70.14]|12:00:01|12:00:03|
|B|[12:00:01, 12:00:02, 12:00:03]|[0, 0, 0]|[70.11, 70.12, 70.14]|12:00:01|12:00:03|

With the data segmented in this way, a query for device A between a time
interval becomes quite fast. The query planner can use an index to find those
rows for device A that contain at least some timestamps corresponding to the
specified interval, and even a sequential scan is quite fast since evaluating
device IDs or timestamps does not require decompression. This means the the
query executor only decompresses the timestamp and temperature columns
corresponding to those selected rows.

[compression-methods]: /use-timescale/:currentVersion:/compression/compression-methods/
