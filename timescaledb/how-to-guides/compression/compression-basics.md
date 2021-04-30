# Compression Basics

Given a table called `measurements` like:

|time|device_id|cpu|disk_io|energy_consumption|
|---|---|---|---|---|
| 8/22/2019 0:00 |1|88.2|20|0.8|
| 8/22/2019 0:05 |2|300.5|30| 0.9|

You can enable compression using the following commands
```sql
ALTER TABLE measurements SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'device_id'
);

SELECT add_compression_policy('measurements', INTERVAL '7 days');
```

Thats it! These two commands configure compression and
tell the system to compress chunks older than 7 days. In the
next two sections we will describe how we choose the
period after which to compress and how to set the
`compress_segmentby` option.

## Choosing a compression policy INTERVAL [](choosing-older-than)

You may be wondering why we compress data only after it ages (after 7 days in
the example above) and not right away. There are two reasons: query
efficiency and the ability to handle out-of-order data.

In terms of query efficiency, our experience has shown that when data is just
ingested and thus refers to the recent time interval, we tend to query the
data in a more shallow (in time) and wide (in columns) manner. These are
often debugging or "whole system" queries. As an example,
"show me current CPU usage, disk usage, energy consumption, and I/O for
server 'X'". In this case the uncompressed, row based format that is native
to PostgreSQL will give us the best query performance.

As data begins to age, queries tend to become more analytical in nature and
involve fewer columns. Such deep and narrow queries might, for example, want to calculate the
average disk usage over the last month. These type of queries greatly benefit
from the compressed, columnar format.

Our compression design thus allows you to get the best of both worlds: recent data
is ingested in an uncompressed, row format for efficient shallow and wide queries, and then
automatically converted to a compressed, columnar format after it ages and
is most often queried using deep and narrow queries. Thus one consideration
for choosing the age at which to compress the data is when your query patterns
change from shallow and wide to deep and narrow.

The other thing to consider is that modifications to chunks that have been compressed
are inefficient. In fact, the current version of compression disallows INSERTS, UPDATES,
and DELETES on compressed chunks completely (although you can manually decompress
the chunk to modify it). Thus you want to compress a chunk only after it is unlikely
to be modified further. The amount of delay you should add to chunk compression to
minimize the need to decompress chunks will be different
for each use case, but remember to be mindful of out-of-order data.

<highlight type="warning">
The current release of TimescaleDB supports the ability to query data in
compressed chunks. However, it does not support inserts or updates into compressed
chunks. We also block modifying the schema of hypertables with compressed chunks.
</highlight>

With regards to compression, a chunk can be in one of three states: active (uncompressed),
compression candidate (uncompressed), compressed. Active chunks are those that are
currently ingesting data. Due to the nature of the compression mechanism, they cannot
effectively ingest data while compressed. As shown in the illustration below, as those
chunks age, they become compression candidates that are compressed once they become
old enough according to the compression policy.

![compression timeline](https://assets.timescale.com/images/diagrams/compression_diagram.png)


## Choosing the right segmentby columns [](choosing-segmentby)

The `segmentby` option determines the main key by which compressed data is accessed.
In particular, queries that reference the `segmentby` columns in the WHERE clause are
very efficient. Thus, it is important to pick the correct set of `segmentby` columns.
We will give some intuitions below.

If your table has a primary key then all of the primary key columns other than "time" should
go into the `segmentby` list. In the example above, one can easily imagine a primary
key on (device_id, time), and therefore the `segmentby` list is `device_id`.

Another way to think about this is that a concrete set of values for each `segmentby`
column should define a "time-series" of values you can graph over time. For example,
if we had a more EAV table like the following:

|time|device_id|metric_name|value|
|---|---|---|---|
| 8/22/2019 0:00 |1|cpu|88.2|
| 8/22/2019 0:00 |1|device_io|0.5|
| 8/22/2019 1:00 |1|cpu|88.6|
| 8/22/2019 1:00 |1|device_io|0.6|

Then the series would be defined by the pair of columns `device_id` and 
`metric_name`. Therefore, the `segmentby` option should be `device_id, metric_name`.

<highlight type="tip">
If your data is not compressing well, it may be that you have too many
`segmentby` columns defined. Each segment of data should contain at least 100 rows
in each chunk. If your segments are too small, you can move some columns from the
`segmentby` list to the `orderby` list (described below), or you might be using
chunk intervals that are too short.
</highlight>

## Understanding the orderby option [](understanding-order-by)

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