# Compression

As of version 1.5, TimescaleDB supports the ability to natively compress data. This
functionality does not require the use of any specific file system or external software,
and as you will see, it is simple to set up and configure by the user.

Prior to using this guide, we recommend taking a look at our architecture section
to learn more about how compression works. At a high level, TimescaleDB's built-in
job scheduler framework will asynchronously convert recent data from an uncompressed
row-based form to a compressed columnar form across chunks of TimescaleDB hypertables.

This section will walk through the concepts and help you understand some of the
benefits and limitations of native compression. We will also walk you through the
basics of setting this up for use in your environment.

>:TIP: As with any type of data altering operation, we would suggest backing up
your important data prior to implementing compression.


## Quick Start [](quick-start)

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

### Choosing the time after which to compress data [](choosing-older-than)

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

>:WARNING: The current release of TimescaleDB supports the ability to query data in
compressed chunks. However, it does not support inserts or updates into compressed
chunks. We also block modifying the schema of hypertables with compressed chunks.

With regards to compression, a chunk can be in one of three states: active (uncompressed),
compression candidate (uncompressed), compressed. Active chunks are those that are
currently ingesting data. Due to the nature of the compression mechanism, they cannot
effectively ingest data while compressed. As shown in the illustration below, as those
chunks age, they become compression candidates that are compressed once they become
old enough according to the compression policy.

![compression timeline](https://assets.timescale.com/images/diagrams/compression_diagram.png)

### Choosing the right columns for your segmentby option [](choosing-segmentby)

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

Then the series would be defined by the pair of columns `device_id` and `metric_name`. Therefore, the `segmentby` option should be `device_id, metric_name`.

> :TIP: If your data is not compressing well, it may be that you have too many
`segmentby` columns defined. Each segment of data should contain at least 100 rows
in each chunk. If your segments are too small, you can move some columns from the
`segmentby` list to the `orderby` list (described below), or you might be using
chunk intervals that are too short.


## Understanding How Compression Works [](how-it-works)

Our high-level approach to building columnar storage is to convert many wide rows of data (say, 1000) into a single row of data. But now, each field (column) of that new row stores an ordered set of data comprising the entire column of the 1000 rows.

So, let’s consider a simplified example using a table that looks as follows:

|time|device_id|cpu|disk_io|energy_consumption|
|---|---|---|---|---|
| 12:00:02 |1|88.2|20|0.8|
| 12:00:01 |2|300.5|30| 0.9|
| 12:00:01 |1|88.6|25|0.85|
| 12:00:01 |2|299.1|40| 0.95|

After converting this data to a single row, the data in “array” form:

|time|device_id|cpu|disk_io|energy_consumption|
|---|---|---|---|---|
| [12:00:02, 12:00:02, 12:00:01, 12:00:1 ]| [1, 2, 1, 2]|[88.2, 300.5, 88.6, 299.1]|[20, 30, 25, 40] |[0.8, 0.9, 0.85, 0.95]|

> :TIP: Most indexes set on the hypertable are removed/ignored when reading from compressed chunks!  TimescaleDB creates and uses custom indexes to incorporate the `segmentby` and `orderby` parameters during compression.

### Understanding the segmentby option [](understanding-segmentby)

We can segment compressed rows by specific columns, so that each compressed
row corresponds to data about a single item, e.g., a specific `device_id`.
The `segmentby` option forces the system to break up the compressed array so
that each compressed row has a single value for each segmentby column. For
example if we set `device_id` as a `segmentby` column, then the compressed
version of our running example would look like:


|time|device_id|cpu|disk_io|energy_consumption|
|---|---|---|---|---|
| [12:00:02, 12:00:01]| 1 |[88.2, 88.6]|[20, 25] |[0.8, 0.85]|
| [12:00:02, 12:00:01]| 2 |[300.5, 299.1]|[30, 40] |[0.9, 0.95]|

The above example shows the the `device_id` column is no longer an array,
instead it defines the single value associated with all of the compressed data in the row.

Because a single value is associated with a compressed row, no decompression
is necessary to evaluate the value. Queries with WHERE clauses that filter by
a `segmentby` column are much more efficient, as decompression can happen _after_
filtering instead of before (thus avoiding the need to decompress
filtered-out rows altogether). In fact, for even more efficient access,
we build b-tree indexes over each `segmentby` column.

`segmentby` columns are useful, but can be overused. If too many `segmentby` columns
are specified, then the number of items in each compressed column becomes small
and compression is not effective. Thus, we recommend that you make sure that
each segment contains at least 100 rows per chunk. If this is not the case,
then you can move some segmentby columns into the orderby option (as described in the
next section).

### Understanding the orderby option [](understanding-order-by)

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
results. This is why, if segmenting by a identifier causes segments to become too
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

## Advanced Usage [](advanced-usage)

In this section we will discuss some more advanced features available with compression.

### Manual Compression [](manual-compression)

In the examples above we covered how to compress data using an automated compression
policy that runs in the background and compresses chunks older than a certain age.

Some users want more control over when compression is scheduled or simply want to
compress chunks manually.  Here we will show you how to compress particular chunks
explicitly.

We start by getting a list of the chunks we want to compress. In this case our hypertable
is named 'conditions', and we are looking for the chunks associated with this hypertable
with data older than three days.

``` sql
SELECT show_chunks('conditions', older_than => INTERVAL '3 days');
```

||show_chunks|
|---|---|
|1|_timescaledb_internal_hyper_1_2_chunk|
|2|_timescaledb_internal_hyper_1_3_chunk|

From here we can begin the process of compressing each of the listed chunks with the
following command:

``` sql
SELECT compress_chunk( '<chunk_name>');
```

You can see the results of the compression of that given chunk by running the following:

``` sql
SELECT *
FROM chunk_compression_stats('conditions');
```

| chunk_schema | chunk_name | compression_status | before_compression_table_bytes | before_compression_index_bytes | before_compression_toast_bytes | before_compression_total_bytes | after_compression_table_bytes | after_compression_index_bytes | after_compression_toast_bytes | after_compression_total_bytes | node_name |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| _timescaledb_internal | _hyper_1_1_chunk | Compressed | 8192 bytes | 16 kB | 8192 bytes |  32 kB  | 8192 bytes   | 16 kB  | 8192 bytes | 32 kB | |
| _timescaledb_internal | _hyper_1_20_chunk | Uncompressed | | | | | | | | | |

This result set shows you the chunks for the given hypertable, whether those
chunks are compressed, and stats about those chunks.

We could then proceed to compress all of the chunks in this example that are
more than three days old by repeating the process for the remaining chunks
in the list we generated.

If you want to select which chunks to compress based on their time range in a
more programmatic manner, you can use the output of `show_chunks` to feed a set
of chunks to `compress_chunks` in order to compress each of the chunks:

``` sql
SELECT compress_chunk(i) from show_chunks('conditions', newer_than, older_than) i;
```

### Decompressing Chunks [](decompress-chunks)

In order to decompress individual chunks, you can run a `decompress_chunk`
command in much the same way you can manually compress an individual chunk:

``` sql
SELECT decompress_chunk('_timescaledb_internal._hyper_2_2_chunk');
```

Similar to above, you can also decompress a set of chunks based on a
time range by first looking up this set of chunks via `show_chunks`:

``` sql
SELECT decompress_chunk(i) from show_chunks('conditions', newer_than, older_than) i;
```

Or if you want to have more precise matching constraints, including that you
are using space partitioning (e.g., based on `device_id`):

``` sql
SELECT tableoid::regclass FROM metrics
  WHERE time = '2000-01-01' AND device_id = 1
  GROUP BY tableoid;

                 tableoid
------------------------------------------
 _timescaledb_internal._hyper_72_37_chunk
```

Decompression might often be employed in the event that you need to backfill or
update data that lives in a compressed chunk, as TimescaleDB does not currenty
support modifying (inserting into, updating, deleted from) compressed chunks.

Next we walk you through the instructions for preparing your table for
inserting or backfilling data.   The general approach has four steps:

1. Temporarily turn off any compression policy (as otherwise that policy will attempt
to re-compress the chunks that we are currently working on)

1. Decompress chunks that will be effected by modifications or backfill

1. Perform the modifications or backfill

1. Re-enable compression policy (which will have the effect of recompressing
any of our recently-decompressed chunks)

In the next sections, we describe some automated helper functions we provide
that perform all five steps in a more automatic fashion, and then also walk you
through more manual instructions.

#### Automatically decompressing chunks for backfill

In the [TimescaleDB Extras][timescaledb-extras] github repository, we provide
explicit functions for [backfilling batch data to compressed
chunks][timescaledb-extras-backfill], which is useful for inserting a *batch*
of backfilled data (as opposed to individual row inserts). By "backfill", we
mean inserting data corresponding to a timestamp well in the past, which given
its timestamp, already corresponds to a compressed chunk.

In the below example, we backfill data into a temporary table; such temporary
tables are short-lived and only exist for the duration of the database
session. Alternatively, if backfill is common, one might use a normal table for
this instead, which would allow multiple writers to insert into the table at
the same time before the `decompress_backfill` process.

To use this procedure:

- First, create a table with the same schema as the hypertable (in
  this example, `cpu`) that we are backfilling into.

```sql
CREATE TEMPORARY TABLE cpu_temp AS SELECT * FROM cpu WITH NO DATA;
```

- Second, insert data into the backfill table.

- Third, use a supplied backfill procedure to perform the above steps: halt
  compression policy, identify those compressed chunks to which the backfilled
  data corresponds, decompress those chunks, insert data from the backfill
  table into the main hypertable, and then re-enable compression policy:

```sql
CALL decompress_backfill(staging_table=>'cpu_temp', destination_hypertable=>'cpu');`
```

If using a temp table, the table is automatically dropped at the end of your
database session.  If using a normal table, after you are done backfilling the
data successfully, you will likely want to truncate your table in preparation
for the next backfill (or drop it completely).

#### Manually decompressing chunks for backfill [](manual-decompression)

To perform these steps more manually, we first identify and turn off our
compression policy, before manually decompressing chunks.  To accomplish this
we first find the job_id of the policy using:

```sql
SELECT s.job_id
FROM timescaledb_information.jobs j
  INNER JOIN timescaledb_information.job_stats s ON j.job_id = s.job_id
WHERE j.proc_name = 'policy_compression' AND s.hypertable_name = <target table>;
```

Next, pause the job with:

``` sql
SELECT alter_job(<job_id>, scheduled => false);
```

We have now paused the compress chunk policy from the hypertable which
will leave us free to decompress the chunks we need to modify via backfill or
update. To decompress the chunk(s) that we will be modifying, for each chunk:

``` sql
SELECT decompress_chunk('_timescaledb_internal._hyper_2_2_chunk');
```

Similar to above, you can also decompress a set of chunks based on a
time range by first looking up this set of chunks via `show_chunks`:

``` sql
SELECT decompress_chunk(i) from show_chunks('conditions', newer_than, older_than) i;
```

>:TIP: You need to run 'decompress_chunk' for each chunk that will be impacted
by your INSERT or UPDATE statement in backfilling data. Once your needed chunks
are decompressed you can proceed with your data backfill operations.

Once your backfill and update operations are complete we can simply re-enable
our compression policy job:

``` sql
SELECT alter_job(<job_id>, scheduled => true);
```

This job will re-compress any chunks that were decompressed during your backfilling
operation the next time it runs. To have it run immediately, you can expressly execute
the command via [`run_job`](/api#run_job):

``` sql
CALL run_job(<job_id>);
```

### Storage considerations for decompressing chunks [](storage-for-decompression)

Another factor to be mindful of when planning your compression strategy is the
additional storage overhead needed to decompress chunks. This is key when you are
provisioning storage for use with TimescaleDB. You want to ensure that you plan for
enough storage headroom to decompress some chunks if needed.

### Interactions with other TimescaleDB features

Since compression performs an implicit reordering of data using `segmentby` and `orderby`, 
it is not recommended to combine this feature with [reordering][]. 

## Future Work [](future-work)

One of the current limitations of TimescaleDB is that once chunks are converted
into compressed column form, we do not currently allow any further modifications
of the data (e.g., inserts, updates, deletes) or the schema without manual decompression.
In other words, chunks are immutable in compressed form. Attempts to modify the
chunks' data will either error or fail silently (as preferred by users). We
plan to remove this limitation in future releases.
If you still need to modify the schema for a hypertable, you will have to turn off 
compression. First, [manually decompress compressed chunks and delete any compression policies on that table](#manual-decompression) 
After that, disable compression using `ALTER TABLE`.

``` sql
ALTER TABLE conditions SET (timescaledb.compress = false );
```

[timescaledb-extras]: https://github.com/timescale/timescaledb-extras
[timescaledb-extras-backfill]: https://github.com/timescale/timescaledb-extras/blob/master/backfill.sql
[reordering]: /api#reorder_chunk
