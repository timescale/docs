---
title: About compression
excerpt: How to compress hypertables
products: [self_hosted]
keywords: [compression, hypertables]
---

import CompressionIntro from 'versionContent/_partials/_compression-intro.mdx';

# About compression

<CompressionIntro />

<Highlight type="note">
Most indexes set on the hypertable are removed or ignored
when reading from compressed chunks. Timescale creates and uses custom indexes
to incorporate the `segmentby` and `orderby` parameters during compression.
</Highlight>

This section explains how to enable native compression, and then goes into
detail on the most important settings for compression, to help you get the
best possible compression ratio.

## Enable compression

You can enable compression on individual hypertables, by declaring which column
you want to segment by. This procedure uses an example table, called `example`,
and segments it by the `device_id` column. Every chunk that is more than seven
days old is then marked to be automatically compressed.

|time|device_id|cpu|disk_io|energy_consumption|
|-|-|-|-|-|
|8/22/2019 0:00|1|88.2|20|0.8|
|8/22/2019 0:05|2|300.5|30|0.9|

<Procedure>

### Enabling compression

1.  At the `psql` prompt, alter the table:

    ```sql
    ALTER TABLE example SET (
      timescaledb.compress,
      timescaledb.compress_segmentby = 'device_id'
    );
    ```

1.  Add a compression policy to compress chunks that are older than seven days:

    ```sql
    SELECT add_compression_policy('example', INTERVAL '7 days');
    ```

</Procedure>

For more information, see the API reference for
[`ALTER TABLE (compression)`][alter-table-compression] and
[`add_compression_policy`][add_compression_policy].

You can also set a compression policy through
the Timescale console. The compression tool automatically generates and
runs the compression commands for you. To learn more, see the
[Timescale documentation](/use-timescale/latest/services/service-explorer/#setting-a-compression-policy-from-timescale-cloud-console).

## View current compression policy

To view the compression policy that you've set:

```sql
SELECT * FROM timescaledb_information.jobs
  WHERE proc_name='policy_compression';
```

For more information, see the API reference for [`timescaledb_information.jobs`][timescaledb_information-jobs].

## Remove compression policy

To remove a compression policy, use `remove_compression_policy`. For example, to
remove a compression policy for a hypertable named `cpu`:

```sql
SELECT remove_compression_policy('cpu');
```

For more information, see the API reference for
[`remove_compression_policy`][remove_compression_policy].

## Disable compression

You can disable compression entirely on individual hypertables. This command
works only if you don't currently have any compressed chunks:

```sql
ALTER TABLE <TABLE_NAME> SET (timescaledb.compress=false);
```

If your hypertable contains compressed chunks, you need to
[decompress each chunk][decompress-chunks] individually before you can disable
compression.

## Compression policy intervals

Data is usually compressed after an interval of time, and not
immediately. In the "Enabling compression" procedure, you used a seven day
compression interval. Choosing a good compression interval can make your queries
more efficient, and also allow you to handle data that is out of order.

### Query efficiency

Research has shown that when data is newly ingested, the queries are more likely
to be shallow in time, and wide in columns. Generally, they are debugging
queries, or queries that cover the whole system, rather than specific, analytic
queries. An example of the kind of query more likely for new data is "show the
current CPU usage, disk usage, energy consumption, and I/O for a particular
server". When this is the case, the uncompressed data has better query
performance, so the native PostgreSQL row-based format is the best option.

However, as data ages, queries are likely to change. They become more
analytical, and involve fewer columns. An example of the kind of query run on
older data is "calculate the average disk usage over the last month." This type
of query runs much faster on compressed, columnar data.

To take advantage of this and increase your query efficiency, you want to run
queries on new data that is uncompressed, and on older data that is compressed.
Setting the right compression policy interval means that recent data is ingested
in an uncompressed, row format for efficient shallow and wide queries, and then
automatically converted to a compressed, columnar format after it ages and is
more likely to be queried using deep and narrow queries. Therefore, one
consideration for choosing the age at which to compress the data is when your
query patterns change from shallow and wide to deep and narrow.

### Modified data

Trying to change chunks that have already been compressed can be inefficient.
You can always query data in compressed chunks, but the current version of
compression does not support `DELETE` actions on compressed chunks. This
limitation means you really only want to compress a chunk at a time when it is
unlikely to be modified again. How much time this requires is highly dependent
on your individual setup. Choose a compression interval that minimizes the need
to decompress chunks, but keep in mind that you want to avoid storing data that
is out of order.

You can manually decompress a chunk to modify it if you need to. For more
information on how to do that,
see [decompressing chunks][decompress-chunks].

### Compression states over time

A chunk can be in one of three states:

*   `Active` and uncompressed
*   `Compression candidate` and uncompressed
*   `Compressed`

Active chunks are uncompressed and able to ingest data. Due to the nature of the
compression mechanism, they cannot effectively ingest data while compressed. As
shown in this illustration, as active chunks age, they become compression
candidates, and are eventually compressed when they become old enough according
to the compression policy.

<img
class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/compression_diagram.webp"alt="Compression>
timeline"/>

## Segment by columns

When you compress data, you need to select which column to segment by. Each row
in a compressed table must contain data about a single item. The column that a
table is segmented by contains only a single entry, while all other columns can
have multiple arrayed entries. For example, in this compressed table, the first
row contains all the values for device ID 1, and the second row contains all the
values for device ID 2:

|time|device_id|cpu|disk_io|energy_consumption|
|---|---|---|---|---|
|[12:00:02, 12:00:01]|1|[88.2, 88.6]|[20, 25]|[0.8, 0.85]|
|[12:00:02, 12:00:01]|2|[300.5, 299.1]|[30, 40]|[0.9, 0.95]|

Because a single value is associated with each compressed row, there is no need
to decompress to evaluate the value in that column. This means that queries with
`WHERE` clauses that filter by a `segmentby` column are much more efficient,
because decompression can happen after filtering instead of before. This avoids
the need to decompress filtered-out rows altogether.

Because some queries are more efficient than others, it is important to pick the
correct set of `segmentby` columns. If your table has a primary key all of the
primary key columns, except for `time`, can go into the `segmentby` list. For
example, if our example table uses a primary key on `(device_id, time)`, then
the `segmentby` list is `device_id`.

Another method is to determine a set of values that can be graphed over time.
For example, in this EAV (entity-attribute-value) table, the series can be
defined by `device_id` and `metric_name`. Therefore, the `segmentby` option
should be `device_id, metric_name`:

|time|device_id|metric_name|value|
|---|---|---|---|
|8/22/2019 0:00|1|cpu|88.2|
|8/22/2019 0:00|1|device_io|0.5|
|8/22/2019 1:00|1|cpu|88.6|
|8/22/2019 1:00|1|device_io|0.6|

The `segmentby` columns are useful, but can be overused. If you specify a lot of
`segmentby` columns, the number of items in each compressed column is reduced,
and compression is not as effective. A good guide is for each segment to contain
at least 100 rows per chunk. To achieve this, you might also need to use
the `compress_orderby` column.

## Order entries

By default, the items inside a compressed array are arranged in descending order
according to the hypertable's `time` column. In most cases, this works well,
provided you have set the `segmentby` option appropriately. However, in some
more complicated scenarios, you want to manually adjust the
`compress_orderby`setting as well. Changing this value can improve the
compression ratio and query performance.

Compression is most effective when adjacent data is close in magnitude or
exhibits some sort of trend. Random data, or data that is out of order,
compresses poorly. This means that it is important that the order of the input
data causes it to follow a trend.

In this example, there are no `segmentby` columns set, so the data is sorted by
the `time` column. If you look at the `cpu` column, you can see that it might
not be able to be compressed, because even though both devices are outputting a
value that is a float, the measurements have different magnitudes, with device 1
showing numbers around 88, and device 2 showing numbers around 300:

|time|device_id|cpu|disk_io|energy_consumption|
|-|-|-|-|-|
|[12:00:02, 12:00:02, 12:00:01, 12:00:01 ]|[1, 2, 1, 2]|[88.2, 300.5, 88.6, 299.1]|[20, 30, 25, 40]|[0.8, 0.9, 0.85, 0.95]|

To improve the performance of this data, you can order by `device_id, time DESC`
instead, using these commands:

```sql
ALTER TABLE  example
  SET (timescaledb.compress,
       timescaledb.compress_orderby = 'device_id, time DESC');
```

Using those settings, the compressed table now shows each measurement in
consecutive order, and the `cpu` values show a trend. This table compresses much
better:

|time|device_id|cpu|disk_io|energy_consumption|
|-|-|-|-|-|
|[12:00:02, 12:00:01, 12:00:02, 12:00:01 ]|[1, 1, 2, 2]|[88.2, 88.6, 300.5, 299.1]|[20, 25, 30, 40]|[0.8, 0.85, 0.9, 0.95]|

Putting items in `orderby` and `segmentby` columns often achieves similar
results. In this same example, if you set it to segment by the `device_id`
column, it has good compression, even without setting `orderby`. This is because
ordering only matters within a segment, and segmenting by device means that each
segment represents a series if it is ordered by time. So, if segmenting by an
identifier causes segments to become too small, try moving the `segmentby`
column into a prefix of the `orderby` list.

You can also use ordering to increase query performance. If a query uses similar
ordering as the compression, you can decompress incrementally and still return
results in the same order. You can also avoid a `SORT`. Additionally, the system
automatically creates additional columns to store the minimum and maximum value
of any `orderby` column. This way, the query executor looks at this additional
column that specifies the range of values in the compressed column, without
first performing any decompression, in order to determine whether the row could
possibly match a time predicate specified by the query.

## Insert historical data into compressed chunks

In TimescaleDB 2.3 and later, you can insert data directly into compressed
chunks. When you do this,the data that is being inserted is not compressed
immediately. It is stored alongside the chunk it has been inserted into, and
then a separate job merges it with the chunk and compresses it later on.

[alter-table-compression]: /api/:currentVersion:/compression/alter_table_compression/
[add_compression_policy]: /api/:currentVersion:/compression/add_compression_policy/
[decompress-chunks]: /use-timescale/:currentVersion:/compression/decompress-chunks
[remove_compression_policy]: /api/:currentVersion:/compression/remove_compression_policy/
[timescaledb_information-jobs]: /api/:currentVersion:/informational-views/jobs/
