# Compression
In TimescaleDB, when compression is enabled, it converts data stored in many
rows into an array. This means that instead of using lots of rows to store the
data, it stores the same data in a single row. Because a single row takes up
less disk space than many rows, it decreases the amount of disk space required,
and can also speed up some queries.

As a simplified example, you might have a table that looks like this to start with:

|time|device_id|cpu|energy_consumption|
|---|---|---|---|
|12:00:02|1|88.2|0.8|
|12:00:02|2|300.5|0.9|
|12:00:01|1|88.6|0.85|
|12:00:01|2|299.1|0.95|

When compression is applied, the data is converted to a single row containing an array, like this:

|time|device_id|cpu|energy_consumption|
|---|---|---|---|
|[12:00:02, 12:00:02, 12:00:01, 12:00:1]|[1, 2, 1, 2]|[88.2, 300.5, 88.6, 299.1]|[0.8, 0.9, 0.85, 0.95]|

<highlight type="tip"> Most indexes set on the hypertable are removed or ignored
when reading from compressed chunks! TimescaleDB creates and uses custom indexes
to incorporate the `segmentby` and `orderby` parameters during compression.
</highlight>

This section explains how to enable native compression, and then goes into
detail on the most important settings for compression, to help you get the
best possible compression ratio:

*   [Choosing the interval](#compression-interval) after which to compress.
*   [Setting the `compress_segmentby`](#compression-segmentby) option appropriately.
*   [Choosing a `compress_orderby` column](#compression-orderby) to potentially enhance query efficiency.

## Enable compression [](compression-enable)
You can enable compression on individual hypertables, by declaring which column
you want to segment by. In this procedure, we are using this example table,
called `example`, and we are going to segment it by the `device_id` column. We
want every chunk that is more than seven days old to be automatically
compressed.

|time|device_id|cpu|disk_io|energy_consumption|
|---|---|---|---|---|
|8/22/2019 0:00|1|88.2|20|0.8|
|8/22/2019 0:05|2|300.5|30|0.9|

### Procedure: Enabling compression
1.  At the `pgsl` prompt, alter the table:
    ```sql
    ALTER TABLE example SET (
      timescaledb.compress,
      timescaledb.compress_segmentby = 'device_id'
    );
    ```
2.  Add a compression policy to compress chunks that are older than seven days:
    ```SQL
    SELECT add_compression_policy('example', INTERVAL '7 days');
    ```

## Compression policy intervals [](compression-interval)
Data is usually compressed after an interval of time has elapsed, and not
immediately. In the ["Enabling compression" procedure](#compression-enable), we
used a seven day compression interval. Choosing a good compression interval can
make your queries more efficient, and also allow you to handle data that is out
of order.

### Query efficiency
From our research and experience we know that when data is newly ingested, the
queries are more likely to be shallow in time, and wide in columns. Generally,
they are debugging queries, or queries that cover the whole system, rather than
specific, analytic queries. An example of the kind of query more likely for new
data is "show me the current CPU usage, disk usage, energy consumption, and I/O
for a particular server". When this is the case, the uncompressed data will have
better query performance, so the native PostgreSQL row-based format is the best
option.

However, as your data ages, your queries are likely to change. They become more
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
compression does not support `UPDATE` or `DELETE` actions on compressed chunks.
This limitation means you really only want to compress a chunk at a time when it
is unlikely to be modified again. How much time this requires is highly
dependent on your individual setup. Choose a compression interval that minimizes
the need to decompress chunks, but keep in mind that you want to avoid storing
data that is out of order.

<highlight type="tip">
You can manually decompress a chunk to modify it if you need to. For more
information on how to do that, see [decompressing chunks][decompress-chunks].
</highlight>

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

![compression timeline](https://assets.timescale.com/images/diagrams/compression_diagram.png)

## Segmenting by columns [](compression-segmentby)
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
the [`compress_orderby` column](#compression-orderby).

<!---
Lana, you're up to here!
-->

## Understanding the `orderby` option [](compression-orderby)

The `orderby` option determines the order of items inside the compressed array.
By default, this option is set to the descending order of the hypertable's
time column. This is sufficient for most cases if the `segmentby` option is set appropriately,
but can also be manually set to a different setting in advanced scenarios.

The `orderby` effects both the compression ratio achieved and the query performance.

Compression is most effective when adjacent data is close in magnitude or exhibits
some sort of trend. In other words, random or out-of-order data will compress poorly.
Thus, when compressing data it is important that the order of the input data
causes it to follow a trend.

Let's look again at what our running example looked like without any segmentby columns.

|time|device_id|cpu|disk_io|energy_consumption|
|---|---|---|---|---|
| [12:00:02, 12:00:02, 12:00:01, 12:00:01 ]| [1, 2, 1, 2]|[88.2, 300.5, 88.6, 299.1]|[20, 30, 25, 40] |[0.8, 0.9, 0.85, 0.95]|

Notice that the data is ordered by the `time` column. But, if we look at the
`cpu` column, we can see that the compressor will not be able to efficiently
compress it. Although both devices output a value that is a float, the
measurements have different magnitudes. The float list [88.2, 300.5, 88.6,
299.1] will compress poorly because values of the same magnitude are not
adjacent. However,  we can order by `device_id, time DESC` by setting
our table options as follows:

``` sql
ALTER TABLE  measurements
  SET (timescaledb.compress,
       timescaledb.compress_orderby = 'device_id, time DESC');
```

Using those settings, the compressed table will look as follows:

|time|device_id|cpu|disk_io|energy_consumption|
|---|---|---|---|---|
| [12:00:02, 12:00:01, 12:00:02, 12:00:01 ]| [1, 1, 2, 2]|[88.2, 88.6, 300.5, 299.1]|[20, 25, 30, 40] |[0.8, 0.85, 0.9, 0.95]|

Now, each devices measurement is consecutive in the ordering and
and thus the measurement values exhibit more of a trend. The cpu
series [88.2, 88.6, 300.5, 299.1] will compress much better.

If you look at the above example with `device_id` as a `segmentby`,
you will see that this will have good compression as well since
ordering only matters within a segment and segmenting by device
guarantees that each segment represents a series if only ordered by time.
Thus, putting items in `orderby` and `segmentby` columns achieves similar
results. This is why, if segmenting by an identifier causes segments to become too
small, we recommend moving the segmentby column into a prefix of the
orderby list.

We also use ordering to increase query performance. If a query uses the same
(or similar) ordering as the compression, we know that we can decompress
incrementally and still return results in the same order. We can also
avoid a sort. In addition, the system automatically creates additional columns
that store the minimum and maximum value of any `orderby` column. This way, the
query executor can look at this special column that specifies the range of
values (e.g., timestamps) in the compressed column – without first performing any
decompression – in order to determine whether the row could possibly match a
time predicate specified by a user’s SQL query.


[decompress-chunks]: /how-to-guides/compression/decompress-chunks
